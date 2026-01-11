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
        if (!Schema::hasColumn('surat_keluars', 'status')) {
             Schema::table('surat_keluars', function (Blueprint $table) {
                $table->enum('status', ['draft', 'approved', 'rejected'])->default('draft')->after('jenis_surat');
             });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_keluars', function (Blueprint $table) {
            //
        });
    }
};
