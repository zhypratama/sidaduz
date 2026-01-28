<?php

namespace App\Http\Controllers;

use App\Models\Pembelajaran;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Gtk;
use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembelajaranController extends Controller
{
    public function index()
    {
        $kelas = Kelas::orderBy('nama')->get();
        return Inertia::render('Kurikulum/Pembelajaran/Index', [
            'kelas_list' => $kelas
        ]);
    }

    public function show(Kelas $kelas)
    {
        // Load existing mapping
        $pembelajarans = Pembelajaran::with(['mataPelajaran', 'guru'])
            ->where('kelas_id', $kelas->id)
            ->get()
            ->keyBy('mata_pelajaran_id');

        // All Subjects
        $mataPelajaran = MataPelajaran::orderBy('urutan')->orderBy('nama')->get();

        // All Teachers
        $teachers = Gtk::orderBy('nama')->select('id', 'nama', 'nip', 'jenis_ptk')->get();

        return response()->json([
            'pembelajarans' => $pembelajarans,
            'subjects' => $mataPelajaran,
            'teachers' => $teachers,
            'kelas' => $kelas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'gtk_id' => 'nullable|exists:gtks,id',
            'sk_mengajar' => 'nullable|string',
        ]);

        $school = SchoolProfile::first();

        // Upsert Mapping
        $pembelajaran = Pembelajaran::updateOrCreate(
            [
                'kelas_id' => $validated['kelas_id'],
                'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
            ],
            [
                'school_id' => $school->id ?? 1,
                'gtk_id' => $validated['gtk_id'],
                'sk_mengajar' => $validated['sk_mengajar'] ?? null,
                'status' => 'aktif'
            ]
        );

        return response()->json(['message' => 'Distribusi tersimpan', 'data' => $pembelajaran]);
    }
}
