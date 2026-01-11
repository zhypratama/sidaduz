@echo off
cd /d "c:\xampp\htdocs\sisko-app"
echo ===================================================
echo     UPDATE APLIKASI SISKO (SIDADU)
echo ===================================================
echo.
echo [INFO] Mengambil perubahan terbaru dari Git...
call git pull origin main
echo.

echo [INFO] Memperbarui dependensi PHP (Composer)...
call composer install --no-interaction --prefer-dist --optimize-autoloader
echo.

echo [INFO] Menjalankan migrasi database...
call php artisan migrate --force
echo.

echo [INFO] Membersihkan cache aplikasi...
call php artisan optimize:clear
echo.

echo [SUKSES] Aplikasi telah diperbarui!
echo Tekan sembarang tombol untuk kembali...
pause >nul
