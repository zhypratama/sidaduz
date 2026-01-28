<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\CheckMaintenanceMode::class, // Custom Maintenance Mode
            \App\Http\Middleware\SecurityHeaders::class, // Security Headers
            
            // Advanced Security Layers
            \App\Http\Middleware\NetworkThreatDetector::class, // Layer 3: Tool Detection & Port Scanning
            \App\Http\Middleware\BruteForceProtection::class, // Layer 2: Brute Force & Rate Limiting
            \App\Http\Middleware\AdvancedInputSanitizer::class, // Layer 1: Input Validation
            
            \App\Http\Middleware\DetectSecurityThreats::class, // Security Monitoring
            \App\Http\Middleware\CheckBlockedIp::class, // Blocked IP Check
            \App\Http\Middleware\SecurityFirewall::class, // VPN & Geo Blocking
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '/whatsapp/webhook', // Exclude Webhook from CSRF
            'wa-webhook', 
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
