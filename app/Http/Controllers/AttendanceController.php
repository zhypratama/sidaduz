<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Kelas;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::query()->with('student');

        // Filter by Month & Year (Default to current)
        $bulan = $request->input('bulan', date('n'));
        $tahun = $request->input('tahun', date('Y'));
        
        $query->where('bulan', $bulan)->where('tahun', $tahun);

        // Filter by Kelas (via Student)
        if ($request->has('kelas') && $request->kelas !== 'all') {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('kelas_temp', $request->kelas);
            });
        }

        // Search by Name/NIS
        if ($request->has('search')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nipd', 'like', '%' . $request->search . '%');
            });
        }

        $attendances = $query->paginate(10)->withQueryString();
        $kelas_list = Kelas::orderBy('urutan')->get();

        return Inertia::render('Absensi/Index', [
            'attendances' => $attendances,
            'kelas_list' => $kelas_list,
            'filters' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'kelas' => $request->kelas,
                'search' => $request->search
            ]
        ]);
    }

    public function import(Request $request) 
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer'
        ]);

        try {
            $path = $request->file('file')->getRealPath();
            $data = array_map('str_getcsv', file($path)); // Basic CSV parsing or use Library
            // For robustness, usually we use Maatwebsite/Excel dedicated import class. 
            // Here implementing basic logic for simplicity or placeholder.
            
            // Note: Use Maatwebsite Import class ideally. 
            // For now, let's assume valid excel and just redirect back with "Not Implemented Yet" 
            // or implement simple logic if library is available.
            return back()->with('error', 'Fitur Import sedang dikembangkan. Gunakan Input Manual sementara.');
        } catch (\Exception $e) {
             return back()->with('error', 'Gagal import: ' . $e->getMessage());
        }
    }
    
    public function export(Request $request)
    {
        // Export logic (e.g. using Maatwebsite/Excel)
        return back()->with('error', 'Fitur Export sedang dikembangkan.');
    }
}
