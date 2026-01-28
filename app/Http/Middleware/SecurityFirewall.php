<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Models\SecurityLog;

class SecurityFirewall
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();

        // 1. Skip check for local/internal IPs
        if (in_array($ip, ['127.0.0.1', '::1', 'localhost']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
            return $next($request);
        }

        // 2. Check Whitelist (Institutions/Registered Entities)
        $isWhitelisted = Cache::remember('ip_whitelist_' . $ip, 3600, function () use ($ip) {
            return \App\Models\IpWhitelist::where('ip_address', $ip)->exists();
        });
        
        if ($isWhitelisted) {
            return $next($request);
        }

        // 3. GeoIP & VPN Detection (Cached for 24 hours per IP)
        $securityData = Cache::remember('ip_security_' . $ip, 86400, function () use ($ip) {
            try {
                // Using ip-api.com (Pro for better limits, but free version for demo)
                // Fields: status, country, countryCode, proxy (VPN), hosting (Data center)
                $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}?fields=status,country,countryCode,proxy,hosting");
                
                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                // fallback to allow if API is down to avoid blocking legitimate users
                return ['status' => 'fail', 'message' => 'api_down'];
            }
            return null;
        });

        if ($securityData && $securityData['status'] === 'success') {
            $countryCode = $securityData['countryCode'] ?? 'ID';
            $isProxy = $securityData['proxy'] ?? false;
            $isHosting = $securityData['hosting'] ?? false; // Usually VPNs/Bots use hosting

            // A. Block VPN / Proxy
            if ($isProxy || $isHosting) {
                SecurityLog::logEvent(
                    'vpn_detected',
                    "User blocked due to VPN/Proxy detection. IP: {$ip}",
                    'high',
                    ['geo' => $securityData]
                );

                return $this->blockResponse('VPN/Proxy detected. Please disable VPN to access SIDADU.');
            }

            // B. Block Outside Country (Default: Indonesia / ID)
            $allowedCountry = config('app.allowed_country', 'ID');
            if ($countryCode !== $allowedCountry) {
                SecurityLog::logEvent(
                    'geo_block',
                    "User blocked due to Geo-location restriction. Country: {$securityData['country']} ({$countryCode}). IP: {$ip}",
                    'high',
                    ['geo' => $securityData]
                );

                return $this->blockResponse("SIDADU hanya dapat diakses dari dalam wilayah Indonesia. Negara terdeteksi: {$securityData['country']}");
            }
        }

        return $next($request);
    }

    protected function blockResponse($message)
    {
        return response()->view('errors.security_block', [
            'message' => $message
        ], 403);
    }
}
