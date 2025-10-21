@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    Aladdin Clone - Avtomaticheskaya ustanovka
echo ========================================
echo.

REM Proverka Node.js
echo Proverka Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [OSHIBKA] Node.js ne ustanovlen!
    echo Ustanovite Node.js s https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js ustanovlen: %NODE_VERSION%

REM Proverka npm
echo Proverka npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [OSHIBKA] npm ne ustanovlen!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm ustanovlen: %NPM_VERSION%

REM Proverka PostgreSQL
echo Proverka PostgreSQL...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [OSHIBKA] PostgreSQL ne ustanovlen!
    echo Ustanovite PostgreSQL s https://www.postgresql.org/
    pause
    exit /b 1
)
echo [OK] PostgreSQL ustanovlen
echo.

REM Ustanovka zavisimostej
echo ========================================
echo    Ustanovka zavisimostej
echo ========================================

echo Ustanovka kornevyh zavisimostej...
call npm install
if %errorlevel% neq 0 (
    echo [OSHIBKA] Oshibka pri ustanovke kornevyh zavisimostej
    pause
    exit /b 1
)
echo [OK] Kornevye zavisimosti ustanovleny

echo Ustanovka backend zavisimostej...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [OSHIBKA] Oshibka pri ustanovke backend zavisimostej
    pause
    exit /b 1
)
echo [OK] Backend zavisimosti ustanovleny
cd ..

echo Ustanovka frontend zavisimostej...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [OSHIBKA] Oshibka pri ustanovke frontend zavisimostej
    pause
    exit /b 1
)
echo [OK] Frontend zavisimosti ustanovleny
cd ..
echo.

REM Sozdanie bazy dannyh
echo ========================================
echo    Nastrojka bazy dannyh
echo ========================================

echo Sozdanie bazy dannyh aladdin_db...

REM Proverka sushhestvovaniya BD
psql -U postgres -lqt | findstr /C:"aladdin_db" >nul 2>nul
if %errorlevel% equ 0 (
    echo Baza dannyh aladdin_db uzhe sushhestvuet.
    set /p "RECREATE=Udalit' i peresozdatj? (y/n): "
    if /i "!RECREATE!"=="y" (
        dropdb -U postgres aladdin_db
        createdb -U postgres aladdin_db
        echo [OK] Baza dannyh peresozdana
    )
) else (
    createdb -U postgres aladdin_db
    if %errorlevel% neq 0 (
        echo [OSHIBKA] Oshibka pri sozdanii bazy dannyh
        echo Poprobujte sozdatj vruchнuyu: createdb -U postgres aladdin_db
        pause
        exit /b 1
    )
    echo [OK] Baza dannyh sozdana
)
echo.

REM Nastrojka .env
echo ========================================
echo    Nastrojka peremennyh okruzheniya
echo ========================================

if not exist "backend\.env" (
    echo Sozdanie fajla backend\.env...
    copy backend\.env.example backend\.env >nul

    echo.
    echo VNIMANIE: Otredaktirujte fajl backend\.env
    echo Ustanovite pravilj'nyj parolj dlya PostgreSQL (DB_PASSWORD)
    echo.
    echo Otkrytj fajl sejchas? (y/n):
    set /p "OPEN_ENV="
    if /i "!OPEN_ENV!"=="y" (
        notepad backend\.env
    )

    echo [OK] Fajl .env sozdan
) else (
    echo Fajl backend\.env uzhe sushhestvuet
)
echo.

REM Zapolnenie bazy dannyh
echo ========================================
echo    Zapolnenie bazy dannyh
echo ========================================

echo Zapusk seed skripta...
cd backend
call npm run db:seed
if %errorlevel% neq 0 (
    echo [OSHIBKA] Oshibka pri zapolnenii bazy dannyh
    echo Proverj'te nastrojki podklyucheniya v backend\.env
    pause
    exit /b 1
)
echo [OK] Baza dannyh zapolnena testovymi dannymi
cd ..
echo.

REM Zavershenie
echo ========================================
echo    Ustanovka zavershena uspeshno!
echo ========================================
echo.
echo Dlya zapuska prilozheniya vypolnite:
echo   npm run dev
echo.
echo Prilozhenie budet dostupno po adresam:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Testovye dannye:
echo   * 2 portfelya (Growth Portfolio, Balanced Portfolio)
echo   * 10 aktivov (AAPL, MSFT, BTC, ETH i drugie)
echo   * 8 pozicij
echo   * 3 sdelki
echo.
echo Udachi!
echo.
pause
