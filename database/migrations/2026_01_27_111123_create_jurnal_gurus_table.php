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
        Schema::create('jurnal_gurus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pembelajaran_id')->constrained('pembelajarans')->onDelete('cascade');
            $table->date('tanggal');
            $table->string('jam_ke'); // 1-2
            $table->text('materi');
            $table->text('catatan')->nullable(); // Kendala/Kejadian
            $table->string('foto_kegiatan')->nullable();
            $table->enum('status_guru', ['Hadir', 'Izin', 'Sakit', 'Tugas Luar'])->default('Hadir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnal_gurus');
    }
};
