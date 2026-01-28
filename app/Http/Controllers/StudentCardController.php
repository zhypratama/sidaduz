<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentCardController extends Controller
{
    public function index()
    {
        $students = \App\Models\Student::with('kelas')
            ->orderBy('nama_lengkap')
            ->paginate(request('per_page', 24)); // Grid 3x8 or 4x6

        $kelas = \App\Models\Kelas::orderBy('nama')->get();

        $profile = \App\Models\SchoolProfile::first();

        return \Inertia\Inertia::render('Siswa/Kartu/Index', [
            'students' => $students,
            'kelas_list' => $kelas,
            'profile' => $profile,
            'filters' => request()->only(['search', 'kelas'])
        ]);
    }

    public function print(Request $request)
    {
        // Bulk Print by Class or Selection
        $query = \App\Models\Student::with('kelas');

        if ($request->has('kelas') && $request->kelas != 'all') {
            $query->whereHas('kelas', function($q) use ($request) {
                $q->where('nama', $request->kelas);
            });
        }

        if ($request->has('ids')) {
            $ids = explode(',', $request->ids);
            $query->whereIn('id', $ids);
        }

        $students = $query->orderBy('nama_lengkap')->get();
        $school = \App\Models\SchoolProfile::first();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kartu_siswa', [
            'students' => $students,
            'school' => $school
        ]);

        $pdf->setPaper('A4', 'portrait'); // Or custom size for PVC Card
        
        return $pdf->stream('Kartu_Siswa.pdf');
    }
}
