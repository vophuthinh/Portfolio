import { describe, it, expect } from "vitest";
import { escapeHtml } from "../js/utils.js";

describe("escapeHtml", () => {
  it("should escape HTML special characters", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("should escape ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("should escape double quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
  });

  it("should escape single quotes", () => {
    expect(escapeHtml("'hello'")).toBe("&#39;hello&#39;");
  });

  it("should return empty string for non-string input", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(123)).toBe("");
  });

  it("should handle normal text without changes", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("should handle mixed content", () => {
    expect(escapeHtml('<div class="test">Hello & World</div>')).toBe(
      "&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;/div&gt;",
    );
  });
});
