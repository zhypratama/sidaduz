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
        Schema::table('school_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('school_profiles', 'rt')) {
                $table->string('rt')->nullable()->after('alamat');
            }
            if (!Schema::hasColumn('school_profiles', 'rw')) {
                $table->string('rw')->nullable()->after('rt');
            }
            if (!Schema::hasColumn('school_profiles', 'kelurahan')) {
                $table->string('kelurahan')->nullable()->after('rw');
            }
            if (!Schema::hasColumn('school_profiles', 'kecamatan')) {
                $table->string('kecamatan')->nullable()->after('kelurahan');
            }
            if (!Schema::hasColumn('school_profiles', 'kota')) {
                $table->string('kota')->nullable()->after('kecamatan');
            }
            if (!Schema::hasColumn('school_profiles', 'propinsi')) {
                $table->string('propinsi')->nullable()->after('kota');
            }
            if (!Schema::hasColumn('school_profiles', 'ijin_nomenklatur')) {
                $table->string('ijin_nomenklatur')->nullable()->after('propinsi');
            }
            if (!Schema::hasColumn('school_profiles', 'akreditasi')) {
                $table->string('akreditasi')->nullable()->after('ijin_nomenklatur');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed for repair
    }
};
