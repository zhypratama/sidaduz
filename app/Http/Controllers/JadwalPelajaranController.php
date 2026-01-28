<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\JadwalPelajaran;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\SchoolProfile;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class JadwalPelajaranController extends Controller
{
    public function index()
    {
        $kelas = Kelas::orderBy('nama')->get();
        return Inertia::render('Kurikulum/Jadwal/Index', [
            'kelas_list' => $kelas
        ]);
    }

    public function show(Kelas $kelas)
    {
        // Load existing schedule for this class
        $jadwal = JadwalPelajaran::with(['mataPelajaran', 'guru'])
            ->where('kelas_id', $kelas->id)
            ->get();

        // Available Subjects
        $mataPelajaran = MataPelajaran::orderBy('nama')->get();

        return response()->json([
            'jadwal' => $jadwal,
            'subjects' => $mataPelajaran,
            'kelas' => $kelas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'hari' => 'required|string',
            'jam_ke' => 'required|integer',
            'guru_id' => 'nullable|exists:gtks,id'
        ]);

        $school = SchoolProfile::first();

        // Auto-detect Teacher from Pembelajaran (Distribution) if not provided
        $guruId = $validated['guru_id'] ?? null;
        if (!$guruId) {
            $distribution = \App\Models\Pembelajaran::where('kelas_id', $validated['kelas_id'])
                ->where('mata_pelajaran_id', $validated['mata_pelajaran_id'])
                ->first();
            
            if ($distribution) {
                $guruId = $distribution->gtk_id;
            }
        }

        try {
            // Upsert: Update if exists at same slot, or create new
            $jadwal = JadwalPelajaran::updateOrCreate(
                [
                    'kelas_id' => $validated['kelas_id'],
                    'hari' => $validated['hari'],
                    'jam_ke' => $validated['jam_ke'],
                ],
                [
                    'school_id' => $school->id ?? 1,
                    'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                    'guru_id' => $guruId,
                ]
            );

            return response()->json(['message' => 'Jadwal berhasil disimpan', 'data' => $jadwal]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menyimpan jadwal: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required',
            'hari' => 'required',
            'jam_ke' => 'required',
        ]);

        JadwalPelajaran::where('kelas_id', $validated['kelas_id'])
            ->where('hari', $validated['hari'])
            ->where('jam_ke', $validated['jam_ke'])
            ->delete();

        return response()->json(['message' => 'Jadwal dihapus']);
    }
}
