#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Aladdin Clone - Автоматическая установка${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка Node.js
echo -e "${YELLOW}Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен!${NC}"
    echo "Установите Node.js с https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js установлен: ${NODE_VERSION}${NC}"

# Проверка npm
echo -e "${YELLOW}Проверка npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm не установлен!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm установлен: ${NPM_VERSION}${NC}"

# Проверка PostgreSQL
echo -e "${YELLOW}Проверка PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL не установлен!${NC}"
    echo "Установите PostgreSQL с https://www.postgresql.org/"
    exit 1
fi
PSQL_VERSION=$(psql --version)
echo -e "${GREEN}✓ PostgreSQL установлен: ${PSQL_VERSION}${NC}"
echo ""

# Установка зависимостей
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Установка зависимостей${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "${YELLOW}Установка корневых зависимостей...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при установке корневых зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Корневые зависимости установлены${NC}"

echo -e "${YELLOW}Установка backend зависимостей...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при установке backend зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend зависимости установлены${NC}"
cd ..

echo -e "${YELLOW}Установка frontend зависимостей...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при установке frontend зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend зависимости установлены${NC}"
cd ..
echo ""

# Создание базы данных
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Настройка базы данных${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "${YELLOW}Создание базы данных aladdin_db...${NC}"

# Проверка существования БД
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw aladdin_db; then
    echo -e "${YELLOW}База данных aladdin_db уже существует.${NC}"
    read -p "Удалить и пересоздать? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        dropdb -U postgres aladdin_db
        createdb -U postgres aladdin_db
        echo -e "${GREEN}✓ База данных пересоздана${NC}"
    fi
else
    createdb -U postgres aladdin_db
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка при создании базы данных${NC}"
        echo "Попробуйте создать вручную: createdb -U postgres aladdin_db"
        exit 1
    fi
    echo -e "${GREEN}✓ База данных создана${NC}"
fi
echo ""

# Настройка .env
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Настройка переменных окружения${NC}"
echo -e "${BLUE}========================================${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Создание файла backend/.env...${NC}"
    cp backend/.env.example backend/.env

    # Запрос пароля от PostgreSQL
    read -sp "Введите пароль от PostgreSQL (пользователь postgres): " DB_PASSWORD
    echo

    # Замена пароля в .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/DB_PASSWORD=your_password/DB_PASSWORD=$DB_PASSWORD/" backend/.env
    else
        # Linux
        sed -i "s/DB_PASSWORD=your_password/DB_PASSWORD=$DB_PASSWORD/" backend/.env
    fi

    echo -e "${GREEN}✓ Файл .env создан и настроен${NC}"
else
    echo -e "${YELLOW}Файл backend/.env уже существует${NC}"
fi
echo ""

# Заполнение базы данных
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Заполнение базы данных${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "${YELLOW}Запуск seed скрипта...${NC}"
cd backend
npm run db:seed
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при заполнении базы данных${NC}"
    echo "Проверьте настройки подключения в backend/.env"
    exit 1
fi
echo -e "${GREEN}✓ База данных заполнена тестовыми данными${NC}"
cd ..
echo ""

# Завершение
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ Установка завершена успешно!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Для запуска приложения выполните:${NC}"
echo -e "  ${YELLOW}npm run dev${NC}"
echo ""
echo -e "${BLUE}Приложение будет доступно по адресам:${NC}"
echo -e "  Frontend: ${YELLOW}http://localhost:3000${NC}"
echo -e "  Backend:  ${YELLOW}http://localhost:5000${NC}"
echo ""
echo -e "${BLUE}Тестовые данные:${NC}"
echo -e "  • 2 портфеля (Growth Portfolio, Balanced Portfolio)"
echo -e "  • 10 активов (AAPL, MSFT, BTC, ETH и другие)"
echo -e "  • 8 позиций"
echo -e "  • 3 сделки"
echo ""
echo -e "${GREEN}Удачи! 🚀${NC}"
