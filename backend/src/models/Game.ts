import { Model, DataTypes, Sequelize } from 'sequelize';

export enum GameCategory {
  SLOTS = 'slots',
  LIVE_CASINO = 'live_casino',
  TABLE_GAMES = 'table_games',
  JACKPOT = 'jackpot',
  CRASH = 'crash',
  INSTANT = 'instant',
}

export interface GameAttributes {
  id?: number;
  providerId: number;
  gameId: string;
  name: string;
  slug: string;
  category: GameCategory;
  thumbnail?: string;
  description?: string;
  hasDemo: boolean;
  minBet?: number;
  maxBet?: number;
  rtp?: number;
  volatility?: string;
  isActive: boolean;
  popularity: number;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Game extends Model<GameAttributes> implements GameAttributes {
  public id!: number;
  public providerId!: number;
  public gameId!: string;
  public name!: string;
  public slug!: string;
  public category!: GameCategory;
  public thumbnail?: string;
  public description?: string;
  public hasDemo!: boolean;
  public minBet?: number;
  public maxBet?: number;
  public rtp?: number;
  public volatility?: string;
  public isActive!: boolean;
  public popularity!: number;
  public metadata?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initGameModel = (sequelize: Sequelize): typeof Game => {
  Game.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'providers',
          key: 'id',
        },
      },
      gameId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(GameCategory)),
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hasDemo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      minBet: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      maxBet: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      rtp: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      volatility: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      popularity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'games',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['providerId', 'gameId'],
        },
        {
          fields: ['category'],
        },
        {
          fields: ['slug'],
        },
      ],
    }
  );

  return Game;
};
