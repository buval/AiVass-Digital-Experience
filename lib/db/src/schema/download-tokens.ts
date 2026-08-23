import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const downloadTokensTable = pgTable(
  "download_tokens",
  {
    token: text("token").primaryKey(),
    guideSlug: text("guide_slug").notNull(),
    buyerEmail: text("buyer_email").notNull(),
    attemptsRemaining: integer("attempts_remaining").notNull().default(3),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    stripeSessionId: text("stripe_session_id"),
    fulfilled: boolean("fulfilled").notNull().default(false),
    emailClaimedAt: timestamp("email_claimed_at", { withTimezone: true }),
    emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("download_tokens_session_guide_unique").on(
      table.stripeSessionId,
      table.guideSlug,
    ),
  ],
);

export const insertDownloadTokenSchema = createInsertSchema(downloadTokensTable);
export type InsertDownloadToken = z.infer<typeof insertDownloadTokenSchema>;
export type DownloadToken = typeof downloadTokensTable.$inferSelect;
