@echo off
setlocal enabledelayedexpansion
title SIDADU - Automatic Setup Wizard
color 0B
rem Switching context to project root
cd /d "%~dp0\.."

echo.
echo  ===========================================================
echo           SIDADU APP - AUTOMATIC SETUP WIZARD
echo  ===========================================================
echo.
echo  Skrip ini akan mengonfigurasi aplikasi Anda secara otomatis.
echo  Pastikan XAMPP (MySQL) sudah dalam keadaan START.
echo.
pause

:: 1. Setup .env
echo [1/4] Menyiapkan Konfigurasi (.env)...
if not exist ".env" (
    copy .env.example .env
    echo [OK] File .env berhasil dibuat.
) else (
    echo [SKIP] File .env sudah ada.
)

:: 2. Generate APP_KEY
echo [2/4] Membuat Kunci Pengaman Aplikasi...
php artisan key:generate --force
echo [OK] App Key berhasil dibuat.

:: 3. Jalankan Migrasi Database
echo [3/4] Menyiapkan Database...
echo.
echo Mencoba mendeteksi lokasi XAMPP...

:: Deteksi MySQL di folder ../../mysql (Standard Portable)
set "MYSQL_PATH=..\..\mysql\bin\mysqld.exe"
if exist "!MYSQL_PATH!" (
    echo [OK] XAMPP Portable terdeteksi di folder induk.
) else (
    set "MYSQL_PATH=C:\xampp\mysql\bin\mysqld.exe"
    if exist "!MYSQL_PATH!" (
        echo [OK] XAMPP Standard terdeteksi di C:\xampp.
    ) else (
        echo [!] PERINGATAN: MySQL (mysqld.exe) tidak ditemukan secara otomatis.
        echo Harap pastikan MySQL sudah berjalan secara manual di XAMPP.
    )
)

echo.
echo Pilihan Database:
echo 1. SQLite (Praktis, Tanpa Setup MySQL) - REKOMENDASI UNTUK PEMULA
echo 2. MySQL (Butuh XAMPP Running)
echo.
set /p db_choice="Pilih Jenis Database (1/2): "

if "%db_choice%"=="1" (
    echo DB_CONNECTION=sqlite > .env.temp
    echo DB_DATABASE=database/database.sqlite >> .env.temp
    :: Filter out old DB lines
    for /f "tokens=1* delims==" %%a in (.env) do (
        set "key=%%a"
        if "!key!" neq "DB_CONNECTION" if "!key!" neq "DB_DATABASE" if "!key!" neq "DB_HOST" if "!key!" neq "DB_PORT" if "!key!" neq "DB_USERNAME" if "!key!" neq "DB_PASSWORD" (
            echo %%a=%%b >> .env.temp
        )
    )
    move /y .env.temp .env
    
    if not exist "database\database.sqlite" (
        type nul > database\database.sqlite
    )
    echo [OK] Konfigurasi beralih ke SQLite.
) else (
    echo [INFO] Jika menggunakan MySQL Portable, pastikan port 3306 sudah terbuka.
    set /p db_name="Masukkan Nama Database di MySQL (Default: sidaduz): "
    if "!db_name!"=="" set "db_name=sidaduz"
    echo Segera ganti DB_DATABASE=!db_name! di file .env jika gagal.
)

echo.
echo Menjalankan Migrasi & Data Default...
php artisan migrate --seed --force
echo [OK] Database siap digunakan.

:: 4. Registrasi & Finalisasi
echo [4/4] Finalisasi Sistem & Registrasi...
php artisan storage:link
php artisan app:register-installation
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

echo.
echo  ===========================================================
echo               INSTALASI SELESAI!
echo  ===========================================================
echo.
echo  Aplikasi sekarang bisa dijalankan menggunakan:
echo  - SidaduzControlPanel.exe (Klik Start Server)
echo.
echo  Email Admin Default: admin@sekolah.id
echo  Password: password
echo.
pause
