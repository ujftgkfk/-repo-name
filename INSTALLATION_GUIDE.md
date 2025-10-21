# Подробная инструкция по установке и запуску Aladdin Clone

Это полное руководство для установки и запуска платформы Aladdin Clone. Следуйте инструкциям шаг за шагом.

## Содержание

1. [Установка необходимого ПО](#шаг-1-установка-необходимого-по)
2. [Клонирование проекта](#шаг-2-клонирование-проекта)
3. [Установка зависимостей](#шаг-3-установка-зависимостей)
4. [Настройка базы данных](#шаг-4-настройка-базы-данных)
5. [Настройка переменных окружения](#шаг-5-настройка-переменных-окружения)
6. [Заполнение базы данных тестовыми данными](#шаг-6-заполнение-базы-данных)
7. [Запуск приложения](#шаг-7-запуск-приложения)
8. [Использование приложения](#шаг-8-использование-приложения)
9. [Решение проблем](#решение-проблем)

---

## Шаг 1: Установка необходимого ПО

### 1.1 Установка Node.js

**Windows:**
1. Перейдите на https://nodejs.org/
2. Скачайте LTS версию (рекомендуется версия 18 или выше)
3. Запустите установщик (.msi файл)
4. Следуйте инструкциям установщика (оставьте настройки по умолчанию)
5. Проверьте установку:
   ```bash
   node --version
   npm --version
   ```
   Вы должны увидеть номера версий (например, v18.17.0 и 9.8.1)

**macOS:**
1. Установите Homebrew (если еще не установлен):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Установите Node.js:
   ```bash
   brew install node
   ```
3. Проверьте установку:
   ```bash
   node --version
   npm --version
   ```

**Linux (Ubuntu/Debian):**
```bash
# Обновите систему
sudo apt update
sudo apt upgrade -y

# Установите Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверьте установку
node --version
npm --version
```

### 1.2 Установка PostgreSQL

**Windows:**
1. Перейдите на https://www.postgresql.org/download/windows/
2. Скачайте установщик для Windows
3. Запустите установщик
4. Во время установки:
   - Запомните пароль для пользователя `postgres` (вам понадобится позже!)
   - Порт по умолчанию: `5432` (оставьте как есть)
   - Locale: выберите вашу локаль
5. После установки PostgreSQL должен запуститься автоматически

**macOS:**
```bash
# Установка через Homebrew
brew install postgresql@14

# Запуск PostgreSQL
brew services start postgresql@14

# Создание пользователя (если нужно)
createuser -s postgres
```

**Linux (Ubuntu/Debian):**
```bash
# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib

# Запуск PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Переключение на пользователя postgres
sudo -i -u postgres
psql

# В PostgreSQL консоли установите пароль
ALTER USER postgres PASSWORD 'your_password';
\q
exit
```

### 1.3 Установка Git (если еще не установлен)

**Windows:**
1. Скачайте с https://git-scm.com/download/win
2. Установите, следуя инструкциям

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

Проверьте установку:
```bash
git --version
```

---

## Шаг 2: Клонирование проекта

### 2.1 Откройте терминал (командную строку)

**Windows:**
- Нажмите `Win + R`, введите `cmd` и нажмите Enter
- Или найдите "Command Prompt" в меню Пуск

**macOS:**
- Нажмите `Cmd + Space`, введите `Terminal` и нажмите Enter

**Linux:**
- Нажмите `Ctrl + Alt + T`

### 2.2 Перейдите в папку, куда хотите сохранить проект

```bash
# Windows
cd C:\Users\ВашеИмя\Desktop

# macOS/Linux
cd ~/Desktop
```

### 2.3 Клонируйте репозиторий

```bash
git clone https://github.com/ujftgkfk/-repo-name.git
cd -repo-name

# Переключитесь на ветку с проектом
git checkout claude/create-allad-clone-011CULQGpvgFbL93UL9DRwf7
```

---

## Шаг 3: Установка зависимостей

Зависимости - это внешние библиотеки, которые нужны для работы проекта.

### 3.1 Установка корневых зависимостей

```bash
# Убедитесь, что вы в корневой папке проекта
npm install
```

Подождите, пока установятся все пакеты (может занять 1-2 минуты).

### 3.2 Установка зависимостей backend

```bash
cd backend
npm install
```

Подождите завершения установки (1-2 минуты).

### 3.3 Установка зависимостей frontend

```bash
cd ../frontend
npm install
```

Подождите завершения установки (1-2 минуты).

### 3.4 Вернитесь в корневую папку

```bash
cd ..
```

---

## Шаг 4: Настройка базы данных

### 4.1 Запустите PostgreSQL (если не запущен)

**Windows:**
- PostgreSQL должен запуститься автоматически после установки
- Проверьте в "Службы" (Services), что служба PostgreSQL запущена

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### 4.2 Создайте базу данных

**Способ 1: Через командную строку (все ОС)**

```bash
# Windows (в Command Prompt с правами администратора)
"C:\Program Files\PostgreSQL\14\bin\createdb.exe" -U postgres aladdin_db

# macOS/Linux
createdb aladdin_db
```

Если команда `createdb` не найдена, используйте способ 2.

**Способ 2: Через psql консоль**

```bash
# Подключитесь к PostgreSQL
# Windows
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres

# macOS/Linux
psql -U postgres

# В консоли PostgreSQL введите:
CREATE DATABASE aladdin_db;

# Проверьте, что БД создана
\l

# Выйдите из консоли
\q
```

---

## Шаг 5: Настройка переменных окружения

Переменные окружения содержат конфигурацию для подключения к базе данных.

### 5.1 Перейдите в папку backend

```bash
cd backend
```

### 5.2 Создайте файл .env

**Windows (Command Prompt):**
```bash
copy .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

### 5.3 Откройте файл .env в текстовом редакторе

**Windows:**
```bash
notepad .env
```

**macOS:**
```bash
open -e .env
```

**Linux:**
```bash
nano .env
# или
gedit .env
```

### 5.4 Отредактируйте файл .env

Замените значения на свои:

```env
# Порт для backend сервера
PORT=5000
NODE_ENV=development

# Настройки PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aladdin_db
DB_USER=postgres
DB_PASSWORD=ВАШ_ПАРОЛЬ_ОТ_POSTGRESQL

# JWT секрет (можете оставить как есть для разработки)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS (адрес frontend)
CORS_ORIGIN=http://localhost:3000

# Версия API
API_VERSION=v1
```

**ВАЖНО:** Замените `ВАШ_ПАРОЛЬ_ОТ_POSTGRESQL` на пароль, который вы указали при установке PostgreSQL!

### 5.5 Сохраните файл

- В Notepad: `Файл` → `Сохранить`
- В nano: `Ctrl + O`, затем `Enter`, затем `Ctrl + X`
- В других редакторах: `Ctrl + S` (Windows/Linux) или `Cmd + S` (macOS)

### 5.6 Вернитесь в корневую папку

```bash
cd ..
```

---

## Шаг 6: Заполнение базы данных

Теперь заполним базу данных тестовыми данными (активы, портфели, сделки).

```bash
cd backend
npm run db:seed
```

Вы должны увидеть сообщения:
```
Database synchronized.
Created 10 assets
Created portfolios
Created 8 positions
Created 3 trades
Database seeded successfully!
```

Если видите ошибку подключения к базе данных:
1. Проверьте, что PostgreSQL запущен
2. Проверьте правильность пароля в файле `.env`
3. Убедитесь, что база данных `aladdin_db` создана

После успешного выполнения вернитесь в корневую папку:
```bash
cd ..
```

---

## Шаг 7: Запуск приложения

### Вариант 1: Запуск обоих серверов одновременно (рекомендуется)

Из корневой папки проекта:

```bash
npm run dev
```

Вы увидите логи запуска обоих серверов:
```
[backend] Aladdin Backend Server running on port 5000
[frontend] VITE ready in XXX ms
[frontend] ➜ Local: http://localhost:3000
```

### Вариант 2: Запуск серверов отдельно

Откройте ДВА терминала (две командные строки).

**Терминал 1 - Backend:**
```bash
cd backend
npm run dev
```

Должно появиться:
```
Aladdin Backend Server running on port 5000
Database connection established successfully.
```

**Терминал 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Должно появиться:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000
```

---

## Шаг 8: Использование приложения

### 8.1 Откройте браузер

Откройте любой современный браузер (Chrome, Firefox, Edge, Safari).

### 8.2 Перейдите на адрес

Введите в адресной строке:
```
http://localhost:3000
```

### 8.3 Вы увидите главную страницу Aladdin Clone!

Приложение откроется на странице Dashboard.

### 8.4 Что можно делать в приложении

#### Dashboard (Главная страница)
- Просмотр общей статистики:
  - Общая сумма активов под управлением (Total AUM)
  - Количество портфелей
  - Активные позиции
  - Оценка рисков
- Таблица портфелей с их стоимостью
- Последние сделки

#### Portfolios (Портфели)
- Просмотр всех портфелей
- Создание нового портфеля:
  1. Нажмите "Create Portfolio"
  2. Введите название (например, "Мой портфель")
  3. Описание (опционально)
  4. Начальный баланс (например, 100000)
  5. Нажмите "Create"
- Просмотр деталей портфеля:
  - Нажмите "View Details" на любом портфеле
  - Увидите все позиции, стоимость, прибыль/убыток
  - Распределение активов

#### Trading (Торговля)
- Создание сделки:
  1. Нажмите "New Trade"
  2. Выберите портфель
  3. Выберите актив (например, AAPL - Apple)
  4. Выберите тип (Buy или Sell)
  5. Введите количество (например, 10 акций)
  6. Цена заполнится автоматически
  7. Нажмите "Create Trade"
- Исполнение сделки:
  1. Найдите созданную сделку в таблице (статус PENDING)
  2. Нажмите "Execute"
  3. Сделка будет выполнена, позиция обновится

#### Risk Analysis (Анализ рисков)
- Выберите портфель из списка
- Нажмите "Analyze Risk"
- Просмотрите:
  - **VaR (95%)**: Максимальный ожидаемый убыток с вероятностью 95%
  - **Sharpe Ratio**: Коэффициент доходности с учетом риска
  - **Volatility**: Волатильность портфеля
  - **Risk Level**: Уровень риска (Low/Medium/High)
  - **Scenario Analysis**: Как портфель поведет себя при различных сценариях (крах рынка, рост ставок и т.д.)

#### Assets (Активы)
- Просмотр всех активов
- Добавление нового актива:
  1. Нажмите "Add Asset"
  2. Введите тикер (например, TSLA)
  3. Название (Tesla Inc.)
  4. Тип (Stock)
  5. Сектор (Automotive)
  6. Текущую цену
  7. Биржу (NASDAQ)
  8. Нажмите "Add"

#### Analytics (Аналитика)
- Выберите портфель
- Просмотрите:
  - Общую стоимость портфеля
  - Инвестированную сумму
  - Общую доходность в $ и %
  - Распределение по типам активов (круговая диаграмма)
  - Распределение по секторам
  - Топ-10 активов в портфеле

---

## Решение проблем

### Проблема: "Cannot find module" или ошибки при npm install

**Решение:**
```bash
# Удалите все node_modules и переустановите
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Или в Windows:
del /s /q node_modules package-lock.json
del /s /q backend\node_modules backend\package-lock.json
del /s /q frontend\node_modules frontend\package-lock.json

# Переустановите
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Проблема: "ECONNREFUSED" или "unable to connect to database"

**Решение:**
1. Проверьте, что PostgreSQL запущен:
   ```bash
   # Windows (в Services)
   services.msc
   # Найдите postgresql и убедитесь, что статус "Running"

   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. Проверьте настройки в `backend/.env`:
   - Правильный пароль
   - Правильный порт (обычно 5432)
   - Правильное имя базы данных

3. Попробуйте подключиться к PostgreSQL вручную:
   ```bash
   psql -U postgres -d aladdin_db
   ```

### Проблема: "Port 5000 already in use"

**Решение:**

**Windows:**
```bash
# Найдите процесс на порту 5000
netstat -ano | findstr :5000

# Завершите процесс (замените PID на номер из предыдущей команды)
taskkill /PID <PID> /F

# Или измените порт в backend/.env
PORT=5001
```

**macOS/Linux:**
```bash
# Найдите и завершите процесс
lsof -ti:5000 | xargs kill -9

# Или измените порт в backend/.env
PORT=5001
```

### Проблема: "Port 3000 already in use"

**Решение:**
- Закройте другое приложение, использующее порт 3000
- Или frontend автоматически предложит использовать другой порт (например, 3001)

### Проблема: Белый экран в браузере

**Решение:**
1. Откройте консоль разработчика:
   - Chrome/Edge: `F12` или `Ctrl + Shift + I`
   - Firefox: `F12`
   - Safari: `Cmd + Option + I`

2. Проверьте ошибки в консоли

3. Убедитесь, что backend запущен и доступен:
   - Откройте http://localhost:5000/health
   - Должно быть: `{"status":"OK","timestamp":"..."}`

4. Очистите кэш браузера:
   - `Ctrl + Shift + Delete` (Windows/Linux)
   - `Cmd + Shift + Delete` (macOS)
   - Выберите "Cached images and files"

### Проблема: Ошибки TypeScript при сборке

**Решение:**
```bash
# Пересоберите проекты
cd backend
npm run build

cd ../frontend
npm run build
```

### Проблема: База данных не создается

**Решение:**

1. Создайте БД вручную через psql:
   ```bash
   psql -U postgres
   CREATE DATABASE aladdin_db;
   \q
   ```

2. Или через pgAdmin (если установлен):
   - Откройте pgAdmin
   - Правый клик на "Databases"
   - "Create" → "Database"
   - Имя: aladdin_db
   - Нажмите "Save"

---

## Дополнительные команды

### Остановка приложения

Нажмите `Ctrl + C` в терминале, где запущено приложение.

### Перезапуск приложения

```bash
# Остановите (Ctrl + C)
# Затем запустите снова
npm run dev
```

### Очистка и пересоздание базы данных

```bash
cd backend

# Удалите базу данных
dropdb aladdin_db
# или через psql: DROP DATABASE aladdin_db;

# Создайте заново
createdb aladdin_db

# Заполните данными
npm run db:seed
```

### Просмотр логов

Логи видны в терминале, где запущено приложение.
Для более подробных логов backend откройте `backend/src/index.ts` и установите:
```typescript
logging: true  // в настройках Sequelize
```

---

## Технические требования

### Минимальные требования:
- **ОС**: Windows 10, macOS 10.15+, Ubuntu 20.04+
- **RAM**: 4 GB
- **Процессор**: 2 ядра
- **Свободное место**: 2 GB

### Рекомендуемые требования:
- **RAM**: 8 GB+
- **Процессор**: 4 ядра+
- **Свободное место**: 5 GB+

---

## Полезные ссылки

- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/
- **React документация**: https://react.dev/
- **Express документация**: https://expressjs.com/
- **Material-UI**: https://mui.com/
- **TypeScript**: https://www.typescriptlang.org/

---

## Контакты для поддержки

Если у вас возникли проблемы:
1. Проверьте раздел "Решение проблем" выше
2. Откройте issue на GitHub
3. Свяжитесь с разработчиком

---

**Поздравляем! Вы успешно установили и запустили Aladdin Clone!**

Теперь вы можете:
- Создавать портфели
- Добавлять активы
- Совершать сделки
- Анализировать риски
- Просматривать аналитику

Удачи в использовании платформы! 🚀
