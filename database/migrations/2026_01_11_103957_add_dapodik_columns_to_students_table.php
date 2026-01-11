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
            // Identitas Utama
            $table->string('nipd')->nullable()->unique()->after('id');
            // 'jenis_kelamin' already exists
            // 'nisn' already exists
            // 'tempat_lahir' already exists
            // 'tanggal_lahir' already exists
            // 'nik' already exists
            // 'agama' already exists
            
            // Alamat Detail
            // 'alamat' already exists
            // 'rt' already exists
            // 'rw' already exists
            $table->string('dusun')->nullable()->after('rw');
            // 'desa_kelurahan' already exists
            // 'kecamatan' already exists
            // 'kode_pos' already exists
            $table->string('jenis_tinggal')->nullable()->after('kode_pos');
            $table->string('alat_transportasi')->nullable()->after('jenis_tinggal');
            // 'no_telp' already exists
            $table->string('no_hp')->nullable()->after('no_telp');
            // 'email' already exists

            // Keterangan Tambahan
            $table->string('skhun')->nullable()->after('email');
            $table->boolean('penerima_kps')->default(false)->after('skhun');
            $table->string('no_kps')->nullable()->after('penerima_kps');

            // Data Ayah
            // 'nama_ayah' already exists
            $table->year('tahun_lahir_ayah')->nullable()->after('nama_ayah');
            $table->string('pendidikan_ayah')->nullable()->after('tahun_lahir_ayah');
            // 'pekerjaan_ayah' already exists
            $table->string('penghasilan_ayah')->nullable()->after('pekerjaan_ayah');
            $table->string('nik_ayah')->nullable()->after('penghasilan_ayah');

            // Data Ibu
            // 'nama_ibu' already exists
            $table->year('tahun_lahir_ibu')->nullable()->after('nama_ibu');
            $table->string('pendidikan_ibu')->nullable()->after('tahun_lahir_ibu');
            // 'pekerjaan_ibu' already exists
            $table->string('penghasilan_ibu')->nullable()->after('pekerjaan_ibu');
            $table->string('nik_ibu')->nullable()->after('penghasilan_ibu');

            // Data Wali
            // 'nama_wali' already exists
            $table->year('tahun_lahir_wali')->nullable()->after('nama_wali');
            $table->string('pendidikan_wali')->nullable()->after('tahun_lahir_wali');
            // 'pekerjaan_wali' already exists
            $table->string('penghasilan_wali')->nullable()->after('pekerjaan_wali');
            $table->string('nik_wali')->nullable()->after('penghasilan_wali');

            // Data Rombel & Ujian
            // 'kelas_temp' or 'rombel_saat_ini' - merging to 'kelas_temp' if intended, but let's add 'rombel' for clarity
            $table->string('rombel')->nullable()->after('nik_wali'); 
            $table->string('no_peserta_un')->nullable()->after('rombel');
            $table->string('no_seri_ijazah')->nullable()->after('no_peserta_un');
            $table->boolean('penerima_kip')->default(false)->after('no_seri_ijazah');
            $table->string('no_kip')->nullable()->after('penerima_kip');
            $table->string('nama_di_kip')->nullable()->after('no_kip');
            $table->string('no_kks')->nullable()->after('nama_di_kip');
            $table->string('no_akta_lahir')->nullable()->after('no_kks');

            // Data Bank
            $table->string('bank')->nullable()->after('no_akta_lahir');
            $table->string('no_rekening_bank')->nullable()->after('bank');
            $table->string('rekening_atas_nama')->nullable()->after('no_rekening_bank');

            // PIP
            $table->boolean('layak_pip')->default(false)->after('rekening_atas_nama');
            $table->string('alasan_layak_pip')->nullable()->after('layak_pip');
            $table->string('kebutuhan_khusus')->nullable()->after('alasan_layak_pip');
            
            // Lainnya
            $table->string('sekolah_asal')->nullable()->after('kebutuhan_khusus');
            $table->integer('anak_ke')->nullable()->after('sekolah_asal');
            $table->string('lintang')->nullable()->after('anak_ke');
            $table->string('bujur')->nullable()->after('lintang');
            $table->string('no_kk')->nullable()->after('bujur');
            $table->decimal('berat_badan', 5, 2)->nullable()->after('no_kk');
            $table->decimal('tinggi_badan', 5, 2)->nullable()->after('berat_badan');
            $table->decimal('lingkar_kepala', 5, 2)->nullable()->after('tinggi_badan');
            $table->integer('jml_saudara_kandung')->nullable()->after('lingkar_kepala');
            $table->decimal('jarak_rumah_ke_sekolah', 5, 2)->nullable()->after('jml_saudara_kandung');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'nipd', 'dusun', 'jenis_tinggal', 'alat_transportasi', 'no_hp',
                'skhun', 'penerima_kps', 'no_kps',
                'tahun_lahir_ayah', 'pendidikan_ayah', 'penghasilan_ayah', 'nik_ayah',
                'tahun_lahir_ibu', 'pendidikan_ibu', 'penghasilan_ibu', 'nik_ibu',
                'tahun_lahir_wali', 'pendidikan_wali', 'penghasilan_wali', 'nik_wali',
                'rombel', 'no_peserta_un', 'no_seri_ijazah',
                'penerima_kip', 'no_kip', 'nama_di_kip', 'no_kks', 'no_akta_lahir',
                'bank', 'no_rekening_bank', 'rekening_atas_nama',
                'layak_pip', 'alasan_layak_pip', 'kebutuhan_khusus',
                'sekolah_asal', 'anak_ke', 'lintang', 'bujur', 'no_kk',
                'berat_badan', 'tinggi_badan', 'lingkar_kepala', 'jml_saudara_kandung', 'jarak_rumah_ke_sekolah'
            ]);
        });
    }
};
