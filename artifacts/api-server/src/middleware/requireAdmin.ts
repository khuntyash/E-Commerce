import type { Request, Response, NextFunction } from "express";

/**
 * Guards admin-only routes with a shared token. The client must send the token
 * in the `X-Admin-Token` header, matching the `ADMIN_API_TOKEN` env var.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const expected = (process.env["ADMIN_API_TOKEN"] ?? "").trim();

  if (!expected) {
    res.status(503).json({
      title: "Admin access is not configured",
      detail: "ADMIN_API_TOKEN is not set on the server.",
      status: 503,
    });
    return;
  }

  const provided = (req.header("x-admin-token") ?? "").trim();

  if (!provided || provided !== expected) {
    res.status(401).json({
      title: "Unauthorized",
      detail: "Missing or invalid admin token.",
      status: 401,
    });
    return;
  }

  next();
}
