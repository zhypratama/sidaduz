<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\SecurityLog;
use App\Models\BlockedIp;

class BruteForceProtection
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for whitelisted IPs
        if ($this->isWhitelisted($request->ip())) {
            return $next($request);
        }

        $ip = $request->ip();

        // 1. Check if IP is already blocked
        if ($this->isBlocked($ip)) {
            $this->logThreat($request, 'blocked_ip_attempt', 'Blocked IP attempted access');
            abort(403, 'Your IP has been blocked due to suspicious activity');
        }

        // 2. Login attempt rate limiting (5 attempts per 15 minutes)
        if ($request->is('login') && $request->isMethod('POST')) {
            $key = 'login_attempts:' . $ip;
            
            if (RateLimiter::tooManyAttempts($key, 5)) {
                $this->handleBruteForce($request, $ip);
                abort(429, 'Too many login attempts. Please try again in 12 hours.');
            }

            RateLimiter::hit($key, 43200); // 12 hours
        }

        // 3. Credential Stuffing Detection (multiple different usernames from same IP)
        if ($request->is('login') && $request->isMethod('POST')) {
            $this->detectCredentialStuffing($request, $ip);
        }

        // 4. General request rate limiting (100 requests per minute)
        $generalKey = 'requests:' . $ip;
        if (RateLimiter::tooManyAttempts($generalKey, 100)) {
            $this->handleDDoS($request, $ip);
            abort(429, 'Too many requests');
        }

        RateLimiter::hit($generalKey, 60);

        return $next($request);
    }

    private function detectCredentialStuffing(Request $request, string $ip): void
    {
        $username = $request->input('email') ?? $request->input('username');
        
        if (!$username) return;

        $key = 'credential_stuffing:' . $ip;
        $usernames = Cache::get($key, []);
        
        if (!in_array($username, $usernames)) {
            $usernames[] = $username;
            Cache::put($key, $usernames, 43200); // 12 hours
        }

        // If more than 5 different usernames in 15 minutes, it's credential stuffing
        if (count($usernames) > 5) {
            $this->logThreat($request, 'credential_stuffing', 'Credential stuffing attack detected: ' . count($usernames) . ' different usernames');
            
            // Block IP immediately
            BlockedIp::updateOrCreate(
                ['ip_address' => $ip],
                ['reason' => 'Credential Stuffing Attack', 'blocked_at' => now()]
            );

            abort(403, 'Suspicious activity detected. Your IP has been blocked.');
        }
    }

    private function handleBruteForce(Request $request, string $ip): void
    {
        $this->logThreat($request, 'brute_force', 'Brute force attack detected');
        
        // Block IP after 5 failed attempts
        BlockedIp::updateOrCreate(
            ['ip_address' => $ip],
            ['reason' => 'Brute Force Attack', 'blocked_at' => now()]
        );
    }

    private function handleDDoS(Request $request, string $ip): void
    {
        $this->logThreat($request, 'ddos_attempt', 'Potential DDoS attack detected: >100 req/min');
        
        // Temporary block for 1 hour
        Cache::put('temp_block:' . $ip, true, 3600);
    }

    private function isBlocked(string $ip): bool
    {
        // Check permanent block
        if (BlockedIp::where('ip_address', $ip)->exists()) {
            return true;
        }

        // Check temporary block
        return Cache::has('temp_block:' . $ip);
    }

    private function isWhitelisted(string $ip): bool
    {
        return \App\Models\IpWhitelist::where('ip_address', $ip)->exists();
    }

    private function logThreat(Request $request, string $type, string $description): void
    {
        SecurityLog::logEvent(
            $type,
            $description,
            'critical',
            [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl()
            ]
        );
    }
}
