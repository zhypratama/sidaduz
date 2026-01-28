<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SecurityLog;
use App\Models\BlockedIp;

class NetworkThreatDetector
{
    /**
     * Detect penetration testing tools and malicious scanners
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for whitelisted IPs
        if ($this->isWhitelisted($request->ip())) {
            return $next($request);
        }

        $userAgent = $request->userAgent() ?? '';
        $ip = $request->ip();

        // 1. Detect Penetration Testing Tools
        if ($this->detectPenTestingTools($userAgent)) {
            $this->logAndBlock($request, 'pentesting_tool', 'Penetration testing tool detected: ' . $userAgent);
            abort(403, 'Security tool detected');
        }

        // 2. Detect Automated Scanners
        if ($this->detectAutomatedScanners($userAgent)) {
            $this->logAndBlock($request, 'automated_scanner', 'Automated scanner detected: ' . $userAgent);
            abort(403, 'Automated scanner detected');
        }

        // 3. Detect Port Scanning (rapid sequential requests)
        if ($this->detectPortScanning($request, $ip)) {
            $this->logAndBlock($request, 'port_scanning', 'Port scanning activity detected');
            abort(403, 'Port scanning detected');
        }

        // 4. Detect Suspicious Patterns
        if ($this->detectSuspiciousPatterns($request)) {
            $this->logAndBlock($request, 'suspicious_pattern', 'Suspicious request pattern detected');
            abort(403, 'Suspicious activity detected');
        }

        return $next($request);
    }

    private function detectPenTestingTools(string $userAgent): bool
    {
        $tools = [
            // Web Application Scanners
            'burp',
            'burpsuite',
            'owasp zap',
            'zaproxy',
            'sqlmap',
            'nikto',
            'acunetix',
            'netsparker',
            'appscan',
            'w3af',
            'webscarab',
            
            // Network Scanners
            'nmap',
            'masscan',
            'zmap',
            'nessus',
            'openvas',
            
            // Exploitation Frameworks
            'metasploit',
            'msfconsole',
            'beef',
            'cobalt strike',
            
            // Fuzzing Tools
            'wfuzz',
            'ffuf',
            'dirbuster',
            'dirb',
            'gobuster',
            
            // Other Tools
            'hydra',
            'medusa',
            'john',
            'hashcat',
            'wireshark',
            'ettercap',
        ];

        $userAgentLower = strtolower($userAgent);
        
        foreach ($tools as $tool) {
            if (str_contains($userAgentLower, $tool)) {
                return true;
            }
        }

        return false;
    }

    private function detectAutomatedScanners(string $userAgent): bool
    {
        $patterns = [
            '/bot/i',
            '/crawler/i',
            '/spider/i',
            '/scraper/i',
            '/curl/i',
            '/wget/i',
            '/python-requests/i',
            '/go-http-client/i',
            '/java\//i',
            '/perl/i',
            '/ruby/i',
            '/php/i',
        ];

        // Allow legitimate bots (Google, Bing, etc.)
        $allowedBots = [
            'googlebot',
            'bingbot',
            'slurp', // Yahoo
            'duckduckbot',
            'baiduspider',
            'yandexbot',
        ];

        $userAgentLower = strtolower($userAgent);
        
        foreach ($allowedBots as $bot) {
            if (str_contains($userAgentLower, $bot)) {
                return false;
            }
        }

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $userAgent)) {
                return true;
            }
        }

        return false;
    }

    private function detectPortScanning(Request $request, string $ip): bool
    {
        $key = 'port_scan:' . $ip;
        $requests = \Illuminate\Support\Facades\Cache::get($key, []);
        
        // Add current request
        $requests[] = [
            'url' => $request->fullUrl(),
            'time' => now()->timestamp
        ];

        // Keep only last 60 seconds
        $requests = array_filter($requests, function($req) {
            return $req['time'] > (now()->timestamp - 60);
        });

        \Illuminate\Support\Facades\Cache::put($key, $requests, 120);

        // If more than 20 different URLs in 60 seconds, it's likely port scanning
        $uniqueUrls = count(array_unique(array_column($requests, 'url')));
        
        return $uniqueUrls > 20;
    }

    private function detectSuspiciousPatterns(Request $request): bool
    {
        $url = $request->fullUrl();
        
        // Common admin panel paths (honeypot detection)
        $suspiciousPaths = [
            '/admin.php',
            '/phpmyadmin',
            '/wp-admin',
            '/wp-login.php',
            '/administrator',
            '/.env',
            '/.git',
            '/config.php',
            '/setup.php',
            '/install.php',
        ];

        foreach ($suspiciousPaths as $path) {
            if (str_contains($url, $path)) {
                return true;
            }
        }

        return false;
    }

    private function logAndBlock(Request $request, string $type, string $description): void
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

        // Auto-block IP
        BlockedIp::updateOrCreate(
            ['ip_address' => $request->ip()],
            ['reason' => $description, 'blocked_at' => now()]
        );
    }

    private function isWhitelisted(string $ip): bool
    {
        return \App\Models\IpWhitelist::where('ip_address', $ip)->exists();
    }
}
