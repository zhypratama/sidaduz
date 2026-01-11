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
            $table->string('paper_size')->default('F4')->after('isi_surat');
            $table->json('margins')->nullable()->after('paper_size');
            $table->json('spacing')->nullable()->after('margins');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_templates', function (Blueprint $table) {
            $table->dropColumn(['paper_size', 'margins', 'spacing']);
        });
    }
};
