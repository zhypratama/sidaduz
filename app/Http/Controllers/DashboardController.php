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
        
        // Real Stats
        $stats = [
            'total_siswa' => User::role('Siswa')->count(),
            'total_guru' => User::role('Guru')->count(),
            'surat_keluar' => \App\Models\SuratKeluar::count(),
            'surat_masuk' => \App\Models\SuratMasuk::count(),
            // 'total_kelas' => \App\Models\Kelas::count(), // If exists
            // 'total_alumni' => User::role('Alumni')->count(),
            
            // Gender Chart (GTK - Since Siswa data not ready)
            'chart_data' => [
                'pria' => \App\Models\Gtk::where('jenis_kelamin', 'L')->count(),
                'wanita' => \App\Models\Gtk::where('jenis_kelamin', 'P')->count(),
            ]
        ];

        return Inertia::render('Dashboard', [
            'schoolProfile' => $schoolProfile,
            'stats' => $stats
        ]);
    }
}
