import { and, eq, isNull, sql } from "drizzle-orm";
import { db, customerCareTicketsTable } from "@workspace/db";
import { logger } from "./logger";

/**
 * Lifecycle rules for customer care tickets:
 *
 *  1. Auto-resolve confirmation: when a ticket has been marked "resolved" and
 *     the user has not answered the "Is your query resolved?" prompt within
 *     48 hours, we treat it as confirmed (record the acknowledgement) so the
 *     prompt stops and the ticket is considered settled.
 *
 *  2. Retention: 30 days after a ticket was resolved it is deleted everywhere.
 *     Replies are removed automatically via the ON DELETE CASCADE foreign key.
 *
 * The sweep is idempotent and safe to run repeatedly.
 */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const AUTO_CONFIRM_AFTER_MS = 48 * HOUR_MS;
export const DELETE_AFTER_RESOLVED_MS = 30 * DAY_MS;

const SWEEP_INTERVAL_MS = HOUR_MS;
const THROTTLE_MS = 5 * 60 * 1000;

let lastRun = 0;
let inFlight: Promise<void> | null = null;

/**
 * Run a single maintenance pass. Resolves the auto-confirmation first, then
 * purges anything past the retention window.
 */
export async function runCustomerCareMaintenance(): Promise<void> {
  const now = new Date();
  const confirmCutoff = new Date(now.getTime() - AUTO_CONFIRM_AFTER_MS);
  const deleteCutoff = new Date(now.getTime() - DELETE_AFTER_RESOLVED_MS);

  // resolvedAt is the anchor; fall back to updatedAt for any legacy rows that
  // were resolved before resolvedAt was populated.
  const resolvedSince = sql`coalesce(${customerCareTicketsTable.resolvedAt}, ${customerCareTicketsTable.updatedAt})`;

  try {
    const autoConfirmed = await db
      .update(customerCareTicketsTable)
      .set({ userResolvedFeedbackAt: now })
      .where(
        and(
          eq(customerCareTicketsTable.status, "resolved"),
          isNull(customerCareTicketsTable.userResolvedFeedbackAt),
          sql`${resolvedSince} < ${confirmCutoff}`,
        ),
      )
      .returning({ id: customerCareTicketsTable.id });

    const purged = await db
      .delete(customerCareTicketsTable)
      .where(
        and(
          eq(customerCareTicketsTable.status, "resolved"),
          sql`${resolvedSince} < ${deleteCutoff}`,
        ),
      )
      .returning({ id: customerCareTicketsTable.id });

    if (autoConfirmed.length || purged.length) {
      logger.info(
        { autoConfirmed: autoConfirmed.length, purged: purged.length },
        "Customer care maintenance sweep completed",
      );
    }
  } catch (err) {
    logger.error({ err }, "Customer care maintenance sweep failed");
  }
}

/**
 * Throttled trigger safe to call from hot request paths (e.g. when listing
 * threads). Runs at most once every few minutes and never concurrently.
 */
export function maybeRunCustomerCareMaintenance(): void {
  const now = Date.now();
  if (inFlight || now - lastRun < THROTTLE_MS) return;
  lastRun = now;
  inFlight = runCustomerCareMaintenance().finally(() => {
    inFlight = null;
  });
}

/**
 * Start the background sweep: once on boot, then on a fixed interval. The timer
 * is unref'd so it never keeps the process alive on its own.
 */
export function startCustomerCareMaintenance(): NodeJS.Timeout {
  void runCustomerCareMaintenance();
  const timer = setInterval(() => {
    void runCustomerCareMaintenance();
  }, SWEEP_INTERVAL_MS);
  if (typeof timer.unref === "function") timer.unref();
  return timer;
}
