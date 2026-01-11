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
        Schema::table('gtks', function (Blueprint $table) {
            $table->string('nuptk')->nullable();
            $table->string('jenis_ptk')->nullable();
            $table->string('agama')->nullable();
            $table->string('rt')->nullable();
            $table->string('rw')->nullable();
            $table->string('nama_dusun')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kode_pos')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->string('tugas_tambahan')->nullable();
            $table->string('sk_cpns')->nullable();
            $table->date('tanggal_cpns')->nullable();
            $table->string('sk_pengangkatan')->nullable();
            $table->date('tmt_pengangkatan')->nullable();
            $table->string('lembaga_pengangkatan')->nullable();
            $table->string('pangkat_golongan')->nullable();
            $table->string('sumber_gaji')->nullable();
            $table->string('nama_ibu_kandung')->nullable();
            $table->string('status_perkawinan')->nullable();
            $table->string('nama_suami_istri')->nullable();
            $table->string('nip_suami_istri')->nullable();
            $table->string('pekerjaan_suami_istri')->nullable();
            $table->date('tmt_pns')->nullable();
            $table->string('sudah_lisensi_kepala_sekolah')->nullable();
            $table->string('pernah_diklat_kepengawasan')->nullable();
            $table->string('keahlian_braille')->nullable();
            $table->string('keahlian_bahasa_isyarat')->nullable();
            $table->string('npwp')->nullable();
            $table->string('nama_wajib_pajak')->nullable();
            $table->string('kewarganegaraan')->nullable();
            $table->string('bank')->nullable();
            $table->string('nomor_rekening_bank')->nullable();
            $table->string('rekening_atas_nama')->nullable();
            $table->string('nik')->nullable();
            $table->string('no_kk')->nullable();
            $table->string('karpeg')->nullable();
            $table->string('karis_karsu')->nullable();
            $table->string('lintang')->nullable();
            $table->string('bujur')->nullable();
            $table->string('nuks')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gtks', function (Blueprint $table) {
            //
        });
    }
};
