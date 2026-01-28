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
            'school_profile' => \App\Models\SchoolProfile::first(),
            'registration' => [
                'is_registered' => \App\Services\ActivationService::isRegistered(),
                'data' => cache('installation_data'),
            ],
            'registration' => [
                'is_registered' => \App\Services\ActivationService::isRegistered(),
                'data' => cache('installation_data'),
            ],
            'system_info' => $this->gatherSystemInfo(),
            'cache_stats' => $this->gatherCacheStats()
        ]);
    }

    public function getSystemStats()
    {
        return response()->json([
            'system_info' => $this->gatherSystemInfo(),
            'cache_stats' => $this->gatherCacheStats(),
        ]);
    }

    private function gatherSystemInfo()
    {
        return [
            'php' => phpversion(),
            'laravel' => app()->version(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'os' => php_uname('s') . ' ' . php_uname('r') . ' (' . php_uname('m') . ')',
            'database' => \Illuminate\Support\Facades\DB::connection()->getPdo()->getAttribute(\PDO::ATTR_SERVER_VERSION),
            'driver' => \Illuminate\Support\Facades\DB::connection()->getDriverName(),
            'disk_total' => $this->formatSize(disk_total_space('.')),
            'disk_free' => $this->formatSize(disk_free_space('.')),
            'disk_used_percent' => round((1 - (disk_free_space('.') / disk_total_space('.'))) * 100, 1),
            'php_memory_limit' => ini_get('memory_limit'),
            'php_max_execution_time' => ini_get('max_execution_time') . 's',
            'php_upload_max_filesize' => ini_get('upload_max_filesize'),
            'php_post_max_size' => ini_get('post_max_size'),
        ];
    }

    private function gatherCacheStats()
    {
        return [
            'views' => $this->formatSize($this->getFolderSize(storage_path('framework/views'))),
            'sessions' => $this->formatSize($this->getFolderSize(storage_path('framework/sessions'))),
            'logs' => $this->formatSize($this->getFolderSize(storage_path('logs'))),
            'framework' => $this->formatSize($this->getFolderSize(storage_path('framework/cache'))),
        ];
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $item) {
            // Special Handler: is_online_mode (disimpan di SchoolProfile)
            if ($item['key'] === 'is_online_mode') {
                $profile = \App\Models\SchoolProfile::first();
                if ($profile) {
                    $profile->is_online_mode = ($item['value'] == 'true' || $item['value'] == '1' || $item['value'] === true);
                    $profile->save();
                    
                    // Clear School Profile Cache
                    \Illuminate\Support\Facades\Cache::forget('school_profile');
                }
                continue; 
            }

            // Normal Settings
            AppSetting::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value'], 'group' => $item['group'] ?? 'umum']
            );
        }

        return back()->with('success', 'Pengaturan berhasil disimpan');
    }

    public function updatePermission(Request $request) {
        if (!auth()->user()->can('view.settings')) abort(403);
        
        $request->validate([
             'role_id' => 'required',
             'permission' => 'required',
             'enabled' => 'required|boolean'
        ]);
        
        $role = \Spatie\Permission\Models\Role::findById($request->role_id);
        if($request->enabled) {
             $role->givePermissionTo($request->permission);
        } else {
             $role->revokePermissionTo($request->permission);
        }
        
        // Cache clear handled by Spatie usually, but good to be safe
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        
        return back();
    }

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
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');
        
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


    public function checkUpdate()
    {
        return response()->json(\App\Services\UpdaterService::checkForUpdates());
    }

    public function performUpdate()
    {
        $result = \App\Services\UpdaterService::runUpdate();
        if ($result['success']) {
            return back()->with('success', 'Aplikasi berhasil diperbarui!')->with('update_log', $result['log']);
        } else {
            return back()->with('error', 'Update Gagal: ' . $result['error'])->with('update_log', $result['log']);
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
