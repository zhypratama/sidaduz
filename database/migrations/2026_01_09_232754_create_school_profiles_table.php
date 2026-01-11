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
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('nama_sekolah');
            $table->string('npsn')->nullable();
            $table->string('nama_kepala_sekolah')->nullable();
            $table->text('alamat_sekolah')->nullable();
            $table->string('email_sekolah')->nullable();
            $table->string('no_telp_sekolah')->nullable();
            $table->string('web_sekolah')->nullable();
            $table->string('logo_sekolah')->nullable();
            $table->string('kop_surat')->nullable();
            $table->string('jam_masuk')->nullable();
            $table->string('jam_pulang')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_profiles');
    }
};
