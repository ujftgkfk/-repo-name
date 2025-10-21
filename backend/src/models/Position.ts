import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import { Portfolio } from './Portfolio';
import { Asset } from './Asset';

interface PositionAttributes {
  id: string;
  portfolioId: string;
  assetId: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PositionCreationAttributes extends Optional<PositionAttributes, 'id' | 'currentValue' | 'unrealizedPnL' | 'realizedPnL'> {}

export class Position extends Model<PositionAttributes, PositionCreationAttributes> implements PositionAttributes {
  public id!: string;
  public portfolioId!: string;
  public assetId!: string;
  public quantity!: number;
  public averagePrice!: number;
  public currentValue!: number;
  public unrealizedPnL!: number;
  public realizedPnL!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Position.init(
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
    quantity: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    averagePrice: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: false
    },
    currentValue: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    },
    unrealizedPnL: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    },
    realizedPnL: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'positions',
    timestamps: true
  }
);

// Associations
Portfolio.hasMany(Position, { foreignKey: 'portfolioId', as: 'positions' });
Position.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });

Asset.hasMany(Position, { foreignKey: 'assetId', as: 'positions' });
Position.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
