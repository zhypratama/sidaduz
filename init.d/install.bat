@echo off
rem Switching context to project root
cd /d "%~dp0\.."
setlocal
title Sisko App Installer

echo ===================================================
echo        SISKO APPS INSTALLER (Windows)
echo ===================================================
echo.

:: 1. Check Requirements
echo [1/7] Checking Requirements...
where php >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PHP not found. Please install PHP/XAMPP and add it to PATH.
    pause
    exit /b 1
)
where composer >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Composer not found. Please install Composer.
    pause
    exit /b 1
)
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js.
    pause
    exit /b 1
)
echo OK.
echo.

:: 2. Setup Environment
echo [2/7] Setting up Environment Configuration...
if not exist ".env" (
    echo Copying .env.example to .env...
    copy .env.example .env
) else (
    echo .env file already exists. Skipping copy.
)
echo.

:: 3. Dependencies
echo [3/7] Installing Dependencies (This may take a while)...
echo -- Installing PHP dependencies...
call composer install --optimize-autoloader --no-dev
if %errorlevel% neq 0 (
    echo ERROR: Composer install failed.
    pause
    exit /b 1
)
echo -- Installing Node.js dependencies...
call npm install
echo.

:: 4. Build Assets
echo [4/7] Building Frontend Assets...
call npm run build
echo.

:: 5. Key Generation
echo [5/7] Generating Application Key...
call php artisan key:generate
echo.

:: 6. Database Setup
echo [6/7] Setting up Database...
echo Please ensure your database (defined in .env) exists!
set /p run_migrate="Do you want to run fresh migrations & seeds? (WARNING: DELETES ALL DATA) [y/N]: "
if /i "%run_migrate%"=="y" (
    call php artisan migrate:fresh --seed
) else (
    echo Skipping database reset. Running normal migrate...
    call php artisan migrate
)
echo.

:: 7. Final Polish
echo [7/7] Finalizing...
call php artisan storage:link
call php artisan route:cache
call php artisan view:cache
call php artisan config:cache

echo.
echo ===================================================
echo      INSTALLATION COMPLETED SUCCESSFULLY!
echo ===================================================
echo.
echo You can now access the application.
echo Don't forget to configure your .env file properly.
echo.
pause
