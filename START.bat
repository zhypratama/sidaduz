@echo off
title SIDADU - Server Starter
color 0A

echo.
echo ========================================
echo    SIDADU Server Starter
echo ========================================
echo.

echo.
rem Switching context to project root
cd /d "%~dp0\.."

REM Check if XAMPP Control Panel exists
if exist "C:\xampp\xampp-control.exe" (
    echo [1/3] Opening XAMPP Control Panel...
    start "" "C:\xampp\xampp-control.exe"
    timeout /t 2 /nobreak > nul
    echo [OK] XAMPP Control Panel opened
    echo.
) else (
    echo [ERROR] XAMPP Control Panel not found!
    echo Please install XAMPP or check the path.
    echo.
    pause
    exit /b 1
)

echo ========================================
echo    IMPORTANT INSTRUCTIONS:
echo ========================================
echo.
echo 1. In XAMPP Control Panel:
echo    - Click START button next to MySQL
echo    - Wait until it turns GREEN
echo.
echo 2. Then press any key here to continue...
echo.
pause

echo.
echo [2/3] Checking MySQL status...
netstat -an | findstr "3306" > nul
if %errorlevel% == 0 (
    echo [OK] MySQL is running on port 3306
    echo.
) else (
    echo [WARNING] MySQL may not be running!
    echo Please make sure MySQL is started in XAMPP.
    echo.
    echo Press any key to continue anyway...
    pause
    echo.
)

echo [3/3] Starting Laravel Development Server...
echo.
echo Server URL: http://127.0.0.1:8000
echo Dashboard: http://127.0.0.1:8000/dashboard
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
php artisan serve --host=127.0.0.1 --port=8000

echo.
echo Server stopped.
pause
