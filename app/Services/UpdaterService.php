<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;

class UpdaterService
{
    /**
     * Mengecek apakah ada pembaruan di GitHub
     */
    public static function checkForUpdates()
    {
        $repo = env('GITHUB_REPO_URL');
        $branch = env('GITHUB_BRANCH', 'main');
        
        if (!$repo) return ['available' => false, 'message' => 'Repo URL tidak dikonfigurasi.'];

        try {
            // Kita gunakan API GitHub untuk cek commit terakhir
            // Format URL: https://api.github.com/repos/{user}/{repo}/commits/{branch}
            $apiPath = str_replace('https://github.com/', '', $repo);
            $apiUrl = "https://api.github.com/repos/{$apiPath}/commits/{$branch}";

            $response = Http::withHeaders([
                'User-Agent' => 'SIDADU-Updater'
            ])->get($apiUrl);

            if ($response->successful()) {
                $latestCommit = $response->json();
                $lastSha = cache('last_update_sha');
                
                return [
                    'available' => ($lastSha !== $latestCommit['sha']),
                    'latest_version' => substr($latestCommit['sha'], 0, 7),
                    'message' => $latestCommit['commit']['message'],
                    'date' => $latestCommit['commit']['author']['date'],
                    'sha' => $latestCommit['sha']
                ];
            }
        } catch (\Exception $e) {
            Log::error('UPDATER_CHECK_FAILED: ' . $e->getMessage());
        }

        return ['available' => false, 'error' => true];
    }

    /**
     * Menjalankan proses update (Git Pull + Migrate + Clear Cache)
     */
    public static function runUpdate()
    {
        $log = [];
        try {
            // 1. Git Pull
            $output = [];
            exec('git pull origin ' . env('GITHUB_BRANCH', 'main') . ' 2>&1', $output, $result);
            $log[] = "--- GIT PULL ---\n" . implode("\n", $output);
            
            if ($result !== 0) throw new \Exception("Gagal melakukan git pull.");

            // 2. Migrate
            Artisan::call('migrate --force');
            $log[] = "\n--- DATABASE MIGRATE ---\n" . Artisan::output();

            // 3. Clear Cache
            Artisan::call('optimize:clear');
            $log[] = "\n--- CACHE CLEAR ---\n" . Artisan::output();

            // Simpan SHA terakhir
            $latest = self::checkForUpdates();
            if (isset($latest['sha'])) {
                cache()->forever('last_update_sha', $latest['sha']);
            }

            return ['success' => true, 'log' => implode("\n", $log)];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage(), 'log' => implode("\n", $log)];
        }
    }
}
