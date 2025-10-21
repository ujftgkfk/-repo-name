# API Examples - Примеры использования API

Этот файл содержит примеры запросов к API Aladdin Clone.

## Базовый URL

```
http://localhost:5000/api/v1
```

## Содержание

1. [Portfolios (Портфели)](#portfolios)
2. [Assets (Активы)](#assets)
3. [Trades (Сделки)](#trades)
4. [Risk Analysis (Анализ рисков)](#risk-analysis)
5. [Analytics (Аналитика)](#analytics)

---

## Portfolios

### Получить все портфели

```bash
curl http://localhost:5000/api/v1/portfolios
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Growth Portfolio",
      "description": "Aggressive growth strategy",
      "currency": "USD",
      "totalValue": "107143.60",
      "cashBalance": "50000.00",
      "positions": [...]
    }
  ]
}
```

### Получить портфель по ID

```bash
curl http://localhost:5000/api/v1/portfolios/{portfolio_id}
```

### Создать новый портфель

```bash
curl -X POST http://localhost:5000/api/v1/portfolios \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Portfolio",
    "description": "My investment portfolio",
    "currency": "USD",
    "cashBalance": 100000
  }'
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "My Portfolio",
    "totalValue": "100000.00",
    "cashBalance": "100000.00"
  }
}
```

### Обновить портфель

```bash
curl -X PUT http://localhost:5000/api/v1/portfolios/{portfolio_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Portfolio Name",
    "description": "New description",
    "cashBalance": 150000
  }'
```

### Удалить портфель

```bash
curl -X DELETE http://localhost:5000/api/v1/portfolios/{portfolio_id}
```

### Получить позиции портфеля

```bash
curl http://localhost:5000/api/v1/portfolios/{portfolio_id}/positions
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "portfolioId": "portfolio-uuid",
      "assetId": "asset-uuid",
      "quantity": "100.00000000",
      "averagePrice": "175.0000",
      "currentValue": "17850.00",
      "unrealizedPnL": "350.00",
      "asset": {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "currentPrice": "178.50"
      }
    }
  ]
}
```

### Обновить значения позиций

```bash
curl -X POST http://localhost:5000/api/v1/portfolios/{portfolio_id}/update-values
```

---

## Assets

### Получить все активы

```bash
curl http://localhost:5000/api/v1/assets
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "assetType": "STOCK",
      "sector": "Technology",
      "currentPrice": "178.50",
      "currency": "USD",
      "exchange": "NASDAQ"
    }
  ]
}
```

### Фильтрация активов

```bash
# По типу актива
curl http://localhost:5000/api/v1/assets?assetType=STOCK

# По сектору
curl http://localhost:5000/api/v1/assets?sector=Technology

# Комбинация
curl http://localhost:5000/api/v1/assets?assetType=STOCK&sector=Technology
```

### Получить актив по ID

```bash
curl http://localhost:5000/api/v1/assets/{asset_id}
```

### Создать новый актив

```bash
curl -X POST http://localhost:5000/api/v1/assets \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "assetType": "STOCK",
    "sector": "Automotive",
    "currentPrice": 242.84,
    "currency": "USD",
    "exchange": "NASDAQ"
  }'
```

**Типы активов:**
- `STOCK` - Акции
- `BOND` - Облигации
- `ETF` - ETF фонды
- `OPTION` - Опционы
- `FUTURE` - Фьючерсы
- `FOREX` - Валюта
- `CRYPTO` - Криптовалюта
- `COMMODITY` - Товары
- `REAL_ESTATE` - Недвижимость
- `PRIVATE_EQUITY` - Прямые инвестиции

### Обновить актив

```bash
curl -X PUT http://localhost:5000/api/v1/assets/{asset_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "currentPrice": 180.00
  }'
```

### Обновить только цену актива

```bash
curl -X PATCH http://localhost:5000/api/v1/assets/{asset_id}/price \
  -H "Content-Type: application/json" \
  -d '{
    "currentPrice": 185.50
  }'
```

### Удалить актив

```bash
curl -X DELETE http://localhost:5000/api/v1/assets/{asset_id}
```

---

## Trades

### Получить все сделки

```bash
curl http://localhost:5000/api/v1/trades
```

### Получить сделки портфеля

```bash
curl http://localhost:5000/api/v1/trades?portfolioId={portfolio_id}
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "portfolioId": "portfolio-uuid",
      "assetId": "asset-uuid",
      "tradeType": "BUY",
      "quantity": "100.00000000",
      "price": "175.0000",
      "totalAmount": "17510.00",
      "fees": "10.00",
      "status": "EXECUTED",
      "executedAt": "2024-01-15T10:30:00Z",
      "portfolio": {...},
      "asset": {...}
    }
  ]
}
```

### Создать сделку (Buy)

```bash
curl -X POST http://localhost:5000/api/v1/trades \
  -H "Content-Type: application/json" \
  -d '{
    "portfolioId": "portfolio-uuid",
    "assetId": "asset-uuid",
    "tradeType": "BUY",
    "quantity": 10,
    "price": 178.50,
    "fees": 5.00
  }'
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": "new-trade-uuid",
    "tradeType": "BUY",
    "quantity": "10.00000000",
    "price": "178.5000",
    "totalAmount": "1790.00",
    "fees": "5.00",
    "status": "PENDING"
  }
}
```

### Создать сделку (Sell)

```bash
curl -X POST http://localhost:5000/api/v1/trades \
  -H "Content-Type: application/json" \
  -d '{
    "portfolioId": "portfolio-uuid",
    "assetId": "asset-uuid",
    "tradeType": "SELL",
    "quantity": 5,
    "price": 180.00,
    "fees": 5.00
  }'
```

### Исполнить сделку

```bash
curl -X POST http://localhost:5000/api/v1/trades/{trade_id}/execute
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": "trade-uuid",
    "status": "EXECUTED",
    "executedAt": "2024-01-15T10:35:00Z"
  },
  "message": "Trade executed successfully"
}
```

**Что происходит при исполнении:**
- Обновляется баланс портфеля
- Создается/обновляется позиция
- При продаже рассчитывается реализованная прибыль

### Отменить сделку

```bash
curl -X POST http://localhost:5000/api/v1/trades/{trade_id}/cancel
```

**Статусы сделок:**
- `PENDING` - Ожидает исполнения
- `EXECUTED` - Исполнена
- `CANCELLED` - Отменена
- `FAILED` - Не удалось исполнить

---

## Risk Analysis

### Анализ рисков портфеля

```bash
curl http://localhost:5000/api/v1/risk/portfolio/{portfolio_id}/analyze
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "var95": -2145.23,
    "var99": -3876.45,
    "sharpeRatio": 1.45,
    "volatility": 0.0234,
    "beta": 1.12,
    "maxDrawdown": 0.0876,
    "exposureByAssetType": {
      "STOCK": 65.5,
      "BOND": 20.0,
      "CRYPTO": 10.5,
      "COMMODITY": 4.0
    },
    "exposureBySector": {
      "Technology": 45.2,
      "Finance": 15.8,
      "Healthcare": 10.5
    },
    "concentration": 0.2345
  }
}
```

**Метрики:**
- `var95` - Value at Risk 95% (макс. ожидаемый убыток с вероятностью 95%)
- `var99` - Value at Risk 99% (макс. ожидаемый убыток с вероятностью 99%)
- `sharpeRatio` - Коэффициент Шарпа (доходность с учетом риска)
- `volatility` - Волатильность портфеля
- `beta` - Чувствительность к рынку (1.0 = как рынок)
- `maxDrawdown` - Максимальное падение от пика
- `concentration` - Индекс концентрации (диверсификация)

### Сценарный анализ

```bash
curl http://localhost:5000/api/v1/risk/portfolio/{portfolio_id}/scenarios
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "scenario": "Market Crash",
      "description": "20% market decline across all equities",
      "impact": -12543.50,
      "impactPercentage": -11.8,
      "affectedPositions": [
        {
          "symbol": "AAPL",
          "currentValue": 17850.00,
          "projectedValue": 14280.00,
          "change": -3570.00
        }
      ]
    },
    {
      "scenario": "Interest Rate Hike",
      "description": "2% interest rate increase",
      "impact": -4523.20,
      "impactPercentage": -4.2,
      "affectedPositions": [...]
    }
  ]
}
```

**Сценарии:**
1. **Market Crash** - Падение рынка на 20%
2. **Interest Rate Hike** - Рост ставок на 2%
3. **Inflation Spike** - Неожиданная инфляция 5%
4. **Currency Devaluation** - Девальвация валюты 15%
5. **Tech Sector Correction** - Коррекция техсектора 30%

### История рисков

```bash
# За последние 30 дней (по умолчанию)
curl http://localhost:5000/api/v1/risk/portfolio/{portfolio_id}/history

# За последние 90 дней
curl http://localhost:5000/api/v1/risk/portfolio/{portfolio_id}/history?days=90
```

---

## Analytics

### Dashboard сводка

```bash
curl http://localhost:5000/api/v1/analytics/dashboard
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "totalAUM": 345678.90,
    "totalPortfolios": 2,
    "totalPositions": 8,
    "portfolios": [
      {
        "id": "uuid",
        "name": "Growth Portfolio",
        "totalValue": 107143.60,
        "cashBalance": 50000.00,
        "positionsCount": 4,
        "unrealizedPnL": 844.10
      }
    ],
    "recentTrades": [...]
  }
}
```

### Производительность портфеля

```bash
curl http://localhost:5000/api/v1/analytics/portfolio/{portfolio_id}/performance
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "totalValue": 107143.60,
    "totalInvested": 106299.50,
    "totalReturn": 844.10,
    "returnPercentage": 0.79,
    "unrealizedPnL": 844.10,
    "realizedPnL": 0.00,
    "cashBalance": 50000.00
  }
}
```

### Распределение активов

```bash
curl http://localhost:5000/api/v1/analytics/portfolio/{portfolio_id}/allocation
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "byAssetType": {
      "STOCK": {
        "value": 57143.60,
        "percentage": 53.3,
        "count": 4
      },
      "ETF": {
        "value": 45023.00,
        "percentage": 42.0,
        "count": 1
      }
    },
    "bySector": {
      "Technology": {
        "value": 47430.50,
        "percentage": 44.2,
        "count": 3
      }
    },
    "topHoldings": [
      {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "assetType": "STOCK",
        "value": 18945.50,
        "percentage": 17.7,
        "quantity": 50,
        "currentPrice": 378.91
      }
    ]
  }
}
```

### История сделок портфеля

```bash
# Первые 50 сделок
curl http://localhost:5000/api/v1/analytics/portfolio/{portfolio_id}/trades

# С пагинацией
curl http://localhost:5000/api/v1/analytics/portfolio/{portfolio_id}/trades?limit=20&offset=0
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tradeType": "BUY",
      "quantity": "100.00000000",
      "price": "175.0000",
      "totalAmount": "17510.00",
      "status": "EXECUTED",
      "executedAt": "2024-01-15T10:30:00Z",
      "asset": {
        "symbol": "AAPL",
        "name": "Apple Inc."
      }
    }
  ],
  "total": 3
}
```

---

## Примеры использования с JavaScript/TypeScript

### Fetch API

```javascript
// Получить все портфели
async function getPortfolios() {
  const response = await fetch('http://localhost:5000/api/v1/portfolios');
  const data = await response.json();
  return data.data;
}

// Создать портфель
async function createPortfolio(portfolioData) {
  const response = await fetch('http://localhost:5000/api/v1/portfolios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(portfolioData),
  });
  const data = await response.json();
  return data.data;
}

// Исполнить сделку
async function executeTrade(tradeId) {
  const response = await fetch(
    `http://localhost:5000/api/v1/trades/${tradeId}/execute`,
    {
      method: 'POST',
    }
  );
  const data = await response.json();
  return data.data;
}

// Анализ рисков
async function analyzeRisk(portfolioId) {
  const response = await fetch(
    `http://localhost:5000/api/v1/risk/portfolio/${portfolioId}/analyze`
  );
  const data = await response.json();
  return data.data;
}
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Получить портфели
const portfolios = await api.get('/portfolios');

// Создать актив
const asset = await api.post('/assets', {
  symbol: 'NVDA',
  name: 'NVIDIA Corporation',
  assetType: 'STOCK',
  sector: 'Technology',
  currentPrice: 495.50,
  exchange: 'NASDAQ',
});

// Создать и исполнить сделку
const trade = await api.post('/trades', {
  portfolioId: 'portfolio-uuid',
  assetId: 'asset-uuid',
  tradeType: 'BUY',
  quantity: 100,
  price: 178.50,
});

await api.post(`/trades/${trade.data.data.id}/execute`);

// Сценарный анализ
const scenarios = await api.get('/risk/portfolio/portfolio-uuid/scenarios');
```

---

## Коды ошибок

- `200` - OK
- `201` - Created (успешно создано)
- `400` - Bad Request (неверный запрос)
- `404` - Not Found (не найдено)
- `500` - Internal Server Error (ошибка сервера)

**Формат ошибки:**
```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

---

## Примеры полных сценариев

### Создание портфеля и покупка акций

```bash
# 1. Создать портфель
PORTFOLIO=$(curl -s -X POST http://localhost:5000/api/v1/portfolios \
  -H "Content-Type: application/json" \
  -d '{"name":"Tech Portfolio","cashBalance":100000}' \
  | jq -r '.data.id')

echo "Portfolio ID: $PORTFOLIO"

# 2. Найти актив (AAPL)
ASSET=$(curl -s http://localhost:5000/api/v1/assets \
  | jq -r '.data[] | select(.symbol=="AAPL") | .id')

echo "Asset ID: $ASSET"

# 3. Создать сделку на покупку
TRADE=$(curl -s -X POST http://localhost:5000/api/v1/trades \
  -H "Content-Type: application/json" \
  -d "{\"portfolioId\":\"$PORTFOLIO\",\"assetId\":\"$ASSET\",\"tradeType\":\"BUY\",\"quantity\":100,\"price\":178.50,\"fees\":10}" \
  | jq -r '.data.id')

echo "Trade ID: $TRADE"

# 4. Исполнить сделку
curl -X POST "http://localhost:5000/api/v1/trades/$TRADE/execute"

# 5. Просмотреть портфель
curl "http://localhost:5000/api/v1/portfolios/$PORTFOLIO"

# 6. Анализ рисков
curl "http://localhost:5000/api/v1/risk/portfolio/$PORTFOLIO/analyze"
```

---

## Testing с Postman

Импортируйте эту коллекцию в Postman:

```json
{
  "info": {
    "name": "Aladdin Clone API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Portfolios",
      "item": [
        {
          "name": "Get All Portfolios",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/portfolios"
          }
        },
        {
          "name": "Create Portfolio",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/portfolios",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"New Portfolio\",\"cashBalance\":100000}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    }
  ]
}
```

---

**Готово! Используйте эти примеры для работы с API** 🚀
