<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Gtk;
use App\Models\Kelas;
use App\Models\SchoolProfile;
use App\Models\Presensi;
use Inertia\Inertia;

class PublicOverviewController extends Controller
{
    public function index()
    {
        $school = SchoolProfile::first();
        
        $stats = [
            'total_students' => Student::count(),
            'total_teachers' => Gtk::count(),
            'total_classes' => Kelas::count(),
            'students_male' => Student::where('jenis_kelamin', 'L')->count(),
            'students_female' => Student::where('jenis_kelamin', 'P')->count(),
        ];

        // Fetch Public Page Settings
        $settings = \App\Models\AppSetting::whereIn('key', [
            'landing_hero_title',
            'landing_hero_subtitle',
            'landing_bg_image',
            'landing_show_stats',
            'landing_welcome_text'
        ])->pluck('value', 'key');

        // Fetch Today's Attendance for the Live Tab
        $today = now()->format('Y-m-d');
        $attendance = Presensi::whereDate('tanggal', $today)
            ->with(['student' => function($q) {
                $q->select('id', 'nama_lengkap', 'kelas_id');
            }, 'student.kelas'])
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'nama_masking' => $this->maskName($item->student->nama_lengkap),
                    'kelas' => $item->student->kelas?->nama_kelas ?? '-',
                    'status' => $item->status,
                    'jam' => $item->jam_masuk ?? '-',
                    'waktu_relatif' => $item->created_at->diffForHumans()
                ];
            });

        return Inertia::render('Public/Overview', [
            'school' => $school,
            'stats' => $stats,
            'pageSettings' => $settings,
            'attendance' => $attendance,
            'currentDate' => now()->translatedFormat('l, d F Y')
        ]);
    }

    private function maskName($name)
    {
        $parts = explode(' ', $name);
        $maskedParts = [];
        
        foreach ($parts as $part) {
            $len = strlen($part);
            if ($len > 1) {
                $maskedParts[] = substr($part, 0, 1) . str_repeat('*', $len - 1);
            } else {
                $maskedParts[] = $part;
            }
        }
        
        return implode(' ', $maskedParts);
    }
}
