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
        Schema::create('berita_acaras', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->time('waktu');
            $table->foreignId('pelapor_id')->constrained('users')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('kategori'); // Pelanggaran, Kejadian, Lainnya
            $table->string('file_bukti')->nullable();
            $table->timestamps();
        });

        Schema::create('buku_tamus', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->time('waktu_masuk');
            $table->time('waktu_keluar')->nullable();
            $table->string('nama');
            $table->string('asal_instansi')->nullable();
            $table->string('keperluan');
            $table->string('bertemu_dengan')->nullable(); 
            $table->string('no_hp')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });
        
        // Seed default school hours if not exists
        if (\Illuminate\Support\Facades\Schema::hasTable('app_settings')) {
             \Illuminate\Support\Facades\DB::table('app_settings')->insertOrIgnore([
                 ['key' => 'jam_masuk_sekolah', 'value' => '07:00', 'group' => 'piket', 'label' => 'Jam Masuk Sekolah', 'type' => 'time', 'created_at' => now(), 'updated_at' => now()],
                 ['key' => 'jam_pulang_sekolah', 'value' => '15:00', 'group' => 'piket', 'label' => 'Jam Pulang Sekolah', 'type' => 'time', 'created_at' => now(), 'updated_at' => now()],
             ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buku_tamus');
        Schema::dropIfExists('berita_acaras');
    }
};
