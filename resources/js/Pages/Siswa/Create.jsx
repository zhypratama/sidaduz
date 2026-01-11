import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import ContentBox from '@/Components/ContentBox';
import FormInput from '@/Components/FormInput';
import { Save, ArrowLeft, User, Users, MapPin, School } from 'lucide-react';

export default function Create({ auth, kelas }) {
    const { data, setData, post, processing, errors } = useForm({
        // Data Pribadi
        nama_lengkap: '',
        nipd: '',
        nisn: '',
        nik: '',
        jenis_kelamin: 'L',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        alamat: '',
        no_telp: '',
        email: '',

        // Orang Tua
        nama_ayah: '',
        pekerjaan_ayah: '',
        no_telp_ayah: '',
        nama_ibu: '',
        pekerjaan_ibu: '',
        no_telp_ibu: '',

        // Akademik
        status: 'aktif',
        kelas_id: '',
        kelas_temp: '', // Legacy/Optional
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('siswa.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tambah Siswa Baru</h2>}
        >
            <Head title="Tambah Siswa" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
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
                                className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Data Pribadi */}
                            <ContentBox title="Data Pribadi Siswa" icon={User} className="bg-white dark:bg-gray-800 border-none shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                    <div className="col-span-2">
                                        <FormInput
                                            label="Nama Lengkap"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            error={errors.nama_lengkap}
                                            placeholder="Nama lengkap siswa sesuai ijazah"
                                            required
                                        />
                                    </div>
                                    <FormInput
                                        label="NIPD"
                                        value={data.nipd}
                                        onChange={(e) => setData('nipd', e.target.value)}
                                        error={errors.nipd}
                                        placeholder="Nomor Induk Peserta Didik"
                                    />
                                    <FormInput
                                        label="NISN"
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                        error={errors.nisn}
                                        placeholder="Nomor Induk Siswa Nasional"
                                    />
                                    <FormInput
                                        label="NIK"
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value)}
                                        error={errors.nik}
                                        placeholder="Nomor Induk Kependudukan"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Kelamin</label>
                                        <select
                                            value={data.jenis_kelamin}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm transition-all"
                                        >
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <FormInput
                                        label="Tempat Lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                                        error={errors.tempat_lahir}
                                    />
                                    <FormInput
                                        label="Tanggal Lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        error={errors.tanggal_lahir}
                                    />
                                    <FormInput
                                        label="Agama"
                                        value={data.agama}
                                        onChange={(e) => setData('agama', e.target.value)}
                                        error={errors.agama}
                                        placeholder="Islam, Kristen, dll"
                                    />
                                    <FormInput
                                        label="No. Telepon / WA"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                        error={errors.no_telp}
                                    />
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap</label>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            rows="3"
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm transition-all"
                                            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."
                                        ></textarea>
                                        {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                                    </div>
                                </div>
                            </ContentBox>

                            {/* Data Orang Tua */}
                            <ContentBox title="Data Orang Tua / Wali" icon={Users} className="bg-white dark:bg-gray-800 border-none shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                    <FormInput
                                        label="Nama Ayah"
                                        value={data.nama_ayah}
                                        onChange={(e) => setData('nama_ayah', e.target.value)}
                                        error={errors.nama_ayah}
                                    />
                                    <FormInput
                                        label="Pekerjaan Ayah"
                                        value={data.pekerjaan_ayah}
                                        onChange={(e) => setData('pekerjaan_ayah', e.target.value)}
                                        error={errors.pekerjaan_ayah}
                                    />
                                    <FormInput
                                        label="Nama Ibu"
                                        value={data.nama_ibu}
                                        onChange={(e) => setData('nama_ibu', e.target.value)}
                                        error={errors.nama_ibu}
                                    />
                                    <FormInput
                                        label="Pekerjaan Ibu"
                                        value={data.pekerjaan_ibu}
                                        onChange={(e) => setData('pekerjaan_ibu', e.target.value)}
                                        error={errors.pekerjaan_ibu}
                                    />
                                    <FormInput
                                        label="No. Telp Ortu"
                                        value={data.no_telp_ayah} // Using ayahs phone field for general contact
                                        onChange={(e) => setData('no_telp_ayah', e.target.value)}
                                        error={errors.no_telp_ayah}
                                        placeholder="Nomor yang bisa dihubungi"
                                    />
                                </div>
                            </ContentBox>

                            {/* Data Akademik */}
                            <ContentBox title="Data Akademik" icon={School} className="bg-white dark:bg-gray-800 border-none shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Siswa</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm transition-all"
                                        >
                                            <option value="aktif">Aktif</option>
                                            <option value="lulus">Lulus</option>
                                            <option value="mutasi_keluar">Mutasi Keluar</option>
                                            <option value="dikeluarkan">Dikeluarkan</option>
                                            <option value="meninggal_dunia">Meninggal Dunia</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas Saat Ini</label>
                                        <select
                                            value={data.kelas_id}
                                            onChange={(e) => setData('kelas_id', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm transition-all"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelas && kelas.map((k) => (
                                                <option key={k.id} value={k.id}>{k.nama}</option>
                                            ))}
                                        </select>
                                        {errors.kelas_id && <div className="text-red-500 text-xs mt-1">{errors.kelas_id}</div>}
                                    </div>
                                </div>
                            </ContentBox>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
