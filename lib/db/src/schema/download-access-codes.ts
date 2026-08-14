import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * One-time email verification codes for the My Downloads recovery page.
 * A row is created when a visitor requests access for an email address.
 * After the correct code is entered, a short-lived session token is stored
 * on the row; that token gates purchase lookups and link refreshes.
 */
export const downloadAccessCodesTable = pgTable("download_access_codes", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  attemptsRemaining: integer("attempts_remaining").notNull().default(5),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  sessionToken: text("session_token"),
  sessionExpiresAt: timestamp("session_expires_at", { withTimezone: true }),
});

export type DownloadAccessCode = typeof downloadAccessCodesTable.$inferSelect;
