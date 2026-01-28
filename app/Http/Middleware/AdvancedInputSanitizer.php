<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SecurityLog;

class AdvancedInputSanitizer
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

        // 1. SQL Injection Detection
        if ($this->detectSQLInjection($request)) {
            $this->logThreat($request, 'sql_injection_advanced', 'Advanced SQL Injection attempt detected');
            abort(403, 'SQL Injection detected');
        }

        // 2. XSS Detection (Advanced)
        if ($this->detectXSS($request)) {
            $this->logThreat($request, 'xss_advanced', 'Advanced XSS attempt detected');
            abort(403, 'XSS attack detected');
        }

        // 3. Command Injection Detection
        if ($this->detectCommandInjection($request)) {
            $this->logThreat($request, 'command_injection', 'Command Injection attempt detected');
            abort(403, 'Command Injection detected');
        }

        // 4. LDAP Injection Detection
        if ($this->detectLDAPInjection($request)) {
            $this->logThreat($request, 'ldap_injection', 'LDAP Injection attempt detected');
            abort(403, 'LDAP Injection detected');
        }

        // 5. XML Injection Detection
        if ($this->detectXMLInjection($request)) {
            $this->logThreat($request, 'xml_injection', 'XML Injection attempt detected');
            abort(403, 'XML Injection detected');
        }

        return $next($request);
    }

    private function detectSQLInjection(Request $request): bool
    {
        $patterns = [
            // Classic SQL Injection
            '/(\bUNION\b.*\bSELECT\b)/i',
            '/(\bSELECT\b.*\bFROM\b.*\bWHERE\b)/i',
            '/(\bINSERT\b.*\bINTO\b.*\bVALUES\b)/i',
            '/(\bUPDATE\b.*\bSET\b)/i',
            '/(\bDELETE\b.*\bFROM\b)/i',
            '/(\bDROP\b.*\b(TABLE|DATABASE)\b)/i',
            
            // Advanced SQL Injection
            '/(\bEXEC\b|\bEXECUTE\b)/i',
            '/(\bxp_cmdshell\b)/i',
            '/(\bsp_executesql\b)/i',
            '/(;|\||&&)\s*(DROP|ALTER|CREATE|TRUNCATE)/i',
            
            // Boolean-based blind SQL injection
            '/(\bAND\b|\bOR\b)\s+\d+\s*=\s*\d+/i',
            '/(\'\s*OR\s*\'1\'\s*=\s*\'1)/i',
            '/(\'\s*OR\s*1\s*=\s*1)/i',
            
            // Time-based blind SQL injection
            '/(\bSLEEP\b|\bBENCHMARK\b|\bWAITFOR\b)/i',
            
            // SQL Comments
            '/(--|\#|\/\*|\*\/)/i',
            
            // Hex encoding
            '/(0x[0-9a-f]+)/i',
            
            // INFORMATION_SCHEMA
            '/(\bINFORMATION_SCHEMA\b)/i',
        ];

        return $this->checkPatterns($request, $patterns);
    }

    private function detectXSS(Request $request): bool
    {
        $patterns = [
            // Script tags
            '/(<script[^>]*>.*?<\/script>)/is',
            '/(<script[^>]*>)/i',
            
            // Event handlers
            '/(on\w+\s*=)/i',
            
            // JavaScript protocol
            '/(javascript:)/i',
            '/(vbscript:)/i',
            '/(data:text\/html)/i',
            
            // Encoded attacks
            '/(%3C|&lt;)script/i',
            '/(%3E|&gt;)/i',
            
            // SVG attacks
            '/(<svg[^>]*>)/i',
            
            // IMG attacks
            '/(<img[^>]*onerror)/i',
            '/(<img[^>]*src\s*=\s*["\']?javascript:)/i',
            
            // Iframe attacks
            '/(<iframe[^>]*>)/i',
            
            // Object/Embed attacks
            '/(<object[^>]*>)/i',
            '/(<embed[^>]*>)/i',
            
            // Meta refresh
            '/(<meta[^>]*http-equiv[^>]*refresh)/i',
            
            // Base64 encoded
            '/(base64,)/i',
        ];

        return $this->checkPatterns($request, $patterns);
    }

    private function detectCommandInjection(Request $request): bool
    {
        $patterns = [
            // Shell commands
            '/(\$\(|\`)/i', // Only block $(...) and backticks globally
            '/(\bcat\b|\bls\b|\bwhoami\b|\bpwd\b)/i',
            '/(\bwget\b|\bcurl\b|\bnc\b|\bnetcat\b)/i',
            '/(\brm\b|\bmv\b|\bcp\b|\bchmod\b)/i',
            
            // Windows commands
            '/(\bcmd\b|\bpowershell\b|\btasklist\b)/i',
            
            // Backticks
            '/(`[^`]*`)/i',
            
            // Command substitution
            '/(\$\([^\)]*\))/i',
        ];

        return $this->checkPatterns($request, $patterns);
    }
    private function detectLDAPInjection(Request $request): bool
    {
        $patterns = [
            // Only block LDAP specific structures, not single chars like ( or )
            '/(\(\|)/i',  // (|
            '/(\(&)/i',   // (&
            '/(objectClass=\*)/i',
            '/(\badmin\b.*\bpass\b)/i', // Basic heuristic
        ];

        return $this->checkPatterns($request, $patterns);
    }

    private function detectXMLInjection(Request $request): bool
    {
        $patterns = [
            '/(<!ENTITY)/i',
            '/(<!DOCTYPE)/i',
            '/(<!\[CDATA\[)/i',
        ];

        return $this->checkPatterns($request, $patterns);
    }

    private function checkPatterns(Request $request, array $patterns): bool
    {
        // Exclude sensitive fields that might contain special characters (passwords, tokens)
        $inputs = $request->except(['password', 'password_confirmation', '_token', 'current_password', 'new_password']);
        
        // Check keys to catch attacks in parameter names
        $keys = array_keys($inputs);
        foreach ($keys as $key) {
             foreach ($patterns as $pattern) {
                if (preg_match($pattern, $key)) {
                    return true;
                }
            }
        }

        // Check inputs + headers
        $inputs = array_merge(
            $inputs,
            ['user_agent' => $request->userAgent()],
            ['referer' => $request->header('referer')]
        );

        foreach ($inputs as $key => $value) {
            if (is_string($value)) {
                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        return true;
                    }
                }
            } elseif (is_array($value)) {
                // Recursive check for arrays
                foreach ($value as $subValue) {
                    if (is_string($subValue)) {
                        foreach ($patterns as $pattern) {
                            if (preg_match($pattern, $subValue)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    private function isWhitelisted(string $ip): bool
    {
        return \App\Models\IpWhitelist::where('ip_address', $ip)->exists();
    }

    private function logThreat(Request $request, string $type, string $description): void
    {
        SecurityLog::logEvent(
            $type,
            $description . ": " . $request->fullUrl(),
            'critical',
            [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => $request->all()
            ]
        );
    }
}
