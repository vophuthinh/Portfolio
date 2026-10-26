import { describe, it, expect } from "vitest";
import fs from "node:fs";
import profileHandler from "../api/profile.js";
import skillsHandler from "../api/skills.js";
import projectsHandler from "../api/projects.js";
import mcpHandler, { handleRpc } from "../api/mcp.js";

const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const json = (f) => JSON.parse(read(f));

function call(handler, { method = "GET", query = {}, body } = {}) {
  const out = { headers: {} };
  const res = {
    setHeader: (k, v) => (out.headers[k] = v),
    status(c) {
      out.status = c;
      return res;
    },
    json(b) {
      out.body = b;
      return res;
    },
    end() {
      return res;
    },
  };
  handler({ method, query, body }, res);
  return out;
}

describe("vercel routes", () => {
  const { routes } = json("vercel.json");
  const fsIdx = routes.findIndex((r) => r.handle === "filesystem");

  it("serves Markdown for the homepage before the filesystem, with Vary: Accept", () => {
    const r = routes.findIndex((x) => x.src === "/" && x.dest === "/index.md");
    expect(r).toBeGreaterThan(-1);
    expect(r).toBeLessThan(fsIdx);
    expect(routes[r].has[0]).toMatchObject({ key: "accept" });
    expect(routes[r].headers["Content-Type"]).toMatch(/^text\/markdown/);
    expect(routes[r].headers.Vary).toBe("Accept");
    const html = routes.find((x) => x.src === "/" && x.continue);
    expect(html.headers.Vary).toBe("Accept");
  });

  it("returns real 404s (no SPA rewrite) in markdown, JSON and HTML", () => {
    const after = routes.slice(fsIdx + 1);
    expect(after.every((r) => r.dest !== "/index.html")).toBe(true);
    const md = after.find((r) => r.dest === "/404.md");
    const api = after.find((r) => r.dest === "/404.json");
    const html = after.find((r) => r.dest === "/404.html");
    for (const r of [md, api, html]) expect(r.status).toBe(404);
    expect(md.headers["Content-Type"]).toMatch(/^text\/markdown/);
    expect(api.headers["Content-Type"]).toMatch(/^application\/json/);
    expect(after.indexOf(api)).toBeLessThan(after.indexOf(md));
    expect(after.indexOf(md)).toBeLessThan(after.indexOf(html));
  });

  it("keeps security headers on every path", () => {
    const h = routes[0].headers;
    expect(h["Content-Security-Policy"]).toBeTruthy();
    expect(h["X-Frame-Options"]).toBe("DENY");
  });
});

describe("static agent files", () => {
  it("404.md explains the error and points at docs/sitemap/llms.txt", () => {
    const md = read("public/404.md");
    expect(md.length).toBeGreaterThan(20);
    for (const l of ["/docs", "/sitemap.xml", "/llms.txt"]) expect(md).toContain(l);
  });

  it("404.json is a structured error", () => {
    const { error } = json("public/404.json");
    expect(error).toMatchObject({ code: "not_found" });
    expect(error.hint).toBeTruthy();
  });

  it("index.md has content", () => {
    expect(read("public/index.md")).toMatch(/^# Vo Phu Thinh/);
  });

  it.each(["about", "contact", "privacy"])("%s page has >= 500 chars", (n) => {
    const text = read(`public/${n}.html`)
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, "");
    expect(text.replace(/\s+/g, " ").length).toBeGreaterThan(500);
  });

  it("homepage links docs, trust pages and declares Organization contact/address", () => {
    const html = read("index.html");
    for (const l of ["/docs", "/about", "/contact", "/privacy", "/openapi.json"])
      expect(html).toContain(`href="${l}"`);
    const org = html
      .match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
    const node = JSON.parse(org)["@graph"].find((n) => n["@type"] === "Organization" && n.contactPoint);
    expect(node.contactPoint).toMatchObject({ contactType: expect.any(String), email: expect.any(String) });
    expect(node.address["@type"]).toBe("PostalAddress");
  });

  it("llms.txt links docs, openapi and MCP", () => {
    const t = read("public/llms.txt");
    for (const l of ["/docs", "/openapi.json", "server-card.json", "/privacy"]) expect(t).toContain(l);
  });
});

