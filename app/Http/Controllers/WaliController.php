<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class WaliController extends Controller
{
    // Show Login Page
    public function showLogin()
    {
        return Inertia::render('Wali/Login', [
            'school_logo_url' => SchoolProfile::first()?->logo_url,
            'wa_number' => \App\Models\AppSetting::where('key', 'wa_sender_number')->value('value')
        ]);
    }

    // Handle Login
    public function login(Request $request)
    {
        $request->validate([
            'nama_ibu' => 'required|string',
            'password' => 'required|string', // Format DDMMYYYY
        ]);

        // Logic: Find students with this Mother's Name
        // In real app, name matching is tricky (Use exact match for now)
        $students = Student::where('nama_ibu', $request->nama_ibu)->get();

        if ($students->isEmpty()) {
            return back()->withErrors(['nama_ibu' => 'Nama Ibu tidak ditemukan di database.']);
        }

        // Check Password (Date of Birth of ANY of the children)
        // Format Input: DDMMYYYY
        // Database Format: YYYY-MM-DD
        
        $isAuthenticated = false;
        
        foreach ($students as $student) {
            // Convert DB date to DDMMYYYY
            $dob = date('dmY', strtotime($student->tanggal_lahir));
            // Or maybe using NIS? The prompt suggested "Username nama ibu". 
            // I previously suggested "Password default date of birth".
            
            if ($request->password === $dob || $request->password === $student->nis) {
                $isAuthenticated = true;
                break;
            }
        }

        if (!$isAuthenticated) {
            return back()->withErrors(['password' => 'Password salah (Gunakan Tgl Lahir DDMMYYYY atau NIS).']);
        }

        // Success: Store in Session
        Session::put('wali_logged_in', true);
        Session::put('wali_nama_ibu', $request->nama_ibu);
        
        // Store IDs of children to avoid re-querying by name every time
        Session::put('wali_student_ids', $students->pluck('id')->toArray());

        return redirect()->route('wali.dashboard');
    }

    public function logout()
    {
        Session::forget(['wali_logged_in', 'wali_nama_ibu', 'wali_student_ids']);
        return redirect()->route('wali.login');
    }

    public function dashboard()
    {
        if (!Session::get('wali_logged_in')) {
            return redirect()->route('wali.login');
        }

        $studentIds = Session::get('wali_student_ids');
        $students = Student::whereIn('id', $studentIds)
            ->with(['kelas', 'presensis' => function($q) {
                $q->latest()->take(1); // Latest attendance
            }, 'pelanggarans', 'prestasis'])
            ->get();

        return Inertia::render('Wali/Dashboard', [
            'students' => $students,
            'nama_ibu' => Session::get('wali_nama_ibu')
        ]);
    }
}
