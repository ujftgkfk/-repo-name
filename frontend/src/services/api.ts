import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Wallet APIs
export const walletApi = {
  getUser: (userId: number) => api.get(`/wallet/users/${userId}`),
  createUser: (username: string) => api.post('/wallet/users', { username }),
  getBalance: (userId: number) => api.get(`/wallet/users/${userId}/balance`),
  deposit: (userId: number, amount: number) => api.post(`/wallet/users/${userId}/deposit`, { amount })
};

// Game APIs
export const gameApi = {
  playDice: (data: any) => api.post('/games/dice', data),
  playSlots: (data: any) => api.post('/games/slots', data),
  playRoulette: (data: any) => api.post('/games/roulette', data),
  playBlackjack: (data: any) => api.post('/games/blackjack', data),
  getBetHistory: (userId: number, game?: string, limit?: number) =>
    api.get(`/games/bets/${userId}`, { params: { game, limit } }),
  getUserStats: (userId: number) => api.get(`/games/stats/${userId}`)
};

export default api;
