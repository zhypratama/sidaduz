<?php

namespace App\Http\Controllers;

use App\Models\NilaiHarian;
use App\Models\Pembelajaran;
use App\Models\Student;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NilaiHarianController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Ensure user is associated with a GTK
        if (!$user->gtk) {
            // Alternatively, admin can see all
            if ($user->hasRole('admin') || $user->hasRole('super_admin')) {
                $pembelajarans = Pembelajaran::with(['kelas', 'mataPelajaran', 'guru'])
                    ->get()
                    ->groupBy('kelas.nama_kelas');
            } else {
                return redirect()->route('dashboard')->with('error', 'Anda tidak terdaftar sebagai Guru.');
            }
        } else {
            $pembelajarans = $user->gtk->pembelajarans()->with(['kelas', 'mataPelajaran'])->get();
        }

        return Inertia::render('Nilai/Index', [
            'pembelajarans' => $pembelajarans
        ]);
    }

    public function create(Request $request)
    {
        $user = Auth::user();
        $gtk = $user->gtk;

        if (!$gtk && !$user->hasRole('admin') && !$user->hasRole('super_admin')) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        // Get available subjects for this teacher
        $query = Pembelajaran::with(['kelas', 'mataPelajaran']);
        
        if ($gtk) {
            $query->where('gtk_id', $gtk->id);
        }

        $pembelajarans = $query->get();

        $selectedPembelajaran = null;
        $students = [];
        $existingGrades = [];

        if ($request->has('pembelajaran_id')) {
            $selectedPembelajaran = Pembelajaran::with(['kelas', 'mataPelajaran', 'guru'])
                ->findOrFail($request->pembelajaran_id);

            // Verify ownership
            if ($gtk && $selectedPembelajaran->gtk_id !== $gtk->id) {
                abort(403);
            }

            $students = Student::where('kelas_id', $selectedPembelajaran->kelas_id)
                ->orderBy('nama_lengkap')
                ->get();
                
            // If editing/viewing specific date/judul, fetch existing grades
            // This part might be complex for "Create" page. 
            // Maybe "Create" is just for new entry. 
        }

        return Inertia::render('Nilai/Create', [
            'pembelajarans' => $pembelajarans,
            'selectedPembelajaran' => $selectedPembelajaran,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pembelajaran_id' => 'required|exists:pembelajarans,id',
            'judul' => 'required|string|max:255',
            'jenis' => 'required|in:Tugas,UH,UTS,UAS,Praktek,Proyek,Sikap',
            'tanggal' => 'required|date',
            'scores' => 'required|array',
            'scores.*.student_id' => 'required|exists:students,id',
            'scores.*.nilai' => 'nullable|numeric|min:0|max:100',
            'scores.*.keterangan' => 'nullable|string',
        ]);

        $pembelajaran = Pembelajaran::findOrFail($request->pembelajaran_id);
        
        // Verify ownership
        $user = Auth::user();
        if ($user->gtk && $pembelajaran->gtk_id !== $user->gtk->id) {
            abort(403);
        }

        DB::transaction(function () use ($request, $pembelajaran) {
            foreach ($request->scores as $scoreData) {
                // If nilai is provided (not null/empty), save it
                if (isset($scoreData['nilai']) && $scoreData['nilai'] !== '') {
                    NilaiHarian::updateOrCreate(
                        [
                            'pembelajaran_id' => $pembelajaran->id,
                            'student_id' => $scoreData['student_id'],
                            'judul' => $request->judul,
                            'jenis' => $request->jenis,
                        ],
                        [
                            'tanggal' => $request->tanggal,
                            'nilai' => $scoreData['nilai'],
                            'keterangan' => $scoreData['keterangan'] ?? null,
                        ]
                    );
                }
            }
        });

        return redirect()->route('nilai.index')->with('success', 'Nilai berhasil disimpan.');
    }
    
    public function show(Pembelajaran $pembelajaran)
    {
        // Show history of grades for this subject
        // Verify access
         $user = Auth::user();
        if ($user->gtk && $pembelajaran->gtk_id !== $user->gtk->id) {
            abort(403);
        }
        
        $pembelajaran->load(['kelas', 'mataPelajaran', 'guru']);
        
        // Group grades by Judul/Date
        $grades = NilaiHarian::where('pembelajaran_id', $pembelajaran->id)
            ->with('student')
            ->orderBy('tanggal', 'desc')
            ->get()
            ->groupBy('judul');
            
        return Inertia::render('Nilai/Show', [
            'pembelajaran' => $pembelajaran,
            'grades' => $grades
        ]);
    }
}
