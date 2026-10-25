import { guard } from "./_lib.js";
import { skills } from "./_data.js";

export default function handler(req, res) {
  if (guard(req, res)) return;
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.status(200).json(skills);
}
