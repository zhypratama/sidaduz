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
        // 1. Students Table
        Schema::table('students', function (Blueprint $table) {
            // Drop Unique Indexes
            $table->dropUnique(['nisn']);
            $table->dropUnique(['nik']);
            $table->dropUnique(['nipd']);
            
            // Change to TEXT for encypted data storage
            $table->text('nisn')->nullable()->change();
            $table->text('nik')->nullable()->change();
            $table->text('nipd')->nullable()->change();
            $table->text('no_telp')->nullable()->change();
            $table->text('no_hp')->nullable()->change();
            $table->text('email')->nullable()->change();
            $table->text('skhun')->nullable()->change();
            $table->text('no_kps')->nullable()->change();
            $table->text('nik_ayah')->nullable()->change();
            $table->text('no_telp_ayah')->nullable()->change();
            $table->text('nik_ibu')->nullable()->change();
            $table->text('no_telp_ibu')->nullable()->change();
            $table->text('nik_wali')->nullable()->change();
            $table->text('no_telp_wali')->nullable()->change();
            $table->text('no_peserta_un')->nullable()->change();
            $table->text('no_seri_ijazah')->nullable()->change();
            $table->text('no_kip')->nullable()->change();
            $table->text('nama_di_kip')->nullable()->change();
            $table->text('no_kks')->nullable()->change();
            $table->text('no_akta_lahir')->nullable()->change();
            $table->text('bank')->nullable()->change();
            $table->text('no_rekening_bank')->nullable()->change();
            $table->text('rekening_atas_nama')->nullable()->change();
            $table->text('no_kk')->nullable()->change();
            
            // Text values often used in encryption
            $table->text('nama_ayah')->nullable()->change();
            $table->text('nama_ibu')->nullable()->change();
            $table->text('nama_wali')->nullable()->change();
            $table->text('alamat')->nullable()->change();
        });

        // 2. GTK Table
        Schema::table('gtks', function (Blueprint $table) {
            // Change to TEXT for encrypted data
            $table->text('nuptk')->nullable()->change();
            $table->text('nik')->nullable()->change();
            $table->text('no_kk')->nullable()->change();
            $table->text('npwp')->nullable()->change();
            $table->text('nomor_rekening_bank')->nullable()->change();
            $table->text('rekening_atas_nama')->nullable()->change();
            $table->text('bank')->nullable()->change();
            $table->text('telepon')->nullable()->change();
            $table->text('email')->nullable()->change();
            $table->text('nama_ibu_kandung')->nullable()->change();
            $table->text('nama_suami_istri')->nullable()->change();
            $table->text('nip_suami_istri')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting this is complex because encrypted data can't fit back into small strings
        // and we destroyed unique indexes. 
        // For PDP, security is priority.
    }
};
