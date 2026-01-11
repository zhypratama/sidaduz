<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // Get all settings and group them
        $settings = AppSetting::all()->groupBy('group');

        // Fetch Roles and Permissions for Matrix
        $roles = \Spatie\Permission\Models\Role::with('permissions')->get();
        $permissions = \Spatie\Permission\Models\Permission::all();
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'roles' => $roles,
            'permissions' => $permissions,
            'system_info' => [
                'php' => phpversion(),
                'laravel' => app()->version(),
                'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                'database' => \Illuminate\Support\Facades\DB::connection()->getPdo()->getAttribute(\PDO::ATTR_SERVER_VERSION),
                'driver' => \Illuminate\Support\Facades\DB::connection()->getDriverName(),
            ],
            'cache_stats' => [
                'views' => $this->formatSize($this->getFolderSize(storage_path('framework/views'))),
                'sessions' => $this->formatSize($this->getFolderSize(storage_path('framework/sessions'))),
                'logs' => $this->formatSize($this->getFolderSize(storage_path('logs'))),
                'framework' => $this->formatSize($this->getFolderSize(storage_path('framework/cache'))),
            ]
        ]);
    }

    // ... (updatePermission & update methods remain same)

    // --- Backup & Update System ---

    public function backupDatabase()
    {
        // Check Permission
        if (!auth()->user()->can('backup.create')) abort(403);

        $filename = 'backup-db-' . date('Y-m-d_H-i-s') . '.sql';
        $path = storage_path('app/backups/' . $filename);
        
        // Ensure directory exists
        if (!file_exists(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        // Database config
        $dbName = env('DB_DATABASE');
        $dbUser = env('DB_USERNAME');
        $dbPass = env('DB_PASSWORD');
        
        // Mysqldump path (adjust for XAMPP/Live)
        $dumpBinaryPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe'; // XAMPP Default
        if (!file_exists($dumpBinaryPath)) {
             $dumpBinaryPath = 'mysqldump'; // Try global if XAMPP not found
        }

        $command = "\"{$dumpBinaryPath}\" --user=\"{$dbUser}\" --password=\"{$dbPass}\" \"{$dbName}\" > \"{$path}\"";

        try {
            exec($command, $output, $returnVar);
            
            if ($returnVar !== 0) {
                return back()->with('error', 'Gagal backup database. Pastikan mysqldump tersedia. Code: ' . $returnVar);
            }

            return response()->download($path)->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            return back()->with('error', 'Exception: ' . $e->getMessage());
        }
    }

    public function backupStorage()
    {
        // Check Permission
        if (!auth()->user()->can('backup.create')) abort(403);

        $zip_file = 'backup-storage-' . date('Y-m-d_H-i-s') . '.zip';
        $zip_path = storage_path('app/backups/' . $zip_file);
        
        // Ensure directory exists
        if (!file_exists(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        $zip = new \ZipArchive();
        if ($zip->open($zip_path, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
            $path = storage_path('app/public');
            if (is_dir($path)) {
                $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path), \RecursiveIteratorIterator::LEAVES_ONLY);
                foreach ($files as $name => $file) {
                    if (!$file->isDir()) {
                        $filePath = $file->getRealPath();
                        $relativePath = substr($filePath, strlen($path) + 1);
                        $zip->addFile($filePath, $relativePath);
                    }
                }
            }
            $zip->close();
        }

        return response()->download($zip_path)->deleteFileAfterSend(true);
    }

    public function updateApp()
    {
        // 1. Git Pull
        // 2. Migrate
        // 3. Clear Cache
        
        $log = [];
        
        try {
            // Git Pull
            $git_output = [];
            exec('git pull origin main 2>&1', $git_output, $git_return);
            $log[] = ">>> GIT PULL:\n" . implode("\n", $git_output);

            if ($git_return !== 0) {
                 return back()->with('error', 'Git Pull Failed! Log: ' . implode("\n", $git_output));
            }

            // Migrate
            \Illuminate\Support\Facades\Artisan::call('migrate --force');
            $log[] = "\n>>> MIGRATE:\n" . \Illuminate\Support\Facades\Artisan::output();
            
            // Build Assets (Optional/Risky on shared host, skip for now or use pre-built)
            // Ideally we run 'npm run build' but node might not be capable.
            // Let's assume user manually builds or we commit built assets (bad practice but common for shared hosting).
            
            // Clear Cache
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            $log[] = "\n>>> CACHE CLEAR:\n" . \Illuminate\Support\Facades\Artisan::output();

            return back()->with('success', 'Update Selesai!')->with('update_log', implode("\n", $log));

        } catch (\Exception $e) {
            return back()->with('error', 'Update Gagal: ' . $e->getMessage());
        }
    }

    // --- Cache Management ---

    public function clearCache()
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            \Illuminate\Support\Facades\Artisan::call('view:clear');
            \Illuminate\Support\Facades\Artisan::call('cache:clear');
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('route:clear');
            
            return back()->with('success', 'Cache aplikasi berhasil dibersihkan! (Views, Config, Route, App Cache)');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membersihkan cache: ' . $e->getMessage());
        }
    }

    private function getFolderSize($dir)
    {
        $size = 0;
        if (!file_exists($dir)) return 0;
        
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir)) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }

    private function formatSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