describe("openapi.json", () => {
  const spec = json("public/openapi.json");
  const ops = Object.entries(spec.paths).flatMap(([path, item]) =>
    Object.entries(item).map(([method, op]) => ({ path, method, op })),
  );

  it("is OpenAPI 3.1 with unique operationIds and descriptions", () => {
    expect(spec.openapi).toBe("3.1.0");
    const ids = ops.map((o) => o.op.operationId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { op } of ops) {
      expect(op.operationId).toMatch(/^[a-zA-Z][a-zA-Z0-9_]*$/);
      expect(op.description.length).toBeGreaterThan(10);
      expect(Object.keys(op.responses).length).toBeGreaterThan(0);
    }
  });

  it("every $ref resolves and every path has a handler file", () => {
    for (const [, ref] of read("public/openapi.json").matchAll(/"\$ref": "#\/([^"]+)"/g)) {
      expect(ref.split("/").reduce((o, k) => o?.[k], spec)).toBeDefined();
    }
    for (const { path } of ops) expect(fs.existsSync(new URL(`..${path.replace("/v1/", "/")}.js`, import.meta.url))).toBe(true);
  });
});

describe("public API handlers", () => {
  it("GET /api/profile, /api/skills, /api/projects return 200 JSON", () => {
    expect(call(profileHandler).body.name).toBe("Vo Phu Thinh");
    expect(call(skillsHandler).body.ai_ml.length).toBeGreaterThan(0);
    expect(call(projectsHandler).body.count).toBeGreaterThan(0);
  });

  it("filters projects and returns a JSON error with a hint for unknown categories", () => {
    const bad = call(projectsHandler, { query: { category: "nope" } });
    expect(bad.status).toBe(404);
    expect(bad.body.error).toMatchObject({ code: "category_not_found" });
    expect(bad.body.error.hint).toBeTruthy();
    expect(bad.headers["Content-Type"]).toMatch(/json/);
  });

  it("rejects wrong methods with JSON 405 and Allow", () => {
    const r = call(profileHandler, { method: "POST" });
    expect(r.status).toBe(405);
    expect(r.headers.Allow).toBe("GET");
    expect(r.body.error.code).toBe("method_not_allowed");
  });
});

describe("MCP endpoint", () => {
  const rpc = (method, params) => handleRpc({ jsonrpc: "2.0", id: 1, method, params });

  it("initializes and lists tools", () => {
    expect(rpc("initialize").result.protocolVersion).toBeTruthy();
    expect(rpc("tools/list").result.tools.map((t) => t.name)).toEqual(["get_profile", "get_skills", "list_projects"]);
  });

  it("calls a tool", () => {
    const text = rpc("tools/call", { name: "get_profile" }).result.content[0].text;
    expect(JSON.parse(text).name).toBe("Vo Phu Thinh");
  });

  it("returns JSON-RPC errors", () => {
    expect(rpc("nope").error.code).toBe(-32601);
    expect(rpc("tools/call", { name: "x" }).error.code).toBe(-32602);
  });

  it("notifications get 202, GET gets 405, server card matches", () => {
    let status;
    mcpHandler(
      { method: "POST", body: { jsonrpc: "2.0", method: "notifications/initialized" } },
      { setHeader() {}, status: (c) => ((status = c), { end() {} }) },
    );
    expect(status).toBe(202);
    expect(call(mcpHandler).status).toBe(405);
    const card = json("public/.well-known/mcp/server-card.json");
    expect(card.transport).toMatchObject({ type: "streamable-http", endpoint: "/api/mcp" });
  });
});
