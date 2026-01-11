@echo off
:: Note: This script is now in init.d/
:: We need to move UP one level to root to run artisan/npm
cd /d "%~dp0.."

echo ===================================================
echo     MEMULAI APLIKASI SISKO APP (SIDADU)
echo ===================================================
echo.
echo [INFO] Memeriksa dependensi...

if not exist "vendor" (
    echo [INFO] Folder vendor tidak ditemukan. Menjalankan composer install...
    call composer install
)

if not exist "node_modules" (
    echo [INFO] Folder node_modules tidak ditemukan. Menjalankan npm install...
    call npm install
)

echo.
echo [INFO] Menyalakan Server...
:: Use init.d\run_hidden.vbs relative to root? No, run_hidden.vbs is in init.d same as this script.
:: But we are currently in ROOT due to cd ..
:: So we call "init.d\run_hidden.vbs"

wscript init.d\run_hidden.vbs "cmd /c php artisan serve"
wscript init.d\run_hidden.vbs "cmd /c npm run dev"

echo.
echo [SUCCESS] Aplikasi sedang berjalan! 
echo Akses di browser: http://127.0.0.1:8000
echo.
echo Tekan sembarang tombol untuk menutup launcher ini (Server tetap jalan di background/window minim).
exit
