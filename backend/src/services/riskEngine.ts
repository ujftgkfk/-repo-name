import { Portfolio } from '../models/Portfolio';
import { Position } from '../models/Position';
import { Asset } from '../models/Asset';

export interface RiskAnalysis {
  var95: number;
  var99: number;
  sharpeRatio: number;
  volatility: number;
  beta: number;
  maxDrawdown: number;
  exposureByAssetType: Record<string, number>;
  exposureBySector: Record<string, number>;
  concentration: number;
}

export interface ScenarioResult {
  scenario: string;
  description: string;
  impact: number;
  impactPercentage: number;
  affectedPositions: Array<{
    symbol: string;
    currentValue: number;
    projectedValue: number;
    change: number;
  }>;
}

export class RiskEngine {
  // Calculate Value at Risk using historical simulation method
  static calculateVaR(returns: number[], confidence: number): number {
    const sorted = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sorted.length);
    return sorted[index] || 0;
  }

  // Calculate portfolio volatility (standard deviation of returns)
  static calculateVolatility(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
  static calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const volatility = this.calculateVolatility(returns);
    return volatility > 0 ? (avgReturn - riskFreeRate / 252) / volatility : 0;
  }

  // Calculate Beta (market sensitivity)
  static calculateBeta(portfolioReturns: number[], marketReturns: number[]): number {
    const n = Math.min(portfolioReturns.length, marketReturns.length);
    const portfolioMean = portfolioReturns.slice(0, n).reduce((s, r) => s + r, 0) / n;
    const marketMean = marketReturns.slice(0, n).reduce((s, r) => s + r, 0) / n;

    let covariance = 0;
    let marketVariance = 0;

    for (let i = 0; i < n; i++) {
      covariance += (portfolioReturns[i] - portfolioMean) * (marketReturns[i] - marketMean);
      marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
    }

    return marketVariance > 0 ? covariance / marketVariance : 1;
  }

  // Calculate maximum drawdown
  static calculateMaxDrawdown(values: number[]): number {
    let maxDrawdown = 0;
    let peak = values[0];

    for (const value of values) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  // Simulate portfolio returns (mock data for demonstration)
  static simulateReturns(days: number = 252): number[] {
    const returns: number[] = [];
    for (let i = 0; i < days; i++) {
      // Generate random returns with mean 0.0005 and std 0.015
      const random = (Math.random() - 0.5) * 2;
      returns.push(0.0005 + random * 0.015);
    }
    return returns;
  }

  // Simulate market returns (mock data)
  static simulateMarketReturns(days: number = 252): number[] {
    const returns: number[] = [];
    for (let i = 0; i < days; i++) {
      const random = (Math.random() - 0.5) * 2;
      returns.push(0.0004 + random * 0.012);
    }
    return returns;
  }

  // Calculate comprehensive risk analysis
  static async analyzePortfolioRisk(portfolioId: string): Promise<RiskAnalysis> {
    const portfolio = await Portfolio.findByPk(portfolioId, {
      include: [
        {
          model: Position,
          as: 'positions',
          include: [{ model: Asset, as: 'asset' }]
        }
      ]
    });

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const positions = (portfolio as any).positions || [];
    const totalValue = parseFloat(portfolio.totalValue.toString());

    // Simulate returns for demonstration
    const returns = this.simulateReturns();
    const marketReturns = this.simulateMarketReturns();

    // Calculate portfolio values over time
    const values = returns.map((r, i) => {
      return totalValue * returns.slice(0, i + 1).reduce((prod, ret) => prod * (1 + ret), 1);
    });

    // Calculate risk metrics
    const var95 = this.calculateVaR(returns, 0.95) * totalValue;
    const var99 = this.calculateVaR(returns, 0.99) * totalValue;
    const volatility = this.calculateVolatility(returns);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const beta = this.calculateBeta(returns, marketReturns);
    const maxDrawdown = this.calculateMaxDrawdown(values);

    // Calculate exposure by asset type
    const exposureByAssetType: Record<string, number> = {};
    const exposureBySector: Record<string, number> = {};

    for (const position of positions) {
      const asset = (position as any).asset;
      const positionValue = parseFloat((position as any).currentValue.toString());
      const percentage = (positionValue / totalValue) * 100;

      // By asset type
      if (!exposureByAssetType[asset.assetType]) {
        exposureByAssetType[asset.assetType] = 0;
      }
      exposureByAssetType[asset.assetType] += percentage;

      // By sector
      const sector = asset.sector || 'Other';
      if (!exposureBySector[sector]) {
        exposureBySector[sector] = 0;
      }
      exposureBySector[sector] += percentage;
    }

    // Calculate concentration (Herfindahl index)
    const concentration = positions.reduce((sum: number, position: any) => {
      const percentage = parseFloat(position.currentValue.toString()) / totalValue;
      return sum + Math.pow(percentage, 2);
    }, 0);

    return {
      var95,
      var99,
      sharpeRatio,
      volatility,
      beta,
      maxDrawdown,
      exposureByAssetType,
      exposureBySector,
      concentration
    };
  }

  // Run scenario analysis
  static async runScenarioAnalysis(portfolioId: string): Promise<ScenarioResult[]> {
    const portfolio = await Portfolio.findByPk(portfolioId, {
      include: [
        {
          model: Position,
          as: 'positions',
          include: [{ model: Asset, as: 'asset' }]
        }
      ]
    });

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const positions = (portfolio as any).positions || [];
    const totalValue = parseFloat(portfolio.totalValue.toString());

    const scenarios = [
      {
        name: 'Market Crash',
        description: '20% market decline across all equities',
        impacts: { STOCK: -0.20, ETF: -0.18, CRYPTO: -0.30 }
      },
      {
        name: 'Interest Rate Hike',
        description: '2% interest rate increase',
        impacts: { BOND: -0.10, STOCK: -0.05, REAL_ESTATE: -0.08 }
      },
      {
        name: 'Inflation Spike',
        description: '5% unexpected inflation',
        impacts: { BOND: -0.15, COMMODITY: 0.10, REAL_ESTATE: 0.05 }
      },
      {
        name: 'Currency Devaluation',
        description: '15% currency devaluation',
        impacts: { FOREX: -0.15, STOCK: 0.05, COMMODITY: 0.08 }
      },
      {
        name: 'Tech Sector Correction',
        description: '30% decline in technology sector',
        impacts: { STOCK: -0.12, ETF: -0.08 }
      }
    ];

    const results: ScenarioResult[] = [];

    for (const scenario of scenarios) {
      let totalImpact = 0;
      const affectedPositions: any[] = [];

      for (const position of positions) {
        const asset = (position as any).asset;
        const positionValue = parseFloat((position as any).currentValue.toString());
        const impact = scenario.impacts[asset.assetType as keyof typeof scenario.impacts] || 0;

        const projectedValue = positionValue * (1 + impact);
        const change = projectedValue - positionValue;
        totalImpact += change;

        if (Math.abs(change) > 0) {
          affectedPositions.push({
            symbol: asset.symbol,
            currentValue: positionValue,
            projectedValue,
            change
          });
        }
      }

      results.push({
        scenario: scenario.name,
        description: scenario.description,
        impact: totalImpact,
        impactPercentage: (totalImpact / totalValue) * 100,
        affectedPositions
      });
    }

    return results.sort((a, b) => a.impact - b.impact);
  }
}
