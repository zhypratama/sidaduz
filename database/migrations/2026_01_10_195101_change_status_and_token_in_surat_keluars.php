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
        // Change status from ENUM to VARCHAR to support 'approved' and other statuses dynamically
        DB::statement("ALTER TABLE surat_keluars MODIFY COLUMN status VARCHAR(50) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to ENUM is optional but tricky with data. 
        // We'll leave it as varchar for safety or revert to original enum if empty.
        // DB::statement("ALTER TABLE surat_keluars MODIFY COLUMN status ENUM('draft', 'menunggu_persetujuan', 'disetujui', 'ditolak', 'terkirim', 'arsip') DEFAULT 'draft'");
    }
};
