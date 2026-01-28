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
        // Copy data from 'nis' to 'nipd' if 'nipd' is null
        \DB::statement("UPDATE students SET nipd = nis WHERE nipd IS NULL AND nis IS NOT NULL");

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('nis');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('nis')->nullable()->unique()->after('id');
        });

        // Restore data (best effort)
        \DB::statement("UPDATE students SET nis = nipd");
    }
};
