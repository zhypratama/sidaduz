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
        if (!Schema::hasColumn('academic_calendars', 'type')) {
            Schema::table('academic_calendars', function (Blueprint $table) {
                $table->string('type')->default('kegiatan')->after('end'); // kegiatan, libur, ujian
                $table->string('color')->nullable()->after('type'); // Hex color
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_calendars', function (Blueprint $table) {
            $table->dropColumn(['type', 'color']);
        });
    }
};
