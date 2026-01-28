import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Trophy, Star, Upload } from 'lucide-react';

export default function PrestasiCreate({ auth, students, tingkat_list }) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        nama_prestasi: '',
        tingkat: '',
        poin_apresiasi: 0,
        tanggal: new Date().toISOString().split('T')[0],
        bukti_file: null
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('bk.prestasi.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Catat Prestasi</h2>
                    <p className="text-gray-500 text-sm">Input pencapaian istimewa siswa</p>
                </div>
            }
        >
            <Head title="Input Prestasi" />

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-[30px] shadow-sm border border-gray-100 dark:border-gray-700">
                <form onSubmit={submit} className="space-y-6">

                    {/* Siswa Select */}
                    <div>
                        <InputLabel htmlFor="siswa_id" value="Nama Siswa" />
                        <select
                            id="siswa_id"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-xl shadow-sm focus:border-primary focus:ring-primary h-11"
                            value={data.siswa_id}
                            onChange={(e) => setData('siswa_id', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Siswa --</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>{s.nama_lengkap} - {s.kelas?.nama}</option>
                            ))}
                        </select>
                        {errors.siswa_id && <p className="text-red-500 text-sm mt-1">{errors.siswa_id}</p>}
                    </div>

                    {/* Nama Prestasi */}
                    <div>
                        <InputLabel htmlFor="nama_prestasi" value="Nama Prestasi / Lomba" />
                        <div className="relative">
                            <TextInput
                                id="nama_prestasi"
                                type="text"
                                className="mt-1 block w-full pl-10"
                                value={data.nama_prestasi}
                                onChange={(e) => setData('nama_prestasi', e.target.value)}
                                placeholder="Contoh: Juara 1 Lomba MTK"
                                required
                            />
                            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        {errors.nama_prestasi && <p className="text-red-500 text-sm mt-1">{errors.nama_prestasi}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tingkat */}
                        <div>
                            <InputLabel htmlFor="tingkat" value="Tingkat" />
                            <select
                                id="tingkat"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-xl shadow-sm focus:border-primary focus:ring-primary h-11"
                                value={data.tingkat}
                                onChange={(e) => setData('tingkat', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Tingkat --</option>
                                {tingkat_list.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.tingkat && <p className="text-red-500 text-sm mt-1">{errors.tingkat}</p>}
                        </div>

                        {/* Poin Apresiasi */}
                        <div>
                            <InputLabel htmlFor="poin_apresiasi" value="Poin Apresiasi" />
                            <div className="relative">
                                <TextInput
                                    id="poin_apresiasi"
                                    type="number"
                                    className="mt-1 block w-full pl-10"
                                    value={data.poin_apresiasi}
                                    onChange={(e) => setData('poin_apresiasi', e.target.value)}
                                    required
                                />
                                <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">* Poin ini akan mengurangi total poin pelanggaran siswa.</p>
                            {errors.poin_apresiasi && <p className="text-red-500 text-sm mt-1">{errors.poin_apresiasi}</p>}
                        </div>
                    </div>

                    {/* Tanggal */}
                    <div>
                        <InputLabel htmlFor="tanggal" value="Tanggal Peroleh" />
                        <TextInput
                            id="tanggal"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            required
                        />
                        {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                    </div>

                    {/* Bukti File */}
                    <div>
                        <InputLabel htmlFor="bukti_file" value="Sertifikat / Bukti (Opsional)" />
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="bukti_file" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                        <span>Upload file</span>
                                        <input
                                            id="bukti_file"
                                            name="bukti_file"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => setData('bukti_file', e.target.files[0])}
                                        />
                                    </label>
                                    <p className="pl-1">atau drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 2MB</p>
                                {data.bukti_file && <p className="text-xs text-emerald-500 font-bold">{data.bukti_file.name}</p>}
                            </div>
                        </div>
                        {errors.bukti_file && <p className="text-red-500 text-sm mt-1">{errors.bukti_file}</p>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('bk.prestasi.index')}>
                            <SecondaryButton>Batal</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing} className="bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 ring-primary">
                            Simpan Prestasi
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
