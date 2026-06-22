import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Customer care tickets received from external applications (e.g. the
 * Label-Cropper app) via the customer-care webhook. This table is the system
 * of record for all incoming feedback/support messages.
 */
export const customerCareTicketsTable = pgTable(
  "customer_care_tickets",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    mobile: text("mobile"),
    topic: text("topic").notNull(),
    message: text("message").notNull(),
    // Identifier of the user in the originating application (optional).
    sourceUserId: integer("source_user_id"),
    // Which application sent this ticket (e.g. "label-cropper-app").
    source: text("source").notNull().default("unknown"),
    // "open" or "resolved".
    status: text("status").notNull().default("open"),
    // When the user submitted it in the source app (optional).
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    // When the originating user last viewed this thread (drives unread counts
    // for replies shown back in the source app). Null = never viewed.
    userLastSeenAt: timestamp("user_last_seen_at", { withTimezone: true }),
    // When the user confirmed (in the source app) that a resolved ticket
    // actually solved their query. Null = not yet confirmed.
    userResolvedFeedbackAt: timestamp("user_resolved_feedback_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("customer_care_status_idx").on(table.status),
    index("customer_care_created_at_idx").on(table.createdAt),
  ],
);

export const insertCustomerCareTicketSchema = createInsertSchema(
  customerCareTicketsTable,
).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

export type InsertCustomerCareTicket = z.infer<
  typeof insertCustomerCareTicketSchema
>;
export type CustomerCareTicket = typeof customerCareTicketsTable.$inferSelect;

/**
 * Replies on a customer care ticket. Currently all replies are authored by an
 * admin on the main website; the source app surfaces them back to the user.
 */
export const customerCareRepliesTable = pgTable(
  "customer_care_replies",
  {
    id: serial("id").primaryKey(),
    ticketId: integer("ticket_id")
      .notNull()
      .references(() => customerCareTicketsTable.id, { onDelete: "cascade" }),
    // "admin" (from the main website) or "user" (reserved for future use).
    authorRole: text("author_role").notNull().default("admin"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("customer_care_replies_ticket_idx").on(table.ticketId)],
);

export type CustomerCareReply = typeof customerCareRepliesTable.$inferSelect;
