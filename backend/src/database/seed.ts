import { sequelize } from './connection';
import { Portfolio } from '../models/Portfolio';
import { Asset, AssetType } from '../models/Asset';
import { Position } from '../models/Position';
import { Trade, TradeType, TradeStatus } from '../models/Trade';

async function seed() {
  try {
    console.log('Starting database seed...');

    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create sample assets
    const assets = await Asset.bulkCreate([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        assetType: AssetType.STOCK,
        sector: 'Technology',
        currentPrice: 178.50,
        currency: 'USD',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        assetType: AssetType.STOCK,
        sector: 'Technology',
        currentPrice: 378.91,
        currency: 'USD',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        assetType: AssetType.STOCK,
        sector: 'Technology',
        currentPrice: 141.80,
        currency: 'USD',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        assetType: AssetType.STOCK,
        sector: 'Consumer Cyclical',
        currentPrice: 155.20,
        currency: 'USD',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        assetType: AssetType.STOCK,
        sector: 'Automotive',
        currentPrice: 242.84,
        currency: 'USD',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        assetType: AssetType.ETF,
        sector: 'Broad Market',
        currentPrice: 450.23,
        currency: 'USD',
        exchange: 'NYSE'
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        assetType: AssetType.CRYPTO,
        sector: 'Cryptocurrency',
        currentPrice: 43500.00,
        currency: 'USD',
        exchange: 'Crypto'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        assetType: AssetType.CRYPTO,
        sector: 'Cryptocurrency',
        currentPrice: 2280.50,
        currency: 'USD',
        exchange: 'Crypto'
      },
      {
        symbol: 'AGG',
        name: 'iShares Core U.S. Aggregate Bond ETF',
        assetType: AssetType.BOND,
        sector: 'Fixed Income',
        currentPrice: 96.50,
        currency: 'USD',
        exchange: 'NYSE'
      },
      {
        symbol: 'GLD',
        name: 'SPDR Gold Shares',
        assetType: AssetType.COMMODITY,
        sector: 'Precious Metals',
        currentPrice: 184.20,
        currency: 'USD',
        exchange: 'NYSE'
      }
    ]);

    console.log(`Created ${assets.length} assets`);

    // Create sample portfolios
    const portfolio1 = await Portfolio.create({
      name: 'Growth Portfolio',
      description: 'Aggressive growth strategy focused on tech stocks',
      currency: 'USD',
      cashBalance: 50000.00,
      totalValue: 50000.00
    });

    const portfolio2 = await Portfolio.create({
      name: 'Balanced Portfolio',
      description: 'Diversified portfolio with stocks, bonds, and commodities',
      currency: 'USD',
      cashBalance: 100000.00,
      totalValue: 100000.00
    });

    console.log('Created portfolios');

    // Create positions for Growth Portfolio
    const positions1 = await Position.bulkCreate([
      {
        portfolioId: portfolio1.id,
        assetId: assets[0].id, // AAPL
        quantity: 100,
        averagePrice: 175.00,
        currentValue: 17850.00,
        unrealizedPnL: 350.00,
        realizedPnL: 0
      },
      {
        portfolioId: portfolio1.id,
        assetId: assets[1].id, // MSFT
        quantity: 50,
        averagePrice: 370.00,
        currentValue: 18945.50,
        unrealizedPnL: 445.50,
        realizedPnL: 0
      },
      {
        portfolioId: portfolio1.id,
        assetId: assets[2].id, // GOOGL
        quantity: 75,
        averagePrice: 140.00,
        currentValue: 10635.00,
        unrealizedPnL: 135.00,
        realizedPnL: 0
      },
      {
        portfolioId: portfolio1.id,
        assetId: assets[4].id, // TSLA
        quantity: 40,
        averagePrice: 245.00,
        currentValue: 9713.60,
        unrealizedPnL: -86.40,
        realizedPnL: 0
      }
    ]);

    // Create positions for Balanced Portfolio
    const positions2 = await Position.bulkCreate([
      {
        portfolioId: portfolio2.id,
        assetId: assets[5].id, // SPY
        quantity: 100,
        averagePrice: 445.00,
        currentValue: 45023.00,
        unrealizedPnL: 523.00,
        realizedPnL: 0
      },
      {
        portfolioId: portfolio2.id,
        assetId: assets[8].id, // AGG
        quantity: 200,
        averagePrice: 97.00,
        currentValue: 19300.00,
        unrealizedPnL: -100.00,
        realizedPnL: 0
      },
      {
        portfolioId: portfolio2.id,
        assetId: assets[9].id, // GLD
        quantity: 50,
        averagePrice: 182.00,
        currentValue: 9210.00,
        unrealizedPnL: 110.00,
        realizedPnL: 0
      },
      {
        portfolioId: portfolio2.id,
        assetId: assets[6].id, // BTC
        quantity: 0.5,
        averagePrice: 42000.00,
        currentValue: 21750.00,
        unrealizedPnL: 750.00,
        realizedPnL: 0
      }
    ]);

    // Update portfolio total values
    const portfolio1Value = positions1.reduce((sum, p) => sum + parseFloat(p.currentValue.toString()), 0);
    await portfolio1.update({ totalValue: portfolio1Value + parseFloat(portfolio1.cashBalance.toString()) });

    const portfolio2Value = positions2.reduce((sum, p) => sum + parseFloat(p.currentValue.toString()), 0);
    await portfolio2.update({ totalValue: portfolio2Value + parseFloat(portfolio2.cashBalance.toString()) });

    console.log(`Created ${positions1.length + positions2.length} positions`);

    // Create sample trades
    const trades = await Trade.bulkCreate([
      {
        portfolioId: portfolio1.id,
        assetId: assets[0].id,
        tradeType: TradeType.BUY,
        quantity: 100,
        price: 175.00,
        totalAmount: 17500.00,
        fees: 10.00,
        status: TradeStatus.EXECUTED,
        executedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        portfolioId: portfolio1.id,
        assetId: assets[1].id,
        tradeType: TradeType.BUY,
        quantity: 50,
        price: 370.00,
        totalAmount: 18500.00,
        fees: 10.00,
        status: TradeStatus.EXECUTED,
        executedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        portfolioId: portfolio2.id,
        assetId: assets[5].id,
        tradeType: TradeType.BUY,
        quantity: 100,
        price: 445.00,
        totalAmount: 44500.00,
        fees: 15.00,
        status: TradeStatus.EXECUTED,
        executedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log(`Created ${trades.length} trades`);

    console.log('Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- Assets: ${assets.length}`);
    console.log(`- Portfolios: 2`);
    console.log(`- Positions: ${positions1.length + positions2.length}`);
    console.log(`- Trades: ${trades.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
