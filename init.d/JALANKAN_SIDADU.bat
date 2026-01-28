@echo off
title SIDADU - Quick Start Redirector
echo.
echo  ===========================================================
echo           SIDADU APP - QUICK START (REDIRECTOR)
echo  ===========================================================
echo.
echo  Mengarahkan ke folder aplikasi...
echo.

if not exist "%~dp0\START.bat" (
    echo [ERROR] File 'START.bat' tidak ditemukan di folder yang sama!
    pause
    exit /b
)

call "%~dp0\START.bat"
