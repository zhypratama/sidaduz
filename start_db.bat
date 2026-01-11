@echo off
:: Script untuk menyalakan MariaDB (MySQL) Tanpa Panel XAMPP
echo [INFO] Sedang menyalakan Database MariaDB...

:: Menjalankan mysqld.exe secara background/minimized
:: Pastikan path sesuai dengan instalasi XAMPP Anda. Default: C:\xampp\mysql\bin\mysqld.exe
if exist "C:\xampp\mysql\bin\mysqld.exe" (
    start "MariaDB Background" /MIN "C:\xampp\mysql\bin\mysqld.exe"
    echo [SUKSES] Database berhasil dijalankan!
) else (
    echo [ERROR] File mysqld.exe tidak ditemukan di C:\xampp\mysql\bin\. 
    echo Mohon edit file ini dan sesuaikan path XAMPP Anda.
    pause
)
