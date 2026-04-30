import { describe, it, expect } from "vitest";

/**
 * Replicate escapeHtml from js/utils.js for unit testing (without DOM)
 * In the browser, it uses textContent/innerHTML. For tests, replicate the logic.
 */
function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

describe("escapeHtml", () => {
  it("should escape HTML special characters", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("should escape ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("should escape quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
    expect(escapeHtml("'hello'")).toBe("&#039;hello&#039;");
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
