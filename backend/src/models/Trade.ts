import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import { Portfolio } from './Portfolio';
import { Asset } from './Asset';

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum TradeStatus {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

interface TradeAttributes {
  id: string;
  portfolioId: string;
  assetId: string;
  tradeType: TradeType;
  quantity: number;
  price: number;
  totalAmount: number;
  fees: number;
  status: TradeStatus;
  executedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TradeCreationAttributes extends Optional<TradeAttributes, 'id' | 'status' | 'fees'> {}

export class Trade extends Model<TradeAttributes, TradeCreationAttributes> implements TradeAttributes {
  public id!: string;
  public portfolioId!: string;
  public assetId!: string;
  public tradeType!: TradeType;
  public quantity!: number;
  public price!: number;
  public totalAmount!: number;
  public fees!: number;
  public status!: TradeStatus;
  public executedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trade.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    portfolioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'portfolios',
        key: 'id'
      }
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assets',
        key: 'id'
      }
    },
    tradeType: {
      type: DataTypes.ENUM(...Object.values(TradeType)),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    fees: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TradeStatus)),
      allowNull: false,
      defaultValue: TradeStatus.PENDING
    },
    executedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'trades',
    timestamps: true
  }
);

// Associations
Portfolio.hasMany(Trade, { foreignKey: 'portfolioId', as: 'trades' });
Trade.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });

Asset.hasMany(Trade, { foreignKey: 'assetId', as: 'trades' });
Trade.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
