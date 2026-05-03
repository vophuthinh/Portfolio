/**
 * Simple Express server with CSP nonce injection
 * For production deployment with dynamic nonce generation
 *
 * Usage: node server.js
 */

import express from "express";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import contactHandler from "./api/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generate a cryptographically secure nonce
function generateNonce() {
  return crypto.randomBytes(16).toString("base64");
}

// Middleware to inject nonce into HTML
function injectNonceMiddleware(req, res, next) {
  const originalSend = res.send;

  res.send = function (data) {
    if (typeof data === "string" && data.includes("</html>")) {
      const nonce = res.locals.nonce;

      // Add nonce to inline scripts
      data = data.replace(
        /<script([^>]*?)>([\s\S]*?)<\/script>/gi,
        (match, attributes, content) => {
          if (attributes.includes("nonce=") || attributes.includes("src=")) {
            return match;
          }
          return `<script${attributes} nonce="${nonce}">${content}</script>`;
        },
      );

      // Add nonce to inline styles
      data = data.replace(
        /<style([^>]*?)>([\s\S]*?)<\/style>/gi,
        (match, attributes, content) => {
          if (attributes.includes("nonce=")) {
            return match;
          }
          return `<style${attributes} nonce="${nonce}">${content}</style>`;
        },
      );

      // Remove the meta CSP tag — HTTP header CSP takes precedence
      data = data.replace(
        /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/gi,
        "",
      );
    }

    originalSend.call(this, data);
  };

  next();
}

// Security headers middleware
function securityHeadersMiddleware(req, res, next) {
  const nonce = res.locals.nonce || "placeholder";

  // Content Security Policy with nonce
  res.setHeader(
    "Content-Security-Policy",
    `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' cdn.jsdelivr.net unpkg.com cdnjs.cloudflare.com;
    style-src 'self' 'nonce-${nonce}' fonts.googleapis.com cdn.jsdelivr.net cdnjs.cloudflare.com unpkg.com;
    font-src 'self' fonts.gstatic.com cdnjs.cloudflare.com cdn.jsdelivr.net data:;
    img-src 'self' data: cdn.jsdelivr.net cdnjs.cloudflare.com;
    connect-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com api.emailjs.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
      .replace(/\s+/g, " ")
      .trim(),
  );

  // Other security headers
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );

  next();
}

// Apply middleware
app.use(express.json());

// Trust first proxy hop for correct client IP behind CDN/reverse proxy
// Only trust loopback addresses as proxies (safe default)
app.set("trust proxy", "loopback");

// Generate nonce per request before CSP header generation
app.use((req, res, next) => {
  res.locals.nonce = generateNonce();
  next();
});

app.use(securityHeadersMiddleware);
app.use(injectNonceMiddleware);

// API endpoints
app.post("/api/contact", contactHandler);

// Serve static files from dist directory
app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: "1y",
    etag: true,
    lastModified: true,
  }),
);

// Service Worker with proper MIME type
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(path.join(__dirname, "dist", "sw.js"));
});

// Handle SPA routing - serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔒 CSP nonce injection enabled`);
  console.log(`📁 Serving from: ${path.join(__dirname, "dist")}`);
});

export default app;
