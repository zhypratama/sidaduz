<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MataPelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mapels = \App\Models\MataPelajaran::orderBy('urutan')->orderBy('nama')->get();
        return \Inertia\Inertia::render('MataPelajaran/Index', [
            'mapels' => $mapels
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:50|unique:mata_pelajarans,kode',
            'kelompok' => 'nullable|string|max:50',
        ]);

        // Auto assign urutan to last
        $lastOrder = \App\Models\MataPelajaran::max('urutan') ?? 0;
        $validated['urutan'] = $lastOrder + 1;

        \App\Models\MataPelajaran::create($validated);

        return back()->with('success', 'Mata Pelajaran berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mapel = \App\Models\MataPelajaran::findOrFail($id);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:50|unique:mata_pelajarans,kode,' . $id,
            'kelompok' => 'nullable|string|max:50',
        ]);

        $mapel->update($validated);

        return back()->with('success', 'Mata Pelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mapel = \App\Models\MataPelajaran::findOrFail($id);
        $mapel->delete();

        return back()->with('success', 'Mata Pelajaran berhasil dihapus.');
    }

    /**
     * Reorder items
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:mata_pelajarans,id'
        ]);

        // Update order based on index in the array
        foreach ($request->ids as $index => $id) {
            \App\Models\MataPelajaran::where('id', $id)->update(['urutan' => $index + 1]);
        }

        return back()->with('success', 'Urutan berhasil disimpan.');
    }
}
