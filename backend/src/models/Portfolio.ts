import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface PortfolioAttributes {
  id: string;
  name: string;
  description?: string;
  currency: string;
  totalValue: number;
  cashBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PortfolioCreationAttributes extends Optional<PortfolioAttributes, 'id' | 'totalValue' | 'cashBalance'> {}

export class Portfolio extends Model<PortfolioAttributes, PortfolioCreationAttributes> implements PortfolioAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public currency!: string;
  public totalValue!: number;
  public cashBalance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Portfolio.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    totalValue: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    },
    cashBalance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'portfolios',
    timestamps: true
  }
);
