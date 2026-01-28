@echo off
rem Switching context to project root
cd /d "%~dp0\.."
REM ============================================
REM SIDADU WhatsApp Gateway Launcher
REM ============================================

echo.
echo ========================================
echo  SIDADU WhatsApp Gateway
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak terdeteksi!
    echo.
    echo Silakan install Node.js terlebih dahulu:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js terdeteksi: 
node --version
echo.

REM Navigate to wa-gateway directory
cd /d "%~dp0wa-gateway"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [WARNING] Dependencies belum terinstall!
    echo [INFO] Menginstall dependencies...
    echo.
    call npm install
    echo.
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Gagal install dependencies!
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies berhasil terinstall!
    echo.
)

REM Check if server.js exists
if not exist "server.js" (
    echo [ERROR] File server.js tidak ditemukan!
    pause
    exit /b 1
)

echo ========================================
echo  Starting WhatsApp Gateway Server...
echo ========================================
echo.
echo [INFO] Server akan berjalan di: http://localhost:3000
echo [INFO] Tekan Ctrl+C untuk stop server
echo.
echo [TIPS] Setelah server running:
echo   1. Buka browser: http://127.0.0.1:8000
echo   2. Login sebagai Admin
echo   3. Menu: Sistem ^& Pengaturan ^> WhatsApp Gateway
echo   4. Scan QR Code yang muncul
echo.
echo ========================================
echo.

REM Start the server
node server.js

REM If server stops
echo.
echo [INFO] Server stopped.
pause
