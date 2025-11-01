import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initUserModel } from '../models/User';
import { initBetModel } from '../models/Bet';
import { initProviderModel } from '../models/Provider';
import { initGameModel } from '../models/Game';
import { initGameSessionModel } from '../models/GameSession';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'casino_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Initialize models
export const User = initUserModel(sequelize);
export const Bet = initBetModel(sequelize);
export const Provider = initProviderModel(sequelize);
export const Game = initGameModel(sequelize);
export const GameSession = initGameSessionModel(sequelize);

// Define associations
User.hasMany(Bet, { foreignKey: 'userId', as: 'bets' });
Bet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Provider.hasMany(Game, { foreignKey: 'providerId', as: 'games' });
Game.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(GameSession, { foreignKey: 'userId', as: 'sessions' });
GameSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Game.hasMany(GameSession, { foreignKey: 'gameId', as: 'sessions' });
GameSession.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

Provider.hasMany(GameSession, { foreignKey: 'providerId', as: 'sessions' });
GameSession.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });
