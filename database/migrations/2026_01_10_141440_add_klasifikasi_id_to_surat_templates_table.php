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
        Schema::table('surat_templates', function (Blueprint $table) {
            $table->foreignId('klasifikasi_surat_id')->nullable()->constrained('klasifikasi_surats')->nullOnDelete()->after('kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_templates', function (Blueprint $table) {
            $table->dropForeign(['klasifikasi_surat_id']);
            $table->dropColumn('klasifikasi_surat_id');
        });
    }
};
