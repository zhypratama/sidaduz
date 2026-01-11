<?php

namespace App\Http\Controllers;

use App\Models\SuratTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuratTemplateController extends Controller
{
    public function index()
    {
        $templates = SuratTemplate::latest()->get();
        return Inertia::render('Surat/Template/Index', ['templates' => $templates]);
    }

    public function create()
    {
        $klasifikasis = \App\Models\KlasifikasiSurat::all();
        return Inertia::render('Surat/Template/Create', ['klasifikasis' => $klasifikasis]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'kategori' => 'nullable',
            'isi_surat' => 'required',
            'klasifikasi_surat_id' => 'nullable|exists:klasifikasi_surats,id',
        ]);

        SuratTemplate::create($validated);

        return redirect()->route('surat-template.index')->with('success', 'Template berhasil dibuat');
    }

    public function edit($id)
    {
        $template = SuratTemplate::findOrFail($id);
        $klasifikasis = \App\Models\KlasifikasiSurat::all();
        return Inertia::render('Surat/Template/Create', [
            'template' => $template,
            'klasifikasis' => $klasifikasis
        ]); 
    }

    public function update(Request $request, $id)
    {
        $template = SuratTemplate::findOrFail($id);
        
        $validated = $request->validate([
            'nama' => 'required',
            'kategori' => 'nullable',
            'isi_surat' => 'required',
            'klasifikasi_surat_id' => 'nullable|exists:klasifikasi_surats,id',
        ]);

        $template->update($validated);

        return redirect()->route('surat-template.index')->with('success', 'Template berhasil diperbarui');
    }

    public function destroy($id)
    {
        SuratTemplate::findOrFail($id)->delete();
        return back()->with('success', 'Template berhasil dihapus');
    }
}
