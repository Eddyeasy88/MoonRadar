import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWatchlistSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { randomUUID } from "crypto";

// Erweitern des Session-Typs, um userId zu erlauben
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Received registration data:", req.body);
      
      // Passen Sie die Validierung an, damit sie weniger streng ist
      const schemaWithDefaults = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        referralCode: z.string().optional(),
        referredBy: z.string().nullable().optional(),
      });
      
      const parsed = schemaWithDefaults.parse(req.body);
      
      const existingUserByEmail = await storage.getUserByEmail(parsed.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(parsed.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      const hashedPassword = await hash(parsed.password, 10);
      const referralCode = randomUUID().split("-")[0];
      
      const user = await storage.createUser({
        username: parsed.username,
        email: parsed.email,
        password: hashedPassword,
        referralCode,
        referredBy: parsed.referredBy || null,
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(parsed.email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      const isPasswordValid = await compare(parsed.password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      // Set the user ID in the session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to login" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  // User settings
  app.patch("/api/users/settings", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { darkMode, notifications } = req.body;
      const updatedUser = await storage.updateUser(user.id, {
        darkMode: darkMode !== undefined ? darkMode : user.darkMode,
        notifications: notifications !== undefined ? notifications : user.notifications,
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update settings" });
    }
  });
  
  // Watchlist routes
  app.get("/api/watchlist", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const watchlist = await storage.getWatchlistByUserId(req.session.userId);
      return res.status(200).json(watchlist);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get watchlist" });
    }
  });
  
  app.post("/api/watchlist", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const parsed = insertWatchlistSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const existing = await storage.getWatchlistItemByUserIdAndCoinId(
        req.session.userId,
        parsed.coinId
      );
      
      if (existing) {
        return res.status(400).json({ message: "Coin already in watchlist" });
      }
      
      const watchlistItem = await storage.addToWatchlist(parsed);
      return res.status(201).json(watchlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });
  
  app.delete("/api/watchlist/:coinId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { coinId } = req.params;
      
      const existing = await storage.getWatchlistItemByUserIdAndCoinId(
        req.session.userId,
        coinId
      );
      
      if (!existing) {
        return res.status(404).json({ message: "Coin not in watchlist" });
      }
      
      await storage.removeFromWatchlist(req.session.userId, coinId);
      return res.status(200).json({ message: "Removed from watchlist" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });
  
  // VIP routes
  app.post("/api/vip/upgrade", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Set VIP expiry to 30 days from now
      const vipExpiresAt = new Date();
      vipExpiresAt.setDate(vipExpiresAt.getDate() + 30);
      
      const updatedUser = await storage.updateUser(user.id, {
        isVip: true,
        vipExpiresAt,
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to upgrade to VIP" });
    }
  });
  
  // Invite routes
  app.get("/api/invite/generate", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      return res.status(200).json({
        url: `https://moonradar.app/invite?ref=${user.referralCode}`,
        referralCode: user.referralCode,
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to generate invite link" });
    }
  });
  
  // Coin data routes (mock responses for development)
  app.get("/api/coins/moonshot", async (req, res) => {
    // This would normally fetch from a crypto API
    return res.json({
      id: "moon",
      symbol: "MOON",
      name: "MoonCoin",
      price: 0.0345,
      priceChange24h: 678.0,
      volume24h: 2100000,
      marketCap: 15000000,
      whalePercentage: 2.1,
      holders: 8750,
      liquidity: 350000,
      moonPhase: "FULL_MOON",
      whaleIndicator: "ROCKET"
    });
  });
  
  app.get("/api/coins/:symbol", async (req, res) => {
    const { symbol } = req.params;
    
    // This would normally fetch from a crypto API
    const mockCoins: Record<string, any> = {
      "WAGMI": {
        id: "wagmi",
        symbol: "WAGMI",
        name: "Wagmi Token",
        price: 0.031,
        priceChange24h: 24.9,
        volume24h: 1800000,
        marketCap: 12000000,
        whalePercentage: 4.2,
        holders: 2456,
        liquidity: 350000,
        moonPhase: "HALF_MOON",
        whaleIndicator: "ROCKET"
      },
      "RIZZ": {
        id: "rizz",
        symbol: "RIZZ",
        name: "Rizz Token",
        price: 0.089,
        priceChange24h: -12.3,
        volume24h: 950000,
        marketCap: 8500000,
        whalePercentage: 14.7,
        holders: 1850,
        liquidity: 180000,
        moonPhase: "NEW_MOON",
        whaleIndicator: "BOMB"
      },
      "MOON": {
        id: "moon",
        symbol: "MOON",
        name: "MoonCoin",
        price: 0.0345,
        priceChange24h: 678.0,
        volume24h: 2100000,
        marketCap: 15000000,
        whalePercentage: 2.1,
        holders: 8750,
        liquidity: 350000,
        moonPhase: "FULL_MOON",
        whaleIndicator: "ROCKET"
      }
    };
    
    const coin = mockCoins[symbol.toUpperCase()];
    
    if (!coin) {
      return res.status(404).json({ message: "Coin not found" });
    }
    
    return res.json(coin);
  });
  
  app.get("/api/coins/by-phase", async (req, res) => {
    // This would normally fetch from a crypto API and group by phase
    return res.json({
      "NEW_MOON": [
        {
          id: "pixel",
          symbol: "PIXEL",
          name: "Pixel Token",
          price: 0.00021,
          priceChange24h: -5.2,
          volume24h: 320000,
          whalePercentage: 8.3,
          moonPhase: "NEW_MOON",
          whaleIndicator: "DYNAMITE"
        },
        {
          id: "dingo",
          symbol: "DINGO",
          name: "Dingo Token",
          price: 0.00045,
          priceChange24h: -2.1,
          volume24h: 210000,
          whalePercentage: 7.8,
          moonPhase: "NEW_MOON",
          whaleIndicator: "DYNAMITE"
        },
        {
          id: "floki",
          symbol: "FLOKI",
          name: "Floki Token",
          price: 0.00008,
          priceChange24h: -8.7,
          volume24h: 890000,
          whalePercentage: 12.4,
          moonPhase: "NEW_MOON",
          whaleIndicator: "BOMB"
        },
        {
          id: "edu",
          symbol: "EDU",
          name: "Education Token",
          price: 0.0032,
          priceChange24h: -1.9,
          volume24h: 150000,
          whalePercentage: 6.2,
          moonPhase: "NEW_MOON",
          whaleIndicator: "DYNAMITE"
        },
        {
          id: "leo",
          symbol: "LEO",
          name: "Leo Token",
          price: 0.0078,
          priceChange24h: -0.8,
          volume24h: 220000,
          whalePercentage: 9.1,
          moonPhase: "NEW_MOON",
          whaleIndicator: "DYNAMITE"
        }
      ],
      "HALF_MOON": [
        {
          id: "mcb",
          symbol: "MCB",
          name: "MCB Token",
          price: 0.012,
          priceChange24h: 5.8,
          volume24h: 450000,
          whalePercentage: 4.9,
          moonPhase: "HALF_MOON",
          whaleIndicator: "ROCKET"
        },
        {
          id: "linq",
          symbol: "LINQ",
          name: "Linq Token",
          price: 0.045,
          priceChange24h: 8.2,
          volume24h: 680000,
          whalePercentage: 3.7,
          moonPhase: "HALF_MOON",
          whaleIndicator: "ROCKET"
        },
        {
          id: "ape",
          symbol: "APE",
          name: "Ape Token",
          price: 0.089,
          priceChange24h: 3.4,
          volume24h: 1200000,
          whalePercentage: 7.2,
          moonPhase: "HALF_MOON",
          whaleIndicator: "DYNAMITE"
        },
        {
          id: "agix",
          symbol: "AGIX",
          name: "AGIX Token",
          price: 0.23,
          priceChange24h: 6.7,
          volume24h: 3400000,
          whalePercentage: 5.4,
          moonPhase: "HALF_MOON",
          whaleIndicator: "DYNAMITE"
        },
        {
          id: "hex",
          symbol: "HEX",
          name: "Hex Token",
          price: 0.0021,
          priceChange24h: 4.5,
          volume24h: 980000,
          whalePercentage: 6.8,
          moonPhase: "HALF_MOON",
          whaleIndicator: "DYNAMITE"
        }
      ],
      "FULL_MOON": [
        {
          id: "wagmi",
          symbol: "WAGMI",
          name: "Wagmi Token",
          price: 0.031,
          priceChange24h: 24.9,
          volume24h: 1800000,
          whalePercentage: 4.2,
          moonPhase: "FULL_MOON",
          whaleIndicator: "ROCKET"
        },
        {
          id: "shib",
          symbol: "SHIB",
          name: "Shiba Inu",
          price: 0.000023,
          priceChange24h: 15.7,
          volume24h: 9800000,
          whalePercentage: 2.8,
          moonPhase: "FULL_MOON",
          whaleIndicator: "ROCKET"
        },
        {
          id: "btc",
          symbol: "BTC",
          name: "Bitcoin",
          price: 43500.25,
          priceChange24h: 12.3,
          volume24h: 48000000,
          whalePercentage: 1.9,
          moonPhase: "FULL_MOON",
          whaleIndicator: "ROCKET"
        },
        {
          id: "bonk",
          symbol: "BONK",
          name: "Bonk Token",
          price: 0.00000045,
          priceChange24h: 32.8,
          volume24h: 4500000,
          whalePercentage: 3.5,
          moonPhase: "FULL_MOON",
          whaleIndicator: "ROCKET"
        },
        {
          id: "doge",
          symbol: "DOGE",
          name: "Dogecoin",
          price: 0.123,
          priceChange24h: 18.5,
          volume24h: 8900000,
          whalePercentage: 4.1,
          moonPhase: "FULL_MOON",
          whaleIndicator: "ROCKET"
        }
      ]
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
