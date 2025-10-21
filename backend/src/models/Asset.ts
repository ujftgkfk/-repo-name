import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

export enum AssetType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  ETF = 'ETF',
  OPTION = 'OPTION',
  FUTURE = 'FUTURE',
  FOREX = 'FOREX',
  CRYPTO = 'CRYPTO',
  COMMODITY = 'COMMODITY',
  REAL_ESTATE = 'REAL_ESTATE',
  PRIVATE_EQUITY = 'PRIVATE_EQUITY'
}

interface AssetAttributes {
  id: string;
  symbol: string;
  name: string;
  assetType: AssetType;
  sector?: string;
  currentPrice: number;
  currency: string;
  exchange?: string;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AssetCreationAttributes extends Optional<AssetAttributes, 'id'> {}

export class Asset extends Model<AssetAttributes, AssetCreationAttributes> implements AssetAttributes {
  public id!: string;
  public symbol!: string;
  public name!: string;
  public assetType!: AssetType;
  public sector?: string;
  public currentPrice!: number;
  public currency!: string;
  public exchange?: string;
  public metadata?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Asset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assetType: {
      type: DataTypes.ENUM(...Object.values(AssetType)),
      allowNull: false
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currentPrice: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    exchange: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'assets',
    timestamps: true
  }
);
