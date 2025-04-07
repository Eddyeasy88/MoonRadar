import { 
  users, type User, type InsertUser,
  watchlist, type Watchlist, type InsertWatchlist,
  invites, type Invite, type InsertInvite
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { referralCode: string }): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Watchlist methods
  getWatchlistByUserId(userId: number): Promise<Watchlist[]>;
  getWatchlistItemByUserIdAndCoinId(userId: number, coinId: string): Promise<Watchlist | undefined>;
  addToWatchlist(item: InsertWatchlist): Promise<Watchlist>;
  removeFromWatchlist(userId: number, coinId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser & { referralCode: string }): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      isVip: false,
      darkMode: true,
      notifications: false
    }).returning();
    
    return result[0];
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("User not found");
    }
    
    return result[0];
  }
  
  // Watchlist methods
  async getWatchlistByUserId(userId: number): Promise<Watchlist[]> {
    return db.select().from(watchlist).where(eq(watchlist.userId, userId));
  }
  
  async getWatchlistItemByUserIdAndCoinId(userId: number, coinId: string): Promise<Watchlist | undefined> {
    const result = await db
      .select()
      .from(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.coinId, coinId)
      ));
    
    return result[0];
  }
  
  async addToWatchlist(item: InsertWatchlist): Promise<Watchlist> {
    const result = await db
      .insert(watchlist)
      .values(item)
      .returning();
    
    return result[0];
  }
  
  async removeFromWatchlist(userId: number, coinId: string): Promise<void> {
    await db
      .delete(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.coinId, coinId)
      ));
  }
}

export const storage = new DatabaseStorage();
