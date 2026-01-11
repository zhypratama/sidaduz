<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\SchoolProfile;
use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class MutationController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::query();
        
        // Filter only non-active students
        $query->whereIn('status', ['mutasi_keluar', 'lulus', 'dikeluarkan']);

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }
        
        if ($request->has('status') && $request->status !== 'all') {
             $query->where('status', $request->status);
        }

        $students = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Mutasi/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function print(Student $student)
    {
        // Check if template exists, if not use hardcoded or throw error
        // For now, let's generate a standard Letter based on School Profile
        
        $school = SchoolProfile::first();
        
        // Data for the view/PDF
        $data = [
            'school' => $school,
            'student' => $student,
            'date' => now()->translatedFormat('d F Y'),
            'no_surat' => '421.3/' . rand(100,999) . '/SMP-AI/' . date('Y') // Placeholder logic
        ];

        // We can reuse the surat layouts if available, or a specific view
        $pdf = Pdf::loadView('pdf.surat_mutasi', $data);
        return $pdf->stream('Surat_Mutasi_' . $student->nis . '.pdf');
    }
}
