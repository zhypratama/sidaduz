<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicCalendar;
use Carbon\Carbon;

class ReferenceCalendarSeeder extends Seeder
{
    public function run()
    {
        // Data Referensi Kalender Pendidikan Jawa Barat 2024/2025 (Estimasi)
        $events = [
            // JULI 2024
            ['title' => 'Hari Pertama Masuk Sekolah', 'start' => '2024-07-15', 'type' => 'kegiatan', 'color' => '#3b82f6'],
            ['title' => 'MPLS (Masa Pengenalan Lingkungan Sekolah)', 'start' => '2024-07-15', 'end' => '2024-07-17', 'type' => 'kegiatan', 'color' => '#3b82f6'],
            ['title' => 'Tahun Baru Islam 1446 H', 'start' => '2024-07-07', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],

            // AGUSTUS 2024
            ['title' => 'HUT RI ke-79', 'start' => '2024-08-17', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],

            // SEPTEMBER 2024
            ['title' => 'Prakiraan STS (Sumatif Tengah Semester)', 'start' => '2024-09-16', 'end' => '2024-09-21', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Maulid Nabi Muhammad SAW', 'start' => '2024-09-16', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],

            // DESEMBER 2024
            ['title' => 'Prakiraan SAS (Sumatif Akhir Semester)', 'start' => '2024-12-02', 'end' => '2024-12-07', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Titimangsa Rapor Semester 1', 'start' => '2024-12-20', 'type' => 'kegiatan', 'color' => '#10b981'],
            ['title' => 'Libur Semester 1', 'start' => '2024-12-23', 'end' => '2024-12-31', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Hari Raya Natal', 'start' => '2024-12-25', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],

            // JANUARI 2025
            ['title' => 'Tahun Baru Masehi', 'start' => '2025-01-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Hari Pertama Masuk Semester 2', 'start' => '2025-01-06', 'type' => 'kegiatan', 'color' => '#3b82f6'],
            ['title' => 'Imlek 2576', 'start' => '2025-01-29', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],

            // FEBRUARI 2025
            ['title' => 'Isra Mikraj', 'start' => '2025-01-27', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'], // Cek tanggal tepat

            // MARET 2025
            ['title' => 'Prakiraan STS Semester 2', 'start' => '2025-03-03', 'end' => '2025-03-08', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Hari Raya Nyepi', 'start' => '2025-03-29', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Idul Fitri 1446 H (Estimasi)', 'start' => '2025-03-31', 'end' => '2025-04-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Libur Hari Raya', 'start' => '2025-03-24', 'end' => '2025-04-05', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],

            // APRIL 2025
            
            // MEI 2025
            ['title' => 'Hari Buruh', 'start' => '2025-05-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Waisak', 'start' => '2025-05-12', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'], 
            ['title' => 'Ujian Sekolah (Kls 9)', 'start' => '2025-05-19', 'end' => '2025-05-24', 'type' => 'ujian', 'color' => '#f59e0b'],

            // JUNI 2025
            ['title' => 'Lahir Pancasila', 'start' => '2025-06-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Idul Adha', 'start' => '2025-06-06', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Prakiraan SAS Semester 2', 'start' => '2025-06-09', 'end' => '2025-06-14', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Pembagian Rapor', 'start' => '2025-06-27', 'type' => 'kegiatan', 'color' => '#10b981'],
            ['title' => 'Libur Akhir Tahun', 'start' => '2025-06-30', 'end' => '2025-07-12', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
        ];

        foreach ($events as $event) {
            AcademicCalendar::create(array_merge($event, [
                'description' => 'Disinkronkan dari referensi Kalender Pendidikan Jawa Barat 2024/2025',
                'all_day' => true
            ]));
        }
    }
}
