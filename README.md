# Aladdin Clone - Investment Management Platform

A comprehensive investment management and risk analytics platform inspired by BlackRock's Aladdin. This application provides portfolio management, trading operations, risk analysis, and advanced analytics capabilities.

![Platform](https://img.shields.io/badge/Platform-Investment_Management-blue)
![Stack](https://img.shields.io/badge/Stack-PERN-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📚 Документация

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Подробная пошаговая инструкция по установке (для новичков)
- **[QUICK_START.md](QUICK_START.md)** - Быстрый старт для опытных пользователей
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Примеры использования API с curl, JavaScript, TypeScript

### 🚀 Быстрая установка

**Автоматическая установка (рекомендуется):**

```bash
# Linux/macOS
./setup.sh

# Windows
setup.bat
```

**Или вручную:**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
createdb aladdin_db
cd backend && cp .env.example .env
# Отредактируйте .env с вашим паролем PostgreSQL
npm run db:seed
cd .. && npm run dev
```

Откройте: http://localhost:3000

---

## Features

### Core Capabilities

- **Portfolio Management**
  - Create and manage multiple investment portfolios
  - Track positions across different asset classes
  - Real-time portfolio valuation and P&L tracking
  - Cash balance management

- **Risk Analytics Engine**
  - Value at Risk (VaR) calculations at 95% and 99% confidence levels
  - Sharpe Ratio calculation for risk-adjusted returns
  - Portfolio volatility and beta metrics
  - Maximum drawdown analysis
  - Concentration risk measurement (Herfindahl Index)
  - Scenario analysis and stress testing

- **Trading Operations**
  - Create buy/sell orders
  - Execute trades with automatic position updates
  - Trade history and audit trail
  - Real-time order management

- **Advanced Analytics**
  - Portfolio performance metrics
  - Asset allocation visualization
  - Sector and asset type exposure analysis
  - Top holdings analysis
  - Historical trade analytics

- **Asset Management**
  - Support for multiple asset classes:
    - Stocks
    - Bonds
    - ETFs
    - Options & Futures
    - Forex
    - Cryptocurrencies
    - Commodities
    - Real Estate
    - Private Equity

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Build Tool**: Vite
- **Routing**: React Router v6

## Project Structure

```
aladdin-clone/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (Risk Engine)
│   │   ├── database/         # DB connection and seeds
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── package.json              # Root package.json
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd aladdin-clone
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Database Setup

1. Create a PostgreSQL database:

```bash
createdb aladdin_db
```

2. Configure environment variables:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=aladdin_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
API_VERSION=v1
```

### Step 4: Seed the Database

```bash
cd backend
npm run db:seed
```

This will create:
- 10 sample assets (stocks, ETFs, bonds, crypto, commodities)
- 2 portfolios (Growth Portfolio and Balanced Portfolio)
- Sample positions and trades

## Running the Application

### Development Mode

You can run both frontend and backend simultaneously from the root directory:

```bash
# From root directory
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### Production Mode

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# Start production servers
npm run start
```

## API Endpoints

### Portfolios
- `GET /api/v1/portfolios` - Get all portfolios
- `GET /api/v1/portfolios/:id` - Get portfolio by ID
- `POST /api/v1/portfolios` - Create new portfolio
- `PUT /api/v1/portfolios/:id` - Update portfolio
- `DELETE /api/v1/portfolios/:id` - Delete portfolio
- `GET /api/v1/portfolios/:id/positions` - Get portfolio positions
- `POST /api/v1/portfolios/:id/update-values` - Update position values

### Assets
- `GET /api/v1/assets` - Get all assets
- `GET /api/v1/assets/:id` - Get asset by ID
- `POST /api/v1/assets` - Create new asset
- `PUT /api/v1/assets/:id` - Update asset
- `PATCH /api/v1/assets/:id/price` - Update asset price
- `DELETE /api/v1/assets/:id` - Delete asset

### Trades
- `GET /api/v1/trades` - Get all trades
- `GET /api/v1/trades/:id` - Get trade by ID
- `POST /api/v1/trades` - Create new trade
- `POST /api/v1/trades/:id/execute` - Execute trade
- `POST /api/v1/trades/:id/cancel` - Cancel trade

### Risk Analysis
- `GET /api/v1/risk/portfolio/:portfolioId/analyze` - Analyze portfolio risk
- `GET /api/v1/risk/portfolio/:portfolioId/scenarios` - Run scenario analysis
- `GET /api/v1/risk/portfolio/:portfolioId/history` - Get risk history

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard summary
- `GET /api/v1/analytics/portfolio/:portfolioId/performance` - Get portfolio performance
- `GET /api/v1/analytics/portfolio/:portfolioId/allocation` - Get asset allocation
- `GET /api/v1/analytics/portfolio/:portfolioId/trades` - Get trade history

## Risk Analysis Features

### Value at Risk (VaR)
The platform calculates VaR using historical simulation method:
- **VaR 95%**: Maximum expected loss at 95% confidence level
- **VaR 99%**: Maximum expected loss at 99% confidence level

### Risk Metrics
- **Sharpe Ratio**: Risk-adjusted return metric
- **Volatility**: Standard deviation of returns
- **Beta**: Portfolio sensitivity to market movements
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Concentration**: Herfindahl index for diversification

### Scenario Analysis
Stress tests portfolio against various scenarios:
- Market Crash (20% equity decline)
- Interest Rate Hike (2% increase)
- Inflation Spike (5% unexpected inflation)
- Currency Devaluation (15% decline)
- Tech Sector Correction (30% decline)

## Usage Guide

### Creating a Portfolio

1. Navigate to **Portfolios** page
2. Click **Create Portfolio**
3. Enter portfolio details:
   - Name
   - Description
   - Initial cash balance
4. Click **Create**

### Adding Assets

1. Navigate to **Assets** page
2. Click **Add Asset**
3. Enter asset details:
   - Symbol (e.g., AAPL)
   - Name (e.g., Apple Inc.)
   - Asset Type (Stock, Bond, ETF, etc.)
   - Sector
   - Current Price
   - Exchange
4. Click **Add**

### Executing Trades

1. Navigate to **Trading** page
2. Click **New Trade**
3. Select:
   - Portfolio
   - Asset
   - Trade Type (Buy/Sell)
   - Quantity
   - Price (auto-filled with current price)
   - Fees (optional)
4. Click **Create Trade**
5. Click **Execute** to complete the trade

### Analyzing Risk

1. Navigate to **Risk Analysis** page
2. Select a portfolio
3. Click **Analyze Risk**
4. View:
   - VaR metrics
   - Sharpe Ratio
   - Volatility
   - Risk level
   - Scenario analysis results

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Formatting

```bash
# Format backend
cd backend
npm run lint

# Format frontend
cd frontend
npm run lint
```

### Database Migrations

```bash
cd backend
npm run db:migrate
```

## Architecture

### Backend Architecture

```
Request → Router → Controller → Service/Model → Database
                              ↓
                         Risk Engine
```

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic (Risk Engine, calculations)
- **Models**: Database schema and ORM operations
- **Routes**: API endpoint definitions

### Frontend Architecture

```
Page Component → API Service → Backend API
      ↓              ↓
  UI Components   State Management
```

- **Pages**: Main route components
- **Components**: Reusable UI components
- **Services**: API client and data fetching
- **State**: React Query for server state

## Performance

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: React Query caching for API responses
- **Connection Pooling**: PostgreSQL connection pool (max 10)
- **Lazy Loading**: Code splitting in frontend
- **Compression**: Response compression enabled

## Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Server-side validation
- **SQL Injection**: Protected by Sequelize ORM
- **XSS**: Protected by React's built-in escaping

## Future Enhancements

- [ ] Real-time market data integration
- [ ] AI-powered portfolio recommendations (Aladdin Copilot)
- [ ] Advanced charting and technical analysis
- [ ] Multi-currency support
- [ ] Mobile application (React Native)
- [ ] Email notifications and alerts
- [ ] Compliance and regulatory reporting
- [ ] Multi-user support with authentication
- [ ] API rate limiting
- [ ] WebSocket for real-time updates
- [ ] Export to PDF/Excel
- [ ] Integration with external brokers
- [ ] Machine learning for risk prediction

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by BlackRock's Aladdin platform
- Built with modern web technologies
- Educational and demonstration purposes

## Support

For questions or issues:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Note**: This is an educational project inspired by BlackRock's Aladdin platform. It is not affiliated with or endorsed by BlackRock.