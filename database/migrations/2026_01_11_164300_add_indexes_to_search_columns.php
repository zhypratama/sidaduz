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
        Schema::table('students', function (Blueprint $table) {
            $table->index('nama_lengkap');
            // nipd, nisn, nik are already unique (implied index)
        });

        if (Schema::hasTable('gtks')) {
            Schema::table('gtks', function (Blueprint $table) {
                $table->index('nama');
                $table->index('nip');
            });
        }

        if (Schema::hasTable('surat_keluars')) {
            Schema::table('surat_keluars', function (Blueprint $table) {
                $table->index('no_surat');
                $table->index('perihal');
                $table->index('tujuan');
                $table->index('tanggal_surat');
            });
        }

        if (Schema::hasTable('surat_masuks')) {
            Schema::table('surat_masuks', function (Blueprint $table) {
                $table->index('perihal');
                $table->index('pengirim');
                $table->index('no_surat_pengirim');
                $table->index('tanggal_surat');
            });
        }
        
        if (Schema::hasTable('kelas')) {
             Schema::table('kelas', function (Blueprint $table) {
                  $table->index('nama');
             });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['nama_lengkap']);
        });

        if (Schema::hasTable('gtks')) {
            Schema::table('gtks', function (Blueprint $table) {
                $table->dropIndex(['nama']);
                $table->dropIndex(['nip']);
            });
        }

        if (Schema::hasTable('surat_keluars')) {
            Schema::table('surat_keluars', function (Blueprint $table) {
                $table->dropIndex(['no_surat']);
                $table->dropIndex(['perihal']);
                $table->dropIndex(['tujuan']);
                $table->dropIndex(['tanggal_surat']);
            });
        }

        if (Schema::hasTable('surat_masuks')) {
            Schema::table('surat_masuks', function (Blueprint $table) {
                $table->dropIndex(['perihal']);
                $table->dropIndex(['pengirim']);
                $table->dropIndex(['no_surat_pengirim']);
                $table->dropIndex(['tanggal_surat']);
            });
        }
        
        if (Schema::hasTable('kelas')) {
             Schema::table('kelas', function (Blueprint $table) {
                  $table->dropIndex(['nama']);
             });
        }
    }
};
