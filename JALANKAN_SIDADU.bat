@echo off
title SIDADU - Quick Start Redirector
echo.
echo  ===========================================================
echo           SIDADU APP - QUICK START (REDIRECTOR)
echo  ===========================================================
echo.
echo  Mengarahkan ke folder aplikasi...
echo.

if not exist "START.bat" (
    echo [ERROR] File 'START.bat' tidak ditemukan!
    echo Pastikan file ini berada di dalam folder aplikasi.
    pause
    exit /b
)

call START.bat
