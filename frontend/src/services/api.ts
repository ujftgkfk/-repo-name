import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Portfolio APIs
export const portfolioApi = {
  getAll: () => api.get('/portfolios'),
  getById: (id: string) => api.get(`/portfolios/${id}`),
  create: (data: any) => api.post('/portfolios', data),
  update: (id: string, data: any) => api.put(`/portfolios/${id}`, data),
  delete: (id: string) => api.delete(`/portfolios/${id}`),
  getPositions: (id: string) => api.get(`/portfolios/${id}/positions`),
  updateValues: (id: string) => api.post(`/portfolios/${id}/update-values`)
};

// Asset APIs
export const assetApi = {
  getAll: (params?: any) => api.get('/assets', { params }),
  getById: (id: string) => api.get(`/assets/${id}`),
  create: (data: any) => api.post('/assets', data),
  update: (id: string, data: any) => api.put(`/assets/${id}`, data),
  updatePrice: (id: string, price: number) => api.patch(`/assets/${id}/price`, { currentPrice: price }),
  delete: (id: string) => api.delete(`/assets/${id}`)
};

// Trade APIs
export const tradeApi = {
  getAll: (params?: any) => api.get('/trades', { params }),
  getById: (id: string) => api.get(`/trades/${id}`),
  create: (data: any) => api.post('/trades', data),
  execute: (id: string) => api.post(`/trades/${id}/execute`),
  cancel: (id: string) => api.post(`/trades/${id}/cancel`)
};

// Risk APIs
export const riskApi = {
  analyzePortfolio: (portfolioId: string) => api.get(`/risk/portfolio/${portfolioId}/analyze`),
  runScenarios: (portfolioId: string) => api.get(`/risk/portfolio/${portfolioId}/scenarios`),
  getHistory: (portfolioId: string, days?: number) =>
    api.get(`/risk/portfolio/${portfolioId}/history`, { params: { days } })
};

// Analytics APIs
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPerformance: (portfolioId: string) => api.get(`/analytics/portfolio/${portfolioId}/performance`),
  getAllocation: (portfolioId: string) => api.get(`/analytics/portfolio/${portfolioId}/allocation`),
  getTradeHistory: (portfolioId: string, params?: any) =>
    api.get(`/analytics/portfolio/${portfolioId}/trades`, { params })
};

export default api;
