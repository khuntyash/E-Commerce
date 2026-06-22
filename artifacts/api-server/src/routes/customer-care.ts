import { Router, type IRouter } from "express";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db, customerCareTicketsTable } from "@workspace/db";
import {
  ReceiveCustomerCareWebhookBody,
  ListCustomerCareTicketsQueryParams,
  UpdateCustomerCareTicketStatusParams,
  UpdateCustomerCareTicketStatusBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Public webhook: external apps (e.g. Label-Cropper) POST submissions here.
 * Protected by a shared secret sent in the `X-Webhook-Secret` header.
 */
router.post("/webhooks/customer-care", async (req, res) => {
  const expectedSecret = (process.env["CUSTOMER_CARE_WEBHOOK_SECRET"] ?? "").trim();

  if (!expectedSecret) {
    res.status(503).json({
      title: "Customer care webhook is not configured",
      detail: "CUSTOMER_CARE_WEBHOOK_SECRET is not set on the server.",
      status: 503,
    });
    return;
  }

  const providedSecret = (req.header("x-webhook-secret") ?? "").trim();
  if (!providedSecret || providedSecret !== expectedSecret) {
    res.status(401).json({
      title: "Unauthorized",
      detail: "Missing or invalid webhook secret.",
      status: 401,
    });
    return;
  }

  const parsed = ReceiveCustomerCareWebhookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      title: "Invalid payload",
      detail: parsed.error.issues.map((i) => i.message).join("; "),
      status: 400,
    });
    return;
  }

  const body = parsed.data;

  try {
    const [ticket] = await db
      .insert(customerCareTicketsTable)
      .values({
        name: body.name ?? null,
        email: body.email ?? null,
        mobile: body.mobile ?? null,
        topic: body.topic,
        message: body.message,
        sourceUserId: body.user_id ?? null,
        source: (body.source ?? "").trim() || "unknown",
        submittedAt: body.submitted_at ?? null,
      })
      .returning();

    res.status(201).json(ticket);
  } catch (err) {
    logger.error({ err }, "Failed to store customer care ticket");
    res.status(500).json({
      title: "Could not store the submission",
      status: 500,
    });
  }
});

/**
 * Admin: list tickets with optional status filter, search and pagination.
 */
router.get("/admin/customer-care", requireAdmin, async (req, res) => {
  const parsed = ListCustomerCareTicketsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      title: "Invalid query parameters",
      detail: parsed.error.issues.map((i) => i.message).join("; "),
      status: 400,
    });
    return;
  }

  const { status, q, limit, offset } = parsed.data;
  const conditions = [];

  if (status !== "all") {
    conditions.push(eq(customerCareTicketsTable.status, status));
  }

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    conditions.push(
      or(
        ilike(customerCareTicketsTable.name, like),
        ilike(customerCareTicketsTable.email, like),
        ilike(customerCareTicketsTable.mobile, like),
        ilike(customerCareTicketsTable.topic, like),
        ilike(customerCareTicketsTable.message, like),
      ),
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  try {
    const [totalRow] = await db
      .select({ value: count() })
      .from(customerCareTicketsTable)
      .where(where);

    const items = await db
      .select()
      .from(customerCareTicketsTable)
      .where(where)
      .orderBy(desc(customerCareTicketsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ items, total: totalRow?.value ?? 0, limit, offset });
  } catch (err) {
    logger.error({ err }, "Failed to list customer care tickets");
    res.status(500).json({ title: "Could not load tickets", status: 500 });
  }
});

/**
 * Admin: update a ticket's status (resolve / reopen).
 */
router.patch(
  "/admin/customer-care/:id/status",
  requireAdmin,
  async (req, res) => {
    const idParsed = UpdateCustomerCareTicketStatusParams.safeParse(req.params);
    if (!idParsed.success) {
      res.status(400).json({
        title: "Invalid ticket id",
        status: 400,
      });
      return;
    }

    const bodyParsed = UpdateCustomerCareTicketStatusBody.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({
        title: "Invalid payload",
        detail: bodyParsed.error.issues.map((i) => i.message).join("; "),
        status: 400,
      });
      return;
    }

    const { id } = idParsed.data;
    const { status } = bodyParsed.data;
    const now = new Date();

    try {
      const [updated] = await db
        .update(customerCareTicketsTable)
        .set({
          status,
          updatedAt: now,
          resolvedAt: status === "resolved" ? now : null,
        })
        .where(eq(customerCareTicketsTable.id, id))
        .returning();

      if (!updated) {
        res.status(404).json({ title: "Ticket not found", status: 404 });
        return;
      }

      res.json(updated);
    } catch (err) {
      logger.error({ err }, "Failed to update customer care ticket");
      res.status(500).json({ title: "Could not update ticket", status: 500 });
    }
  },
);

export default router;
