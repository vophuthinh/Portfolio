import { describe, it, expect } from "vitest";

/**
 * Replicate rate limiting logic from api/contact.js for unit testing
 */
const MAX_TRACKED_IPS = 500;

function createRateLimiter(maxRequests = 5) {
  const store = new Map();

  return function checkRateLimit(ip) {
    const now = Date.now();
    const hourAgo = now - 3600000;

    if (!store.has(ip)) {
      if (store.size >= MAX_TRACKED_IPS) {
        const oldestKey = store.keys().next().value;
        store.delete(oldestKey);
      }
      store.set(ip, []);
    }

    const requests = store.get(ip).filter((time) => time > hourAgo);

    if (requests.length >= maxRequests) {
      return false;
    }

    requests.push(now);
    store.set(ip, requests);

    return true;
  };
}

describe("Rate Limiter", () => {
  it("should allow requests under the limit", () => {
    const checkRateLimit = createRateLimiter(5);
    expect(checkRateLimit("1.2.3.4")).toBe(true);
    expect(checkRateLimit("1.2.3.4")).toBe(true);
    expect(checkRateLimit("1.2.3.4")).toBe(true);
  });

  it("should block requests over the limit", () => {
    const checkRateLimit = createRateLimiter(3);
    expect(checkRateLimit("1.2.3.4")).toBe(true);
    expect(checkRateLimit("1.2.3.4")).toBe(true);
    expect(checkRateLimit("1.2.3.4")).toBe(true);
    expect(checkRateLimit("1.2.3.4")).toBe(false);
  });

  it("should track different IPs separately", () => {
    const checkRateLimit = createRateLimiter(1);
    expect(checkRateLimit("1.1.1.1")).toBe(true);
    expect(checkRateLimit("2.2.2.2")).toBe(true);
    expect(checkRateLimit("1.1.1.1")).toBe(false);
    expect(checkRateLimit("2.2.2.2")).toBe(false);
  });

  it("should evict oldest IP when store is full", () => {
    const checkRateLimit = createRateLimiter(100);
    // Fill the store
    for (let i = 0; i < MAX_TRACKED_IPS + 1; i++) {
      checkRateLimit(`10.0.${Math.floor(i / 256)}.${i % 256}`);
    }
    // Should not throw and still work
    expect(checkRateLimit("99.99.99.99")).toBe(true);
  });
});
