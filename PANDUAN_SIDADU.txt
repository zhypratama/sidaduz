╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🚀 CARA MENJALANKAN SIDADU 🚀                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

📍 LOKASI PROJECT: C:\xampp\htdocs\sidaduz


═══════════════════════════════════════════════════════════
  CARA TERCEPAT (RECOMMENDED)
═══════════════════════════════════════════════════════════

1. Double-click file ini:
   
   📂 C:\xampp\htdocs\sidaduz\START.bat

2. XAMPP Control Panel akan terbuka otomatis

3. Di XAMPP Control Panel:
   - Klik tombol [Start] di sebelah MySQL
   - Tunggu sampai berubah HIJAU
   
4. Kembali ke jendela START.bat
   - Tekan tombol apa saja untuk lanjut
   
5. Server akan start otomatis di:
   
   🌐 http://127.0.0.1:8000/dashboard


═══════════════════════════════════════════════════════════
  CARA MANUAL (Jika START.bat Gagal)
═══════════════════════════════════════════════════════════

STEP 1: Start MySQL
--------------------
1. Buka: C:\xampp\xampp-control.exe
2. Klik [Start] di sebelah MySQL
3. Tunggu sampai HIJAU


STEP 2: Start Laravel Server
-----------------------------
1. Buka Command Prompt / PowerShell
2. Ketik:
   
   cd C:\xampp\htdocs\sidaduz
   php artisan serve

3. Tunggu sampai muncul:
   
   INFO  Server running on [http://127.0.0.1:8000]


STEP 3: Buka Browser
---------------------
Akses salah satu URL ini:

• http://127.0.0.1:8000/dashboard
• http://localhost:8000/dashboard


═══════════════════════════════════════════════════════════
  LOGIN CREDENTIALS
═══════════════════════════════════════════════════════════

Admin:
------
Email    : admin@sidadu.test
Password : password

Guru:
-----
Email    : guru@sidadu.test
Password : password


═══════════════════════════════════════════════════════════
  TROUBLESHOOTING
═══════════════════════════════════════════════════════════

❌ Blank White Screen?
   → MySQL belum berjalan
   → Start MySQL di XAMPP Control Panel
   → Refresh browser (Ctrl+Shift+R)

❌ Port 8000 already in use?
   → Matikan proses lain yang pakai port 8000
   → Atau gunakan port lain:
     php artisan serve --port=8001

❌ MySQL won't start?
   → Cek apakah port 3306 sudah dipakai
   → Restart komputer
   → Reinstall XAMPP

❌ Weather widget tidak muncul?
   → Buka Settings → Umum
   → Aktifkan "Mode Online"
   → Pastikan ada koneksi internet


═══════════════════════════════════════════════════════════
  FILE PENTING
═══════════════════════════════════════════════════════════

📄 START.bat
   → Start MySQL + Laravel server (1 klik)

📄 start-whatsapp-gateway.bat
   → Start WhatsApp Gateway server (1 klik)

📄 QUICK_START.md
   → Panduan lengkap cara start server

📄 WHATSAPP_QUICK_START.md
   → Panduan cepat WhatsApp Gateway (3 langkah)

📄 WHATSAPP_GATEWAY_STATUS.md
   → Status & dokumentasi lengkap WhatsApp Gateway

📄 BROADCAST_CENTER_QUICK_START.md
   → Panduan lengkap Broadcast Center

📄 URGENT_MYSQL_NOT_RUNNING.md
   → Troubleshoot MySQL

📄 TROUBLESHOOTING_BLANK_SCREEN.md
   → Troubleshoot blank screen

📄 SECURITY_FOOTER_GUIDE.md
   → Panduan keamanan & enkripsi footer


═══════════════════════════════════════════════════════════
  FITUR UTAMA
═══════════════════════════════════════════════════════════

✅ Dashboard dengan widget yang bisa di-drag & resize
✅ Weather widget (jika online mode aktif)
✅ Manajemen Siswa & GTK
✅ Sistem Persuratan dengan QR Code
✅ Bimbingan Konseling (BK)
✅ Kartu Siswa dengan QR Code
✅ Absensi Piket (Manual & QR)
✅ WhatsApp Gateway (Self-Hosted)
✅ Broadcast Center (Kirim pesan massal)
✅ Chatbot Wali Murid (Auto-reply)
✅ Role & Permission Management
✅ Dark Mode
✅ Footer terenkripsi (tidak bisa diubah)


═══════════════════════════════════════════════════════════
  KEAMANAN
═══════════════════════════════════════════════════════════

⚠️  UNTUK DEVELOPMENT (Lokal):
    ✅ APP_DEBUG=true - OK
    ✅ HTTP tanpa SSL - OK

⚠️  UNTUK PRODUCTION (Online):
    ❌ APP_DEBUG=false - WAJIB
    ❌ HTTPS dengan SSL - WAJIB
    ❌ Firewall aktif - WAJIB
    
    Lihat: ASSESSMENT_REPORT.md


═══════════════════════════════════════════════════════════
  KONTAK SUPPORT
═══════════════════════════════════════════════════════════

Developer : Fanzhy
Version   : 1.0.0
Framework : Laravel 12 + React 18
Database  : MySQL/MariaDB


═══════════════════════════════════════════════════════════

            Made with ❤️ by Fanzhy
         For Support One Data Education

═══════════════════════════════════════════════════════════
