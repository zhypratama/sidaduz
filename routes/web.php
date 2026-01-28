<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::post('/dashboard/layout', [DashboardController::class, 'updateLayout'])
    ->middleware(['auth'])
    ->name('dashboard.layout.update');

// Donation Page (Authenticated)
Route::get('/donasi', [\App\Http\Controllers\DonationController::class, 'index'])
    ->middleware(['auth'])
    ->name('donation');

use App\Http\Controllers\SuratController;
Route::get('/statistik', [\App\Http\Controllers\PublicOverviewController::class, 'index'])->name('public.overview');

// Public Routes for Surat Validation
Route::get('/surat/validasi/{token}', [SuratController::class, 'validasi'])->name('surat-keluar.validasi');
Route::get('/surat/token/{token}', [SuratController::class, 'showByToken'])->name('surat-keluar.pdf-token');

// Public Facilities
Route::get('/fasilitas', [\App\Http\Controllers\PublicInventoryController::class, 'index'])->name('public.facilities.index');


// Two-Factor Authentication Challenge (Public route for login flow)
Route::get('/two-factor-challenge', [\App\Http\Controllers\TwoFactorController::class, 'challenge'])->name('two-factor.challenge');
Route::post('/two-factor-challenge', [\App\Http\Controllers\TwoFactorController::class, 'verify'])->middleware('throttle:5,1')->name('two-factor.verify');
Route::post('/two-factor-challenge/whatsapp', [\App\Http\Controllers\TwoFactorController::class, 'sendWhatsappOtp'])->middleware('throttle:1,1')->name('two-factor.whatsapp.send');

// WhatsApp Webhook (Exempt from CSRF in bootstrap/app.php)
Route::post('/whatsapp/webhook', [\App\Http\Controllers\WhatsappWebhookController::class, 'handle'])->name('whatsapp.webhook');

