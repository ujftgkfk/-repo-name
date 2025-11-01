import { Model, DataTypes, Sequelize } from 'sequelize';

export interface ProviderAttributes {
  id?: number;
  name: string;
  slug: string;
  displayName: string;
  logo?: string;
  apiEndpoint?: string;
  apiKey?: string;
  isActive: boolean;
  isMock: boolean;
  config?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Provider extends Model<ProviderAttributes> implements ProviderAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public displayName!: string;
  public logo?: string;
  public apiEndpoint?: string;
  public apiKey?: string;
  public isActive!: boolean;
  public isMock!: boolean;
  public config?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initProviderModel = (sequelize: Sequelize): typeof Provider => {
  Provider.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      displayName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      apiEndpoint: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      apiKey: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isMock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      config: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'providers',
      timestamps: true,
    }
  );

  return Provider;
};
