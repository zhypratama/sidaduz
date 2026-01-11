@echo off
echo [INFO] Menghentikan server SISKO...
taskkill /f /im php.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo [SUKSES] Server aplikasi dimatikan.
pause
