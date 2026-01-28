# Panduan Meng-online-kan Aplikasi Server Lokal

Jika Anda memiliki server lokal (misalnya XAMPP di komputer sekolah) dan ingin agar aplikasi bisa diakses dari mana saja menggunakan domain (contoh: `sekolah-anda.com`), ada dua metode utama yang bisa digunakan:

## Metode 1: Cloudflare Tunnel (Sangat Direkomendasikan)
Metode ini paling aman dan tidak memerlukan pengaturan router yang rumit. Anda tidak perlu Public IP statis.

**Langkah-langkah:**

1.  **Miliki Domain**: Pastikan Anda sudah membeli domain.
2.  **Akun Cloudflare**: Daftarkan domain Anda ke Cloudflare (gratis).
3.  **Install Cloudflared**:
    -   Download `cloudflared` untuk Windows dari website resmi Cloudflare.
    -   Ikuti panduan "Zero Trust > Tunnels" di dashboard Cloudflare.
    -   Hubungkan tunnel ke port lokal aplikasi Anda.
    -   **PENTING**: Karena aplikasi berjalan di XAMPP/Apache, biasanya portnya adalah `80`. Arahkan tunnel service ke `http://localhost:80`.
4.  **Konfigurasi Aplikasi**:
    -   Buka file `.env`.
    -   Ubah `APP_URL=https://domain-anda.com`.
    -   Pastikan `ASSET_URL` tidak di-set (atau hapus barisnya) agar asset mengikuti `APP_URL`.

**Kelebihan**:
-   Gratis HTTPS (Gembok hijau).
-   Tidak perlu buka port router (aman dari serangan langsung).
-   Bisa diakses meski IP internet sekolah berubah-ubah (Dinamis).

---

## Metode 2: Public IP & Port Forwarding (Cara Tradisional)
Gunakan cara ini jika Anda memiliki IP Public Statis dari penyedia internet (ISP) dan memiliki akses penuh ke Router/Mikrotik.

**Langkah-langkah:**

1.  **Setting Router**:
    -   Masuk ke admin panel router.
    -   Cari menu "Port Forwarding" atau "Virtual Server".
    -   Buat rule baru:
        -   **External Port**: 80 (HTTP) dan 443 (HTTPS).
        -   **Internal IP**: Alamat IP Komputer Server (misal `192.168.1.server`).
        -   **Internal Port**: 80 (untuk Apache XAMPP).
2.  **Setting Domain**:
    -   Di panel domain manager, buat **A Record**.
    -   Arahkan ke IP Public internet sekolah Anda.
3.  **Konfigurasi Aplikasi**:
    -   Sama seperti di atas, ubah `APP_URL` di `.env` sesuaikan dengan domain.

**Kekurangan**:
-   Lebih berisiko keamanan.
-   Setting lebih rumit (firewall, NAT, Mikrotik).
-   Jika IP Public berubah, domain tidak bisa diakses (kecuali pakai DDNS).

---

## Catatan Penting untuk Produksi

Jika aplikasi akan dipakai banyak orang (guru/siswa/wali murid), **JANGAN** menggunakan perintah:
`php artisan serve`
Perintah itu hanya untuk coba-coba (development) dan hanya bisa menampung 1 koneksi dalam satu waktu (single-threaded).

**Gunakanlah Apache (XAMPP):**
1.  Pastikan folder project ada di `htdocs`.
2.  Atur "Virtual Host" di Apache agar domain/IP langsung mengarah ke folder `public`.
3.  Atau akses melalui `http://localhost/sidaduz/public` dan arahkan tunnel ke path tersebut (namun URL akan sedikit lebih panjang).
