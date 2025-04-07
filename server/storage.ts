import { 
  users, type User, type InsertUser,
  watchlist, type Watchlist, type InsertWatchlist
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private watchlist: Map<number, Watchlist>;
  private currentUserId: number;
  private currentWatchlistId: number;

  constructor() {
    this.users = new Map();
    this.watchlist = new Map();
    this.currentUserId = 1;
    this.currentWatchlistId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser & { referralCode: string }): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    
    const user: User = {
      id,
      ...insertUser,
      isVip: false,
      vipExpiresAt: null,
      createdAt: now,
      darkMode: true,
      notifications: false,
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  // Watchlist methods
  async getWatchlistByUserId(userId: number): Promise<Watchlist[]> {
    return Array.from(this.watchlist.values()).filter(
      (item) => item.userId === userId,
    );
  }
  
  async getWatchlistItemByUserIdAndCoinId(userId: number, coinId: string): Promise<Watchlist | undefined> {
    return Array.from(this.watchlist.values()).find(
      (item) => item.userId === userId && item.coinId === coinId,
    );
  }
  
  async addToWatchlist(item: InsertWatchlist): Promise<Watchlist> {
    const id = this.currentWatchlistId++;
    const now = new Date();
    
    const watchlistItem: Watchlist = {
      id,
      ...item,
      createdAt: now,
    };
    
    this.watchlist.set(id, watchlistItem);
    return watchlistItem;
  }
  
  async removeFromWatchlist(userId: number, coinId: string): Promise<void> {
    const item = await this.getWatchlistItemByUserIdAndCoinId(userId, coinId);
    if (item) {
      this.watchlist.delete(item.id);
    }
  }
}

export const storage = new MemStorage();
