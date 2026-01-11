<?php

namespace App\Http\Controllers;

use App\Models\Gtk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GtkController extends Controller
{
    public function index()
    {
        // Show recently updated items first so users see import results
        $gtks = Gtk::orderBy('updated_at', 'desc')->paginate(request('per_page', 10));
        return Inertia::render('GTK/Index', [
            'gtks' => $gtks
        ]);
    }
    
    // ...

    // ...

    public function create()
    {
        return Inertia::render('GTK/Create');
    }

    public function store(Request $request)
    {
        // ... (truncated for brevity, no changes here)
        $validated = $request->validate([
             // ...
        ]);
        // ...
    }
    // ...

    public function import(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        try {
            $importer = new \App\Imports\GtkImport;
            \Maatwebsite\Excel\Facades\Excel::import($importer, $request->file('file'));
            
            return back()->with('success', 'Import Selesai! ' . $importer->rowsCount . ' baris diproses (' . $importer->created . ' baru, ' . $importer->updated . ' diupdate).');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal import data: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\GtkTemplateExport, 'template_import_gtk.xls');
    }

    public function edit(Gtk $gtk)
    {
        return Inertia::render('GTK/Edit', [
            'gtk' => $gtk
        ]);
    }

    public function update(Request $request, Gtk $gtk)
    {
        // Validation similar to store but nullable for file
        $validated = $request->validate([
            'nama' => 'required',
            'nik' => 'nullable',
            'no_kk' => 'nullable',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable',
            'tanggal_lahir' => 'nullable|date',
            'nama_ibu_kandung' => 'nullable',
            'agama' => 'nullable',
            'kewarganegaraan' => 'nullable',
            'status_perkawinan' => 'nullable',
            'nama_suami_istri' => 'nullable',
            'pekerjaan_suami_istri' => 'nullable',
            
            'alamat' => 'nullable',
            'rt' => 'nullable',
            'rw' => 'nullable',
            'nama_dusun' => 'nullable',
            'desa_kelurahan' => 'nullable',
            'kecamatan' => 'nullable',
            'kode_pos' => 'nullable',
            'no_hp' => 'nullable',
            'email' => 'nullable|email',
            'lintang' => 'nullable',
            'bujur' => 'nullable',

            'nip' => 'nullable',
            'nuptk' => 'nullable',
            'jenis_ptk' => 'required',
            'status_kepegawaian' => 'required',
            'sk_pengangkatan' => 'nullable',
            'tmt_pengangkatan' => 'nullable|date',
            'lembaga_pengangkatan' => 'nullable',
            'sk_cpns' => 'nullable',
            'tmt_cpns' => 'nullable|date',
            'pangkat_golongan' => 'nullable',
            'sumber_gaji' => 'nullable',

            'tugas_tambahan' => 'nullable',
            'npwp' => 'nullable',
            'nama_wajib_pajak' => 'nullable',
            'bank' => 'nullable',
            'nomor_rekening_bank' => 'nullable',
            'rekening_atas_nama' => 'nullable',
            'sudah_lisensi_kepala_sekolah' => 'nullable',
            'keahlian_braille' => 'nullable',
            'keahlian_bahasa_isyarat' => 'nullable',
            
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            // Delete old photo
            if ($gtk->foto && Storage::disk('public')->exists($gtk->foto)) {
                Storage::disk('public')->delete($gtk->foto);
            }
            $validated['foto'] = $request->file('foto')->store('foto-gtk', 'public');
        } else {
            unset($validated['foto']);
        }

        // Map jenis_ptk to jabatan for backward compatibility
        $validated['jabatan'] = $validated['jenis_ptk'];

        $gtk->update($validated);
        
        return redirect()->route('gtk.index')->with('success', 'Data GTK berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $gtk = Gtk::findOrFail($id);
        
        // Delete Photo if exists
        if ($gtk->foto && Storage::disk('public')->exists($gtk->foto)) {
            Storage::disk('public')->delete($gtk->foto);
        }

        // Delete User Account if exists
        if ($gtk->user_id) {
            $user = \App\Models\User::find($gtk->user_id);
            if ($user) $user->delete();
        }

        $gtk->delete();

        return back()->with('success', 'Data GTK berhasil dihapus.');
    }

    // --- Manajemen Akun ---
    public function akun()
    {
        $gtks = Gtk::with('user')->latest()->paginate(request('per_page', 10));
        return Inertia::render('GTK/Akun', ['gtks' => $gtks]);
    }

    public function storeAkun($id)
    {
        $gtk = Gtk::findOrFail($id);
        
        // Cek jika sudah punya akun
        if ($gtk->user_id) {
            return back()->with('error', 'GTK ini sudah memiliki akun.');
        }

        // Buat User Baru
        $email = $gtk->email ?? $gtk->nip ?? (strtolower(str_replace(' ', '.', $gtk->nama)) . '@sekolah.id');

        $user = \App\Models\User::create([
            'name' => $gtk->nama,
            'email' => $email,
            'password' => bcrypt('12345678'), // Default password
        ]);

        // Assign Role based on Jabatan (Simplified)
        // $user->assignRole('Guru'); 

        // Update GTK
        $gtk->update(['user_id' => $user->id]);

        return back()->with('success', 'Akun berhasil dibuat. Email: ' . $user->email . ' | Pass: 12345678');
    }

    public function generateAll()
    {
        $gtks = Gtk::whereNull('user_id')->get();
        $count = 0;

        foreach ($gtks as $gtk) {
            // Determine email: Real Email -> NIP -> NUPTK -> Cleaned Name
            $email = $gtk->email;
            
            if (!$email) $email = $gtk->nip;
            if (!$email) $email = $gtk->nuptk;
            if (!$email) $email = strtolower(str_replace(' ', '.', $gtk->nama)) . '@sekolah.id';

            // Ensure unique email (simple append if exists, though unlikely in bulk init)
            if (\App\Models\User::where('email', $email)->exists()) {
                $email = str_replace('@', rand(10,99).'@', $email);
            }

            try {
                $user = \App\Models\User::create([
                    'name' => $gtk->nama,
                    'email' => $email,
                    'password' => bcrypt('12345678'),
                ]);

                // Assign Role (Default Guru)
                // $user->assignRole('Guru');

                $gtk->update(['user_id' => $user->id]);
                $count++;
            } catch (\Exception $e) {
                // Skip if fail
            }
        }

        return back()->with('success', "Berhasil membuat $count akun GTK otomatis.");
    }

    public function resetAccount($id)
    {
        $gtk = Gtk::findOrFail($id);
        
        if ($gtk->user) {
            $gtk->user->delete();
        }
        $gtk->update(['user_id' => null]);

        return $this->storeAkun($id);
    }

    public function resetAllAccounts()
    {
        $gtks = Gtk::whereNotNull('user_id')->get();
        foreach ($gtks as $gtk) {
            if ($gtk->user) {
                try {
                    $gtk->user->delete();
                } catch (\Exception $e) {}
            }
            $gtk->update(['user_id' => null]);
        }

        return $this->generateAll();
    }

    public function resetPassword($id)
    {
        $gtk = Gtk::findOrFail($id);
        if (!$gtk->user_id) return back()->with('error', 'GTK belum memiliki akun.');

        $gtk->user->update([
            'password' => bcrypt('12345678')
        ]);

        return back()->with('success', 'Password berhasil direset ke 12345678');
    }

    // --- Manajemen Piket ---
    public function piket()
    {
        $gtks = Gtk::orderBy('nama')->get();
        // Grouping piket by hari
        $pikets = \App\Models\JadwalPiket::with('gtk')->get()->groupBy('hari');
        
        return Inertia::render('GTK/Piket', [
            'gtks' => $gtks,
            'pikets' => $pikets
        ]);
    }

    public function storePiket(Request $request)
    {
        $validated = $request->validate([
            'gtk_id' => 'required|exists:gtks,id',
            'hari' => 'required',
            'tahun_ajaran' => 'required',
            'semester' => 'required',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
        ]);

        \App\Models\JadwalPiket::create($validated);

        return back()->with('success', 'Petugas piket berhasil ditambahkan!');
    }

    // --- Manajemen Role ---
    public function roleIndex()
    {
        // Get GTK that has User Account
        $gtks = Gtk::whereNotNull('user_id')
            ->with(['user.roles'])
            ->latest()
            ->paginate(request('per_page', 10));
            
        $roles = \Spatie\Permission\Models\Role::all();

        return Inertia::render('GTK/Role', [
            'gtks' => $gtks,
            'roles' => $roles
        ]);
    }

    public function roleUpdate(Request $request, $id)
    {
        $request->validate([
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name'
        ]);

        $gtk = Gtk::findOrFail($id);
        
        if ($gtk->user) {
            $gtk->user->syncRoles($request->roles ?? []);
            return back()->with('success', 'Role berhasil diperbarui!');
        }

        return back()->with('error', 'GTK ini belum memiliki akun User.');
    }
    public function exportRole()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\UserRoleExport, 'data_role_user_' . date('Y-m-d_H-i') . '.xlsx');
    }
}
