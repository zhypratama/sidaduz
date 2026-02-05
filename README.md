# SIDADU (Sistem Database Terpadu)

**SIDADU** adalah platform Sistem Informasi Sekolah berbasis web yang komprehensif, dirancang untuk mendigitalisasi seluruh aspek administrasi dan manajemen sekolah. Aplikasi ini mengintegrasikan manajemen data siswa, pegawai (GTK), akademik, persuratan, hingga kedisiplinan dalam satu ekosistem yang aman dan terpadu.

![Dashboard Preview](public/images/dashboard-preview.png)

## 🌟 Fitur Lengkap & Detail

Aplikasi ini mencakup berbagai modul yang saling terintegrasi untuk memenuhi kebutuhan operasional sekolah modern:

### 1. 🎓 Modul Manajemen Kesiswaan
Pusat data siswa yang lengkap dan sinkron.
*   **Database Peserta Didik 360°**: Menyimpan profil lengkap, data orang tua/wali, data periodik (kesehatan/fisik), hingga data beasiswa (KIP/PIP).
*   **Integrasi Dapodik (Import Excel)**: Fitur cerdas untuk mengimpor data siswa dari format Excel Dapodik, otomatis memetakan kolom dan membuat Rombel jika belum ada.
*   **Manajemen Kelas & Rombongan Belajar**: Pengaturan kenaikan kelas, pembagian kelas, dan riwayat rombel siswa.
*   **Generate Kartu Pelajar (ID Card)**: Cetak kartu pelajar massal dengan QR Code unik untuk setiap siswa.
*   **Mutasi & Alumni**: Pelacakan otomatis status siswa (Lulus, Mutasi Keluar, Drop Out) beserta berlas administrasi terkait.
*   **Akun Siswa Otomatis**: Generator akun untuk siswa agar dapat login dan melihat data pribadi/pengumuman.

### 2. 📝 E-Persuratan & Administrasi Digital
Sistem persuratan tanpa kertas (paperless) yang efisien.
*   **Surat Masuk & Keluar**: Pencatatan (agenda) surat masuk dan keluar dengan manajemen nomor surat otomatis yang terurut.
*   **Smart Template Editor**: Editor visual canggih (WYSIWYG) untuk membuat template surat sendiri. Mendukung variabel dinamis seperti `${nama}`, `${nis}`, `${kelas}`, `${tanggal}`.
*   **QR Code Digital Signature**: Setiap surat yang dicetak dilengkapi QR Code untuk validasi keaslian (Anti-Fake). Scan QR untuk melihat dokumen asli di server.
*   **Disposisi Surat Digital**: Alur disposisi surat dari Kepala Sekolah ke staf terkait secara digital.
*   **Arsip Dokumen**: Penyimpanan dokumen digital yang terorganisir dan mudah dicari.

### 3. 👥 Manajemen GTK (Guru & Tenaga Kependidikan)
*   **Database Kepegawaian**: Biodata lengkap guru dan staf TU.
*   **Manajemen Tugas Tambahan**: Pencatatan tugas tambahan (Waka, Kepala Lab, Wali Kelas, dll).
*   **Jadwal Piket Guru**: Pengaturan dan display jadwal guru piket harian.
*   **Manajemen Akun & Role (Hak Akses)**: Sistem hak akses bertingkat (RBAC) menggunakan *Spatie Permission*. Admin dapat menentukan menu apa saja yang bisa diakses oleh setiap role (Guru, TU, Kepsek, dll).

### 4. ⚖️ Bimbingan Konseling (BK) & Tata Tertib
Monitoring karakter dan kedisiplinan siswa secara real-time.
*   **Sistem Poin Pelanggaran**: Pencatatan kasus siswa berdasarkan bobot poin tata tertib sekolah.
*   **Jurnal Konseling**: Catatan digital sesi konseling antara guru BK dan siswa/ortu.
*   **Pencatatan Prestasi**: Database prestasi akademik dan non-akademik siswa.
*   **Laporan & Statistik**: Dashboard grafik pelanggaran siswa per kelas/bulan dan rekapitulasi penanganan kasus.
*   **Cetak Surat Panggilan**: Generate surat panggilan orang tua otomatis berdasarkan kasus yang dipilih.

