<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Services\WhatsappService;
use Illuminate\Support\Facades\Log;
use App\Models\Presensi;

class WhatsappWebhookController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsappService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function handle(Request $request)
    {
        // Data from Node.js Gateway
        $sender = $request->input('sender'); // Phone number (e.g., 628123...)
        $message = trim($request->input('message'));
        $name = $request->input('name');

        Log::info("WhatsApp Incoming from $sender: $message");

        // 1. Check if sender is a valid parent in our database
        // Need to normalize sender number to match DB format (08... or 62...)
        // Our DB usually stores "08..." or "62...". Let's try both or fuzzy match.
        // Quick fix: Check if sender ends with last 10 digits of stored phone numbers.
        
        // Let's assume strict format for now or fuzzy.
        // Typically Node sends 628xxx. DB might have 08xxx.
        $searchNumber1 = $sender;
        $searchNumber2 = '0' . substr($sender, 2); // Convert 628 to 08

        // Broaden search to include personal student phone number as well
        $student = Student::where('no_telp_ibu', $searchNumber1)
            ->orWhere('no_telp_ibu', $searchNumber2)
            ->orWhere('no_telp_ayah', $searchNumber1)
            ->orWhere('no_telp_ayah', $searchNumber2)
            ->orWhere('no_telp', $searchNumber1)
            ->orWhere('no_telp', $searchNumber2)
            ->first();

        if (!$student) {
            Log::warning("WhatsApp Unregistered Access - Sender: $sender ($name), Message: $message");
            // FALLBACK REPLY for easier testing
            $this->whatsappService->send($sender, "Halo! Nomor ini (*$sender*) belum terdaftar sebagai Wali Murid atau Siswa di sistem SIDADU. Silakan hubungi admin sekolah.");
            return response()->json(['status' => 'ignored', 'reason' => 'unknown_number']);
        }

        Log::info("Student identified: " . $student->nama_lengkap . " (ID: " . $student->id . ")");

        // 2. Process Commands
        $reply = "";
        $lowerMsg = strtolower($message);

        if ($lowerMsg === 'menu' || $lowerMsg === 'halo' || $lowerMsg === 'hi' || $lowerMsg === 'pagi' || $lowerMsg === 'siang' || $lowerMsg === 'sore') {
            $reply = "Halo Bapak/Ibu Wali dari *{$student->nama_lengkap}* 👋\n\n"
                   . "Saya *Syafa*, Asisten Virtual SIDADU. Ketik perintah berikut:\n\n"
                   . "1️⃣ *Cek Absen* : Mengetahui kehadiran hari ini\n"
                   . "2️⃣ *Cek Nilai* : Melihat nilai terbaru\n"
                   . "3️⃣ *Cek Pelanggaran* : Info poin tata tertib\n"
                   . "4️⃣ *Info Sekolah* : Pengumuman terbaru\n\n"
                   . "📍 *Portal Informasi Sekolah*:\n"
                   . url('/statistik') . "\n\n"
                   . "_Silakan ketik angka atau teks perintahnya._";
        }
        elseif (str_contains($lowerMsg, 'cek absen') || str_contains($lowerMsg, 'hadir') || $lowerMsg == '1') {
            // Get today's attendance
            $today = now()->format('Y-m-d');
            $presensi = Presensi::where('student_id', $student->id)
                ->whereDate('tanggal', $today)
                ->first();

            if ($presensi) {
                $status = ucfirst($presensi->status ?? 'Hadir'); 
                $jam = $presensi->jam_masuk ?? '-';
                $reply = "Laporan Absensi *{$student->nama_lengkap}* Hari Ini:\n\n"
                       . "📅 Tanggal: " . now()->format('d-m-Y') . "\n"
                       . "✅ Status: *{$status}*\n"
                       . "⏰ Jam Masuk: {$jam}\n\n"
                       . "Anda juga bisa memantau Portal Informasi Publik di sini:\n"
                       . url('/statistik') . "\n\n"
                       . "Terima kasih.";
            } else {
                $reply = "Belum ada data absensi untuk *{$student->nama_lengkap}* hari ini (" . now()->format('d-m-Y') . ").\n\nSilakan pantau Portal Informasi untuk pembaruan:\n" 
                       . url('/statistik') . "\n\nSiswa mungkin belum melakukan scan atau hari ini libur.";
            }
        }
        elseif (str_contains($lowerMsg, 'cek nilai') || $lowerMsg == '2') {
             $reply = "Untuk melihat detail nilai *{$student->nama_lengkap}*, silakan login ke Portal Wali Murid:\n"
                    . url('/wali/login') . "\n\n"
                    . "👤 Username: `" . $student->nama_ibu . "`\n"
                    . "🔑 Password: `" . ($student->nis ?? 'Tanggal Lahir Siswa') . "`";
        }
        elseif (str_contains($lowerMsg, 'cek pelanggaran') || str_contains($lowerMsg, 'poin') || $lowerMsg == '3') {
             $pelanggarans = \App\Models\Pelanggaran::where('siswa_id', $student->id)
                ->with('jenisPelanggaran')
                ->latest()
                ->take(5)
                ->get();

             $totalPoin = \App\Models\Pelanggaran::where('siswa_id', $student->id)
                ->join('jenis_pelanggarans', 'pelanggarans.jenis_pelanggaran_id', '=', 'jenis_pelanggarans.id')
                ->sum('jenis_pelanggarans.poin');

             if ($pelanggarans->count() > 0) {
                 $list = "";
                 foreach ($pelanggarans as $p) {
                     $list .= "- " . $p->tanggal_kejadian->format('d/m') . ": " . $p->jenisPelanggaran->nama_pelanggaran . " (" . $p->jenisPelanggaran->poin . " poin)\n";
                 }
                 $reply = "Data Pelanggaran *{$student->nama_lengkap}*:\n\n"
                        . "🔴 *Total Poin: {$totalPoin}*\n\n"
                        . "5 Riwayat Terakhir:\n{$list}\n"
                        . "Harap bimbing putra/putri Anda agar tetap mematuhi tata tertib sekolah.";
             } else {
                 $reply = "Alhamdulillah, tidak ada data pelanggaran tercatat untuk *{$student->nama_lengkap}*.\n\nTotal Poin: *0*\n\nPertahankan prestasi dan kedisiplinannya! 🌟";
             }
        }
        elseif (str_contains($lowerMsg, 'info sekolah') || $lowerMsg == '4') {
             $reply = "Saat ini belum ada pengumuman terbaru.\n\nAnda dapat memantau informasi resmi melalui website sekolah atau grup WhatsApp wali murid.";
        }
        else {
             $reply = "Maaf, saya tidak mengerti perintah tersebut.\n\nKetik *MENU* untuk melihat daftar bantuan.";
        }

        // 3. Send Reply
        if ($reply) {
            $this->whatsappService->send($sender, $reply, 'chatbot_reply');
        }

        return response()->json(['status' => 'processed']);
    }
}
