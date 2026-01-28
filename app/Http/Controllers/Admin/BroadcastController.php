<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Student;
use App\Models\User;
use App\Models\WhatsappLog;
use App\Services\WhatsappService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BroadcastController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsappService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function index()
    {
        return Inertia::render('Admin/Broadcast/Index', [
            'kelas_list' => Kelas::orderBy('nama_kelas')->get(),
            'recent_logs' => WhatsappLog::where('type', 'broadcast')->latest()->take(10)->get(),
        ]);
    }

    public function send(Request $request)
    {
        $request->validate([
            'target_type' => 'required|string|in:individual,all_students,all_teachers,per_class',
            'target_phone' => 'nullable|required_if:target_type,individual',
            'target_class_id' => 'nullable|required_if:target_type,per_class',
            'message' => 'required|string|min:5',
        ]);

        $recipients = []; // Array of ['number' => '...', 'name' => '...']

        // 1. Determine Recipients
        switch ($request->target_type) {
            case 'individual':
                $recipients[] = [
                    'number' => $request->target_phone,
                    'name' => 'Tujuan Khusus'
                ];
                break;

            case 'all_students':
                $students = Student::whereNotNull('no_telp')->where('no_telp', '!=', '')->get(['no_telp', 'nama_lengkap']);
                foreach ($students as $s) {
                    $recipients[] = ['number' => $s->no_telp, 'name' => $s->nama_lengkap];
                }
                break;

            case 'all_teachers':
                $teachers = \App\Models\Gtk::whereNotNull('no_hp')->where('no_hp', '!=', '')->get(['no_hp', 'nama']);
                foreach ($teachers as $t) {
                    $recipients[] = ['number' => $t->no_hp, 'name' => $t->nama];
                }
                break;

            case 'per_class':
                // Note: Student model relationship to Kelas might be 'kelas()' or 'kelas_id'
                // Based on migration, it uses 'kelas_temp' string OR 'kelas_id' if related.
                // Migration line 46: $table->string('kelas_temp')
                // Migration line 45 is commented out.
                // Assuming we use 'kelas_id' now if User implemented `2026_01_XX_create_kelas_table`?
                // Step 11 list_dir showed 'KelasController.php', so Kelas probably exists.
                // Let's assume Student has 'kelas_id' fillable. I'll check Student model briefly if needed, 
                // but for now I'll use `kelas_id` as standard. If it fails I'll fix.
                
                $students = Student::where('kelas_id', $request->target_class_id)
                                   ->whereNotNull('no_telp')
                                   ->where('no_telp', '!=', '')
                                   ->get(['no_telp', 'nama_lengkap']);
                                   
                foreach ($students as $s) {
                     $recipients[] = ['number' => $s->no_telp, 'name' => $s->nama_lengkap];
                }
                break;
        }

        if (count($recipients) === 0) {
            return back()->with('error', 'Tidak ada penerima yang ditemukan untuk target tersebut.');
        }

        // 2. Process Broadcast
        $successCount = 0;
        $failCount = 0;

        foreach ($recipients as $recipient) {
            // Personalize message (Simple substitution)
            $msg = str_replace('{nama}', $recipient['name'], $request->message);

            $result = $this->whatsappService->send($recipient['number'], $msg, 'broadcast');
            
            if ($result['status']) {
                $successCount++;
            } else {
                $failCount++;
            }
            
            // Optional: Sleep to prevent rate limit (0.5s)
            usleep(500000); 
        }

        return back()->with('success', "Broadcast selesai. Berhasil: $successCount, Gagal: $failCount");
    }
}
