<?php

namespace App\Http\Controllers;

use App\Models\JurnalGuru;
use App\Models\JurnalDetail;
use App\Models\Pembelajaran;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class JurnalGuruController extends Controller
{
    public function index(Request $request)
    {
        $query = JurnalGuru::with(['pembelajaran.mataPelajaran', 'pembelajaran.kelas', 'pembelajaran.guru'])
            ->latest();

        // Filter: If teacher, only show their journals
        if (Auth::user()->hasRole('Guru')) {
             $query->whereHas('pembelajaran', function ($q) {
                 $q->where('gtk_id', Auth::user()->gtk->id);
             });
        }
        
        // Search & Filter implementation here...

        $jurnals = $query->paginate(10);

        return Inertia::render('Jurnal/Index', [
            'jurnals' => $jurnals
        ]);
    }

    public function create()
    {
        // Get schedules for the logged-in teacher
        $userId = Auth::user()->id;
        // Asumsi relasi user -> gtk exists
        $gtkId = Auth::user()->gtk->id ?? null;

        $pembelajarans = Pembelajaran::with(['mataPelajaran', 'kelas', 'semesters'])
            ->where('gtk_id', $gtkId)
            ->get();

        return Inertia::render('Jurnal/Create', [
            'pembelajarans' => $pembelajarans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pembelajaran_id' => 'required|exists:pembelajarans,id',
            'tanggal' => 'required|date',
            'jam_ke' => 'required|string',
            'materi' => 'required|string',
            'catatan' => 'nullable|string',
            'foto_kegiatan' => 'nullable|image|max:2048',
            'status_guru' => 'required|in:Hadir,Izin,Sakit,Tugas Luar',
            'attendance' => 'array', // Array of {student_id: 1, status: 'H'}
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:H,S,I,A,B',
        ]);

        if ($request->hasFile('foto_kegiatan')) {
            $path = $request->file('foto_kegiatan')->store('jurnal', 'public');
            $validated['foto_kegiatan'] = $path;
        }

        $jurnal = JurnalGuru::create($validated);

        if (!empty($request->attendance)) {
            foreach ($request->attendance as $att) {
                // Only save if status is NOT 'H' (Hadir) to save space, or save all if requirement says so.
                // Plan said: "Hadir is assumed if no record exists here".
                if ($att['status'] !== 'H') {
                    JurnalDetail::create([
                        'jurnal_guru_id' => $jurnal->id,
                        'student_id' => $att['student_id'],
                        'status' => $att['status'],
                    ]);
                }
            }
        }

        return redirect()->route('jurnal.index')->with('success', 'Jurnal berhasil disimpan.');
    }
    
    public function getStudents($pembelajaranId)
    {
        $pembelajaran = Pembelajaran::findOrFail($pembelajaranId);
        $students = Student::where('kelas_id', $pembelajaran->kelas_id)
            ->orderBy('nama_lengkap')
            ->get();
            
        return response()->json($students);
    }
}
