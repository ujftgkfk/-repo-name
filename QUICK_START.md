# Быстрый старт Aladdin Clone

Краткая инструкция для опытных пользователей.

## Предварительные требования

- Node.js 18+
- PostgreSQL 14+
- Git

## Установка за 5 минут

```bash
# 1. Клонирование
git clone https://github.com/ujftgkfk/-repo-name.git
cd -repo-name
git checkout claude/create-allad-clone-011CULQGpvgFbL93UL9DRwf7

# 2. Установка зависимостей
npm install
cd backend && npm install
cd ../frontend && npm install && cd ..

# 3. Создание БД
createdb aladdin_db

# 4. Настройка .env
cd backend
cp .env.example .env
# Отредактируйте .env (установите DB_PASSWORD)
nano .env  # или используйте свой редактор

# 5. Заполнение БД
npm run db:seed

# 6. Запуск
cd ..
npm run dev
```

## Открытие приложения

Откройте браузер: http://localhost:3000

## API

Backend API: http://localhost:5000
Health check: http://localhost:5000/health

## Тестовые данные

После выполнения `npm run db:seed` будут созданы:

**Портфели:**
- Growth Portfolio (технологичный портфель)
- Balanced Portfolio (сбалансированный портфель)

**Активы (10 шт):**
- Акции: AAPL, MSFT, GOOGL, AMZN, TSLA
- ETF: SPY
- Криптовалюты: BTC, ETH
- Облигации: AGG
- Товары: GLD

**Позиции:**
- 8 активных позиций в двух портфелях

**Сделки:**
- 3 исполненные сделки

## Структура проекта

```
aladdin-clone/
├── backend/          # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/  # Risk Engine
│   │   └── database/
│   └── .env          # Конфигурация (создать!)
├── frontend/         # React + TypeScript + MUI
│   └── src/
└── package.json
```

## Основные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка
npm run build

# Запуск production
npm run start

# Пересоздание БД
cd backend
dropdb aladdin_db && createdb aladdin_db
npm run db:seed
```

## API Endpoints

### Портфели
- `GET /api/v1/portfolios` - Все портфели
- `POST /api/v1/portfolios` - Создать портфель
- `GET /api/v1/portfolios/:id` - Детали портфеля

### Активы
- `GET /api/v1/assets` - Все активы
- `POST /api/v1/assets` - Добавить актив

### Торговля
- `POST /api/v1/trades` - Создать сделку
- `POST /api/v1/trades/:id/execute` - Исполнить сделку

### Риски
- `GET /api/v1/risk/portfolio/:id/analyze` - Анализ рисков
- `GET /api/v1/risk/portfolio/:id/scenarios` - Сценарии

### Аналитика
- `GET /api/v1/analytics/dashboard` - Dashboard данные
- `GET /api/v1/analytics/portfolio/:id/performance` - Производительность

## Переменные окружения (.env)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=aladdin_db
DB_USER=postgres
DB_PASSWORD=your_password  # ← ИЗМЕНИТЕ ЭТО!

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
API_VERSION=v1
```

## Решение проблем

### База данных не подключается
```bash
# Проверьте статус PostgreSQL
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows (Services)
services.msc
```

### Порт занят
```bash
# Измените порт в backend/.env
PORT=5001

# Или завершите процесс
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Чистая переустановка
```bash
# Удалите node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Переустановите
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Возможности платформы

### 📊 Dashboard
- Общие метрики (AUM, портфели, позиции)
- Таблица портфелей
- Последние сделки

### 💼 Portfolios
- Создание портфелей
- Просмотр позиций
- P&L трекинг
- Распределение активов

### 💹 Trading
- Создание ордеров (Buy/Sell)
- Исполнение сделок
- История сделок

### ⚠️ Risk Analysis
- Value at Risk (VaR 95%, 99%)
- Sharpe Ratio
- Volatility и Beta
- Maximum Drawdown
- Scenario Analysis (5 сценариев)

### 📈 Analytics
- Performance метрики
- Asset allocation (pie charts)
- Sector allocation
- Top holdings

### 🪙 Assets
- Управление активами
- 10+ типов активов
- Обновление цен

## Технологии

**Backend:**
- Node.js + Express.js
- TypeScript
- PostgreSQL + Sequelize
- Risk Engine (собственная разработка)

**Frontend:**
- React 18
- TypeScript
- Material-UI
- Recharts
- React Query
- Vite

## Лицензия

MIT License

---

**Готово! Начните с открытия http://localhost:3000** 🚀
