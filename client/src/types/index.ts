export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap?: number;
  image?: string;
  whalePercentage: number;
  holders?: number;
  liquidity?: number;
  moonPhase: MoonPhase;
  whaleIndicator: WhaleIndicator;
}

export enum MoonPhase {
  NEW_MOON = "NEW_MOON",
  HALF_MOON = "HALF_MOON",
  FULL_MOON = "FULL_MOON"
}

export enum WhaleIndicator {
  ROCKET = "ROCKET", // <5%
  DYNAMITE = "DYNAMITE", // <10%
  BOMB = "BOMB" // <15%
}

export interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  vipExpiresAt: string | null;
  referralCode: string;
  darkMode: boolean;
  notifications: boolean;
}

export interface WatchlistItem {
  id: number;
  userId: number;
  coinId: string;
  coinSymbol: string;
  createdAt: string;
}
