<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuratController extends Controller
{
    public function index()
    {
        // Dashboard Persuratan (Ringkasan)
        $totalMasuk = SuratMasuk::count();
        $totalKeluar = SuratKeluar::count();
        $recentMasuk = SuratMasuk::latest()->take(5)->get();
        $recentKeluar = SuratKeluar::with('klasifikasi')->latest()->take(5)->get();

        return Inertia::render('Surat/Index', [
            'stats' => [
                'total_masuk' => $totalMasuk,
                'total_keluar' => $totalKeluar,
            ],
            'recent_masuk' => $recentMasuk,
            'recent_keluar' => $recentKeluar,
        ]);
    }

    public function masuk()
    {
        $surats = SuratMasuk::latest()->paginate(10);
        return Inertia::render('Surat/Masuk/Index', [
            'surats' => $surats
        ]);
    }

    public function masukCreate()
    {
        return Inertia::render('Surat/Masuk/Create');
    }

    public function masukStore(Request $request)
    {
        $validated = $request->validate([
            'no_surat_pengirim' => 'required',
            'pengirim' => 'required',
            'perihal' => 'required',
            'tanggal_surat' => 'required|date',
            'tanggal_diterima' => 'required|date',
            'file_scan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file_scan')) {
            $path = $request->file('file_scan')->store('surat-masuk', 'public');
            $validated['file_scan'] = $path;
        }

        SuratMasuk::create($validated);

        return redirect()->route('surat-masuk.index')->with('success', 'Surat masuk berhasil diarsipkan!');
    }

    public function keluar()
    {
        $surats = SuratKeluar::with('klasifikasi')->latest()->paginate(10);
        return Inertia::render('Surat/Keluar/Index', [
            'surats' => $surats
        ]);
    }
    
    public function create()
    {
        $klasifikasis = \App\Models\KlasifikasiSurat::all();
        $templates = \App\Models\SuratTemplate::all();
        $school = \App\Models\SchoolProfile::first();
        
        // Count next number based on current year
        $nextNumber = SuratKeluar::whereYear('tanggal_surat', date('Y'))->count() + 1;
        
        // Get Default Footer Text
        $footerSetting = \App\Models\AppSetting::where('key', 'footer_text_surat')->first();
        $defaultFooter = $footerSetting ? $footerSetting->value : 'Dokumen ini telah ditandatangani secara elektronik yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), BSSN.';

        return Inertia::render('Surat/Keluar/Create', [
            'klasifikasis' => $klasifikasis,
            'templates' => $templates,
            'school' => $school,
            'nextNumber' => $nextNumber,
            'defaultFooter' => $defaultFooter
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'klasifikasi_surat_id' => 'required',
            'no_surat' => 'required|unique:surat_keluars,no_surat',
            'tujuan' => 'required',
            'perihal' => 'required',
            'isi_surat' => 'required',
            'tanggal_surat' => 'required|date',
            'jenis_surat' => 'required',
            'opsi_tanda_tangan' => 'required',
            'paper_size' => 'required',
            'margins' => 'nullable', // JSON array
            'spacing' => 'nullable', // JSON array
            'posisi_tanggal' => 'required|in:kanan_atas,kanan_bawah',
            'footer_enabled' => 'boolean',
            'footer_text' => 'nullable|string',
        ]);

        // Logic Token generation for TTE
        // NOW: Token generated ONLY upon approval
        $validated['status'] = 'draft';

        SuratKeluar::create($validated);

        return to_route('surat-keluar.index')->with('success', 'Surat berhasil dibuat (Draft). Menunggu persetujuan Kepala Sekolah.');
    }

    public function approve($id)
    {
        if (!auth()->user()->can('surat.approve')) {
            abort(403, 'Anda tidak memiliki hak akses untuk menyetujui surat.');
        }

        $surat = SuratKeluar::findOrFail($id);
        
        $surat->update([
            'status' => 'approved',
            'token' => \Illuminate\Support\Str::random(32), // Increased to 32 chars as requested
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Surat berhasil disetujui & ditandatangani.');
    }

    public function approval()
    {
        if (!auth()->user()->can('surat.approve')) {
             abort(403);
        }

        $pending = SuratKeluar::with('klasifikasi')
            ->where('status', 'draft')
            ->orderBy('created_at', 'asc') // Oldest first for queue
            ->get();
            
        $history = SuratKeluar::with('klasifikasi')
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('updated_at') // Most recent approval first
            ->paginate(10);

        return Inertia::render('Surat/Approval/Index', [
            'pending' => $pending,
            'history' => $history
        ]);
    }
    
    public function show($id)
    {
        $surat = SuratKeluar::with('klasifikasi')->findOrFail($id);
        
        // If uploaded scan exists, serve that file instead of generating template
        if ($surat->file_scan && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_scan)) {
            return response()->file(storage_path('app/public/'.$surat->file_scan), [
                'Content-Disposition' => 'inline; filename="Surat_Keluar_SCAN_' . $surat->no_surat . '.pdf"'
            ]);
        }

        $schoolProfile = \App\Models\SchoolProfile::first();

        // Custom Layout Config
        $paperSize = $surat->paper_size ?? 'F4';
        
        // Handling special F4 size manually if needed, otherwise string
        $customPaper = $paperSize;
        if($paperSize === 'F4') {
             $customPaper = [0, 0, 609.4488, 935.433]; // 21.5 x 33 cm in points
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('surat.template', compact('surat', 'schoolProfile'));
        $pdf->setPaper($customPaper, 'portrait');
        
        if ($surat->status !== 'approved' && !auth()->user()->can('surat.view')) {
             abort(403, 'Surat belum disetujui.');
        }

        $filename = 'Surat_Keluar_'.str_replace(['/', '\\'], '-', $surat->no_surat).'.pdf';
        return $pdf->stream($filename);
    }

    public function showByToken($token)
    {
        $surat = SuratKeluar::with('klasifikasi')->where('token', $token)->firstOrFail();
        
        // If uploaded scan exists, serve that for validation
        if ($surat->file_scan && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_scan)) {
            return response()->file(storage_path('app/public/'.$surat->file_scan), [
                'Content-Disposition' => 'inline; filename="Surat_Keluar_SCAN_' . $surat->no_surat . '.pdf"'
            ]);
        }

        $schoolProfile = \App\Models\SchoolProfile::first();

        // Custom Layout Config
        $paperSize = $surat->paper_size ?? 'F4';
        
        $customPaper = $paperSize;
        if($paperSize === 'F4') {
             $customPaper = [0, 0, 609.4488, 935.433]; // 21.5 x 33 cm
        }

        // Generate barcode manually using SVG to avoid Imagick dependency
        // In template.blade.php we already use QrCode::format('svg')

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('surat.template', compact('surat', 'schoolProfile'));
        $pdf->setPaper($customPaper, 'portrait');
        
        $filename = 'Surat_Keluar_'.str_replace(['/', '\\'], '-', $surat->no_surat).'.pdf';
        return $pdf->stream($filename);
    }

    public function validasi($token)
    {
        $surat = SuratKeluar::where('token', $token)->firstOrFail();
        
        return Inertia::render('Surat/Validasi', [
            'surat' => $surat,
            'status' => $surat->status === 'approved' ? 'valid' : 'invalid'
        ]);
    }

    public function uploadScan(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'file_scan' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // Max 10MB
        ]);

        $surat = SuratKeluar::findOrFail($id);
        
        if ($surat->file_scan && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_scan)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->file_scan);
        }

        $path = $request->file('file_scan')->store('surat-keluar/scan', 'public');
        
        $surat->update(['file_scan' => $path]);

        return redirect()->back()->with('success', 'File scan berhasil diupload.');
    }

    public function destroyMasuk($id)
    {
        $surat = SuratMasuk::findOrFail($id);
        
        if ($surat->file_scan && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_scan)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->file_scan);
        }

        $surat->delete();
        return back()->with('success', 'Surat masuk berhasil dihapus.');
    }

    public function destroyKeluar($id)
    {
        $surat = SuratKeluar::findOrFail($id);
        
        if ($surat->file_scan && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_scan)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->file_scan);
        }

        // Technically generated PDF isn't stored, it's generated on fly.

        $surat->delete();
        return back()->with('success', 'Surat keluar berhasil dihapus.'); 
    }
    // --- Arsip & Pengaturan ---

    public function arsip(Request $request)
    {
        $search = $request->search;
        $type = $request->type ?? 'all'; // all, masuk, keluar

        $masuk = SuratMasuk::query()
            ->select('id', 'no_surat_pengirim as no_surat', 'pengirim as entitas', 'perihal', 'tanggal_surat', 'file_scan', \Illuminate\Support\Facades\DB::raw("'Masuk' as kategori"))
            ->when($search, fn($q) => $q->where('perihal', 'like', "%$search%")->orWhere('no_surat_pengirim', 'like', "%$search%")->orWhere('pengirim', 'like', "%$search%"));

        $keluar = SuratKeluar::query()
            ->select('id', 'no_surat', 'tujuan as entitas', 'perihal', 'tanggal_surat', 'file_scan', \Illuminate\Support\Facades\DB::raw("'Keluar' as kategori"))
            ->where('status', 'approved')
            ->when($search, fn($q) => $q->where('perihal', 'like', "%$search%")->orWhere('no_surat', 'like', "%$search%")->orWhere('tujuan', 'like', "%$search%"));

        if ($type === 'masuk') {
            $query = $masuk;
        } elseif ($type === 'keluar') {
            $query = $keluar;
        } else {
            $query = $masuk->union($keluar);
        }

        $archives = $query->orderBy('tanggal_surat', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Surat/Arsip', [
            'archives' => $archives,
            'filters' => $request->only(['search', 'type'])
        ]);
    }

    public function pengaturan()
    {
        $school = \App\Models\SchoolProfile::first();
        $footer = \App\Models\AppSetting::where('key', 'footer_text_surat')->value('value');

        return Inertia::render('Surat/Pengaturan', [
            'school' => $school,
            'footer' => $footer
        ]);
    }

    public function updatePengaturan(Request $request)
    {
        $request->validate([
            'nama_sekolah' => 'required',
            'alamat' => 'nullable',
            'website' => 'nullable',
            'email' => 'nullable',
            'notelp' => 'nullable',
            'kop_surat' => 'nullable|image|max:2048', // Header logo
            'footer_text' => 'nullable|string'
        ]);

        $school = \App\Models\SchoolProfile::first();
        
        // Handle Logo Upload (Kop)
        if ($request->hasFile('kop_surat')) {
            $path = $request->file('kop_surat')->store('company', 'public');
            $school->logo = $path;
        }

        $school->update([
            'nama' => $request->nama_sekolah,
            'alamat' => $request->alamat,
            'website' => $request->website,
            'email' => $request->email,
            'notelp' => $request->notelp,
             // logo saved above if present
        ]);

        // Save Footer
        \App\Models\AppSetting::updateOrCreate(
            ['key' => 'footer_text_surat'],
            ['value' => $request->footer_text]
        );

        return back()->with('success', 'Pengaturan surat berhasil disimpan.');
    }
}
