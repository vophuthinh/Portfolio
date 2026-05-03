/**
 * EmailJS API Proxy
 * Serverless function to proxy contact form submissions
 * Protects EmailJS credentials from exposure
 *
 * Deployment:
 * - Vercel: Place in /api directory
 * - Netlify: Place in /netlify/functions directory
 * - AWS Lambda: Package and deploy
 */

// For Vercel/Node.js environments
import https from "https";

// Email configuration (store these in environment variables)
const EMAIL_CONFIG = {
  SERVICE_ID: process.env.EMAILJS_SERVICE_ID || "",
  TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID || "",
  PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY || "",
  PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY || "", // Required for server-side
  RATE_LIMIT: 5, // Max requests per IP per hour
  ALLOWED_ORIGINS: [
    "http://localhost:3000",
    "http://localhost:4173",
    "https://vophuthinh.com",
    "https://www.vophuthinh.com",
    "https://vophuthinh.name.vn",
    "https://www.vophuthinh.name.vn",
  ],
};

/**
 * In-memory rate limiting.
 * NOTE: On serverless platforms (Vercel/Netlify), each cold start creates a new
 * instance, so this only limits within a single warm instance. For stronger
 * protection, use Vercel KV / Upstash Redis.
 * The Map is capped at MAX_TRACKED_IPS to prevent memory leaks.
 */
const MAX_TRACKED_IPS = 500;
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const hourAgo = now - 3600000;

  if (!rateLimitStore.has(ip)) {
    // Evict oldest entries when store is full
    if (rateLimitStore.size >= MAX_TRACKED_IPS) {
      const oldestKey = rateLimitStore.keys().next().value;
      rateLimitStore.delete(oldestKey);
    }
    rateLimitStore.set(ip, []);
  }

  const requests = rateLimitStore.get(ip).filter((time) => time > hourAgo);

  if (requests.length >= EMAIL_CONFIG.RATE_LIMIT) {
    return false;
  }

  requests.push(now);
  rateLimitStore.set(ip, requests);

  return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sanitize input to prevent injection (XSS, CRLF/header injection)
 */
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\r\n]/g, " ")
    .substring(0, 1000);
}

/**
 * Send email via EmailJS API
 */
function sendEmail(data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      service_id: EMAIL_CONFIG.SERVICE_ID,
      template_id: EMAIL_CONFIG.TEMPLATE_ID,
      user_id: EMAIL_CONFIG.PUBLIC_KEY,
      accessToken: EMAIL_CONFIG.PRIVATE_KEY,
      template_params: {
        from_name: data.from_name,
        email_id: data.email_id,
        message: data.message,
      },
    });

    const options = {
      hostname: "api.emailjs.com",
      port: 443,
      path: "/api/v1.0/email/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, message: "Email sent successfully" });
        } else {
          reject(new Error(`EmailJS API error: ${res.statusCode}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Main handler (Vercel/Express format)
 */
export default async (req, res) => {
  // Enable CORS
  const origin = req.headers.origin;
  if (EMAIL_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are accepted",
    });
  }

  // Require JSON content type (prevents CSRF via form submission)
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("application/json")) {
    return res.status(415).json({
      error: "Unsupported media type",
      message: "Content-Type must be application/json",
    });
  }

  try {
    if (
      !EMAIL_CONFIG.SERVICE_ID ||
      !EMAIL_CONFIG.TEMPLATE_ID ||
      !EMAIL_CONFIG.PUBLIC_KEY ||
      !EMAIL_CONFIG.PRIVATE_KEY
    ) {
      return res.status(503).json({
        error: "Email service not configured",
        message: "Server email configuration is incomplete",
      });
    }

    // Get client IP
    const forwardedFor = req.headers["x-forwarded-for"];
    const firstForwardedIp =
      typeof forwardedFor === "string"
        ? forwardedFor.split(",")[0].trim()
        : undefined;
    const ip =
      req.ip ||
      firstForwardedIp ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
      });
    }

    // Parse and validate request body
    const { from_name, email_id, message, _ts } = req.body;

    // Anti-spam: reject if honeypot field is present (bots fill all fields)
    if (req.body.website) {
      // Return fake success so bot doesn't retry
      return res.status(200).json({ success: true });
    }

    // Anti-spam: form must be open for at least 3 seconds
    const tsNum = Number(_ts);
    if (!_ts || !Number.isFinite(tsNum)) {
      return res.status(400).json({
        error: "Invalid submission",
        message: "Please submit using the contact form.",
      });
    }
    const formAge = Date.now() - tsNum;
    if (formAge < 3000 || formAge > 86400000) {
      return res.status(400).json({
        error: "Invalid submission",
        message: "Please wait a moment before submitting.",
      });
    }

    if (!from_name || !email_id || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please provide name, email, and message",
      });
    }

    // Validate email
    if (!validateEmail(email_id)) {
      return res.status(400).json({
        error: "Invalid email",
        message: "Please provide a valid email address",
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      from_name: sanitizeInput(from_name),
      email_id: sanitizeInput(email_id),
      message: sanitizeInput(message),
    };

    // Send email
    const result = await sendEmail(sanitizedData);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to send email. Please try again later.",
    });
  }
};

// For testing locally with Express
// Uncomment to test:
// import express from 'express';
// const app = express();
// app.use(express.json());
// app.post('/api/contact', contactHandler);
// app.listen(3001, () => console.log('Test server on http://localhost:3001'));
