<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\AppSetting;
use Inertia\Inertia;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for Login/Logout routes to allow Admin login
        if ($request->is('login') || $request->is('logout') || $request->is('admin/*')) {
             // Let user proceed, but we check role inside controller or here?
             // Actually, we should allow login page always.
             return $next($request);
        }
        
        // Fetch Maintenance Status from Key-Value Settings
        $maintenanceMode = \App\Models\AppSetting::where('key', 'maintenance_mode')->value('value');
        
        if ($maintenanceMode === '1') {
            // If user is logged in
            if (auth()->check()) {
                // Allow Admin Sekolah and Kepala Sekolah
                if (auth()->user()->hasRole(['Admin Sekolah', 'Kepala Sekolah'])) {
                    return $next($request);
                }
            }
            
            $message = \App\Models\AppSetting::where('key', 'maintenance_message')->value('value');
            $endTime = \App\Models\AppSetting::where('key', 'maintenance_end_time')->value('value');

            // For others or guests, render Maintenance Page
            // If request expects JSON (Inertia), render component
            return Inertia::render('Maintenance', [
                'message' => $message,
                'end_time' => $endTime
            ])->toResponse($request)->setStatusCode(503);
        }

        return $next($request);
    }
}
