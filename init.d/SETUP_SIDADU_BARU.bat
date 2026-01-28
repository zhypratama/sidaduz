@echo off
title SIDADU - Setup Wizard Redirector
echo.
echo  ===========================================================
echo           SIDADU APP - SETUP WIZARD (REDIRECTOR)
echo  ===========================================================
echo.
echo  Mengarahkan ke folder aplikasi...
echo.

if not exist "%~dp0\AUTO_SETUP.bat" (
    echo [ERROR] File 'AUTO_SETUP.bat' tidak ditemukan di folder yang sama!
    pause
    exit /b
)

call "%~dp0\AUTO_SETUP.bat"
