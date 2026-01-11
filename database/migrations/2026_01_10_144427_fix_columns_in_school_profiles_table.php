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
            $table->renameColumn('alamat_sekolah', 'alamat');
            $table->renameColumn('nama_kepala_sekolah', 'kepala_sekolah');
            $table->renameColumn('logo_sekolah', 'logo');
            $table->string('nip_kepala_sekolah')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->renameColumn('alamat', 'alamat_sekolah');
            $table->renameColumn('kepala_sekolah', 'nama_kepala_sekolah');
            $table->renameColumn('logo', 'logo_sekolah');
            $table->dropColumn('nip_kepala_sekolah');
        });
    }
};
