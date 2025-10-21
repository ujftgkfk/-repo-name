import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import { Portfolio } from './Portfolio';

interface RiskMetricAttributes {
  id: string;
  portfolioId: string;
  date: Date;
  var95: number; // Value at Risk 95%
  var99: number; // Value at Risk 99%
  sharpeRatio: number;
  volatility: number;
  beta: number;
  maxDrawdown: number;
  exposureByAssetType: any;
  exposureBySector: any;
  concentration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RiskMetricCreationAttributes extends Optional<RiskMetricAttributes, 'id'> {}

export class RiskMetric extends Model<RiskMetricAttributes, RiskMetricCreationAttributes> implements RiskMetricAttributes {
  public id!: string;
  public portfolioId!: string;
  public date!: Date;
  public var95!: number;
  public var99!: number;
  public sharpeRatio!: number;
  public volatility!: number;
  public beta!: number;
  public maxDrawdown!: number;
  public exposureByAssetType!: any;
  public exposureBySector!: any;
  public concentration!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RiskMetric.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    var95: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    var99: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    sharpeRatio: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    volatility: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    beta: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    maxDrawdown: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    exposureByAssetType: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    exposureBySector: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    concentration: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'risk_metrics',
    timestamps: true,
    indexes: [
      {
        fields: ['portfolioId', 'date']
      }
    ]
  }
);

Portfolio.hasMany(RiskMetric, { foreignKey: 'portfolioId', as: 'riskMetrics' });
RiskMetric.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
