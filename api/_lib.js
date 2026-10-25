// Shared helpers for read-only public API routes (files prefixed "_" are not routed by Vercel)
export const DOCS_URL = "https://vophuthinh.com/docs";

export function sendError(res, status, code, message, hint) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json({
    error: { code, message, hint, docs: DOCS_URL },
  });
}

/** Handle CORS + method guard. Returns true when the request was fully handled. */
export function guard(req, res, methods = ["GET"]) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", [...methods, "OPTIONS"].join(", "));
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  if (!methods.includes(req.method)) {
    res.setHeader("Allow", methods.join(", "));
    sendError(
      res,
      405,
      "method_not_allowed",
      `${req.method} is not supported on this endpoint.`,
      `Use ${methods.join(" or ")}.`,
    );
    return true;
  }
  return false;
}
