import { guard, sendError } from "./_lib.js";
import { projects } from "./_data.js";

export default function handler(req, res) {
  if (guard(req, res)) return;
  const category = req.query?.category;
  const items = category
    ? projects.filter((p) => p.category === category)
    : projects;
  if (category && items.length === 0) {
    const valid = [...new Set(projects.map((p) => p.category))].join(", ");
    return sendError(
      res,
      404,
      "category_not_found",
      `No projects in category "${category}".`,
      `Use one of: ${valid}.`,
    );
  }
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.status(200).json({ count: items.length, projects: items });
}
