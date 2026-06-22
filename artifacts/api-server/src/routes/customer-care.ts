import { Router, type IRouter, type Request, type Response } from "express";
import { and, asc, count, desc, eq, gt, ilike, or, sql } from "drizzle-orm";
import {
  db,
  customerCareTicketsTable,
  customerCareRepliesTable,
} from "@workspace/db";
import {
  ReceiveCustomerCareWebhookBody,
  ListCustomerCareTicketsQueryParams,
  UpdateCustomerCareTicketStatusParams,
  UpdateCustomerCareTicketStatusBody,
  GetCustomerCareTicketParams,
  AddCustomerCareReplyParams,
  AddCustomerCareReplyBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";
import { logger } from "../lib/logger";
import { maybeRunCustomerCareMaintenance } from "../lib/customerCareMaintenance";

const router: IRouter = Router();

/**
 * Validate the shared webhook secret used by trusted source apps (e.g. the
 * Label-Cropper backend) for server-to-server calls. Returns true when the
 * request is authorized; otherwise writes the error response and returns false.
 */
function checkWebhookSecret(req: Request, res: Response): boolean {
  const expectedSecret = (
    process.env["CUSTOMER_CARE_WEBHOOK_SECRET"] ?? ""
  ).trim();

  if (!expectedSecret) {
    res.status(503).json({
      title: "Customer care webhook is not configured",
      detail: "CUSTOMER_CARE_WEBHOOK_SECRET is not set on the server.",
      status: 503,
    });
    return false;
  }

  const providedSecret = (req.header("x-webhook-secret") ?? "").trim();
  if (!providedSecret || providedSecret !== expectedSecret) {
    res.status(401).json({
      title: "Unauthorized",
      detail: "Missing or invalid webhook secret.",
      status: 401,
    });
    return false;
  }

  return true;
}

/**
 * Public webhook: external apps (e.g. Label-Cropper) POST submissions here.
 * Protected by a shared secret sent in the `X-Webhook-Secret` header.
 */
router.post("/webhooks/customer-care", async (req, res) => {
  if (!checkWebhookSecret(req, res)) return;

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
  maybeRunCustomerCareMaintenance();

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

/**
 * Admin: fetch a single ticket together with its full reply thread.
 */
router.get("/admin/customer-care/:id", requireAdmin, async (req, res) => {
  const idParsed = GetCustomerCareTicketParams.safeParse(req.params);
  if (!idParsed.success) {
    res.status(400).json({ title: "Invalid ticket id", status: 400 });
    return;
  }

  const { id } = idParsed.data;

  try {
    const [ticket] = await db
      .select()
      .from(customerCareTicketsTable)
      .where(eq(customerCareTicketsTable.id, id));

    if (!ticket) {
      res.status(404).json({ title: "Ticket not found", status: 404 });
      return;
    }

    const replies = await db
      .select()
      .from(customerCareRepliesTable)
      .where(eq(customerCareRepliesTable.ticketId, id))
      .orderBy(asc(customerCareRepliesTable.createdAt));

    res.json({ ...ticket, replies });
  } catch (err) {
    logger.error({ err }, "Failed to load customer care ticket");
    res.status(500).json({ title: "Could not load ticket", status: 500 });
  }
});

/**
 * Admin: append a reply to a ticket. The originating user sees it in the
 * source app. Replying also reopens a resolved ticket so it stays actionable.
 */
router.post(
  "/admin/customer-care/:id/replies",
  requireAdmin,
  async (req, res) => {
    const idParsed = AddCustomerCareReplyParams.safeParse(req.params);
    if (!idParsed.success) {
      res.status(400).json({ title: "Invalid ticket id", status: 400 });
      return;
    }

    const bodyParsed = AddCustomerCareReplyBody.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({
        title: "Invalid payload",
        detail: bodyParsed.error.issues.map((i) => i.message).join("; "),
        status: 400,
      });
      return;
    }

    const { id } = idParsed.data;
    const { body } = bodyParsed.data;

    try {
      const [ticket] = await db
        .select({ id: customerCareTicketsTable.id })
        .from(customerCareTicketsTable)
        .where(eq(customerCareTicketsTable.id, id));

      if (!ticket) {
        res.status(404).json({ title: "Ticket not found", status: 404 });
        return;
      }

      const [reply] = await db
        .insert(customerCareRepliesTable)
        .values({ ticketId: id, authorRole: "admin", body })
        .returning();

      // Bump updatedAt so the inbox surfaces freshly-answered tickets.
      await db
        .update(customerCareTicketsTable)
        .set({ updatedAt: new Date() })
        .where(eq(customerCareTicketsTable.id, id));

      res.status(201).json(reply);
    } catch (err) {
      logger.error({ err }, "Failed to add customer care reply");
      res.status(500).json({ title: "Could not add reply", status: 500 });
    }
  },
);

// ---------------------------------------------------------------------------
// Server-to-server endpoints for trusted source apps (e.g. Label-Cropper).
// Authenticated with the shared X-Webhook-Secret. The source app passes the
// authenticated user's id so users only ever see their own threads. These are
// intentionally not part of the public OpenAPI client.
// ---------------------------------------------------------------------------

function parseSourceUser(
  req: Request,
): { userId: number; source: string } | null {
  const rawUserId =
    (req.query["user_id"] as string | undefined) ??
    (req.body?.user_id as string | number | undefined);
  const rawSource =
    (req.query["source"] as string | undefined) ??
    (req.body?.source as string | undefined);

  const userId = Number(rawUserId);
  const source = String(rawSource ?? "").trim();

  if (!Number.isInteger(userId) || userId <= 0 || !source) return null;
  return { userId, source };
}

/**
 * Source app: list the given user's tickets with replies and unread counts.
 * Unread = admin replies created after the user last viewed the thread.
 */
router.get("/customer-care/threads", async (req, res) => {
  if (!checkWebhookSecret(req, res)) return;

  maybeRunCustomerCareMaintenance();

  const who = parseSourceUser(req);
  if (!who) {
    res.status(400).json({
      title: "Invalid request",
      detail: "user_id and source are required.",
      status: 400,
    });
    return;
  }

  try {
    const tickets = await db
      .select()
      .from(customerCareTicketsTable)
      .where(
        and(
          eq(customerCareTicketsTable.sourceUserId, who.userId),
          eq(customerCareTicketsTable.source, who.source),
        ),
      )
      .orderBy(desc(customerCareTicketsTable.createdAt));

    let unreadTotal = 0;
    const threads = await Promise.all(
      tickets.map(async (ticket) => {
        const replies = await db
          .select()
          .from(customerCareRepliesTable)
          .where(eq(customerCareRepliesTable.ticketId, ticket.id))
          .orderBy(asc(customerCareRepliesTable.createdAt));

        const seenAt = ticket.userLastSeenAt
          ? new Date(ticket.userLastSeenAt).getTime()
          : 0;
        const unread = replies.filter(
          (r) =>
            r.authorRole === "admin" &&
            new Date(r.createdAt).getTime() > seenAt,
        ).length;
        unreadTotal += unread;

        return { ...ticket, replies, unread };
      }),
    );

    res.json({ threads, unreadTotal });
  } catch (err) {
    logger.error({ err }, "Failed to load customer care threads");
    res.status(500).json({ title: "Could not load threads", status: 500 });
  }
});

/**
 * Source app: lightweight unread-reply count for the given user (header badge).
 */
router.get("/customer-care/unread-count", async (req, res) => {
  if (!checkWebhookSecret(req, res)) return;

  const who = parseSourceUser(req);
  if (!who) {
    res.status(400).json({
      title: "Invalid request",
      detail: "user_id and source are required.",
      status: 400,
    });
    return;
  }

  try {
    const [row] = await db
      .select({ value: count() })
      .from(customerCareRepliesTable)
      .innerJoin(
        customerCareTicketsTable,
        eq(customerCareRepliesTable.ticketId, customerCareTicketsTable.id),
      )
      .where(
        and(
          eq(customerCareTicketsTable.sourceUserId, who.userId),
          eq(customerCareTicketsTable.source, who.source),
          eq(customerCareRepliesTable.authorRole, "admin"),
          gt(
            customerCareRepliesTable.createdAt,
            sql`coalesce(${customerCareTicketsTable.userLastSeenAt}, to_timestamp(0))`,
          ),
        ),
      );

    res.json({ unreadTotal: row?.value ?? 0 });
  } catch (err) {
    logger.error({ err }, "Failed to count unread replies");
    res.status(500).json({ title: "Could not count replies", status: 500 });
  }
});

/**
 * Source app: mark all of the user's threads as seen (clears unread).
 */
router.post("/customer-care/threads/seen", async (req, res) => {
  if (!checkWebhookSecret(req, res)) return;

  const who = parseSourceUser(req);
  if (!who) {
    res.status(400).json({
      title: "Invalid request",
      detail: "user_id and source are required.",
      status: 400,
    });
    return;
  }

  try {
    await db
      .update(customerCareTicketsTable)
      .set({ userLastSeenAt: new Date() })
      .where(
        and(
          eq(customerCareTicketsTable.sourceUserId, who.userId),
          eq(customerCareTicketsTable.source, who.source),
        ),
      );

    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to mark threads seen");
    res.status(500).json({ title: "Could not update threads", status: 500 });
  }
});

/**
 * Source app: the user answers "Is your query resolved?" on a resolved ticket.
 * "yes" records the acknowledgement; "no" reopens the ticket for the team.
 * Scoped to the user so a user can only act on their own ticket.
 */
router.post("/customer-care/threads/:id/resolution", async (req, res) => {
  if (!checkWebhookSecret(req, res)) return;

  const who = parseSourceUser(req);
  const ticketId = Number(req.params["id"]);
  const response = String(req.body?.response ?? "").trim().toLowerCase();

  if (!who || !Number.isInteger(ticketId) || ticketId <= 0) {
    res.status(400).json({
      title: "Invalid request",
      detail: "user_id, source and a valid ticket id are required.",
      status: 400,
    });
    return;
  }

  if (response !== "yes" && response !== "no") {
    res.status(400).json({
      title: "Invalid request",
      detail: "response must be 'yes' or 'no'.",
      status: 400,
    });
    return;
  }

  try {
    const [ticket] = await db
      .select()
      .from(customerCareTicketsTable)
      .where(
        and(
          eq(customerCareTicketsTable.id, ticketId),
          eq(customerCareTicketsTable.sourceUserId, who.userId),
          eq(customerCareTicketsTable.source, who.source),
        ),
      );

    if (!ticket) {
      res.status(404).json({ title: "Ticket not found", status: 404 });
      return;
    }

    const now = new Date();
    const [updated] =
      response === "yes"
        ? await db
            .update(customerCareTicketsTable)
            .set({ userResolvedFeedbackAt: now, updatedAt: now })
            .where(eq(customerCareTicketsTable.id, ticketId))
            .returning()
        : await db
            .update(customerCareTicketsTable)
            .set({
              status: "open",
              resolvedAt: null,
              userResolvedFeedbackAt: null,
              updatedAt: now,
            })
            .where(eq(customerCareTicketsTable.id, ticketId))
            .returning();

    res.json({ ok: true, status: updated?.status ?? ticket.status });
  } catch (err) {
    logger.error({ err }, "Failed to record ticket resolution feedback");
    res.status(500).json({ title: "Could not update ticket", status: 500 });
  }
});

export default router;
