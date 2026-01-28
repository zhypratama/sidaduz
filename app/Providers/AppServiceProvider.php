<?php

namespace App\Providers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        config(['app.locale' => 'id']);
        \Carbon\Carbon::setLocale('id');

        // Force root URL to prevent localhost vs 127.0.0.1 inconsistency
        \Illuminate\Support\Facades\URL::forceRootUrl(config('app.url'));

        if ((config('app.env') === 'production' || config('app.env') === 'local') 
            && !in_array(request()->getHost(), ['127.0.0.1', 'localhost'])) {
             \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Optimized Timezone: Use .env first, then Cache, then System, then Default
        $timezone = config('app.timezone');
        
        // If config is strictly default 'UTC' (likely from app.php), we try to auto-detect.
        // If user changed it in .env to something else (e.g. Asia/Jakarta), we trust it and skip expensive check.
        if ($timezone === 'UTC') {
            $timezone = Cache::rememberForever('app_system_timezone', function () {
                $defaultTz = 'Asia/Jakarta'; // Default fallback
                
                try {
                    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                        // Optimistik: Jika PC di Indonesia, biasanya W. Europe atau SE Asia
                        $output = [];
                         // Exec with timeout workaround (not native, but we hope for best)
                        @exec('tzutil /g', $output);
                        
                        if (isset($output[0])) {
                            $osTz = trim($output[0]);
                            $tzMap = [
                                'SE Asia Standard Time' => 'Asia/Jakarta',
                                'Singapore Standard Time' => 'Asia/Singapore',
                                'China Standard Time' => 'Asia/Shanghai',
                                'W. Europe Standard Time' => 'Europe/Berlin', 
                                'UTC' => 'UTC',
                            ];
                            
                            if (isset($tzMap[$osTz])) {
                                return $tzMap[$osTz];
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    // Silent fail
                }
    
                return $defaultTz;
            });
        }

        config(['app.timezone' => $timezone]);
        date_default_timezone_set($timezone);

        // Remove Vite::prefetch as it might cause IO blocking on slow HDDs
        // Vite::prefetch(concurrency: 3);
    }
}
