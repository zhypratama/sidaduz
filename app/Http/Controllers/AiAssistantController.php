<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use Illuminate\Support\Str;

class AiAssistantController extends Controller
{
    public function chat(Request $request)
    {
        $message = strtolower($request->input('message', ''));
        $user = auth()->user()->name;

        // Default Response
        $response = [
            'text' => "Maaf, saya belum mengerti perintah itu. Coba ketik 'Bantuan' untuk lihat apa yang saya bisa.",
            'action' => null,
            'url' => null
        ];

        // --- 0. HELP & GREETINGS ---
        if (preg_match('/(halo|hai|hi|pagi|siang|sore|assalam)/', $message)) {
            $response['text'] = "Halo $user! 👋 Saya siap membantu. \n\nCoba perintah ini:\n- **\"Jumlah siswa\"** (Statistik)\n- **\"Tambah surat masuk\"** (Navigasi Cepat)\n- **\"Cari siswa Budi\"** (Pencarian)\n- **\"Siswa terbaru\"** (Cek Data Terakhir)";
            return response()->json($response);
        }

        if (preg_match('/(bantuan|help|menu|fitur)/', $message)) {
            $response['text'] = "**Pusat Komando SIDADU** 🤖\n\nSaya bisa membantu Anda dengan perintah teks:\n\n1. **Navigasi Cepat:** \n   - \"Buka data siswa\", \"Ke pengaturan\", \"Input pelanggaran\"\n2. **Statistik Data:** \n   - \"Total siswa\", \"Jumlah guru\", \"Ada berapa surat masuk\"\n3. **Pencarian Pintar:** \n   - \"Cari siswa [nama]\", \"Cari guru [nama]\"\n4. **Data Terakhir:** \n   - \"Siswa baru daftar\", \"Surat terakhir\"";
            return response()->json($response);
        }

        // --- 1. SMART NAVIGATION (REGEX MAPPING) ---
        // Map keyword to Route Name
        $navMap = [
            'dashboard|home' => 'dashboard',
            'profil sekolah|identitas' => 'profil-sekolah.index',
            'data siswa|daftar siswa|list siswa' => 'siswa.index',
            'tambah siswa|input siswa|murid baru' => 'siswa.create',
            'data guru|gtk|pengajar|staff' => 'gtk.index',
            'tambah guru|input guru' => 'gtk.create',
            'surat masuk' => 'surat-masuk.index',
            'tambah surat masuk|input surat masuk' => 'surat-masuk.create',
            'surat keluar' => 'surat-keluar.index',
            'tambah surat keluar|buat surat' => 'surat-keluar.create',
            'pelanggaran|bk|kasus' => 'bk.pelanggaran.index',
            'input pelanggaran|catat kasus' => 'bk.pelanggaran.create',
            'absensi|kehadiran|presensi' => 'absensi.index',
            'pengaturan|setting|konfigurasi' => 'settings.index',
            'profil saya|akun' => 'profile.edit',
            'mata pelajaran|mapel' => 'kurikulum.mata-pelajaran.index',
            'kalender|akademik' => 'kurikulum.kalender.index',
        ];

        foreach ($navMap as $pattern => $route) {
            if (preg_match("/(" . $pattern . ")/", $message)) {
                // Special check to avoid "tambah siswa" matching "siswa" incorrectly if logic is sloppy
                // But simplified here; if it matches specific "tambah", usually we want that. 
                // However, the loop order matters. Let's rely on specific matches first if needed, 
                // but for now this catches both "data siswa" and "tambah siswa" depending on user input.
                
                // Correction: if user types "tambah siswa", it matches 'tambah siswa'. 
                // If user types "data siswa", matches 'data siswa'.
                // If regex matches, we send valid route.
                
                try {
                    $url = route($route);
                    $response['text'] = "Siap! Membuka halaman **" . ucwords(str_replace(['.', '-', 'index'], [' ', ' ', ''], $route)) . "**...";
                    $response['action'] = 'navigate';
                    $response['url'] = $url;
                    return response()->json($response);
                } catch (\Exception $e) {
                    // Route might not exist or require params
                    continue; 
                }
            }
        }

        // --- 2. DATA STATISTICS (LIVE QUERY) ---
        
        // Count Students
        if (preg_match('/(jumlah|total|banyak)\s+(siswa|murid|peserta didik)/', $message)) {
            $count = Student::count();
            $male = Student::where('jenis_kelamin', 'L')->count();
            $female = Student::where('jenis_kelamin', 'P')->count();
            $response['text'] = "📊 **Statistik Siswa**\n\nTotal: **$count** Siswa\nLaki-laki: **$male**\nPerempuan: **$female**";
            return response()->json($response);
        }

        // Count GTK
        if (preg_match('/(jumlah|total|banyak)\s+(guru|gtk|pengajar|staff)/', $message)) {
            $count = User::role(['Guru', 'Staff', 'Tata Usaha'])->count(); // Adjust roles if needed
            $response['text'] = "Total Guru & Staff terdaftar: **$count** orang.";
            return response()->json($response);
        }

        // Count Letters
        if (preg_match('/(jumlah|total)\s+(surat)/', $message)) {
            $masuk = SuratMasuk::count();
            $keluar = SuratKeluar::count();
            $response['text'] = "📂 **Arsip Surat**\n\nSurat Masuk: **$masuk**\nSurat Keluar: **$keluar**";
            return response()->json($response);
        }

        // --- 3. SPECIFIC DATA RETRIEVAL ---

        // Find Student
        if (preg_match('/cari (siswa|murid) (.+)/', $message, $matches)) {
            $keyword = trim($matches[2]);
            $students = Student::where('nama_lengkap', 'like', "%$keyword%")
                        ->orWhere('nis', 'like', "%$keyword%")
                        ->limit(5)->get();
            
            if ($students->count() > 0) {
                $text = "🔍 Ditemukan **{$students->count()}** siswa:\n";
                foreach ($students as $s) {
                    $text .= "- **{$s->nama_lengkap}** ({$s->kelas_id}) - [Lihat](" . route('siswa.show', $s->id) . ")\n";
                }
                $response['text'] = $text;
            } else {
                $response['text'] = "Tidak ditemukan siswa dengan nama/NIS '$keyword'.";
            }
            return response()->json($response);
        }

        // Check Last Student
        if (preg_match('/(siswa|murid)\s+(terbaru|terakhir|baru)/', $message)) {
            $last = Student::latest()->first();
            if ($last) {
                $response['text'] = "🆕 **Siswa Terakhir Terdaftar:**\n\nNama: **{$last->nama_lengkap}**\nNIS: {$last->nis}\nTanggal Masuk: " . ($last->tanggal_masuk ?? '-');
                $response['action'] = 'navigate';
                $response['url'] = route('siswa.show', $last->id);
            } else {
                $response['text'] = "Belum ada data siswa.";
            }
            return response()->json($response);
        }

        // Check Last Letter (In/Out)
        if (preg_match('/surat (masuk|keluar) (terakhir|terbaru)/', $message, $m)) {
            $type = $m[1];
            if ($type == 'masuk') {
                $last = SuratMasuk::latest('created_at')->first();
                $route = 'surat-masuk.index'; // Usually show doesn't exist for modal based
                $info = $last ? "No: {$last->nomor_surat}\nPerihal: {$last->perihal}" : "Kosong";
            } else {
                $last = SuratKeluar::latest('created_at')->first();
                $route = 'surat-keluar.pdf'; // Direct PDF view
                $info = $last ? "No: {$last->nomor_surat}\nPerihal: {$last->perihal}" : "Kosong";
            }

            if ($last) {
                $response['text'] = "✉️ **Surat $type Terakhir:**\n\n$info";
                if ($type == 'keluar') {
                     // For surat keluar, maybe offer to view PDF
                     $response['action'] = 'navigate';
                     $response['url'] = route('surat-keluar.pdf', $last->id);
                }
            } else {
                $response['text'] = "Belum ada data surat $type.";
            }
            return response()->json($response);
        }

        // --- 4. SYSTEM INFO ---
        if (preg_match('/(waktu|jam|tanggal|server)/', $message)) {
            $response['text'] = "🕒 Waktu Server: " . now()->format('d F Y H:i:s') . "\nZona Waktu: " . config('app.timezone');
            return response()->json($response);
        }

        return response()->json($response);
    }
}
