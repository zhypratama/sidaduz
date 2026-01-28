<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'roles' => $request->user()->roles->pluck('name'),
                    // Optimasi: Cache permissions untuk request ini (atau gunakan Session)
                    // Disini kita gunakan Cache Memory sederhana (via static variable di Model User tidak efektif antar request)
                    // Jadi kita tetap query tapi pastikan Eager Loading atau Cache.
                    // Untuk simplifikasi dan efisiensi ekstrim tanpa Session Complexity: 
                    // Kita gunakan 'getAllPermissions' yang sudah di-cache oleh Spatie Permission jika kita men-set up cache expiration.
                    // Namun, untuk memastikan tidak N+1, kita bisa manual cache di sini.
                    
                    'permissions' => \Illuminate\Support\Facades\Cache::remember('user_perms_' . $request->user()->id, 300, function () use ($request) {
                         return $request->user()->getAllPermissions()->pluck('name');
                    }),
                ]) : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'school_profile' => \Illuminate\Support\Facades\Cache::remember('school_profile', 3600, function () {
                return \App\Models\SchoolProfile::first();
            }),
            'base_url' => url('/'),
            'footer' => [
                'text' => 'Made By Fanzhy Build with Love For Support One Data Education',
                'year' => date('Y'),
                'version' => 'v1.0.0',
                'framework' => 'Laravel v12.46.0',
                'check' => hash('sha256', 'Made By Fanzhy Build with Love For Support One Data Education'), // Integritas check
            ],
            'weather' => \Illuminate\Support\Facades\Cache::remember('global_weather', 1800, function () {
                try {
                    // Fetch real-time weather (Jakarta Default)
                    $lat = -6.2088; $lon = 106.8456;
                    $profile = \App\Models\SchoolProfile::first();
                    $locationName = $profile->kota ?? 'Jakarta';

                    $response = \Illuminate\Support\Facades\Http::timeout(1)->get("https://api.open-meteo.com/v1/forecast", [
                        'latitude' => $lat,
                        'longitude' => $lon,
                        'current' => 'temperature_2m,relative_humidity_2m,weather_code,is_day',
                        'timezone' => config('app.timezone', 'Asia/Jakarta'),
                    ]);

                    if ($response->successful()) {
                        $data = $response->json()['current'];
                        return [
                            'temp' => round($data['temperature_2m']),
                            'condition_code' => $data['weather_code'],
                            'is_day' => $data['is_day'],
                            'location' => $locationName,
                        ];
                    }
                } catch (\Exception $e) {}
                return null;
            }),

            'notifications' => function () use ($request) {
                if (!$request->user()) return [];
                
                return [
                    'security_alert_count' => ($request->user()->can('view.settings')) 
                        ? \App\Models\SecurityLog::where('created_at', '>=', now()->subHours(24))
                            ->where('severity', 'critical')
                            ->count() 
                        : 0
                ];
            },
        ];
    }
}
