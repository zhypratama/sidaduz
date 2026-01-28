<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Presensi;
use App\Models\BeritaAcara;
use App\Models\BukuTamu;
use App\Models\AppSetting;
use Carbon\Carbon;

class PiketController extends Controller
{
    public function index()
    {
        return redirect()->route('gtk.piket.absensi');
    }

    public function absensi()
    {
        // Get today's attendance stats
        $stats = [
            'total_students' => Student::where('status', 'aktif')->count(),
            'hadir' => Presensi::whereDate('tanggal', today())->where('status', 'H')->count(),
            'sakit' => Presensi::whereDate('tanggal', today())->where('status', 'S')->count(),
            'izin' => Presensi::whereDate('tanggal', today())->where('status', 'I')->count(),
            'alpha' => Presensi::whereDate('tanggal', today())->where('status', 'A')->count(),
        ];
        
        $recent_activities = Presensi::with('student')
            ->whereDate('tanggal', today())
            ->latest('updated_at')
            ->take(10)
            ->get();

        return Inertia::render('Piket/Absensi', [
            'stats' => $stats,
            'recent_activities' => $recent_activities,
            'jam_masuk' => AppSetting::where('key', 'jam_masuk_sekolah')->value('value') ?? '07:00',
            'jam_pulang' => AppSetting::where('key', 'jam_pulang_sekolah')->value('value') ?? '15:00',
        ]);
    }

    public function scanQr(Request $request)
    {
        $request->validate(['qr_code' => 'required']);
        
        $code = trim($request->qr_code);
        $isQr = $request->boolean('is_qr');

        // Logic:
        // 1. Manual Input: Flexible (NISN or NIPD)
        // 2. QR Scan: Strict (NISN Only)
        
        $query = Student::query();

        if ($isQr) {
            // Strict check for QR
            $query->where('nisn', $code);
        } else {
            // Flexible check for manual input
            $query->where(function($q) use ($code) {
                $q->where('nipd', $code)
                  ->orWhere('nisn', $code);
            });
        }
        
        $student = $query->first();

        if (!$student) {
            $msg = $isQr ? 'Data siswa tidak ditemukan / QR Code bukan NISN!' : 'Siswa tidak ditemukan!';
            return response()->json(['message' => $msg, 'type' => 'error'], 404);
        }

        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now()->format('H:i');

        // Check Locked Attendance (e.g. S/I/A manually set)
        $existing = Presensi::where('student_id', $student->id)->whereDate('tanggal', $today)->first();

        if ($existing) {
            if ($existing->status != 'H') {
                return response()->json(['message' => "Siswa sudah tercatat {$existing->status} hari ini.", 'type' => 'warning']);
            }
            
            // If already present, check if checking out
            if (!$existing->jam_pulang) {
                 // Check if it's time to go home? Or just update jam_pulang if specific interval passed?
                 // Simple logic for now: If scanned again > 5 mins later, treat as check out
                 $timeSinceMasuk = Carbon::parse($existing->jam_masuk)->diffInMinutes(Carbon::now());
                 if ($timeSinceMasuk > 30) {
                     $existing->update(['jam_pulang' => $now]);
                     return response()->json(['message' => "Goodbye {$student->nama_lengkap}! Hati-hati di jalan.", 'type' => 'success', 'student' => $student]);
                 } else {
                     return response()->json(['message' => "Halo lagi {$student->nama_lengkap}! (Sudah absen masuk)", 'type' => 'info']);
                 }
            } else {
                 return response()->json(['message' => "Sudah absen pulang hari ini.", 'type' => 'info']);
            }
        }

        // New Entry
        Presensi::create([
            'student_id' => $student->id,
            'tanggal' => $today,
            'jam_masuk' => $now,
            'status' => 'H',
            'recorded_by' => auth()->id()
        ]);

        return response()->json(['message' => "Selamat Pagi, {$student->nama_lengkap}!", 'type' => 'success', 'student' => $student]);
    }

    public function storeAbsensi(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'status' => 'required|in:H,S,I,A',
            'keterangan' => 'nullable'
        ]);

        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now()->format('H:i:s');

        Presensi::updateOrCreate(
            ['student_id' => $request->student_id, 'tanggal' => $today],
            [
                'status' => $request->status,
                'jam_masuk' => $request->status == 'H' ? $now : null,
                'keterangan' => $request->keterangan,
                'recorded_by' => auth()->id()
            ]
        );

        return back()->with('success', 'Absensi berhasil disimpan.');
    }

    public function beritaTamu()
    {
        $beritas = BeritaAcara::with('pelapor')->whereDate('tanggal', today())->latest()->get();
        $tamus = BukuTamu::whereDate('tanggal', today())->latest()->get();
        $gtks = \App\Models\Gtk::orderBy('nama')->get(['id', 'nama']); // For 'Bertemu Dengan' dropdown

        return Inertia::render('Piket/BeritaDanTamu', [
            'beritas' => $beritas,
            'tamus' => $tamus,
            'gtks' => $gtks
        ]);
    }

    public function storeBerita(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required',
            'deskripsi' => 'required',
            'kategori' => 'required',
            'file_bukti' => 'nullable|file|image|max:2048'
        ]);

        if ($request->hasFile('file_bukti')) {
            $validated['file_bukti'] = $request->file('file_bukti')->store('bukti-piket', 'public');
        }

        $validated['tanggal'] = today(); // Force today
        $validated['waktu'] = now();
        $validated['pelapor_id'] = auth()->id();

        BeritaAcara::create($validated);

        return back()->with('success', 'Berita acara telah dicatat.');
    }

    public function storeTamu(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'asal_instansi' => 'nullable',
            'keperluan' => 'required',
            'bertemu_dengan' => 'nullable',
            'no_hp' => 'nullable',
            'foto' => 'nullable|image|max:2048' // Optional snapshot
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('tamu', 'public');
        }

        $validated['tanggal'] = today();
        $validated['waktu_masuk'] = now();

        BukuTamu::create($validated);
        
        return back()->with('success', 'Tamu berhasil dicatat (Check-in).');
    }

    public function checkoutTamu($id)
    {
        $tamu = BukuTamu::findOrFail($id);
        $tamu->update(['waktu_keluar' => now()]);
        
        return back()->with('success', 'Tamu berhasil check-out.');
    }

    public function settings()
    {
        // Admin only? Middleware handles it
        $settings = AppSetting::where('group', 'piket')->get()->pluck('value', 'key');
        
        return Inertia::render('Piket/Pengaturan', [
            'settings' => $settings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'jam_masuk_sekolah' => 'required',
            'jam_pulang_sekolah' => 'required',
        ]);

        foreach ($request->only(['jam_masuk_sekolah', 'jam_pulang_sekolah']) as $key => $value) {
            AppSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => 'piket', 'type' => 'time']
            );
        }

        return back()->with('success', 'Pengaturan jam sekolah berhasil disimpan.');
    }
}
