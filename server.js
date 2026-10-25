/**
 * Simple Express server with CSP nonce injection
 * For production deployment with dynamic nonce generation
 *
 * Usage: node server.js
 */

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import contactHandler from "./api/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");
const OFFLINE_FILE = path.join(DIST_DIR, "offline.html");

const app = express();
const PORT = process.env.PORT || 3000;

// Generate a cryptographically secure nonce
function generateNonce() {
  return crypto.randomBytes(16).toString("base64");
}

// Read an HTML file and inject the given nonce into inline scripts/styles,
// replacing any stale nonce baked in at build time (res.sendFile bypasses
// res.send, so this must run explicitly in each HTML route handler).
function renderHtmlWithNonce(filePath, nonce) {
  let html = fs.readFileSync(filePath, "utf8");

  html = html.replace(
    /<script([^>]*?)>([\s\S]*?)<\/script>/gi,
    (match, attributes, content) => {
      if (attributes.includes("src=")) {
        return match;
      }
      const cleanAttributes = attributes.replace(/\s*nonce="[^"]*"/gi, "");
      return `<script${cleanAttributes} nonce="${nonce}">${content}</script>`;
    },
  );

  html = html.replace(
    /<style([^>]*?)>([\s\S]*?)<\/style>/gi,
    (match, attributes, content) => {
      const cleanAttributes = attributes.replace(/\s*nonce="[^"]*"/gi, "");
      return `<style${cleanAttributes} nonce="${nonce}">${content}</style>`;
    },
  );

  // Remove the meta CSP tag — HTTP header CSP takes precedence
  html = html.replace(
    /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/gi,
    "",
  );

  return html;
}

// Security headers middleware
function securityHeadersMiddleware(req, res, next) {
  const nonce = res.locals.nonce || "placeholder";

  // Content Security Policy with nonce
  res.setHeader(
    "Content-Security-Policy",
    `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' cdn.jsdelivr.net unpkg.com cdnjs.cloudflare.com va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net cdnjs.cloudflare.com unpkg.com;
    font-src 'self' fonts.gstatic.com cdnjs.cloudflare.com cdn.jsdelivr.net data:;
    img-src 'self' data: cdn.jsdelivr.net cdnjs.cloudflare.com;
    connect-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com api.emailjs.com va.vercel-analytics.com vitals.vercel-insights.com;
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

// API endpoints
app.post("/api/contact", contactHandler);

// Explicit HTML routes with per-request nonce injection.
// Registered before express.static so a direct request for /index.html or
// /offline.html can't bypass nonce injection via the static file handler.
app.get(["/", "/index.html"], (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.vary("Accept");
  if (req.accepts(["html", "text/markdown"]) === "text/markdown") {
    return res.type("text/markdown").sendFile(path.join(DIST_DIR, "index.md"));
  }
  res.send(renderHtmlWithNonce(INDEX_FILE, res.locals.nonce));
});

app.get("/offline.html", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.send(renderHtmlWithNonce(OFFLINE_FILE, res.locals.nonce));
});

// Serve static files from dist directory (index.html excluded — handled above)
app.use(
  express.static(DIST_DIR, {
    index: false,
    extensions: ["html"],
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(`${path.sep}sw.js`)) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        res.setHeader("Service-Worker-Allowed", "/");
        res.setHeader("Content-Type", "application/javascript");
        return;
      }

      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);

// Unknown paths: real 404 (Markdown for agents, JSON under /api, HTML otherwise)
app.use((req, res) => {
  res.status(404).vary("Accept");
  if (req.path.startsWith("/api/")) {
    return res.sendFile(path.join(DIST_DIR, "404.json"), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  if (req.accepts(["html", "text/markdown"]) === "text/markdown") {
    return res.type("text/markdown").sendFile(path.join(DIST_DIR, "404.md"));
  }
  res.sendFile(path.join(DIST_DIR, "404.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔒 CSP nonce injection enabled`);
  console.log(`📁 Serving from: ${DIST_DIR}`);
});

export default app;
