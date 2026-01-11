<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SchoolProfileController extends Controller
{
    public function index()
    {
        $profile = SchoolProfile::first();
        return Inertia::render('Sekolah/Profil', [
            'profile' => $profile
        ]);
    }

    public function update(Request $request)
    {
        $profile = SchoolProfile::firstOrNew();

        $validated = $request->validate([
            'nama_sekolah' => 'required',
            'singkatan' => 'nullable|max:20',
            'npsn' => 'nullable',
            'alamat' => 'nullable',
            'kepala_sekolah' => 'nullable',
            'nip_kepala_sekolah' => 'nullable',
            'logo' => 'nullable|image|max:2048',
            'kop_surat' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($profile->logo && Storage::disk('public')->exists($profile->logo)) {
                Storage::disk('public')->delete($profile->logo);
            }
            $validated['logo'] = $request->file('logo')->store('school', 'public');
        }

        if ($request->hasFile('kop_surat')) {
            // Delete old kop_surat if exists
            if ($profile->kop_surat && Storage::disk('public')->exists($profile->kop_surat)) {
                Storage::disk('public')->delete($profile->kop_surat);
            }
            $validated['kop_surat'] = $request->file('kop_surat')->store('school/kop', 'public');
        }

        $profile->fill($validated);
        $profile->save();

        return back()->with('success', 'Profil sekolah berhasil diperbarui!');
    }
}
