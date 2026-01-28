<?php

namespace App\Http\Middleware;

use App\Models\SecurityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DetectSecurityThreats
{
    /**
     * Suspicious patterns untuk detect serangan
     */
    private $sqlInjectionPatterns = [
        '/(\bunion\b.*\bselect\b)/i',
        '/(\bor\b\s+1\s*=\s*1)/i',
        '/(sleep\(|benchmark\(|waitfor\s+delay)/i',
        '/(\bdrop\b|\bdelete\b|\btruncate\b).*\btable\b/i',
        '/(exec\(|execute\(|system\()/i',
    ];

    private $xssPatterns = [
        '/<script[^>]*>.*?<\/script>/i',
        '/<iframe[^>]*>/i',
        '/javascript:/i',
        '/on\w+\s*=/i', // onclick, onload, etc
        '/<img[^>]+src[^>]*>/i',
    ];

    private $pathTraversalPatterns = [
        '/\.\.\//',
        '/\.\.\\\\/',
        '/%2e%2e/',
        '/etc\/passwd/',
        '/win\.ini/',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // 1. Check for SQL Injection
            if ($this->detectSQLInjection($request)) {
                $this->respondBlocked($request, 'SQL Injection detected');
            }

            // 2. Check for XSS
            if ($this->detectXSS($request)) {
                $this->respondBlocked($request, 'XSS attempt detected');
            }

            // 3. Check for Path Traversal (CRITICAL)
            if ($this->detectPathTraversal($request)) {
                $this->activateLockdown($request, 'Path Traversal Attack Detected');
                $this->respondBlocked($request, 'System Lockdown Initiated due to Critical Threat');
            }

            // 4. Check for Brute Force (multiple failed logins)
            if ($this->detectBruteForce($request)) {
                // Brute force logic
            }

            // 5. Check for unauthorized access attempts
            if ($this->detectUnauthorizedAccess($request)) {
                 $this->respondBlocked($request, 'Unauthorized Access Attempt');
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Security Middleware Error: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
        }

        return $next($request);
    }

    private function respondBlocked($request, $message)
    {
        abort(403, "Security Alert: " . $message . ". Your IP has been logged.");
    }

    private function activateLockdown($request, $reason)
    {
        // 1. Enable Maintenance Mode via Database (Direct Query for Stability)
        try {
            \Illuminate\Support\Facades\DB::table('app_settings')->updateOrInsert(
                ['key' => 'maintenance_mode'],
                ['value' => '1', 'updated_at' => now()]
            );
            
            \Illuminate\Support\Facades\DB::table('app_settings')->updateOrInsert(
                ['key' => 'maintenance_message'],
                ['value' => 'Sistem dikunci otomatis karena terdeteksi ancaman keamanan: ' . $reason, 'updated_at' => now()]
            );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Failed to enable DB maintenance mode: " . $e->getMessage());
        }

        // 2. Log Critical Event
        try {
            SecurityLog::logEvent(
                'system_lockdown',
                "EMERGENCY: $reason. System putting into maintenance mode.",
                'critical',
                ['ip' => $request->ip(), 'user_agent' => $request->userAgent()]
            );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("SecurityLog Failed: " . $e->getMessage());
        }
    }

    /**
     * Detect SQL Injection attempts
     */
    private function detectSQLInjection(Request $request)
    {
        $inputs = array_merge($request->all(), [$request->getRequestUri()]);
        
        foreach ($inputs as $key => $value) {
            if (!is_string($value)) continue;

            foreach ($this->sqlInjectionPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    SecurityLog::logEvent(
                        'sql_injection',
                        'Potential SQLi: ' . substr($value, 0, 100),
                        'high',
                        ['blocked' => true]
                    );
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Detect XSS attempts
     */
    private function detectXSS(Request $request)
    {
        $inputs = $request->all();

        foreach ($inputs as $key => $value) {
            if (!is_string($value)) continue;

            foreach ($this->xssPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    SecurityLog::logEvent(
                        'xss',
                        'Potential XSS: ' . substr($value, 0, 100),
                        'medium',
                        ['blocked' => true]
                    );
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Detect Path Traversal attempts
     */
    private function detectPathTraversal(Request $request)
    {
        $url = $request->getRequestUri();

        foreach ($this->pathTraversalPatterns as $pattern) {
            if (preg_match($pattern, $url)) {
                 SecurityLog::logEvent(
                    'path_traversal',
                    'Critical Path Traversal Attempt: ' . $url,
                    'critical',
                    ['blocked' => true]
                );
                return true;
            }
        }
        return false;
    }

    /**
     * Detect Brute Force attempts
     */
    private function detectBruteForce(Request $request)
    {
        // Handled by LoginRequest RateLimiter primarily. 
        // Here we just monitor general high volume from single IP?
        return false; 
    }

    /**
     * Detect Unauthorized Access
     */
    private function detectUnauthorizedAccess(Request $request)
    {
        // Detect access to sensitive files
        $sensitivePaths = [
            '/.env',
            '/.git',
            '/backup',
            '/phpmyadmin',
            '/wp-admin',
            '/composer.json',
            '/package.json'
        ];

        $url = $request->getRequestUri();

        foreach ($sensitivePaths as $path) {
            if (str_contains(strtolower($url), $path)) {
                SecurityLog::logEvent(
                    'unauthorized_access',
                    "Sensitive Path Access Blocked: {$path}",
                    'high',
                    ['blocked' => true]
                );
                return true;
            }
        }
        return false;
    }
}
