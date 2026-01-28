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
        Schema::create('jenis_pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->enum('kategori', ['Ringan', 'Sedang', 'Berat', 'Sangat Berat']);
            $table->string('nama_pelanggaran');
            $table->integer('poin')->default(0);
            $table->string('tindakan_biasa')->nullable(); // Default follow-up action
            $table->timestamps();
        });

        Schema::create('pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('jenis_pelanggaran_id')->constrained('jenis_pelanggarans')->onDelete('restrict');
            $table->foreignId('pelapor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('tanggal_kejadian');
            $table->text('catatan')->nullable();
            $table->enum('status', ['Pending', 'Diproses', 'Selesai'])->default('Pending');
            $table->integer('poin_saat_ini')->default(0); // Snapshot of point value
            $table->timestamps();
        });

        Schema::create('konselings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('guru_bk_id')->constrained('users')->onDelete('cascade');
            $table->enum('jenis_layanan', ['Individu', 'Kelompok', 'Karir', 'Belajar', 'Sosial']);
            $table->text('masalah');
            $table->text('hasil')->nullable();
            $table->dateTime('tanggal_konseling');
            $table->text('tindak_lanjut')->nullable();
            $table->timestamps();
        });

        Schema::create('prestasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('students')->onDelete('cascade');
            $table->string('nama_prestasi');
            $table->enum('tingkat', ['Sekolah', 'Kecamatan', 'Kota/Kabupaten', 'Provinsi', 'Nasional', 'Internasional']);
            $table->integer('poin_apresiasi')->default(0);
            $table->date('tanggal');
            $table->string('bukti_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestasis');
        Schema::dropIfExists('konselings');
        Schema::dropIfExists('pelanggarans');
        Schema::dropIfExists('jenis_pelanggarans');
    }
};
