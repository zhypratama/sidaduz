<?php

namespace App\Http\Controllers;

use App\Models\DisposisiSurat;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisposisiSuratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        $query = DisposisiSurat::with(['suratMasuk', 'pemberi', 'penerima'])
            ->latest();

        // If not Admin/Principal, only show assigned to self
        if (!$user->hasRole('Admin Sekolah') && !$user->can('surat.disposisi.view_all')) {
            $query->where('penerima_disposisi_id', $user->id);
        }

        $disposisi = $query->paginate(10);

        return Inertia::render('Surat/Disposisi/Index', [
            'disposisi_list' => $disposisi
        ]);
    }

    /**
     * Store a newly created disposisi in storage.
     */
    public function store(Request $request, SuratMasuk $suratMasuk)
    {
        $validated = $request->validate([
            'penerima_disposisi_id' => 'required|exists:users,id',
            'instruksi' => 'required|string',
            'catatan' => 'nullable|string',
            'batas_waktu' => 'nullable|date',
        ]);

        $disposisi = new DisposisiSurat($validated);
        $disposisi->surat_masuk_id = $suratMasuk->id;
        $disposisi->pemberi_disposisi_id = auth()->id();
        $disposisi->status = 'Belum Dibaca';
        $disposisi->save();

        return back()->with('success', 'Disposisi berhasil dikirim.');
    }

    /**
     * Update the specified disposisi in storage.
     */
    public function update(Request $request, DisposisiSurat $disposisi)
    {
        $validated = $request->validate([
            'status' => 'required|in:Belum Dibaca,Diproses,Selesai',
            'catatan' => 'nullable|string' // Optional Note update from receiver
        ]);

        $disposisi->update($validated);

        return back()->with('success', 'Status disposisi diperbarui.');
    }

    /**
     * Remove the specified disposisi from storage.
     */
    public function destroy(DisposisiSurat $disposisi)
    {
        if ($disposisi->pemberi_disposisi_id !== auth()->id()) {
            return back()->with('error', 'Unauthorized.');
        }

        $disposisi->delete();

        return back()->with('success', 'Disposisi dihapus.');
    }
}
