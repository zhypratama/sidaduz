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
        Schema::create('nilai_harians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('pembelajaran_id')->constrained('pembelajarans')->cascadeOnDelete();
            // We can optionally add user_id (who created it), but pembelajaran_id -> gtk_id usually tells us the "owner".
            // But for audit, maybe created_by? Laravel timestamps are fine for simple tracking.
            
            $table->string('judul'); // e.g. "Penilaian Bab 1", "Tugas Halaman 50"
            $table->enum('jenis', ['Tugas', 'UH', 'UTS', 'UAS', 'Praktek', 'Proyek', 'Sikap'])->default('Tugas');
            $table->date('tanggal');
            $table->float('nilai'); // 100.00
            $table->text('keterangan')->nullable();
            
            $table->timestamps();

            // Index for faster queries
            $table->index(['pembelajaran_id', 'jenis']);
            $table->index(['student_id', 'pembelajaran_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_harians');
    }
};
