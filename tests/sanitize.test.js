import { describe, it, expect } from "vitest";
import { sanitizeInput, validateEmail } from "../api/contact.js";

describe("sanitizeInput", () => {
  it("should encode HTML angle brackets", () => {
    expect(sanitizeInput("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("should strip CRLF characters", () => {
    expect(sanitizeInput("hello\r\nworld")).toBe("hello  world");
  });

  it("should strip CR characters", () => {
    expect(sanitizeInput("hello\rworld")).toBe("hello world");
  });

  it("should strip LF characters", () => {
    expect(sanitizeInput("hello\nworld")).toBe("hello world");
  });

  it("should trim whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("should return empty string for non-string input", () => {
    expect(sanitizeInput(null)).toBe("");
    expect(sanitizeInput(undefined)).toBe("");
    expect(sanitizeInput(123)).toBe("");
  });

  it("should truncate to 1000 characters", () => {
    const longString = "a".repeat(1500);
    expect(sanitizeInput(longString).length).toBe(1000);
  });

  it("should handle empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("should block CRLF header injection attempts", () => {
    const malicious = "attacker\r\nBcc: victim@evil.com";
    const result = sanitizeInput(malicious);
    expect(result).not.toContain("\r");
    expect(result).not.toContain("\n");
  });

  it("should encode ampersands", () => {
    expect(sanitizeInput("a & b")).toBe("a &amp; b");
  });

  it("should preserve content with angle brackets (encoded)", () => {
    expect(sanitizeInput("a < b > c")).toBe("a &lt; b &gt; c");
  });
});

describe("validateEmail", () => {
  it("should accept valid emails", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("test.name@domain.org")).toBe(true);
    expect(validateEmail("a@b.co")).toBe(true);
  });

  it("should reject invalid emails", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("@missing.com")).toBe(false);
    expect(validateEmail("no-domain@")).toBe(false);
    expect(validateEmail("spaces in@email.com")).toBe(false);
  });
});
