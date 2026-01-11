@echo off
:: Script untuk menyalakan MariaDB (MySQL)
:: Pastikan path mysql_install_service atau mysqld.exe benar sesuai instalasi XAMPP

echo [INFO] Sedang mencoba menyalakan MariaDB...

if exist "C:\xampp\mysql\bin\mysqld.exe" (
    start "MariaDB" /min "C:\xampp\mysql\bin\mysqld.exe"
    echo [SUKSES] MariaDB telah dijalankan.
) else (
    echo [ERROR] File mysqld.exe tidak ditemukan di C:\xampp\mysql\bin\
)

:: Tidak perlu pause agar window cmd bisa menutup otomatis jika dijalankan manual
exit
