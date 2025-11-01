import { Model, DataTypes, Sequelize } from 'sequelize';

export interface GameSessionAttributes {
  id?: number;
  userId: number;
  gameId: number;
  providerId: number;
  sessionToken: string;
  gameUrl?: string;
  isDemo: boolean;
  isActive: boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GameSession extends Model<GameSessionAttributes> implements GameSessionAttributes {
  public id!: number;
  public userId!: number;
  public gameId!: number;
  public providerId!: number;
  public sessionToken!: string;
  public gameUrl?: string;
  public isDemo!: boolean;
  public isActive!: boolean;
  public expiresAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initGameSessionModel = (sequelize: Sequelize): typeof GameSession => {
  GameSession.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'providers',
          key: 'id',
        },
      },
      sessionToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      gameUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isDemo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'game_sessions',
      timestamps: true,
    }
  );

  return GameSession;
};
