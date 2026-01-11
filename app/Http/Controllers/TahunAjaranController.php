<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TahunAjaranController extends Controller
{
    public function index()
    {
        $years = TahunAjaran::latest()->get();
        return Inertia::render('Sekolah/TahunAjaran', ['years' => $years]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun' => 'required', // string e.g. "2023/2024"
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        // If making active default to false unless logic added
        TahunAjaran::create($validated);

        return back()->with('success', 'Tahun ajaran berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $year = TahunAjaran::findOrFail($id);
        
        $validated = $request->validate([
            'tahun' => 'required',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        $year->update($validated);

        return back()->with('success', 'Data tahun ajaran berhasil diupdate');
    }

    public function destroy($id)
    {
        $year = TahunAjaran::findOrFail($id);
        if ($year->is_active) {
            return back()->with('error', 'Tidak bisa menghapus tahun ajaran aktif!');
        }
        $year->delete();
        return back()->with('success', 'Tahun ajaran dihapus');
    }

    public function activate($id)
    {
        // Deactivate all
        TahunAjaran::query()->update(['is_active' => false]);
        
        // Activate selected
        $year = TahunAjaran::findOrFail($id);
        $year->update(['is_active' => true]);

        return back()->with('success', 'Tahun ajaran aktif: ' . $year->tahun . ' ' . $year->semester);
    }
}
