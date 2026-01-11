@echo off
:: Script untuk mematikan MariaDB (MySQL)
echo [INFO] Sedang mematikan Database MariaDB...

:: Menggunakan mysqladmin untuk shutdown
:: Asumsi user root tanpa password (default XAMPP). Jika ada password, tambahkan -p
if exist "C:\xampp\mysql\bin\mysqladmin.exe" (
    "C:\xampp\mysql\bin\mysqladmin.exe" -u root shutdown
    echo [SUKSES] Database berhasil dimatikan.
) else (
    echo [ERROR] Utility mysqladmin tidak ditemukan.
)
:: pause
exit
