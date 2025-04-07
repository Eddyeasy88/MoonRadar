import { apiRequest } from './queryClient';
import { User, Coin, WhaleIndicator, MoonPhase, WatchlistItem } from '@/types';

// User API
export const loginUser = async (email: string, password: string) => {
  const res = await apiRequest('POST', '/api/auth/login', { email, password });
  return res.json();
};

export const registerUser = async (username: string, email: string, password: string) => {
  const res = await apiRequest('POST', '/api/auth/register', { username, email, password });
  return res.json();
};

export const logoutUser = async () => {
  const res = await apiRequest('POST', '/api/auth/logout', {});
  return res.json();
};

export const updateUserSettings = async (settings: Partial<User>) => {
  const res = await apiRequest('PATCH', '/api/users/settings', settings);
  return res.json();
};

// Watchlist API
export const addToWatchlist = async (coinId: string, coinSymbol: string) => {
  const res = await apiRequest('POST', '/api/watchlist', { coinId, coinSymbol });
  return res.json();
};

export const removeFromWatchlist = async (coinId: string) => {
  const res = await apiRequest('DELETE', `/api/watchlist/${coinId}`, {});
  return res.json();
};

// VIP API
export const upgradeToVip = async () => {
  const res = await apiRequest('POST', '/api/vip/upgrade', {});
  return res.json();
};

// Invite API
export const generateInviteLink = async () => {
  const res = await apiRequest('GET', '/api/invite/generate');
  return res.json();
};

export const sendInvite = async (email: string) => {
  const res = await apiRequest('POST', '/api/invite/send', { email });
  return res.json();
};

// Function to determine the whale indicator based on percentage
export const getWhaleIndicator = (whalePercentage: number): WhaleIndicator => {
  if (whalePercentage < 5) {
    return WhaleIndicator.ROCKET;
  } else if (whalePercentage < 10) {
    return WhaleIndicator.DYNAMITE;
  } else {
    return WhaleIndicator.BOMB;
  }
};

// Function to determine the moon phase based on market conditions
export const getMoonPhase = (
  priceChange24h: number, 
  whalePercentage: number, 
  volume24hChange: number
): MoonPhase => {
  // This is a simplified algorithm for demo purposes
  // In a real-world scenario, this would be more sophisticated
  const score = priceChange24h - whalePercentage + (volume24hChange / 10);
  
  if (score > 20) {
    return MoonPhase.FULL_MOON;
  } else if (score > 0) {
    return MoonPhase.HALF_MOON;
  } else {
    return MoonPhase.NEW_MOON;
  }
};
