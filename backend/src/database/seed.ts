import { sequelize } from './connection';
import { User } from '../models/User';
import { Bet } from '../models/Bet';
import { Provider } from '../models/Provider';
import { providerService } from '../services/ProviderService';

async function seed() {
  try {
    console.log('Starting database seed...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create demo user
    const demoUser = await User.create({
      username: 'demo',
      balance: 10000.00,
      currency: 'USD',
    });

    console.log(`Created demo user with ID: ${demoUser.id}`);

    // Create providers
    const providers = await Provider.bulkCreate([
      {
        name: 'Pragmatic Play',
        slug: 'pragmatic-play',
        displayName: 'Pragmatic Play',
        logo: 'https://via.placeholder.com/150x50?text=Pragmatic+Play',
        apiEndpoint: 'mock',
        apiKey: 'mock-api-key',
        isActive: true,
        isMock: true,
        config: { secretKey: 'mock-secret' },
      },
      {
        name: 'Evolution Gaming',
        slug: 'evolution',
        displayName: 'Evolution Gaming',
        logo: 'https://via.placeholder.com/150x50?text=Evolution',
        apiEndpoint: 'mock',
        apiKey: 'mock-api-key',
        isActive: true,
        isMock: true,
        config: { secretKey: 'mock-secret' },
      },
      {
        name: 'NetEnt',
        slug: 'netent',
        displayName: 'NetEnt',
        logo: 'https://via.placeholder.com/150x50?text=NetEnt',
        apiEndpoint: 'mock',
        apiKey: 'mock-api-key',
        isActive: true,
        isMock: true,
        config: { secretKey: 'mock-secret' },
      },
    ]);

    console.log(`Created ${providers.length} providers.`);

    // Sync games from each provider
    for (const provider of providers) {
      console.log(`Syncing games from ${provider.displayName}...`);
      const result = await providerService.syncProviderGames(provider.slug);
      console.log(`Synced ${result.synced} games from ${provider.displayName}`);
    }

    // Create some sample bets for history
    const sampleBets = [
      {
        userId: demoUser.id,
        game: 'dice',
        betAmount: 10.00,
        multiplier: 1.98,
        payout: 19.80,
        profit: 9.80,
        isWin: true,
        gameData: { result: 55.5, target: 50, isOver: true },
      },
      {
        userId: demoUser.id,
        game: 'slots',
        betAmount: 5.00,
        multiplier: 10,
        payout: 50.00,
        profit: 45.00,
        isWin: true,
        gameData: { reels: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]] },
      },
      {
        userId: demoUser.id,
        game: 'roulette',
        betAmount: 20.00,
        multiplier: 1,
        payout: 40.00,
        profit: 20.00,
        isWin: true,
        gameData: { result: 17, betType: 'red', betValue: null },
      },
      {
        userId: demoUser.id,
        game: 'dice',
        betAmount: 15.00,
        multiplier: 0,
        payout: 0,
        profit: -15.00,
        isWin: false,
        gameData: { result: 45.2, target: 50, isOver: true },
      },
    ];

    for (const betData of sampleBets) {
      await Bet.create(betData);
    }

    console.log(`Created ${sampleBets.length} sample bets.`);
    console.log('\n=== Seed completed successfully! ===');
    console.log('\nDemo credentials:');
    console.log('Username: demo');
    console.log(`User ID: ${demoUser.id}`);
    console.log('Starting Balance: $10,000.00');
    console.log('\nProviders:');
    providers.forEach(p => console.log(`- ${p.displayName}`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
