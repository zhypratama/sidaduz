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
        Schema::create('disposisi_surats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_masuk_id')->constrained('surat_masuks')->cascadeOnDelete();
            $table->foreignId('pemberi_disposisi_id')->constrained('users'); // Usually auth user
            $table->foreignId('penerima_disposisi_id')->constrained('users'); // Staff/Teacher
            $table->string('instruksi'); // Enum-like: Tindak Lanjuti, Arsip, dll
            $table->text('catatan')->nullable();
            $table->date('batas_waktu')->nullable();
            $table->enum('status', ['Belum Dibaca', 'Diproses', 'Selesai'])->default('Belum Dibaca');
            $table->timestamp('tanggal_disposisi')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disposisi_surats');
    }
};