### 5. 🏫 Akademik & Kurikulum
*   **Manajemen Mata Pelajaran**: Pengaturan mapel wajib, muatan lokal, dan ekstrakurikuler.
*   **Distribusi Guru Mapel**: Pembagian tugas mengajar guru per kelas dan per semester.
*   **Jadwal Pelajaran**: Penyusunan jadwal KBM (Kegiatan Belajar Mengajar) yang fleksibel.
*   **Kalender Akademik**: Agenda kegiatan sekolah tahunan yang tampil di dashboard.
*   **Modul Ajar**: Repository modul ajar dan materi pembelajaran.

### 6. �️ Keamanan Sistem & Privasi (Security)
Prioritas utama kami adalah keamanan data institusi Anda.
*   **Two-Factor Authentication (2FA)**: Login lebih aman dengan verifikasi 2 langkah (Google Authenticator) untuk akun staf/admin.
*   **Advanced Firewall**: Proteksi bawaan terhadap serangan Brute Force, SQL Injection, XSS, dan Path Traversal.
*   **Log Aktivitas & Audit Trail**: Merekam setiap aksi penting (Login, Create, Update, Delete) siapa melakukan apa dan kapan.
*   **IP Blocking & Geo-Blocking**: Blokir akses dari IP atau negara tertentu yang mencurigakan.
*   **Enkripsi Data Sensitif**: Data NIK, No HP, dan Alamat tersimpan dalam format terenkripsi (AES-256) di database.

### 7. ⚖️ Kepatuhan UU PDP (Privasi Data)
Mematuhi **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi**:
*   **Data Sovereignty**: Aplikasi bersifat *Self-Hosted*. Data fisik berada di server sekolah, bukan di cloud vendor.
*   **Kontrol Penuh**: Sekolah memiliki kendali penuh atas penghapusan dan pengelolaan data.
*   **Transparansi**: Tidak ada telemetri tersembunyi yang mengirim data siswa ke pihak luar.

### 8. 🛠️ Utilitas Tambahan
*   **WhatsApp Gateway & Broadcast**: Kirim pesan notifikasi atau pengumuman massal ke Orang Tua/Siswa via WhatsApp (Dukungan integrasi vendor).
*   **Buku Tamu Digital**: Pencatatan tamu sekolah (Check-in/Check-out) dengan keperluan kunjungan.
*   **Formulir Online Builder**: Buat formulir online (seperti Google Forms) untuk survei/pendaftaran ekskul yang terintegrasi langsung ke sistem.
*   **Control Panel Desktop**: Aplikasi desktop (`SidaduzControlPanel.exe`) untuk memudahkan maintenance server (Backup, Restore, Update) tanpa koding.

---

## 💻 Spesifikasi Teknis

Aplikasi dibangun dengan stack teknologi modern, stabil, dan kencang:
*   **Backend Framework**: Laravel 12 (PHP 8.2+) - *Robust & Secure* Security Patch Until 24-02-2027
*   **Frontend**: Inertia.js + React.js - *Single Page Application (SPA) Experience*
*   **Styling**: Tailwind CSS - *Modern UI Design*
*   **Database**: MySQL / MariaDB
*   **PDF Engine**: DomPDF & Browsershot
*   **Web Server**: Support Apache (XAMPP) / Nginx / Laragon

---

## 🚀 Cara Instalasi & Menjalankan

### Persyaratan Sistem
*   Windows/Linux/macOS
*   PHP >= 8.2
*   Composer
*   Node.js & NPM
*   MySQL

### Langkah Cepat (Quick Start)
1.  **Clone & Install Dependencies**:
    ```bash
    git clone https://github.com/zhypratama/sidaduz.git
    cd sidaduz
    composer install
    npm install
    ```
2.  **Konfigurasi Environment**:
    ```bash
    cp .env.example .env
    # Edit .env sesuaikan database
    php artisan key:generate
    php artisan storage:link
    ```
3.  **Setup Database**:
    ```bash
    php artisan migrate --seed
    ```
    *Seeder akan membuat akun admin default.*
4.  **Jalankan Aplikasi**:
    *   **Opsi 1 (Mudah):** Buka `SidaduzControlPanel.exe` -> Klik **START SERVER**.
    *   **Opsi 2 (Manual):**
        ```bash
        # Terminal 1
        php artisan serve
        # Terminal 2
        npm run dev
        ```

### 🔑 Akun Default
*   **URL**: `http://localhost:8000`
*   **Email**: `admin@smpalirsyad.sch.id`
*   **Password**: `password`

---

## 🤝 Kontribusi & Lisensi
Dikembangkan untuk kemajuan Pendataan dan Administrasi Pendidikan Indonesia.
Hak Cipta © 2026 SIDADU-Z by FanzhySoft
