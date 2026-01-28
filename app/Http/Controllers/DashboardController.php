<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $schoolProfile = SchoolProfile::first();
        
        // 1. Real Stats (Cached for 10 minutes)
        // Optimasi: Cache statistik selama 10 menit agar tidak memberatkan database
        $stats = \Illuminate\Support\Facades\Cache::remember('dashboard_stats', 600, function () {
            // Gunakan conditional aggregation untuk mengurangi round-trip database
            
            // Statistik Siswa (Single Query)
            $studentStats = \App\Models\Student::selectRaw("
                count(*) as total,
                count(case when status = 'aktif' then 1 end) as aktif,
                count(case when status = 'lulus' then 1 end) as lulus,
                count(case when status = 'mutasi' then 1 end) as mutasi,
                count(case when status = 'keluar' then 1 end) as keluar,
                count(case when status = 'aktif' and jenis_kelamin = 'L' then 1 end) as aktif_L,
                count(case when status = 'aktif' and jenis_kelamin = 'P' then 1 end) as aktif_P
            ")->first();

            // Statistik GTK (Single Query)
            $gtkStats = \App\Models\Gtk::selectRaw("
                count(case when jenis_kelamin = 'L' then 1 end) as L,
                count(case when jenis_kelamin = 'P' then 1 end) as P
            ")->first();

            return [
                'total_siswa' => $studentStats->aktif,
                'total_guru' => User::role('Guru')->count(),
                'surat_keluar' => \App\Models\SuratKeluar::count(),
                'surat_masuk' => \App\Models\SuratMasuk::count(),
                'total_kelas' => \App\Models\Kelas::count(),
                'total_alumni' => $studentStats->lulus,
                
                // Gender Chart Data
                'chart_data' => [
                    'siswa' => [
                        'L' => $studentStats->aktif_L,
                        'P' => $studentStats->aktif_P,
                    ],
                    'guru' => [
                        'L' => $gtkStats->L,
                        'P' => $gtkStats->P,
                    ]
                ],
                
                // Student Status Distribution
                'siswa_status' => [
                    'aktif' => $studentStats->aktif,
                    'mutasi' => $studentStats->mutasi,
                    'lulus' => $studentStats->lulus,
                    'keluar' => $studentStats->keluar,
                ],
            ];
        });

        // 2. Weather Data (Cached for 30 minutes)
        // Separated from stats cache to handle failures independently and fix scope issues
        // 2. Weather Data (Cached for 30 minutes)
        $weather = \Illuminate\Support\Facades\Cache::remember('dashboard_weather_' . ($schoolProfile->kota ?? 'default'), 1800, function () use ($schoolProfile) {
            try {
                $locationName = $schoolProfile->kota ?? 'Jakarta';
                
                // Simple City Coordinate Map (Indonesia Major Cities)
                $cityCoords = [
                    'jakarta' => ['lat' => -6.2088, 'lon' => 106.8456],
                    'bogor' => ['lat' => -6.5976, 'lon' => 106.7996],
                    'depok' => ['lat' => -6.4025, 'lon' => 106.7942],
                    'tangerang' => ['lat' => -6.1783, 'lon' => 106.6319],
                    'bekasi' => ['lat' => -6.2383, 'lon' => 106.9756],
                    'bandung' => ['lat' => -6.9175, 'lon' => 107.6191],
                    'surabaya' => ['lat' => -7.2575, 'lon' => 112.7521],
                    'semarang' => ['lat' => -6.9667, 'lon' => 110.4167],
                    'yogyakarta' => ['lat' => -7.7956, 'lon' => 110.3695],
                    'solo' => ['lat' => -7.5711, 'lon' => 110.8228],
                    'malang' => ['lat' => -7.9666, 'lon' => 112.6326],
                    'denpasar' => ['lat' => -8.6705, 'lon' => 115.2126],
                    'medan' => ['lat' => 3.5952, 'lon' => 98.6722],
                    'makassar' => ['lat' => -5.1477, 'lon' => 119.4328],
                    'palembang' => ['lat' => -2.9909, 'lon' => 104.7567],
                    'batam' => ['lat' => 1.0456, 'lon' => 104.0305],
                    'pekanbaru' => ['lat' => 0.5071, 'lon' => 101.4478],
                    'banjarmasin' => ['lat' => -3.3194, 'lon' => 114.5908],
                    'pontianak' => ['lat' => -0.0263, 'lon' => 109.3425],
                    'manado' => ['lat' => 1.4748, 'lon' => 124.8421],
                    'padang' => ['lat' => -0.9471, 'lon' => 100.4172],
                    'lampung' => ['lat' => -5.3971, 'lon' => 105.2668],
                ];

                // Normalize input: remove 'Kota', 'Kabupaten', extra spaces, lowercase
                $normalizedCity = strtolower(trim(str_replace(['Kota', 'Kabupaten', 'Kab.'], '', $locationName)));
                
                // Fuzzy search or exact match
                $coords = $cityCoords['jakarta']; // Default
                foreach ($cityCoords as $key => $val) {
                    if (str_contains($normalizedCity, $key)) {
                        $coords = $val;
                        break;
                    }
                }

                // Fetch real-time weather from Open-Meteo
                $response = \Illuminate\Support\Facades\Http::timeout(3)->get("https://api.open-meteo.com/v1/forecast", [
                    'latitude' => $coords['lat'],
                    'longitude' => $coords['lon'],
                    'current' => 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
                    'timezone' => config('app.timezone', 'Asia/Jakarta'),
                ]);

                if ($response->successful()) {
                    $data = $response->json()['current'];
                    return [
                        'temp' => round($data['temperature_2m']),
                        'condition_code' => $data['weather_code'],
                        'humidity' => $data['relative_humidity_2m'],
                        'feel' => round($data['apparent_temperature']),
                        'wind' => $data['wind_speed_10m'],
                        'is_day' => $data['is_day'],
                        'location' => $locationName,
                        'updated_at' => now()->format('H:i')
                    ];
                }
            } catch (\Exception $e) {
                 // Silent fail 
            }
            return null;
        });

        // Active Academic Year
        $activeYear = \App\Models\TahunAjaran::where('is_active', true)->first();

        // Security Stats (for Admin only)
        $securityStats = null;
        $recentThreats = collect();
        
        if (auth()->user()->can('view.settings')) {
            $securityStats = [
                'total_today' => \App\Models\SecurityLog::whereDate('created_at', today())->count(),
                'critical_threats' => \App\Models\SecurityLog::where('severity', 'critical')
                    ->where('created_at', '>=', now()->subDay())
                    ->count(),
            ];
            
            $recentThreats = \App\Models\SecurityLog::with('user')
                ->orderByDesc('detected_at')
                ->limit(5)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'schoolProfile' => $schoolProfile,
            'stats' => $stats,
            'weather' => $weather, // Pass weather separately
            'activeYear' => $activeYear,
            'securityStats' => $securityStats,
            'recentThreats' => $recentThreats,
        ]);
    }

    /**
     * Update user dashboard layout preference.
     */
    public function updateLayout(Request $request)
    {
        $request->validate([
            'layout' => 'required|array',
        ]);

        $user = $request->user();
        $user->dashboard_layout = $request->layout;
        $user->save();

        return back()->with('success', 'Dashboard layout saved successfully');
    }
}
