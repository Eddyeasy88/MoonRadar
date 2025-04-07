import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isVip: boolean("is_vip").default(false).notNull(),
  vipExpiresAt: timestamp("vip_expires_at"),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  darkMode: boolean("dark_mode").default(true).notNull(),
  notifications: boolean("notifications").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  coinId: text("coin_id").notNull(),
  coinSymbol: text("coin_symbol").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userCoinIdx: uniqueIndex("user_coin_idx").on(table.userId, table.coinId),
  };
});

export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  inviterId: integer("inviter_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  inviteeEmail: text("invitee_email").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, expired
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, vipExpiresAt: true });

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertWatchlistSchema = createInsertSchema(watchlist)
  .omit({ id: true, createdAt: true });

export const insertInviteSchema = createInsertSchema(invites)
  .omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlist.$inferSelect;

export type InsertInvite = z.infer<typeof insertInviteSchema>;
export type Invite = typeof invites.$inferSelect;
