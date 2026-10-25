/**
 * Minimal stateless MCP server (Streamable HTTP transport, JSON responses).
 * Spec: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
 */
import { guard, sendError } from "./_lib.js";
import { profile, skills, projects } from "./_data.js";

const PROTOCOL_VERSION = "2025-06-18";

const tools = [
  {
    name: "get_profile",
    description: "Get Vo Phu Thinh's profile: title, contact, availability, awards.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_skills",
    description: "Get technical skills grouped by area.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_projects",
    description: "List portfolio projects, optionally filtered by category.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Project category, e.g. llm" },
      },
    },
  },
];

const handlers = {
  get_profile: () => profile,
  get_skills: () => skills,
  list_projects: ({ category } = {}) =>
    category ? projects.filter((p) => p.category === category) : projects,
};

const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const fail = (id, code, message) => ({
  jsonrpc: "2.0",
  id: id ?? null,
  error: { code, message },
});

export function handleRpc(msg) {
  const { id, method, params } = msg ?? {};
  if (msg?.jsonrpc !== "2.0" || typeof method !== "string") {
    return fail(id, -32600, "Invalid Request");
  }
  if (id === undefined) return null; // notification: no response
  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "vophuthinh-portfolio", version: "1.0.0" },
        instructions: "Read-only tools about Vo Phu Thinh, AI Engineer.",
      });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools });
    case "tools/call": {
      const fn = handlers[params?.name];
      if (!fn) return fail(id, -32602, `Unknown tool: ${params?.name}`);
      return ok(id, {
        content: [
          { type: "text", text: JSON.stringify(fn(params.arguments ?? {})) },
        ],
      });
    }
    default:
      return fail(id, -32601, `Method not found: ${method}`);
  }
}

export default function handler(req, res) {
  if (guard(req, res, ["POST"])) return;
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json(fail(null, -32700, "Parse error"));
    }
  }
  if (Array.isArray(body) || !body || typeof body !== "object") {
    return sendError(
      res,
      400,
      "invalid_request",
      "Body must be a single JSON-RPC 2.0 message.",
      "Send one JSON object, e.g. {\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}.",
    );
  }
  const out = handleRpc(body);
  if (out === null) return res.status(202).end();
  res.status(200).json(out);
}
