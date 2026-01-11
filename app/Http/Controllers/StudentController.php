<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
        }

        $students = $query->latest()->paginate(10)->withQueryString();

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
        return Inertia::render('Siswa/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nis' => 'nullable|unique:students,nis',
            'nisn' => 'nullable|unique:students,nisn',
            'nik' => 'nullable|unique:students,nik',
            'jenis_kelamin' => 'required|in:L,P',
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
            'student' => $siswa
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $siswa)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nis' => 'nullable|unique:students,nis,' . $siswa->id,
            'nisn' => 'nullable|unique:students,nisn,' . $siswa->id,
            'nik' => 'nullable|unique:students,nik,' . $siswa->id,
            'jenis_kelamin' => 'required|in:L,P',
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

    // --- Manajemen Akun Siswa ---
    public function akun()
    {
        $students = Student::with('user')->latest()->paginate(10);
        return Inertia::render('Siswa/Akun', ['students' => $students]);
    }

    public function storeAkun($id)
    {
        $student = Student::findOrFail($id);
        
        // Cek jika sudah punya akun
        if ($student->user_id) {
            return back()->with('error', 'Siswa ini sudah memiliki akun.');
        }

        // Email Fake jika tidak ada
        $email = $student->email ?? $student->nis . '@student.sekolah.id';

        // Buat User Baru
        $user = \App\Models\User::create([
            'name' => $student->nama_lengkap,
            'email' => $email,
            'password' => bcrypt($student->nisn ?? '12345678'), // Default password NISN atau 12345678
        ]);

        $user->assignRole('Siswa');

        // Update Student
        $student->update(['user_id' => $user->id]);

        return back()->with('success', 'Akun berhasil dibuat. Login: Email/NIS, Password: ' . ($student->nisn ?? '12345678'));
    }

    public function resetPassword($id)
    {
        $student = Student::findOrFail($id);
        if (!$student->user_id) return back()->with('error', 'Siswa belum memiliki akun.');

        $pass = $student->nisn ?? '12345678';
        $student->user->update([
            'password' => bcrypt($pass)
        ]);

        return back()->with('success', 'Password berhasil direset ke: ' . $pass);
    }
}
