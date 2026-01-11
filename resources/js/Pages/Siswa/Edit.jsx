import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import ContentBox from '@/Components/ContentBox';
import FormInput from '@/Components/FormInput';
import { Save, ArrowLeft, User, Users, MapPin, School, CreditCard, Activity, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ auth, student, kelas }) {
    const [activeTab, setActiveTab] = useState('pribadi');

    const { data, setData, put, processing, errors } = useForm({
        // Data Pribadi
        nama_lengkap: student.nama_lengkap || '',
        nipd: student.nipd || '',
        nisn: student.nisn || '',
        nik: student.nik || '',
        jenis_kelamin: student.jenis_kelamin || 'L',
        kelas_id: student.kelas_id || '',
        tempat_lahir: student.tempat_lahir || '',
        tanggal_lahir: student.tanggal_lahir || '',
        agama: student.agama || '',
        alamat: student.alamat || '',
        rt: student.rt || '',
        rw: student.rw || '',
        dusun: student.dusun || '',
        desa_kelurahan: student.desa_kelurahan || '',
        kecamatan: student.kecamatan || '',
        kode_pos: student.kode_pos || '',
        jenis_tinggal: student.jenis_tinggal || '',
        alat_transportasi: student.alat_transportasi || '',
        no_telp: student.no_telp || '',
        no_hp: student.no_hp || '',
        email: student.email || '',

        // Data Orang Tua - Ayah
        nama_ayah: student.nama_ayah || '',
        tahun_lahir_ayah: student.tahun_lahir_ayah || '',
        pendidikan_ayah: student.pendidikan_ayah || '',
        pekerjaan_ayah: student.pekerjaan_ayah || '',
        penghasilan_ayah: student.penghasilan_ayah || '',
        nik_ayah: student.nik_ayah || '',

        // Data Orang Tua - Ibu
        nama_ibu: student.nama_ibu || '',
        tahun_lahir_ibu: student.tahun_lahir_ibu || '',
        pendidikan_ibu: student.pendidikan_ibu || '',
        pekerjaan_ibu: student.pekerjaan_ibu || '',
        penghasilan_ibu: student.penghasilan_ibu || '',
        nik_ibu: student.nik_ibu || '',

        // Data Wali
        nama_wali: student.nama_wali || '',
        tahun_lahir_wali: student.tahun_lahir_wali || '',
        pendidikan_wali: student.pendidikan_wali || '',
        pekerjaan_wali: student.pekerjaan_wali || '',
        penghasilan_wali: student.penghasilan_wali || '',
        nik_wali: student.nik_wali || '',

        // Periodik
        tinggi_badan: student.tinggi_badan || '',
        berat_badan: student.berat_badan || '',
        lingkar_kepala: student.lingkar_kepala || '',
        jarak_rumah_ke_sekolah: student.jarak_rumah_ke_sekolah || '',
        jml_saudara_kandung: student.jml_saudara_kandung || '',
        anak_ke: student.anak_ke || '',

        // KIP / PIP / Bank
        penerima_kps: student.penerima_kps ? true : false,
        no_kps: student.no_kps || '',
        penerima_kip: student.penerima_kip ? true : false,
        no_kip: student.no_kip || '',
        nama_di_kip: student.nama_di_kip || '',
        layak_pip: student.layak_pip ? true : false,
        alasan_layak_pip: student.alasan_layak_pip || '',
        bank: student.bank || '',
        no_rekening_bank: student.no_rekening_bank || '',
        rekening_atas_nama: student.rekening_atas_nama || '',

        // Akademik
        status: student.status || 'aktif',
        kelas_temp: student.kelas_temp || '',
        skhun: student.skhun || '',
        no_peserta_un: student.no_peserta_un || '',
        no_seri_ijazah: student.no_seri_ijazah || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('siswa.update', student.id));
    };

    const tabs = [
        { id: 'pribadi', label: 'Data Pribadi', icon: User },
        { id: 'orangtua', label: 'Orang Tua / Wali', icon: Users },
        { id: 'periodik', label: 'Data Periodik', icon: Activity },
        { id: 'bantuan', label: 'KIP / PIP / Bank', icon: CreditCard },
        { id: 'akademik', label: 'Akademik', icon: School },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Data Siswa</h2>}
        >
            <Head title={`Edit Siswa - ${student.nama_lengkap}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        {/* Header & Actions */}
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href={route('siswa.index')}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Kembali</span>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Sidebar Tabs */}
                            <div className="col-span-12 md:col-span-3">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                                    <div className="flex flex-col">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center justify-between p-4 text-sm font-medium transition-colors border-l-4 ${activeTab === tab.id ? 'bg-blue-50 text-primary border-primary' : 'bg-white text-gray-600 border-transparent hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <tab.icon size={18} />
                                                    {tab.label}
                                                </div>
                                                {activeTab === tab.id && <ChevronRight size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="col-span-12 md:col-span-9 space-y-6">
                                {/* DATA PRIBADI */}
                                {activeTab === 'pribadi' && (
                                    <ContentBox title="Data Pribadi Siswa" icon={User} className="bg-white dark:bg-gray-800 border-none shadow-sm rounded-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                            <div className="col-span-2">
                                                <FormInput label="Nama Lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} error={errors.nama_lengkap} required />
                                            </div>
                                            <FormInput label="NIPD" value={data.nipd} onChange={(e) => setData('nipd', e.target.value)} error={errors.nipd} />
                                            <FormInput label="NISN" value={data.nisn} onChange={(e) => setData('nisn', e.target.value)} error={errors.nisn} />
                                            <FormInput label="NIK" value={data.nik} onChange={(e) => setData('nik', e.target.value)} error={errors.nik} />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary">
                                                    <option value="L">Laki-laki</option>
                                                    <option value="P">Perempuan</option>
                                                </select>
                                            </div>
                                            <FormInput label="Tempat Lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} error={errors.tempat_lahir} />
                                            <FormInput label="Tanggal Lahir" type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} error={errors.tanggal_lahir} />
                                            <FormInput label="Agama" value={data.agama} onChange={(e) => setData('agama', e.target.value)} error={errors.agama} />
                                            <FormInput label="No. Telepon / WA" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} error={errors.no_telp} />
                                            <FormInput label="No. HP" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} error={errors.no_hp} />
                                            <FormInput label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />

                                            <div className="col-span-2 border-t pt-4 mt-2">
                                                <h3 className="font-semibold text-gray-900 mb-4">Alamat Domisili</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Jalan</label>
                                                        <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} rows="2" className="w-full border-gray-300 rounded-xl focus:border-primary"></textarea>
                                                    </div>
                                                    <FormInput label="RT" value={data.rt} onChange={(e) => setData('rt', e.target.value)} />
                                                    <FormInput label="RW" value={data.rw} onChange={(e) => setData('rw', e.target.value)} />
                                                    <FormInput label="Dusun" value={data.dusun} onChange={(e) => setData('dusun', e.target.value)} />
                                                    <FormInput label="Desa / Kelurahan" value={data.desa_kelurahan} onChange={(e) => setData('desa_kelurahan', e.target.value)} />
                                                    <FormInput label="Kecamatan" value={data.kecamatan} onChange={(e) => setData('kecamatan', e.target.value)} />
                                                    <FormInput label="Kode Pos" value={data.kode_pos} onChange={(e) => setData('kode_pos', e.target.value)} />
                                                    <FormInput label="Jenis Tinggal" value={data.jenis_tinggal} onChange={(e) => setData('jenis_tinggal', e.target.value)} />
                                                    <FormInput label="Transportasi" value={data.alat_transportasi} onChange={(e) => setData('alat_transportasi', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </ContentBox>
                                )}

                                {/* DATA ORANG TUA */}
                                {activeTab === 'orangtua' && (
                                    <div className="space-y-6">
                                        {/* Data Ayah */}
                                        <ContentBox title="Data Ayah Kandung" icon={Users} className="bg-white border-none shadow-sm rounded-2xl">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                <FormInput label="Nama Ayah" value={data.nama_ayah} onChange={(e) => setData('nama_ayah', e.target.value)} />
                                                <FormInput label="NIK Ayah" value={data.nik_ayah} onChange={(e) => setData('nik_ayah', e.target.value)} />
                                                <FormInput label="Tahun Lahir" value={data.tahun_lahir_ayah} onChange={(e) => setData('tahun_lahir_ayah', e.target.value)} />
                                                <FormInput label="Pendidikan" value={data.pendidikan_ayah} onChange={(e) => setData('pendidikan_ayah', e.target.value)} />
                                                <FormInput label="Pekerjaan" value={data.pekerjaan_ayah} onChange={(e) => setData('pekerjaan_ayah', e.target.value)} />
                                                <FormInput label="Penghasilan Bulanan" value={data.penghasilan_ayah} onChange={(e) => setData('penghasilan_ayah', e.target.value)} />
                                            </div>
                                        </ContentBox>

                                        {/* Data Ibu */}
                                        <ContentBox title="Data Ibu Kandung" icon={Users} className="bg-white border-none shadow-sm rounded-2xl">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                <FormInput label="Nama Ibu" value={data.nama_ibu} onChange={(e) => setData('nama_ibu', e.target.value)} />
                                                <FormInput label="NIK Ibu" value={data.nik_ibu} onChange={(e) => setData('nik_ibu', e.target.value)} />
                                                <FormInput label="Tahun Lahir" value={data.tahun_lahir_ibu} onChange={(e) => setData('tahun_lahir_ibu', e.target.value)} />
                                                <FormInput label="Pendidikan" value={data.pendidikan_ibu} onChange={(e) => setData('pendidikan_ibu', e.target.value)} />
                                                <FormInput label="Pekerjaan" value={data.pekerjaan_ibu} onChange={(e) => setData('pekerjaan_ibu', e.target.value)} />
                                                <FormInput label="Penghasilan Bulanan" value={data.penghasilan_ibu} onChange={(e) => setData('penghasilan_ibu', e.target.value)} />
                                            </div>
                                        </ContentBox>

                                        {/* Data Wali */}
                                        <ContentBox title="Data Wali (Opsional)" icon={Users} className="bg-white border-none shadow-sm rounded-2xl">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                <FormInput label="Nama Wali" value={data.nama_wali} onChange={(e) => setData('nama_wali', e.target.value)} />
                                                <FormInput label="NIK Wali" value={data.nik_wali} onChange={(e) => setData('nik_wali', e.target.value)} />
                                                <FormInput label="Tahun Lahir" value={data.tahun_lahir_wali} onChange={(e) => setData('tahun_lahir_wali', e.target.value)} />
                                                <FormInput label="Pendidikan" value={data.pendidikan_wali} onChange={(e) => setData('pendidikan_wali', e.target.value)} />
                                                <FormInput label="Pekerjaan" value={data.pekerjaan_wali} onChange={(e) => setData('pekerjaan_wali', e.target.value)} />
                                                <FormInput label="Penghasilan Bulanan" value={data.penghasilan_wali} onChange={(e) => setData('penghasilan_wali', e.target.value)} />
                                            </div>
                                        </ContentBox>
                                    </div>
                                )}

                                {/* PERIODIK */}
                                {activeTab === 'periodik' && (
                                    <ContentBox title="Data Periodik Siswa" icon={Activity} className="bg-white border-none shadow-sm rounded-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                            <FormInput label="Tinggi Badan (cm)" type="number" value={data.tinggi_badan} onChange={(e) => setData('tinggi_badan', e.target.value)} />
                                            <FormInput label="Berat Badan (kg)" type="number" value={data.berat_badan} onChange={(e) => setData('berat_badan', e.target.value)} />
                                            <FormInput label="Lingkar Kepala (cm)" type="number" value={data.lingkar_kepala} onChange={(e) => setData('lingkar_kepala', e.target.value)} />
                                            <FormInput label="Anak ke-berapa" type="number" value={data.anak_ke} onChange={(e) => setData('anak_ke', e.target.value)} />
                                            <FormInput label="Jumlah Saudara Kandung" type="number" value={data.jml_saudara_kandung} onChange={(e) => setData('jml_saudara_kandung', e.target.value)} />
                                            <FormInput label="Jarak Tempat Tinggal ke Sekolah (km)" value={data.jarak_rumah_ke_sekolah} onChange={(e) => setData('jarak_rumah_ke_sekolah', e.target.value)} />
                                        </div>
                                    </ContentBox>
                                )}

                                {/* BANTUAN & BANK */}
                                {activeTab === 'bantuan' && (
                                    <ContentBox title="Bantuan KIP / PIP & Rekening" icon={CreditCard} className="bg-white border-none shadow-sm rounded-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                            <div className="col-span-2 flex flex-col gap-4 border-b pb-6 mb-2">
                                                <h3 className="font-semibold text-gray-900">Kartu Indonesia Pintar (KIP) & KPS</h3>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex-1">
                                                        <input type="checkbox" checked={data.penerima_kip} onChange={(e) => setData('penerima_kip', e.target.checked)} className="rounded text-primary focus:ring-primary" />
                                                        <span className="text-sm font-medium">Penerima KIP?</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex-1">
                                                        <input type="checkbox" checked={data.penerima_kps} onChange={(e) => setData('penerima_kps', e.target.checked)} className="rounded text-primary focus:ring-primary" />
                                                        <span className="text-sm font-medium">Penerima KPS?</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex-1">
                                                        <input type="checkbox" checked={data.layak_pip} onChange={(e) => setData('layak_pip', e.target.checked)} className="rounded text-primary focus:ring-primary" />
                                                        <span className="text-sm font-medium">Layak PIP?</span>
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormInput label="Nomor KIP" value={data.no_kip} onChange={(e) => setData('no_kip', e.target.value)} />
                                                    <FormInput label="Nama tertera di KIP" value={data.nama_di_kip} onChange={(e) => setData('nama_di_kip', e.target.value)} />
                                                    <FormInput label="Nomor KPS" value={data.no_kps} onChange={(e) => setData('no_kps', e.target.value)} />
                                                    <FormInput label="Alasan Layak PIP" value={data.alasan_layak_pip} onChange={(e) => setData('alasan_layak_pip', e.target.value)} placeholder="Misal: Yatim/Piatu/Miskin" />
                                                </div>
                                            </div>

                                            <div className="col-span-2">
                                                <h3 className="font-semibold text-gray-900 mb-4">Rekening Bank</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormInput label="Bank" value={data.bank} onChange={(e) => setData('bank', e.target.value)} placeholder="Bank BRI / BNI / dll" />
                                                    <FormInput label="Nomor Rekening" value={data.no_rekening_bank} onChange={(e) => setData('no_rekening_bank', e.target.value)} />
                                                    <FormInput label="Rekening Atas Nama" value={data.rekening_atas_nama} onChange={(e) => setData('rekening_atas_nama', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </ContentBox>
                                )}

                                {/* AKADEMIK */}
                                {activeTab === 'akademik' && (
                                    <ContentBox title="Data Akademik Siswa" icon={School} className="bg-white border-none shadow-sm rounded-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Siswa</label>
                                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary">
                                                    <option value="aktif">Aktif</option>
                                                    <option value="lulus">Lulus</option>
                                                    <option value="mutasi_keluar">Mutasi Keluar</option>
                                                    <option value="dikeluarkan">Dikeluarkan</option>
                                                    <option value="meninggal_dunia">Meninggal Dunia</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas Saat Ini</label>
                                                <select
                                                    value={data.kelas_id}
                                                    onChange={(e) => setData('kelas_id', e.target.value)}
                                                    className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary"
                                                >
                                                    <option value="">Pilih Kelas</option>
                                                    {kelas.map((k) => (
                                                        <option key={k.id} value={k.id}>{k.nama}</option>
                                                    ))}
                                                </select>
                                                {errors.kelas_id && <div className="text-red-500 text-xs mt-1">{errors.kelas_id}</div>}
                                            </div>

                                            <FormInput label="SKHUN" value={data.skhun} onChange={(e) => setData('skhun', e.target.value)} />
                                            <FormInput label="No. Peserta UN" value={data.no_peserta_un} onChange={(e) => setData('no_peserta_un', e.target.value)} />
                                            <FormInput label="No. Seri Ijazah" value={data.no_seri_ijazah} onChange={(e) => setData('no_seri_ijazah', e.target.value)} />
                                        </div>
                                    </ContentBox>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
