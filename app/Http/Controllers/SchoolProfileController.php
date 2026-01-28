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
            'nama_sekolah' => 'nullable',
            'singkatan' => 'nullable',
            'npsn' => 'nullable',
            'alamat' => 'nullable',
            'rt' => 'nullable',
            'rw' => 'nullable',
            'kelurahan' => 'nullable',
            'kecamatan' => 'nullable',
            'kota' => 'nullable',
            'propinsi' => 'nullable',
            'kepala_sekolah' => 'nullable',
            'nip_kepala_sekolah' => 'nullable',
            'nuptk' => 'nullable',
            'ijin_nomenklatur' => 'nullable',
            'akreditasi' => 'nullable',
            'no_telp_sekolah' => 'nullable',
            'web_sekolah' => 'nullable',
            'online_url' => 'nullable|url',
            'email_sekolah' => 'nullable',
            'jam_masuk' => 'nullable',
            'jam_pulang' => 'nullable',
            'logo' => 'nullable|image',
            'login_image' => 'nullable|image',
            'kop_surat' => 'nullable|image',
            'stempel' => 'nullable|image',
            'ttd_kepala_sekolah' => 'nullable|image',
            'ttd_stempel_gabungan' => 'nullable|image',
            'tata_tertib_kartu' => 'nullable|string',
            'is_online_mode' => 'boolean',
        ]);

        // Prevent overwriting existing images with null if no new file is uploaded
        if (!($request->hasFile('logo'))) {
            unset($validated['logo']);
        }
        if (!($request->hasFile('login_image'))) {
            unset($validated['login_image']);
        }
        if (!($request->hasFile('kop_surat'))) {
            unset($validated['kop_surat']);
        }
        if (!($request->hasFile('stempel'))) {
            unset($validated['stempel']);
        }
        if (!($request->hasFile('ttd_kepala_sekolah'))) {
            unset($validated['ttd_kepala_sekolah']);
        }
        if (!($request->hasFile('ttd_stempel_gabungan'))) {
            unset($validated['ttd_stempel_gabungan']);
        }

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($profile->logo && Storage::disk('public')->exists($profile->logo)) {
                Storage::disk('public')->delete($profile->logo);
            }
            $validated['logo'] = $request->file('logo')->store('school', 'public');
        }

        if ($request->hasFile('login_image')) {
            // Delete old login_image if exists
            if ($profile->login_image && Storage::disk('public')->exists($profile->login_image)) {
                Storage::disk('public')->delete($profile->login_image);
            }
            $validated['login_image'] = $request->file('login_image')->store('school', 'public');
        }

        if ($request->hasFile('kop_surat')) {
            // Delete old kop_surat if exists
            if ($profile->kop_surat && Storage::disk('public')->exists($profile->kop_surat)) {
                Storage::disk('public')->delete($profile->kop_surat);
            }
            $validated['kop_surat'] = $request->file('kop_surat')->store('school/kop', 'public');
        }

        if ($request->hasFile('stempel')) {
            if ($profile->stempel && Storage::disk('public')->exists($profile->stempel)) {
                Storage::disk('public')->delete($profile->stempel);
            }
            $validated['stempel'] = $request->file('stempel')->store('school/stempel', 'public');
        }

        if ($request->hasFile('ttd_kepala_sekolah')) {
            if ($profile->ttd_kepala_sekolah && Storage::disk('public')->exists($profile->ttd_kepala_sekolah)) {
                Storage::disk('public')->delete($profile->ttd_kepala_sekolah);
            }
            $validated['ttd_kepala_sekolah'] = $request->file('ttd_kepala_sekolah')->store('school/ttd', 'public');
        }

        if ($request->hasFile('ttd_stempel_gabungan')) {
            if ($profile->ttd_stempel_gabungan && Storage::disk('public')->exists($profile->ttd_stempel_gabungan)) {
                Storage::disk('public')->delete($profile->ttd_stempel_gabungan);
            }
            $validated['ttd_stempel_gabungan'] = $request->file('ttd_stempel_gabungan')->store('school/ttd_gabungan', 'public');
        }

        $profile->fill($validated);
        $profile->save();

        \Cache::forget('school_profile');
        \Cache::forget('dashboard_weather');

        return back()->with('success', 'Profil sekolah berhasil diperbarui!');
    }
}
