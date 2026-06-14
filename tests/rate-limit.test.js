import { describe, it, expect } from "vitest";
import { createRateLimiter, MAX_TRACKED_IPS } from "../api/contact.js";

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
