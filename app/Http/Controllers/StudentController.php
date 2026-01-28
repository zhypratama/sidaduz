<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->has('search')) {
            $query->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nipd', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('per_page', 10);
        $students = $query->with('kelas')->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Siswa/Index', [
            'students' => $students,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Siswa/Create', [
            'kelas' => Kelas::orderBy('nama')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nipd' => 'nullable|unique:students,nipd',
            'nisn' => 'nullable|unique:students,nisn',
            'nik' => 'nullable|unique:students,nik',
            'jenis_kelamin' => 'required|in:L,P',
            'kelas_id' => 'nullable|exists:kelas,id',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'agama' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'nama_ayah' => 'nullable|string',
            'pekerjaan_ayah' => 'nullable|string',
            'no_telp_ayah' => 'nullable|string',
            'nama_ibu' => 'nullable|string',
            'pekerjaan_ibu' => 'nullable|string',
            // 'no_telp_ibu' => 'nullable|string',
            'status' => 'required|in:aktif,lulus,mutasi_keluar,dikeluarkan,meninggal_dunia',
            'kelas_temp' => 'nullable|string',
        ]);

        Student::create($validated);

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $siswa)
    {
        return Inertia::render('Siswa/Edit', [
            'student' => $siswa,
            'kelas' => Kelas::orderBy('nama')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $siswa)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nipd' => 'nullable|unique:students,nipd,' . $siswa->id,
            'nisn' => 'nullable|unique:students,nisn,' . $siswa->id,
            'nik' => 'nullable|unique:students,nik,' . $siswa->id,
            'jenis_kelamin' => 'required|in:L,P',
            'kelas_id' => 'nullable|exists:kelas,id',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'alamat' => 'nullable|string',
            'rt' => 'nullable|string',
            'rw' => 'nullable|string',
            'dusun' => 'nullable|string',
            'desa_kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'jenis_tinggal' => 'nullable|string',
            'alat_transportasi' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'email' => 'nullable|email',
            'skhun' => 'nullable|string',
            'no_peserta_un' => 'nullable|string',
            'no_seri_ijazah' => 'nullable|string',
            
            // Orang Tua / Wali
            'nama_ayah' => 'nullable|string',
            'tahun_lahir_ayah' => 'nullable|string',
            'pendidikan_ayah' => 'nullable|string',
            'pekerjaan_ayah' => 'nullable|string',
            'penghasilan_ayah' => 'nullable|string',
            'nik_ayah' => 'nullable|string',
            
            'nama_ibu' => 'nullable|string',
            'tahun_lahir_ibu' => 'nullable|string',
            'pendidikan_ibu' => 'nullable|string',
            'pekerjaan_ibu' => 'nullable|string',
            'penghasilan_ibu' => 'nullable|string',
            'nik_ibu' => 'nullable|string',
            
            'nama_wali' => 'nullable|string',
            'tahun_lahir_wali' => 'nullable|string',
            'pendidikan_wali' => 'nullable|string',
            'pekerjaan_wali' => 'nullable|string',
            'penghasilan_wali' => 'nullable|string',
            'nik_wali' => 'nullable|string',

            // Periodik
            'tinggi_badan' => 'nullable|numeric',
            'berat_badan' => 'nullable|numeric',
            'lingkar_kepala' => 'nullable|numeric',
            'jarak_rumah_ke_sekolah' => 'nullable|string',
            'jml_saudara_kandung' => 'nullable|numeric',
            'anak_ke' => 'nullable|numeric',

            // KIP / PIP / Bank
            'penerima_kps' => 'boolean',
            'no_kps' => 'nullable|string',
            'penerima_kip' => 'boolean',
            'no_kip' => 'nullable|string',
            'nama_di_kip' => 'nullable|string',
            'layak_pip' => 'boolean',
            'alasan_layak_pip' => 'nullable|string',
            'bank' => 'nullable|string',
            'no_rekening_bank' => 'nullable|string',
            'rekening_atas_nama' => 'nullable|string',

            'status' => 'required|in:aktif,lulus,mutasi_keluar,dikeluarkan,meninggal_dunia',
            'kelas_temp' => 'nullable|string',
        ]);

        $siswa->update($validated);

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $siswa)
    {
        $siswa->delete();
        return redirect()->back()->with('success', 'Data siswa berhasil dihapus.');
    }

    /**
     * Remove ALL resources from storage.
     */
    public function destroyAll()
    {
        // Option 1: Truncate (Fastest, resets ID, ignores events) -> Student::truncate();
        // Option 2: Delete query (Fast, keeps ID sequence, handles some events) -> Student::query()->delete();
        // Chosen: Query delete for safety regarding foreign keys if set to cascade in DB, or to run model events if needed.
        
        $count = Student::count();
        if ($count === 0) {
            return redirect()->back()->with('error', 'Tidak ada data siswa untuk dihapus.');
        }

        Student::query()->delete();
        
        return redirect()->back()->with('success', "Berhasil menghapus seluruh data siswa ($count data).");
    }

    // --- Manajemen Akun Siswa ---
    public function akun(Request $request)
    {
        $query = Student::with('user');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nipd', 'like', '%' . $request->search . '%')
                  ->orWhere('nisn', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = $request->input('per_page', 10);
        $students = $query->latest()->paginate($perPage)->withQueryString();
        
        return Inertia::render('Siswa/Akun', [
            'students' => $students,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    public function storeAkun($id)
    {
        $student = Student::findOrFail($id);
        
        // Cek jika sudah punya akun
        if ($student->user_id) {
            return back()->with('error', 'Siswa ini sudah memiliki akun.');
        }

        // Generate Email: NISN@sidadu.id (fallback nipd if nisn null)
        $email = $student->email ?? ($student->nisn ? $student->nisn . '@sidadu.id' : $student->nipd . '@sidadu.id');

        // Buat User Baru
        $user = \App\Models\User::create([
            'name' => $student->nama_lengkap,
            'email' => $email,
            'password' => bcrypt('Sidadu@' . ($student->nisn ?? '123')), // Default password pattern for compliance
        ]);

        $user->assignRole('Siswa');

        // Update Student
        $student->update(['user_id' => $user->id]);

        return back()->with('success', 'Akun berhasil dibuat. Password default: Sidadu@' . ($student->nisn ?? '123'));
    }

    public function resetPassword($id)
    {
        $student = Student::findOrFail($id);
        if (!$student->user_id) return back()->with('error', 'Siswa belum memiliki akun.');

        $pass = 'Sidadu@' . ($student->nisn ?? '123');
        $student->user->update([
            'password' => bcrypt($pass)
        ]);

        return back()->with('success', 'Password berhasil direset ke: ' . $pass);
    }

    public function generateAll()
    {
        // Optimization: Increase time and memory limits
        set_time_limit(600); 
        ini_set('memory_limit', '512M');

        $students = Student::whereNull('user_id')->get();
        // Optimization: Fetch all existsing emails once for O(1) lookup
        // Using toArray and array_flip for fast hash map lookup
        $existingEmails = \App\Models\User::pluck('email')->toArray();
        $existingEmailsMap = array_flip($existingEmails);
        
        $count = 0;
        // Optimization: Pre-compute default password hash
        $defaultPassHash = bcrypt('Sidadu@123'); 

        DB::beginTransaction();
        try {
            foreach ($students as $student) {
                // Generate Email: NISN@sidadu.id (fallback nipd)
                $email = $student->email ?? ($student->nisn ? $student->nisn . '@sidadu.id' : $student->nipd . '@sidadu.id');
                
                // Fast check using memory map
                if (isset($existingEmailsMap[$email])) continue;

                // Hash password (compute only if distinct from default)
                $password = $student->nisn ? bcrypt('Sidadu@' . $student->nisn) : $defaultPassHash;

                $user = \App\Models\User::create([
                    'name' => $student->nama_lengkap,
                    'email' => $email,
                    'password' => $password,
                ]);

                $user->assignRole('Siswa');
                $student->update(['user_id' => $user->id]);
                
                // Add to map to prevent duplicates in this run
                $existingEmailsMap[$email] = true;
                $count++;
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal generate akun: ' . $e->getMessage());
        }

        return back()->with('success', "Berhasil membuat $count akun siswa baru.");
    }

    public function resetAllAccounts()
    {
        $students = Student::whereNotNull('user_id')->with('user')->get();
        $count = 0;
        foreach ($students as $student) {
            if ($student->user) {
                $student->user->delete();
                $student->update(['user_id' => null]);
                $count++;
            }
        }
        return back()->with('success', "$count akun siswa berhasil dihapus. Silakan generate ulang.");
    }
    // --- Import & Export ---
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        $import = new \App\Imports\StudentImport;
        try {
            \Maatwebsite\Excel\Facades\Excel::import($import, $request->file('file'));
            return back()->with('success', "Import berhasil! {$import->created} siswa baru, {$import->updated} diperbarui. Total dibaca: {$import->rowsCount}");
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal import: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\StudentTemplateExport, 'template_siswa_dapodik.xlsx');
    }
}
