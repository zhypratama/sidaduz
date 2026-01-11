<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use Inertia\Inertia;

use Illuminate\Http\Request;

class KurikulumController extends Controller
{
    public function calendar()
    {
        $events = AcademicCalendar::all()->map(function($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'start' => $event->start->format('Y-m-d H:i:s'),
                'end' => $event->end ? $event->end->format('Y-m-d H:i:s') : null,
                'allDay' => $event->all_day,
                'backgroundColor' => $event->color ?? ($event->is_holiday ? '#ef4444' : '#3b82f6'),
                'borderColor' => $event->color ?? ($event->is_holiday ? '#ef4444' : '#3b82f6'),
                'extendedProps' => [
                    'description' => $event->description,
                    'type' => $event->type,
                    'is_holiday' => $event->is_holiday
                ]
            ];
        });

        return Inertia::render('Kurikulum/Kalender/Index', [
            'events' => $events
        ]);
    }

    public function storeCalendar(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'nullable|date|after_or_equal:start',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'is_holiday' => 'boolean',
            'all_day' => 'boolean'
        ]);

        if (empty($validated['color'])) {
             $colors = [
                'kegiatan' => '#3b82f6', // blue
                'libur' => '#ef4444',    // red
                'ujian' => '#f59e0b',    // orange
                'rapat' => '#10b981',    // green
             ];
             $validated['color'] = $colors[$validated['type']] ?? '#6366f1';
        }

        AcademicCalendar::create($validated);

        return redirect()->back()->with('success', 'Agenda berhasil ditambahkan.');
    }

    public function updateCalendar(Request $request, $id)
    {
        $calendar = AcademicCalendar::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'nullable|date|after_or_equal:start',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'is_holiday' => 'boolean',
            'all_day' => 'boolean'
        ]);

        $colors = [
            'kegiatan' => '#3b82f6', // blue
            'libur' => '#ef4444',    // red
            'ujian' => '#f59e0b',    // orange
            'rapat' => '#10b981',    // green
        ];
        $validated['color'] = $colors[$validated['type']] ?? '#6366f1';

        $calendar->update($validated);

        return redirect()->back()->with('success', 'Agenda berhasil diperbarui.');
    }

    public function destroyCalendar($id)
    {
        AcademicCalendar::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Agenda berhasil dihapus.');
    }
    public function syncReference()
    {
        // Clear existing (Optional, maybe just append or check duplicates? For now, user requested sync, let's append but check simple duplicate by title + date)
        // Or simpler: run the seeder logic directly here.
        
        $events = [
            ['title' => 'Hari Pertama Masuk Sekolah', 'start' => '2024-07-15', 'type' => 'kegiatan', 'color' => '#3b82f6'],
            ['title' => 'MPLS', 'start' => '2024-07-15', 'end' => '2024-07-17', 'type' => 'kegiatan', 'color' => '#3b82f6'],
            ['title' => 'Tahun Baru Islam 1446 H', 'start' => '2024-07-07', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'HUT RI ke-79', 'start' => '2024-08-17', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Prakiraan STS Sem 1', 'start' => '2024-09-16', 'end' => '2024-09-21', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Maulid Nabi SAW', 'start' => '2024-09-16', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Prakiraan SAS Sem 1', 'start' => '2024-12-02', 'end' => '2024-12-07', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Titimangsa Rapor Sem 1', 'start' => '2024-12-20', 'type' => 'kegiatan', 'color' => '#10b981'],
            ['title' => 'Libur Semester 1', 'start' => '2024-12-23', 'end' => '2024-12-31', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Hari Raya Natal', 'start' => '2024-12-25', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Tahun Baru Masehi', 'start' => '2025-01-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Masuk Semester 2', 'start' => '2025-01-06', 'type' => 'kegiatan', 'color' => '#3b82f6'],
            ['title' => 'Imlek 2576', 'start' => '2025-01-29', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Isra Mikraj', 'start' => '2025-01-27', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Prakiraan STS Sem 2', 'start' => '2025-03-03', 'end' => '2025-03-08', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Hari Raya Nyepi', 'start' => '2025-03-29', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Libur Hari Raya', 'start' => '2025-03-24', 'end' => '2025-04-05', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Idul Fitri 1446 H', 'start' => '2025-03-31', 'end' => '2025-04-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Hari Buruh', 'start' => '2025-05-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Waisak', 'start' => '2025-05-12', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Ujian Sekolah', 'start' => '2025-05-19', 'end' => '2025-05-24', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Lahir Pancasila', 'start' => '2025-06-01', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Idul Adha', 'start' => '2025-06-06', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
            ['title' => 'Prakiraan SAS Sem 2', 'start' => '2025-06-09', 'end' => '2025-06-14', 'type' => 'ujian', 'color' => '#f59e0b'],
            ['title' => 'Pembagian Rapor', 'start' => '2025-06-27', 'type' => 'kegiatan', 'color' => '#10b981'],
            ['title' => 'Libur Akhir Tahun', 'start' => '2025-06-30', 'end' => '2025-07-12', 'is_holiday' => true, 'type' => 'libur', 'color' => '#ef4444'],
        ];

        foreach ($events as $event) {
            AcademicCalendar::firstOrCreate(
                ['title' => $event['title'], 'start' => $event['start']],
                array_merge($event, [
                    'description' => 'Disinkronkan dari referensi Kaldik Jabar 2024/2025',
                    'all_day' => true
                ])
            );
        }

        return redirect()->back()->with('success', 'Kalender berhasil disinkronkan dengan referensi Jawa Barat.');
    }
}
