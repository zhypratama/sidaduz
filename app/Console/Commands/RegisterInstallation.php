<?php

namespace App\Console\Commands;

use App\Services\ActivationService;
use Illuminate\Console\Command;

class RegisterInstallation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:register-installation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mendaftarkan instalasi sekolah ke pusat kendali (Patuh PDP)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('===========================================================');
        $this->info('          SIDADU - REGISTRASI INSTALASI SEKOLAH');
        $this->info('===========================================================');
        $this->line('');
        $this->line('Proses ini akan mengirimkan metadata institusi Anda (Nama Sekolah,');
        $this->line('NPSN, Versi) ke pengembang untuk tujuan dukungan teknis.');
        $this->line('Sesuai UU PDP, kami menjamin TIDAK ADA data pribadi siswa/guru');
        $this->line('yang dikirim dalam proses ini.');
        $this->line('');

        if ($this->confirm('Apakah Anda setuju untuk mendaftarkan instalasi ini?', true)) {
            $this->warn('Sedang mendaftarkan...');
            
            if (ActivationService::registerInstallation()) {
                $this->info('[OK] Instalasi berhasil terdaftar. Terima kasih!');
            } else {
                $this->error('[GAGAL] Gagal menghubungi server pendaftaran. Coba lagi nanti.');
            }
        } else {
            $this->comment('Registrasi dibatalkan oleh pengguna.');
        }
        
        $this->line('');
    }
}
