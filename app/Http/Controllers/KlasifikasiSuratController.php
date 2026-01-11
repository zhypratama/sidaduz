<?php

namespace App\Http\Controllers;

use App\Models\KlasifikasiSurat;
use Illuminate\Http\Request;

class KlasifikasiSuratController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|unique:klasifikasi_surats,kode',
            'nama' => 'required',
        ]);

        $klasifikasi = KlasifikasiSurat::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Klasifikasi berhasil ditambahkan',
                'klasifikasi' => $klasifikasi
            ]);
        }

        return back()->with('success', 'Klasifikasi berhasil ditambahkan');
    }
}
