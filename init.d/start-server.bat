@echo off
rem Switching context to project root
cd /d "%~dp0\.."
echo ========================================
echo   XAMPP MySQL Starter
echo ========================================
echo.

echo Checking if MySQL is already running...
netstat -an | findstr "3306" > nul
if %errorlevel% == 0 (
    echo [OK] MySQL is already running on port 3306
    goto :start_laravel
)

echo [INFO] MySQL is not running. Starting MySQL...
echo.

REM Try to start MySQL via XAMPP
if exist "C:\xampp\mysql_start.bat" (
    echo Starting MySQL via XAMPP batch file...
    call "C:\xampp\mysql_start.bat"
    timeout /t 3 /nobreak > nul
    goto :check_mysql
)

if exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo Starting MySQL directly...
    start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 5 /nobreak > nul
    goto :check_mysql
)

echo [ERROR] MySQL executable not found!
echo Please start MySQL manually from XAMPP Control Panel.
echo.
pause
exit /b 1

:check_mysql
echo Verifying MySQL is running...
timeout /t 2 /nobreak > nul
netstat -an | findstr "3306" > nul
if %errorlevel% == 0 (
    echo [OK] MySQL is now running on port 3306
    echo.
) else (
    echo [WARNING] MySQL may not be running properly.
    echo Please check XAMPP Control Panel.
    echo.
)

:start_laravel
echo ========================================
echo   Starting Laravel Development Server
echo ========================================
echo.
echo Server will run on: http://127.0.0.1:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
php artisan serve --host=127.0.0.1 --port=8000

pause