// --- SISWA & GTK ---
    Route::middleware('auth')->group(function () {
    
        // Bimbingan Konseling (BK) Route Group
        Route::prefix('bk')->name('bk.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\BkController::class, 'dashboard'])->name('dashboard');
            
            // Pelanggaran
            Route::get('/pelanggaran', [\App\Http\Controllers\BkController::class, 'pelanggaranIndex'])->name('pelanggaran.index');
            Route::get('/pelanggaran/create', [\App\Http\Controllers\BkController::class, 'pelanggaranCreate'])->name('pelanggaran.create');
            Route::post('/pelanggaran', [\App\Http\Controllers\BkController::class, 'pelanggaranStore'])->name('pelanggaran.store');
            
            // Konseling
            Route::get('/konseling', [\App\Http\Controllers\BkController::class, 'konselingIndex'])->name('konseling.index');
            Route::get('/konseling/create', [\App\Http\Controllers\BkController::class, 'konselingCreate'])->name('konseling.create');
            Route::post('/konseling', [\App\Http\Controllers\BkController::class, 'konselingStore'])->name('konseling.store');
            
            // Aturan
            Route::get('/aturan', [\App\Http\Controllers\BkController::class, 'aturanIndex'])->name('aturan.index');
            Route::post('/aturan', [\App\Http\Controllers\BkController::class, 'aturanStore'])->name('aturan.store');
            Route::patch('/aturan/{id}', [\App\Http\Controllers\BkController::class, 'aturanUpdate'])->name('aturan.update');
            Route::delete('/aturan/{id}', [\App\Http\Controllers\BkController::class, 'aturanDestroy'])->name('aturan.destroy');

            // Prestasi
            Route::get('/prestasi', [\App\Http\Controllers\BkController::class, 'prestasiIndex'])->name('prestasi.index');
            Route::get('/prestasi/create', [\App\Http\Controllers\BkController::class, 'prestasiCreate'])->name('prestasi.create');
            Route::post('/prestasi', [\App\Http\Controllers\BkController::class, 'prestasiStore'])->name('prestasi.store');

            // Laporan
            Route::get('/laporan', [\App\Http\Controllers\BkController::class, 'laporanIndex'])->name('laporan.index');
            Route::get('/laporan/{id}', [\App\Http\Controllers\BkController::class, 'laporanShow'])->name('laporan.show');
        });
            // Manajemen Siswa
        Route::middleware(['can:view.siswa'])->group(function() {
            Route::get('siswa/akun', [\App\Http\Controllers\StudentController::class, 'akun'])->name('siswa.akun.index');
            Route::post('siswa/akun/generate-all', [\App\Http\Controllers\StudentController::class, 'generateAll'])->name('siswa.akun.generate-all');
            Route::post('siswa/akun/reset-all', [\App\Http\Controllers\StudentController::class, 'resetAllAccounts'])->name('siswa.akun.reset-all');
            Route::post('siswa/akun/{id}', [\App\Http\Controllers\StudentController::class, 'storeAkun'])->name('siswa.akun.store');
            Route::post('siswa/akun/{id}/reset-password', [\App\Http\Controllers\StudentController::class, 'resetPassword'])->name('siswa.akun.reset-password');
            
            // Import & Template
            Route::post('siswa/import', [\App\Http\Controllers\StudentController::class, 'import'])->name('siswa.import');
            Route::get('siswa/template', [\App\Http\Controllers\StudentController::class, 'downloadTemplate'])->name('siswa.template');
            
            // Bulk Delete
            // Bulk Delete
            Route::delete('siswa/destroy-all', [\App\Http\Controllers\StudentController::class, 'destroyAll'])->name('siswa.destroy-all');

            // Kartu Siswa Routes
            Route::get('siswa/kartu', [\App\Http\Controllers\StudentCardController::class, 'index'])->name('siswa.kartu.index');
            Route::get('siswa/kartu/print', [\App\Http\Controllers\StudentCardController::class, 'print'])->name('siswa.kartu.print');

            Route::resource('siswa', \App\Http\Controllers\StudentController::class);

            // Kehadiran / Absensi
            Route::get('/absensi', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('absensi.index');
            Route::post('/absensi/import', [\App\Http\Controllers\AttendanceController::class, 'import'])->name('absensi.import');
            Route::post('/absensi/export', [\App\Http\Controllers\AttendanceController::class, 'export'])->name('absensi.export');
            
            // Mutasi & Alumni
            Route::get('/mutasi', [\App\Http\Controllers\MutationController::class, 'index'])->name('mutasi.index');
            Route::get('/mutasi/{student}/print', [\App\Http\Controllers\MutationController::class, 'print'])->name('mutasi.print');
        });

        // Profile User
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Two-Factor Authentication
        Route::prefix('profile/two-factor')->name('profile.two-factor.')->group(function() {
            Route::get('/', [\App\Http\Controllers\TwoFactorController::class, 'show'])->name('show');
            Route::post('/enable', [\App\Http\Controllers\TwoFactorController::class, 'enable'])->name('enable');
            Route::delete('/disable', [\App\Http\Controllers\TwoFactorController::class, 'disable'])->name('disable');
            Route::post('/recovery-codes', [\App\Http\Controllers\TwoFactorController::class, 'regenerateRecoveryCodes'])->name('recovery-codes');
        });

        // Sekolah & Tahun Ajaran
        Route::middleware(['can:view.sekolah'])->prefix('sekolah')->group(function() {
            Route::get('/profil', [\App\Http\Controllers\SchoolProfileController::class, 'index'])->name('profil-sekolah.index');
            Route::patch('/profil', [\App\Http\Controllers\SchoolProfileController::class, 'update'])->name('profil-sekolah.update');
            
            Route::resource('tahun-ajaran', \App\Http\Controllers\TahunAjaranController::class)->except(['create', 'edit', 'show']);
            Route::post('/tahun-ajaran/{id}/activate', [\App\Http\Controllers\TahunAjaranController::class, 'activate'])->name('tahun-ajaran.activate');
        });

        // Manajemen Kelas
        Route::post('kelas/reorder', [\App\Http\Controllers\KelasController::class, 'reorder'])->name('kelas.reorder');
        Route::resource('kelas', \App\Http\Controllers\KelasController::class)->parameters(['kelas' => 'kelas'])->middleware(['can:view.kelas']);

        // Manajemen Surat
        Route::prefix('surat')->name('surat-')->middleware(['can:view.surat'])->group(function () {
            Route::get('/', [SuratController::class, 'index'])->name('index'); 
            Route::get('/masuk', [SuratController::class, 'masuk'])->name('masuk.index');
            Route::get('/masuk/create', [SuratController::class, 'masukCreate'])->name('masuk.create');
            Route::post('/masuk', [SuratController::class, 'masukStore'])->name('masuk.store');
            Route::delete('/masuk/{id}', [SuratController::class, 'destroyMasuk'])->name('masuk.destroy');
            
            Route::get('/keluar', [SuratController::class, 'keluar'])->name('keluar.index');
            Route::get('/keluar/create', [SuratController::class, 'create'])->name('keluar.create');
            Route::post('/keluar', [SuratController::class, 'store'])->name('keluar.store');
            Route::delete('/keluar/{id}', [SuratController::class, 'destroyKeluar'])->name('keluar.destroy');
            Route::get('/approval', [SuratController::class, 'approval'])->name('approval.index');
            Route::post('/keluar/{id}/approve', [SuratController::class, 'approve'])->name('keluar.approve');
            Route::get('/keluar/{id}/pdf', [SuratController::class, 'show'])->name('keluar.pdf');
            Route::post('/keluar/{id}/upload', [SuratController::class, 'uploadScan'])->name('keluar.upload'); // Upload Scan Manual

            Route::resource('template', \App\Http\Controllers\SuratTemplateController::class)->names('template');
            
            // Placeholders
            Route::get('/arsip', [SuratController::class, 'arsip'])->name('arsip.index');
            Route::get('/pengaturan', [SuratController::class, 'pengaturan'])->name('pengaturan.index');
            Route::post('/pengaturan', [SuratController::class, 'updatePengaturan'])->name('pengaturan.update');
            
            // Disposisi
            Route::get('/disposisi', [\App\Http\Controllers\DisposisiSuratController::class, 'index'])->name('disposisi.index'); // Add this line
            Route::post('/masuk/{suratMasuk}/disposisi', [\App\Http\Controllers\DisposisiSuratController::class, 'store'])->name('disposisi.store');
            Route::patch('/disposisi/{disposisi}', [\App\Http\Controllers\DisposisiSuratController::class, 'update'])->name('disposisi.update');
            Route::delete('/disposisi/{disposisi}', [\App\Http\Controllers\DisposisiSuratController::class, 'destroy'])->name('disposisi.destroy');
        });

        // Manajemen GTK
        Route::prefix('gtk')->name('gtk.')->middleware(['can:view.gtk'])->group(function() {
            Route::get('/akun', [\App\Http\Controllers\GtkController::class, 'akun'])->name('akun.index');
            Route::post('/akun/generate-all', [\App\Http\Controllers\GtkController::class, 'generateAll'])->name('akun.generate-all');
            Route::post('/akun/{id}/recreate', [\App\Http\Controllers\GtkController::class, 'resetAccount'])->name('akun.recreate');
            Route::post('/akun/reset-all', [\App\Http\Controllers\GtkController::class, 'resetAllAccounts'])->name('akun.reset-all');
            Route::post('/akun/{id}', [\App\Http\Controllers\GtkController::class, 'storeAkun'])->name('akun.store');
            Route::post('/akun/{id}/reset-password', [\App\Http\Controllers\GtkController::class, 'resetPassword'])->name('akun.reset-password');
            
            // Jadwal Piket (Existing)
            Route::get('/jadwal-piket', [\App\Http\Controllers\GtkController::class, 'piket'])->name('piket.index');
            Route::post('/jadwal-piket', [\App\Http\Controllers\GtkController::class, 'storePiket'])->name('piket.store');
            Route::delete('/jadwal-piket/{id}', [\App\Http\Controllers\GtkController::class, 'destroyPiket'])->name('piket.destroy');
            
            // Menu Piket (New Feature)
            Route::prefix('piket')->name('piket.')->group(function() {
                Route::get('/absensi', [\App\Http\Controllers\PiketController::class, 'absensi'])->name('absensi');
                Route::post('/scan', [\App\Http\Controllers\PiketController::class, 'scanQr'])->name('scan');
                Route::post('/absensi', [\App\Http\Controllers\PiketController::class, 'storeAbsensi'])->name('store-absensi');
                
                Route::get('/berita-tamu', [\App\Http\Controllers\PiketController::class, 'beritaTamu'])->name('berita-tamu');
                Route::post('/berita', [\App\Http\Controllers\PiketController::class, 'storeBerita'])->name('store-berita');
                Route::post('/tamu', [\App\Http\Controllers\PiketController::class, 'storeTamu'])->name('store-tamu');
                Route::post('/tamu/{id}/checkout', [\App\Http\Controllers\PiketController::class, 'checkoutTamu'])->name('checkout-tamu');
                
                Route::get('/pengaturan', [\App\Http\Controllers\PiketController::class, 'settings'])->name('settings');
                Route::post('/pengaturan', [\App\Http\Controllers\PiketController::class, 'updateSettings'])->name('update-settings');
            });

            Route::get('/role/export', [\App\Http\Controllers\GtkController::class, 'exportRole'])->name('role.export');
            Route::get('/role', [\App\Http\Controllers\GtkController::class, 'roleIndex'])->name('role.index');
            Route::post('/role/{id}', [\App\Http\Controllers\GtkController::class, 'roleUpdate'])->name('role.update');
            
            Route::post('/import', [\App\Http\Controllers\GtkController::class, 'import'])->name('import');
            Route::get('/template', [\App\Http\Controllers\GtkController::class, 'downloadTemplate'])->name('template');
            Route::resource('/', \App\Http\Controllers\GtkController::class)->parameters(['' => 'gtk']);
        });


        // Kurikulum
        Route::prefix('kurikulum')->name('kurikulum.')->middleware(['can:view.kurikulum'])->group(function() {
             Route::get('/kalender', [\App\Http\Controllers\KurikulumController::class, 'calendar'])->name('kalender.index');
             Route::post('/kalender', [\App\Http\Controllers\KurikulumController::class, 'storeCalendar'])->name('kalender.store');
             Route::patch('/kalender/{id}', [\App\Http\Controllers\KurikulumController::class, 'updateCalendar'])->name('kalender.update');
             Route::delete('/kalender/{id}', [\App\Http\Controllers\KurikulumController::class, 'destroyCalendar'])->name('kalender.destroy');
             Route::post('/kalender/sync', [\App\Http\Controllers\KurikulumController::class, 'syncReference'])->name('kalender.sync');

             // Mata Pelajaran
             Route::post('mata-pelajaran/reorder', [\App\Http\Controllers\MataPelajaranController::class, 'reorder'])->name('mata-pelajaran.reorder');
             Route::resource('mata-pelajaran', \App\Http\Controllers\MataPelajaranController::class);

             // Pembelajaran (Distribusi Guru)
             Route::resource('pembelajaran', \App\Http\Controllers\PembelajaranController::class);

             // Penilaian / Nilai Harian
             Route::resource('nilai', \App\Http\Controllers\NilaiHarianController::class);

             // Jadwal Pelajaran
             Route::resource('jadwal', \App\Http\Controllers\JadwalPelajaranController::class)->only(['index', 'show', 'store']);
             Route::delete('jadwal', [\App\Http\Controllers\JadwalPelajaranController::class, 'destroy'])->name('jadwal.destroy');

             // Jurnal Guru
             Route::resource('jurnal', \App\Http\Controllers\JurnalGuruController::class);
             Route::get('pembelajaran/{id}/students', [\App\Http\Controllers\JurnalGuruController::class, 'getStudents'])->name('jurnal.students');
        });
        
        // Klasifikasi Surat
        Route::post('klasifikasi-surat', [\App\Http\Controllers\KlasifikasiSuratController::class, 'store'])->name('klasifikasi-surat.store')->middleware(['can:view.surat']);

        // Pengaturan
        Route::middleware(['can:view.settings'])->prefix('settings')->group(function() {
            Route::get('/', [\App\Http\Controllers\SettingController::class, 'index'])->name('settings.index');
            Route::post('/', [\App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');
            Route::post('/app/update', [\App\Http\Controllers\SettingController::class, 'updateApp'])->name('settings.app.update');
            Route::get('/app/check-update', [\App\Http\Controllers\SettingController::class, 'checkUpdate'])->name('settings.app.check-update');
            Route::post('/app/perform-update', [\App\Http\Controllers\SettingController::class, 'performUpdate'])->name('settings.app.perform-update');
            
            // System Stats (Realtime Monitor)
            Route::get('/app/system-stats', [\App\Http\Controllers\SettingController::class, 'getSystemStats'])->name('settings.system.stats');
            
            // SECURITY FIX: Changed from GET to POST to prevent link caching
            Route::post('/backup/db', [\App\Http\Controllers\SettingController::class, 'backupDatabase'])->name('settings.backup.db');
            Route::post('/backup/files', [\App\Http\Controllers\SettingController::class, 'backupStorage'])->name('settings.backup.files');
            
            Route::post('/cache/clear', [\App\Http\Controllers\SettingController::class, 'clearCache'])->name('settings.cache.clear');
            Route::post('/permissions', [\App\Http\Controllers\SettingController::class, 'updatePermission'])->name('settings.permissions.update');
            
            // Public Page Settings
            Route::get('/public-page', [\App\Http\Controllers\PublicPageSettingController::class, 'index'])->name('settings.public-page.index');
            Route::post('/public-page', [\App\Http\Controllers\PublicPageSettingController::class, 'update'])->name('settings.public-page.update');
            
            // Security Dashboard (Admin Only)
            Route::prefix('security')->name('security.')->group(function() {
                Route::get('/', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'index'])->name('dashboard');
                Route::get('/{id}', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'show'])->name('show');
                Route::post('/clear', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'clear'])->name('clear');
                Route::post('/block-ip', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'blockIP'])->name('block-ip');
                Route::post('/unblock-ip', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'unblockIP'])->name('unblock-ip');
                Route::post('/whitelist-ip', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'whitelistIP'])->name('whitelist-ip');
                Route::post('/remove-whitelist', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'removeWhitelist'])->name('remove-whitelist');
                Route::post('/auto-fix', [\App\Http\Controllers\Admin\SecurityDashboardController::class, 'autoFix'])->name('auto-fix');
            });

            // Sarana Prasarana (Inventory)
            Route::resource('inventory', \App\Http\Controllers\InventoryController::class);
        });

        // Modul Ajar (AI Powered)
        Route::get('/modul-ajar', [\App\Http\Controllers\ModulAjarController::class, 'index'])->name('modul-ajar.index');
        Route::post('/modul-ajar/search', [\App\Http\Controllers\ModulAjarController::class, 'search'])->name('modul-ajar.search');

        // Formulir Online (Sidadu Forms) - Admin Only
        // Broadcast Center
        Route::prefix('broadcast')->name('broadcast.')->group(function() {
            Route::get('/', [\App\Http\Controllers\Admin\BroadcastController::class, 'index'])->name('index');
            Route::post('/send', [\App\Http\Controllers\Admin\BroadcastController::class, 'send'])->name('send');
        });

        // WhatsApp Gateway Settings
        Route::prefix('settings/whatsapp')->name('settings.whatsapp.')->group(function() {
            Route::get('/', [\App\Http\Controllers\Admin\WhatsappSettingController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\Admin\WhatsappSettingController::class, 'update'])->name('update');
            Route::post('/test', [\App\Http\Controllers\Admin\WhatsappSettingController::class, 'test'])->name('test');
        });

        // Formulir Online (Sidadu Forms) - Admin Only
        // Accessible by Admin Sekolah & Super Admin via Sidebar logic, 
        // ideally add a specific permission or leave open to auth for now if Roles handle it.
        Route::resource('forms', \App\Http\Controllers\Admin\FormController::class);
        // AI Assistant
        Route::post('/ai/chat', [\App\Http\Controllers\AiAssistantController::class, 'chat'])->name('ai.chat');
    });

    // Public Forms - With Rate Limiting
    Route::get('/form/{slug}', [\App\Http\Controllers\PublicFormController::class, 'show'])->name('public.form.show');
    Route::post('/form/{slug}', [\App\Http\Controllers\PublicFormController::class, 'submit'])
        ->middleware('throttle:10,1') // Max 10 submissions per minute
        ->name('public.form.submit');

    // --- PARENT / WALI APP (PWA) ROUTES ---
    Route::prefix('wali')->name('wali.')->group(function() {
        Route::get('/login', [\App\Http\Controllers\WaliController::class, 'showLogin'])->name('login');
        Route::post('/login', [\App\Http\Controllers\WaliController::class, 'login'])->name('login.post');
        Route::post('/logout', [\App\Http\Controllers\WaliController::class, 'logout'])->name('logout');
        
        Route::get('/dashboard', [\App\Http\Controllers\WaliController::class, 'dashboard'])->name('dashboard');
    });

require __DIR__.'/auth.php';
