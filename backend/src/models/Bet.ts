import { Model, DataTypes, Sequelize } from 'sequelize';

export interface BetAttributes {
  id?: number;
  userId: number;
  game: string;
  betAmount: number;
  multiplier: number;
  payout: number;
  profit: number;
  isWin: boolean;
  gameData: any;
  serverSeed?: string;
  clientSeed?: string;
  nonce?: number;
  createdAt?: Date;
}

export class Bet extends Model<BetAttributes> implements BetAttributes {
  public id!: number;
  public userId!: number;
  public game!: string;
  public betAmount!: number;
  public multiplier!: number;
  public payout!: number;
  public profit!: number;
  public isWin!: boolean;
  public gameData!: any;
  public serverSeed?: string;
  public clientSeed?: string;
  public nonce?: number;
  public readonly createdAt!: Date;
}

export const initBetModel = (sequelize: Sequelize): typeof Bet => {
  Bet.init(
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
      game: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      betAmount: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
      },
      multiplier: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0,
      },
      payout: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        defaultValue: 0,
      },
      profit: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        defaultValue: 0,
      },
      isWin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gameData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      serverSeed: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      clientSeed: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      nonce: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'bets',
      timestamps: true,
      updatedAt: false,
    }
  );

  return Bet;
};
