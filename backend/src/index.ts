import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './database/connection';
import portfolioRoutes from './routes/portfolio.routes';
import assetRoutes from './routes/asset.routes';
import tradeRoutes from './routes/trade.routes';
import riskRoutes from './routes/risk.routes';
import analyticsRoutes from './routes/analytics.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/portfolios`, portfolioRoutes);
app.use(`/api/${API_VERSION}/assets`, assetRoutes);
app.use(`/api/${API_VERSION}/trades`, tradeRoutes);
app.use(`/api/${API_VERSION}/risk`, riskRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (in production, use migrations instead)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }

    app.listen(PORT, () => {
      console.log(`Aladdin Backend Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`API Version: ${API_VERSION}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
