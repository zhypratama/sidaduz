$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   SIDADU - DOMAIN SETUP WIZARD (XAMPP)   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Admin Rights
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️  Harap jalankan script ini sebagai COMMAND PROMPT (ADMINISTRATOR)!" -ForegroundColor Red
    Write-Host "Klik Kanan > Run as Administrator."
    exit
}

# 2. Input Domain
$domain = Read-Host "Masukkan Nama Domain Sekolah (contoh: sekolah.sch.id)"
if ([string]::IsNullOrWhiteSpace($domain)) {
    Write-Host "Domain tidak boleh kosong!" -ForegroundColor Red
    exit
}

$vhostsFile = "C:\xampp\apache\conf\extra\httpd-vhosts.conf"

if (-not (Test-Path $vhostsFile)) {
    Write-Host "❌ File httpd-vhosts.conf tidak ditemukan di C:\xampp\apache\conf\extra\" -ForegroundColor Red
    Write-Host "Pastikan XAMPP terinstall di direktori default."
    exit
}

# 3. Backup Old Config
$backupFile = "$vhostsFile.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
Copy-Item $vhostsFile $backupFile
Write-Host "✅ Backup konfigurasi lama tersimpan di: $backupFile" -ForegroundColor Green

# 4. Create VHost Config Block
$vhostConfig = @"

# --- ADDED BY SIDADU SETUP WIZARD ---
<VirtualHost *:80>
    ServerAdmin admin@$domain
    DocumentRoot "C:/xampp/htdocs/sidaduz/public"
    ServerName $domain
    ServerAlias www.$domain
    
    <Directory "C:/xampp/htdocs/sidaduz/public">
        Options Indexes FollowSymLinks Includes ExecCGI
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "logs/sidadu-$domain-error.log"
    CustomLog "logs/sidadu-$domain-access.log" common
</VirtualHost>
# ------------------------------------
"@

# 5. Append to File
Add-Content -Path $vhostsFile -Value $vhostConfig

Write-Host ""
Write-Host "🎉 Konfigurasi berhasil ditambahkan!" -ForegroundColor Green
Write-Host "Domain: $domain"
Write-Host "Path: C:/xampp/htdocs/sidaduz/public"
Write-Host ""
Write-Host "Langkah Selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Buka XAMPP Control Panel."
Write-Host "2. Stop lalu Start ulang module 'Apache'."
Write-Host "3. Pastikan DNS Domain sudah diarahkan ke IP Public server ini."
Write-Host "4. Jalankan perintah 'php artisan config:cache' di folder project."
Write-Host ""
Read-Host "Tekan Enter untuk keluar..."
