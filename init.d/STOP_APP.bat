@echo off
echo ===================================================
echo     MEMATIKAN APLIKASI
echo ===================================================

echo [INFO] Menutup PHP Artisan Serve...
taskkill /F /IM php.exe /T 2>nul
if %errorlevel% equ 0 (
    echo [OK] PHP Service Stopped.
) else (
    echo [INFO] PHP tidak sedang berjalan atau gagal dihentikan.
)

echo [INFO] Menutup Node.js (Vite)...
taskkill /F /IM node.exe /T 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js Stopped.
) else (
    echo [INFO] Node.js tidak sedang berjalan atau gagal dihentikan.
)

echo.
echo [SUKSES] Semua service aplikasi telah dimatikan.
:: pause
exit
