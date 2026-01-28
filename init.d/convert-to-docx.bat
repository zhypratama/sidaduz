@echo off
rem Switching context to project root
cd /d "%~dp0\.."
echo ============================================
echo   SIDADU - Convert MD to DOCX
echo ============================================
echo.

REM Check if pandoc is installed
where pandoc >nul 2>&1
if %errorlevel% neq 0 goto fallback

echo Converting DOKUMENTASI_SIDADU_LENGKAP.md to DOCX...
pandoc DOKUMENTASI_SIDADU_LENGKAP.md -o DOKUMENTASI_SIDADU_LENGKAP.docx 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] File converted to DOKUMENTASI_SIDADU_LENGKAP.docx
    pause
    exit /b 0
)

:fallback
echo [WARNING] Pandoc tidak ditemukan atau gagal! 
echo Mencoba metode cadangan (HTML Fallback)...
echo.

:: Create a simple HTML wrapper
echo ^<html^>^<body style="font-family: sans-serif; line-height: 1.6; padding: 40px;"^> > DOKUMENTASI_SIDADU_LENGKAP.html
echo ^<h1 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;"^>DOKUMENTASI MASTER SIDADU^</h1^> >> DOKUMENTASI_SIDADU_LENGKAP.html
echo ^<pre style="white-space: pre-wrap; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;"^> >> DOKUMENTASI_SIDADU_LENGKAP.html
type DOKUMENTASI_SIDADU_LENGKAP.md >> DOKUMENTASI_SIDADU_LENGKAP.html
echo ^</pre^>^</body^>^</html^> >> DOKUMENTASI_SIDADU_LENGKAP.html

echo [SUCCESS] Berkas HTML berhasil dibuat: DOKUMENTASI_SIDADU_LENGKAP.html
echo (Anda dapat membuka file ini di Word dan simpan sebagai .docx)
echo.
start DOKUMENTASI_SIDADU_LENGKAP.html
pause
exit /b 0

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] File created: DOKUMENTASI_SIDADU_LENGKAP.docx
    echo.
    echo Opening file...
    start DOKUMENTASI_SIDADU_LENGKAP.docx
) else (
    echo.
    echo [INFO] Converting without Pandoc? (Attempting PowerShell fallback to TXT)
    copy DOKUMENTASI_SIDADU_LENGKAP.md DOKUMENTASI_SIDADU_LENGKAP.txt /y
    echo [SUCCESS] DOKUMENTASI_SIDADU_LENGKAP.txt created.
    echo (You can open this in Word and Save As .docx)
)
    
    if %errorlevel% equ 0 (
        echo [SUCCESS] File created: ASSESSMENT_REPORT.docx
        start ASSESSMENT_REPORT.docx
    ) else (
        echo [ERROR] Conversion failed!
    )
)

echo.
pause
