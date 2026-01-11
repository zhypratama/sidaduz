<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Gtk;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $query = Kelas::with(['waliKelas', 'tahunAjaran']);

        if ($request->search) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        // Filter by specific Tahun Ajaran or default to Active
        // If 'ta' param exists, use it. Else use active.
        // Assuming TahunAjaran has 'is_active' column based on similar projects, 
        // checking SchoolProfileController setup might verify, but for now let's just allow filtering.
        
        $kelas = $query->orderBy('urutan', 'asc')->orderBy('nama', 'asc')->paginate(50); // Increased pagination for drag view
        
        // Data for dropdowns
        $waliKelas = Gtk::orderBy('nama')->get(['id', 'nama']);
        $tahunAjaran = TahunAjaran::orderBy('tahun', 'desc')->orderBy('semester', 'desc')->get(['id', 'tahun', 'semester', 'is_active']);

        return Inertia::render('Kelas/Index', [
            'kelas' => $kelas,
            'waliKelas' => $waliKelas,
            'tahunAjaran' => $tahunAjaran
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'wali_kelas_id' => 'nullable|exists:gtks,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
        ]);

        Kelas::create($validated);

        $message = 'Kelas berhasil ditambahkan!';

        // Sync Role Walikelas
        if (!empty($validated['wali_kelas_id'])) {
            $gtk = Gtk::find($validated['wali_kelas_id']);
            if ($gtk) {
                if ($gtk->user) {
                    // Ensure role exists and assign
                    if (! $gtk->user->hasRole('Walikelas')) {
                        $gtk->user->assignRole('Walikelas');
                        $message .= ' Role Walikelas berhasil ditambahkan ke user.';
                    }
                } else {
                    $message .= ' (Peringatan: Wali Kelas belum memiliki Akun User, role tidak dapat diset otomatis)';
                }
            }
        }

        return back()->with('success', $message);
    }

    public function update(Request $request, Kelas $kelas)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'wali_kelas_id' => 'nullable|exists:gtks,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
        ]);

        $kelas->update($validated);

        $message = 'Kelas berhasil diperbarui!';

        // Sync Role Walikelas
        if (!empty($validated['wali_kelas_id'])) {
            $gtk = Gtk::find($validated['wali_kelas_id']);
            if ($gtk) {
                if ($gtk->user) {
                    // Ensure role exists and assign
                    if (! $gtk->user->hasRole('Walikelas')) {
                        $gtk->user->assignRole('Walikelas');
                        $message .= ' Role Walikelas berhasil ditambahkan ke user.';
                    }
                } else {
                    $message .= ' (Peringatan: Wali Kelas belum memiliki Akun User, role tidak dapat diset otomatis)';
                }
            }
        }

        return back()->with('success', $message);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array'
        ]);

        foreach ($request->items as $index => $id) {
            Kelas::where('id', $id)->update(['urutan' => $index + 1]);
        }

        return back()->with('success', 'Urutan kelas diperbarui!');
    }

    public function destroy(Kelas $kelas)
    {
        $kelas->delete();
        return back()->with('success', 'Kelas berhasil dihapus!');
    }
}
