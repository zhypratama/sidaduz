@echo off
title SIDADU - Setup Wizard Redirector
echo.
echo  ===========================================================
echo           SIDADU APP - SETUP WIZARD (REDIRECTOR)
echo  ===========================================================
echo.
echo  Mengarahkan ke folder aplikasi...
echo.

if not exist "AUTO_SETUP.bat" (
    echo [ERROR] File 'AUTO_SETUP.bat' tidak ditemukan!
    echo Pastikan file ini berada di dalam folder aplikasi.
    pause
    exit /b
)

call AUTO_SETUP.bat
