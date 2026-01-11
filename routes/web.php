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

use App\Http\Controllers\SuratController;
// Public Routes for Surat Validation
Route::get('/surat/validasi/{token}', [SuratController::class, 'validasi'])->name('surat-keluar.validasi');
Route::get('/surat/token/{token}', [SuratController::class, 'showByToken'])->name('surat-keluar.pdf-token');

// --- SISWA & GTK ---
    Route::middleware('auth')->group(function () {
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
            Route::delete('siswa/destroy-all', [\App\Http\Controllers\StudentController::class, 'destroyAll'])->name('siswa.destroy-all');

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
            Route::post('/keluar/{id}/upload', [SuratController::class, 'uploadScan'])->name('keluar.upload'); // Upload Scan Manual

            Route::resource('template', \App\Http\Controllers\SuratTemplateController::class)->names('template');
            
            // Placeholders
            Route::get('/arsip', [SuratController::class, 'arsip'])->name('arsip.index');
            Route::get('/pengaturan', [SuratController::class, 'pengaturan'])->name('pengaturan.index');
            Route::post('/pengaturan', [SuratController::class, 'updatePengaturan'])->name('pengaturan.update');
        });

        // Manajemen GTK
        Route::prefix('gtk')->name('gtk.')->middleware(['can:view.gtk'])->group(function() {
            Route::get('/akun', [\App\Http\Controllers\GtkController::class, 'akun'])->name('akun.index');
            Route::post('/akun/generate-all', [\App\Http\Controllers\GtkController::class, 'generateAll'])->name('akun.generate-all');
            Route::post('/akun/{id}/recreate', [\App\Http\Controllers\GtkController::class, 'resetAccount'])->name('akun.recreate');
            Route::post('/akun/reset-all', [\App\Http\Controllers\GtkController::class, 'resetAllAccounts'])->name('akun.reset-all');
            Route::post('/akun/{id}', [\App\Http\Controllers\GtkController::class, 'storeAkun'])->name('akun.store');
            Route::post('/akun/{id}/reset-password', [\App\Http\Controllers\GtkController::class, 'resetPassword'])->name('akun.reset-password');
            Route::get('/piket', [\App\Http\Controllers\GtkController::class, 'piket'])->name('piket.index');
            Route::post('/piket', [\App\Http\Controllers\GtkController::class, 'storePiket'])->name('piket.store');

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
        });
        
        // Klasifikasi Surat
        Route::post('klasifikasi-surat', [\App\Http\Controllers\KlasifikasiSuratController::class, 'store'])->name('klasifikasi-surat.store')->middleware(['can:view.surat']);

        // Pengaturan
        Route::middleware(['can:view.settings'])->prefix('settings')->group(function() {
        // Route::prefix('settings')->group(function() {
            Route::get('/', [\App\Http\Controllers\SettingController::class, 'index'])->name('settings.index');
            Route::post('/', [\App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');
            Route::post('/app/update', [\App\Http\Controllers\SettingController::class, 'updateApp'])->name('settings.app.update');
            Route::get('/backup/db', [\App\Http\Controllers\SettingController::class, 'backupDatabase'])->name('settings.backup.db');
            Route::get('/backup/files', [\App\Http\Controllers\SettingController::class, 'backupStorage'])->name('settings.backup.files');
            Route::post('/cache/clear', [\App\Http\Controllers\SettingController::class, 'clearCache'])->name('settings.cache.clear');
            Route::post('/permissions', [\App\Http\Controllers\SettingController::class, 'updatePermission'])->name('settings.permissions.update');
        });
    });

require __DIR__.'/auth.php';
