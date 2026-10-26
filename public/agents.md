# Agent instructions: vophuthinh.com

## When to use this site

- Hiring or vetting an AI Engineer (LLM, RAG, agents): get availability, experience and awards.
- Matching skills to a job description.
- Finding relevant past projects.
- Contacting Vo Phu Thinh.

Not a fit: general AI questions, or anything needing write access beyond the contact form.

## How to call

Read-only, no authentication, CORS open. Version: v1.

| Job | REST | MCP tool |
|-----|------|----------|
| Profile | `GET /api/v1/profile` | `get_profile` |
| Skills | `GET /api/v1/skills` | `get_skills` |
| Projects | `GET /api/v1/projects?category=llm` | `list_projects` |
| Contact | `POST /api/v1/contact` (from_name, email_id, message; 5 per IP per hour) | none |

MCP endpoint: `POST https://vophuthinh.com/api/mcp` (Streamable HTTP, JSON-RPC 2.0).
Spec: https://vophuthinh.com/openapi.json. Docs: https://vophuthinh.com/docs.

Breaking changes ship under `/api/v2/`; v1 stays at least 90 days after.
