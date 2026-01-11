<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('surat_keluars', function (Blueprint $table) {
            $table->id();
            $table->string('no_surat')->unique();
            $table->foreignId('klasifikasi_surat_id')->constrained('klasifikasi_surats');
            $table->string('tujuan');
            $table->string('perihal');
            $table->longText('isi_surat'); // HTML content from Smart Editor
            $table->date('tanggal_surat');
            $table->enum('jenis_surat', ['standar', 'undangan', 'tugas'])->default('standar');
            $table->enum('opsi_tanda_tangan', ['tte', 'manual', 'polos'])->default('tte'); // tte = TTE Lokal, manual = Manual + Footer QR, polos = Tanpa TTE
            $table->string('posisi_tanggal')->default('kanan_atas');
            $table->enum('status', ['draft', 'menunggu_persetujuan', 'disetujui', 'ditolak', 'terkirim', 'arsip'])->default('draft');
            $table->string('token')->nullable()->unique(); // Security Print Key
            $table->foreignId('approved_by')->nullable()->constrained('users'); // Kepala Sekolah
            $table->timestamp('approved_at')->nullable();
            
            // Layout Settings
            $table->string('paper_size')->default('F4'); // F4, A4, Letter
            $table->json('margins')->nullable(); // {top, right, bottom, left}
            
            $table->string('file_path')->nullable(); // PDF generated path
            $table->string('qrcode_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_keluars');
    }
};
