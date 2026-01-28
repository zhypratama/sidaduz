<?php

namespace App\Http\Controllers;

use App\Models\JenisPelanggaran;
use App\Models\Konseling;
use App\Models\Pelanggaran;
use App\Models\Prestasi;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BkController extends Controller
{
    // --- DASHBOARD ---
    public function dashboard()
    {
        $totalPelanggaran = Pelanggaran::count();
        $totalKonseling = Konseling::count();
        $totalPrestasi = Prestasi::count();
        
        // Students with highest violation points (Top 5)
        $siswaBermasalah = Student::with('kelas')
            ->withSum('pelanggarans', 'poin_saat_ini')
            ->withSum('prestasis', 'poin_apresiasi')
            ->having('pelanggarans_sum_poin_saat_ini', '>', 0) // Only those with points
            ->orderByDesc('pelanggarans_sum_poin_saat_ini')
            ->take(5)
            ->get();
            
        // Recent Violations
        $recentViolations = Pelanggaran::with(['siswa.kelas', 'jenisPelanggaran'])
            ->latest('tanggal_kejadian')
            ->take(5)
            ->get();
            
        // Recent Achievements
        $recentPrestasi = Prestasi::with(['siswa.kelas'])
            ->latest('tanggal')
            ->take(5)
            ->get();

        return Inertia::render('BK/Dashboard', [
            'stats' => [
                'total_pelanggaran' => $totalPelanggaran,
                'total_konseling' => $totalKonseling,
                'total_prestasi' => $totalPrestasi,
            ],
            'siswa_bermasalah' => $siswaBermasalah,
            'recent_violations' => $recentViolations,
            'recent_prestasi' => $recentPrestasi,
        ]);
    }

    // --- PELANGGARAN ---
    public function pelanggaranIndex(Request $request)
    {
        $query = Pelanggaran::with(['siswa.kelas', 'jenisPelanggaran', 'pelapor'])->latest('tanggal_kejadian');

        if ($request->search) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('BK/Pelanggaran/Index', [
            'pelanggarans' => $query->paginate(10)->withQueryString(),
        ]);
    }

    public function pelanggaranCreate()
    {
        return Inertia::render('BK/Pelanggaran/Create', [
            'students' => Student::with('kelas')->orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'kelas_id']),
            'jenis_pelanggarans' => JenisPelanggaran::orderBy('poin')->get(),
        ]);
    }

    public function pelanggaranStore(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:students,id', 
            'jenis_pelanggaran_id' => 'required|exists:jenis_pelanggarans,id',
            'tanggal_kejadian' => 'required|date',
            'catatan' => 'nullable|string',
        ]);

        $aturan = JenisPelanggaran::findOrFail($validated['jenis_pelanggaran_id']);

        Pelanggaran::create([
            'siswa_id' => $validated['siswa_id'],
            'jenis_pelanggaran_id' => $validated['jenis_pelanggaran_id'],
            'pelapor_id' => auth()->id(),
            'tanggal_kejadian' => $validated['tanggal_kejadian'],
            'catatan' => $validated['catatan'],
            'poin_saat_ini' => $aturan->poin, 
            'status' => 'Pending',
        ]);

        return redirect()->route('bk.pelanggaran.index')->with('success', 'Pelanggaran berhasil dicatat.');
    }

    // --- KONSELING ---
    public function konselingIndex(Request $request)
    {
        $query = Konseling::with(['siswa.kelas', 'guruBk'])->latest('tanggal_konseling');
        
        if ($request->search) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('BK/Konseling/Index', [
            'konselings' => $query->paginate(10)->withQueryString(),
        ]);
    }
    
    public function konselingCreate()
    {
        return Inertia::render('BK/Konseling/Create', [
            'students' => Student::with('kelas')->orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'kelas_id']),
        ]);
    }

    public function konselingStore(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:students,id',
            'jenis_layanan' => 'required',
            'masalah' => 'required',
            'tanggal_konseling' => 'required|date',
            'hasil' => 'nullable', 
            'tindak_lanjut' => 'nullable',
        ]);
        
        Konseling::create([
            'siswa_id' => $validated['siswa_id'],
            'guru_bk_id' => auth()->id(),
            'jenis_layanan' => $validated['jenis_layanan'],
            'masalah' => $validated['masalah'],
            'tanggal_konseling' => $validated['tanggal_konseling'],
            'hasil' => $validated['hasil'],
            'tindak_lanjut' => $validated['tindak_lanjut'],
        ]);

        return redirect()->route('bk.konseling.index')->with('success', 'Sesi konseling berhasil dicatat.');
    }

     // --- ATURAN ---
     public function aturanIndex()
     {
         $rules = JenisPelanggaran::orderBy('poin')->get();
         return Inertia::render('BK/Aturan/Index', [
             'rules' => $rules
         ]);
     }
  
     public function aturanStore(Request $request)
     {
         $validated = $request->validate([
             'nama_pelanggaran' => 'required|string',
             'kategori' => 'required|in:Ringan,Sedang,Berat,Sangat Berat',
             'poin' => 'required|integer|min:0',
             'tindakan_biasa' => 'nullable|string',
         ]);
  
         JenisPelanggaran::create($validated);
         return back()->with('success', 'Aturan baru berhasil ditambahkan.');
     }

     public function aturanUpdate(Request $request, $id)
     {
         $validated = $request->validate([
             'nama_pelanggaran' => 'required|string',
             'kategori' => 'required|in:Ringan,Sedang,Berat,Sangat Berat',
             'poin' => 'required|integer|min:0',
             'tindakan_biasa' => 'nullable|string',
         ]);
  
         $aturan = JenisPelanggaran::findOrFail($id);
         $aturan->update($validated);
         
         return back()->with('success', 'Aturan berhasil diperbarui.');
     }
     
     public function aturanDestroy($id)
    {
        $aturan = JenisPelanggaran::findOrFail($id);
        // Check if used
        if (Pelanggaran::where('jenis_pelanggaran_id', $id)->exists()) {
            return back()->with('error', 'Aturan tidak bisa dihapus karena sudah digunakan dalam data pelanggaran.');
        }
        
        $aturan->delete();
        return back()->with('success', 'Aturan berhasil dihapus.');
    }

    // --- PRESTASI ---
    public function prestasiIndex(Request $request)
    {
        $query = Prestasi::with(['siswa.kelas'])->latest('tanggal');
        
        if ($request->search) {
            $query->whereHas('siswa', function($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('BK/Prestasi/Index', [
            'prestasis' => $query->paginate(10)->withQueryString(),
        ]);
    }

    public function prestasiCreate()
    {
        return Inertia::render('BK/Prestasi/Create', [
            'students' => Student::with('kelas')->orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'kelas_id']),
            'tingkat_list' => ['Sekolah', 'Kecamatan', 'Kota/Kabupaten', 'Provinsi', 'Nasional', 'Internasional'],
        ]);
    }

    public function prestasiStore(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:students,id',
            'nama_prestasi' => 'required|string',
            'tingkat' => 'required|in:Sekolah,Kecamatan,Kota/Kabupaten,Provinsi,Nasional,Internasional',
            'poin_apresiasi' => 'required|integer|min:0',
            'tanggal' => 'required|date',
            'bukti_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('bukti_file')) {
            $validated['bukti_file'] = $request->file('bukti_file')->store('bukti_prestasi', 'public');
        }

        Prestasi::create($validated);

        return redirect()->route('bk.prestasi.index')->with('success', 'Prestasi berhasil dicatat.');
    }

    // --- LAPORAN ---
    public function laporanIndex(Request $request)
    {
        $query = Student::with('kelas')
            ->withSum('pelanggarans', 'poin_saat_ini')
            ->withSum('prestasis', 'poin_apresiasi');
            
        if ($request->search) {
            $query->where('nama_lengkap', 'like', "%{$request->search}%");
        }
        
        if ($request->kelas_id) {
            $query->where('kelas_id', $request->kelas_id);
        }

        return Inertia::render('BK/Laporan/Index', [
            'students' => $query->paginate(15)->withQueryString(),
            'kelas_list' => \App\Models\Kelas::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function laporanShow($id)
    {
        $student = Student::with(['kelas', 'pelanggarans.jenisPelanggaran', 'prestasis', 'konselings.guruBk'])
            ->findOrFail($id);
            
        return Inertia::render('BK/Laporan/Show', [
            'student' => $student,
            'schoolProfile' => \App\Models\SchoolProfile::first(),
        ]);
    }
}
