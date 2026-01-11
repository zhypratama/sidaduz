import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, UserPlus, User, Briefcase, MapPin, Calendar, Phone, FileText, CreditCard, Award, Home } from 'lucide-react';
import { useState } from 'react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        // Identitas
        nama: '',
        nik: '',
        no_kk: '',
        jenis_kelamin: 'L',
        tempat_lahir: '',
        tanggal_lahir: '',
        nama_ibu_kandung: '',
        agama: '',
        kewarganegaraan: 'WNI',
        status_perkawinan: 'Belum Kawin',
        nama_suami_istri: '',
        pekerjaan_suami_istri: '',

        // Alamat & Kontak
        alamat: '', // Alamat Jalan
        rt: '',
        rw: '',
        nama_dusun: '',
        desa_kelurahan: '',
        kecamatan: '',
        kode_pos: '',
        no_hp: '',
        email: '',
        lintang: '',
        bujur: '',

        // Kepegawaian
        nip: '',
        nuptk: '',
        jenis_ptk: 'Guru Mapel',
        status_kepegawaian: 'GTY',
        sk_pengangkatan: '',
        tmt_pengangkatan: '',
        lembaga_pengangkatan: '',
        sk_cpns: '',
        tmt_cpns: '', // tanggal_cpns
        pangkat_golongan: '',
        sumber_gaji: '',

        // Lainnya
        tugas_tambahan: '',
        npwp: '',
        nama_wajib_pajak: '',
        bank: '',
        nomor_rekening_bank: '',
        rekening_atas_nama: '',
        sudah_lisensi_kepala_sekolah: 'Tidak',
        keahlian_braille: 'Tidak',
        keahlian_bahasa_isyarat: 'Tidak',
        foto: null,
    });

    const [activeTab, setActiveTab] = useState('identitas');

    const submit = (e) => {
        e.preventDefault();
        post(route('gtk.store'));
    };

    const tabs = [
        { id: 'identitas', label: 'Identitas Diri', icon: User },
        { id: 'alamat', label: 'Alamat & Kontak', icon: MapPin },
        { id: 'kepegawaian', label: 'Kepegawaian', icon: Briefcase },
        { id: 'lainnya', label: 'Data Lainnya', icon: FileText },
    ];

    const InputField = ({ label, name, type = 'text', placeholder = '', required = false, width = 'full' }) => (
        <div className={width === 'half' ? 'col-span-1' : 'col-span-2'}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                placeholder={placeholder}
            />
            {errors[name] && <div className="text-red-500 text-xs mt-1">{errors[name]}</div>}
        </div>
    );

    const SelectField = ({ label, name, options, required = false, width = 'full' }) => (
        <div className={width === 'half' ? 'col-span-1' : 'col-span-2'}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {errors[name] && <div className="text-red-500 text-xs mt-1">{errors[name]}</div>}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('gtk.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800">Tambah Data GTK</h2>
                            <p className="text-gray-500 text-sm">Lengkapi data GTK secara detail</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Tambah GTK" />

            <div className="max-w-5xl mx-auto">
                <form onSubmit={submit} className="bg-white rounded-[30px] shadow-sm shadow-gray-200/50 overflow-hidden">

                    {/* Tabs Header */}
                    <div className="flex border-b border-gray-100 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-5 text-sm font-medium transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* Tab 1: Identitas */}
                        {activeTab === 'identitas' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <InputField label="Nama Lengkap (Tanpa Gelar)" name="nama" required />
                                <InputField label="NIK (KTP)" name="nik" width="half" />
                                <InputField label="No. Kartu Keluarga (KK)" name="no_kk" width="half" />

                                <SelectField label="Jenis Kelamin" name="jenis_kelamin" width="half" options={[
                                    { value: 'L', label: 'Laki-laki' },
                                    { value: 'P', label: 'Perempuan' }
                                ]} required />
                                <InputField label="Tempat Lahir" name="tempat_lahir" width="half" />
                                <InputField label="Tanggal Lahir" name="tanggal_lahir" type="date" width="half" />
                                <InputField label="Nama Ibu Kandung" name="nama_ibu_kandung" width="half" />

                                <SelectField label="Agama" name="agama" width="half" options={[
                                    { value: 'Islam', label: 'Islam' },
                                    { value: 'Kristen', label: 'Kristen' },
                                    { value: 'Katolik', label: 'Katolik' },
                                    { value: 'Hindu', label: 'Hindu' },
                                    { value: 'Buddha', label: 'Buddha' },
                                    { value: 'Konghucu', label: 'Konghucu' },
                                ]} />
                                <InputField label="Kewarganegaraan" name="kewarganegaraan" width="half" />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>
                                <h4 className="col-span-2 font-semibold text-gray-800">Status Pernikahan</h4>

                                <SelectField label="Status Perkawinan" name="status_perkawinan" width="half" options={[
                                    { value: 'Belum Kawin', label: 'Belum Kawin' },
                                    { value: 'Kawin', label: 'Kawin' },
                                    { value: 'Janda/Duda', label: 'Janda/Duda' },
                                ]} />

                                {data.status_perkawinan === 'Kawin' && (
                                    <>
                                        <InputField label="Nama Suami/Istri" name="nama_suami_istri" width="half" />
                                        <InputField label="Pekerjaan Suami/Istri" name="pekerjaan_suami_istri" width="half" />
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Alamat */}
                        {activeTab === 'alamat' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <InputField label="Alamat Jalan (Domisili)" name="alamat" />
                                <InputField label="RT" name="rt" width="half" placeholder="001" />
                                <InputField label="RW" name="rw" width="half" placeholder="005" />
                                <InputField label="Nama Dusun" name="nama_dusun" width="half" />
                                <InputField label="Desa / Kelurahan" name="desa_kelurahan" width="half" />
                                <InputField label="Kecamatan" name="kecamatan" width="half" />
                                <InputField label="Kode Pos" name="kode_pos" width="half" />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>

                                <InputField label="No. HP / WhatsApp" name="no_hp" width="half" placeholder="08..." />
                                <InputField label="Email Pribadi" name="email" type="email" width="half" />

                                <InputField label="Lintang" name="lintang" width="half" placeholder="-6.2..." />
                                <InputField label="Bujur" name="bujur" width="half" placeholder="106.8..." />
                            </div>
                        )}

                        {/* Tab 3: Kepegawaian */}
                        {activeTab === 'kepegawaian' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <InputField label="NIP" name="nip" width="half" />
                                <InputField label="NUPTK" name="nuptk" width="half" />

                                <SelectField label="Jenis PTK" name="jenis_ptk" width="half" options={[
                                    { value: 'Guru Mapel', label: 'Guru Mapel' },
                                    { value: 'Guru Kelas', label: 'Guru Kelas' },
                                    { value: 'Guru BK', label: 'Guru BK' },
                                    { value: 'Guru Inklusi', label: 'Guru Inklusi' },
                                    { value: 'Tenaga Administrasi Sekolah', label: 'Tenaga Administrasi' },
                                    { value: 'Penjaga Sekolah', label: 'Penjaga Sekolah' },
                                    { value: 'Laboran', label: 'Laboran' },
                                    { value: 'Pustakawan', label: 'Pustakawan' },
                                ]} required />

                                <SelectField label="Status Kepegawaian" name="status_kepegawaian" width="half" options={[
                                    { value: 'PNS', label: 'PNS' },
                                    { value: 'PPPK', label: 'PPPK' },
                                    { value: 'GTY', label: 'GTY / PTY' },
                                    { value: 'GTT', label: 'GTT / PTT Provinsi' },
                                    { value: 'Honor Sekolah', label: 'Honor Sekolah' },
                                ]} required />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>

                                <InputField label="SK Pengangkatan" name="sk_pengangkatan" width="half" />
                                <InputField label="TMT Pengangkatan" name="tmt_pengangkatan" type="date" width="half" />
                                <InputField label="Lembaga Pengangkatan" name="lembaga_pengangkatan" width="half" />
                                <InputField label="Pangkat / Golongan" name="pangkat_golongan" width="half" />
                                <InputField label="Sumber Gaji" name="sumber_gaji" width="half" placeholder="Yayasan/APBD/APBN" />

                                {data.status_kepegawaian === 'PNS' && (
                                    <>
                                        <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>
                                        <InputField label="SK CPNS" name="sk_cpns" width="half" />
                                        <InputField label="TMT CPNS" name="tmt_cpns" type="date" width="half" />
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tab 4: Lainnya */}
                        {activeTab === 'lainnya' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <InputField label="Tugas Tambahan" name="tugas_tambahan" placeholder="Contoh: Wali Kelas VII-A, Kepala Lab" />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>

                                <InputField label="NPWP" name="npwp" width="half" />
                                <InputField label="Nama Wajib Pajak" name="nama_wajib_pajak" width="half" />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>

                                <InputField label="Nama Bank" name="bank" width="half" />
                                <InputField label="Nomor Rekening" name="nomor_rekening_bank" width="half" />
                                <InputField label="Rekening Atas Nama" name="rekening_atas_nama" width="full" />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>

                                <SelectField label="Sudah Lisensi Kepala Sekolah?" name="sudah_lisensi_kepala_sekolah" width="half" options={[
                                    { value: 'Ya', label: 'Ya' },
                                    { value: 'Tidak', label: 'Tidak' },
                                ]} />

                                <SelectField label="Keahlian Braille?" name="keahlian_braille" width="half" options={[
                                    { value: 'Ya', label: 'Ya' },
                                    { value: 'Tidak', label: 'Tidak' },
                                ]} />

                                <SelectField label="Keahlian Bahasa Isyarat?" name="keahlian_bahasa_isyarat" width="half" options={[
                                    { value: 'Ya', label: 'Ya' },
                                    { value: 'Tidak', label: 'Tidak' },
                                ]} />

                                <div className="col-span-2 border-t border-dashed border-gray-200 my-2"></div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil (Opsional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('foto', e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                        <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG. Max: 2MB.</p>
                                    </div>
                                    {errors.foto && <div className="text-danger text-xs mt-1">{errors.foto}</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                const index = tabs.findIndex(t => t.id === activeTab);
                                if (index > 0) setActiveTab(tabs[index - 1].id);
                            }}
                            className={`px-4 py-2 text-gray-600 font-medium hover:text-gray-900 ${activeTab === tabs[0].id ? 'invisible' : ''}`}
                        >
                            <span className="flex items-center gap-1"><ArrowLeft size={16} /> Sebelumnya</span>
                        </button>

                        <div className="flex gap-3">
                            {activeTab !== tabs[tabs.length - 1].id ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const index = tabs.findIndex(t => t.id === activeTab);
                                        if (index < tabs.length - 1) setActiveTab(tabs[index + 1].id);
                                    }}
                                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Selanjutnya
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
                                >
                                    {processing ? 'Menyimpan...' : <><Save size={18} /> Simpan Data GTK</>}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
