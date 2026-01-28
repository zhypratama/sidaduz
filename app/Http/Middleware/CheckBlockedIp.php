<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\BlockedIp;
use Illuminate\Support\Facades\Cache;

class CheckBlockedIp
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();

        // Optimized check using Cache
        $isBlocked = Cache::remember('blocked_ip_' . $ip, 3600, function () use ($ip) {
            return BlockedIp::where('ip_address', $ip)
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                })->exists();
        });

        if ($isBlocked) {
            // Log access attempt from blocked IP
            \App\Models\SecurityLog::logEvent(
                'blocked_ip_access_attempt',
                "Attempted access from blocked IP: {$ip}",
                'medium',
                ['blocked' => true]
            );

            abort(403, 'Akses Anda diblokir karena alasan keamanan. Silakan hubungi administrator.');
        }

        return $next($request);
    }
}
