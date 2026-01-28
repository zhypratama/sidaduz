import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Add Link import here
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function KonselingCreate({ auth, students }) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        jenis_layanan: 'Individu',
        masalah: '',
        hasil: '',
        tindak_lanjut: '',
        tanggal_konseling: new Date().toISOString().slice(0, 16) // datetime-local format YYYY-MM-DDTHH:MM
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('bk.konseling.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Catat Sesi Konseling</h2>
                    <p className="text-gray-500 text-sm">Dokumentasi layanan bimbingan siswa</p>
                </div>
            }
        >
            <Head title="Input Konseling" />

            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-[30px] shadow-sm">
                <form onSubmit={submit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Siswa Select */}
                        <div>
                            <InputLabel htmlFor="siswa_id" value="Nama Siswa" />
                            <select
                                id="siswa_id"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-primary focus:ring-primary"
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

                        {/* Tanggal */}
                        <div>
                            <InputLabel htmlFor="tanggal_konseling" value="Waktu Konseling" />
                            <TextInput
                                id="tanggal_konseling"
                                type="datetime-local"
                                className="mt-1 block w-full"
                                value={data.tanggal_konseling}
                                onChange={(e) => setData('tanggal_konseling', e.target.value)}
                                required
                            />
                            {errors.tanggal_konseling && <p className="text-red-500 text-sm mt-1">{errors.tanggal_konseling}</p>}
                        </div>
                    </div>

                    {/* Jenis Layanan */}
                    <div>
                        <InputLabel htmlFor="jenis_layanan" value="Jenis Layanan" />
                        <select
                            id="jenis_layanan"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                            value={data.jenis_layanan}
                            onChange={(e) => setData('jenis_layanan', e.target.value)}
                            required
                        >
                            <option value="Individu">Konseling Individu</option>
                            <option value="Kelompok">Konseling Kelompok</option>
                            <option value="Karir">Bimbingan Karir</option>
                            <option value="Belajar">Bimbingan Belajar</option>
                            <option value="Sosial">Bimbingan Sosial</option>
                        </select>
                        {errors.jenis_layanan && <p className="text-red-500 text-sm mt-1">{errors.jenis_layanan}</p>}
                    </div>

                    {/* Masalah */}
                    <div>
                        <InputLabel htmlFor="masalah" value="Permasalahan / Topik Bahasan" />
                        <textarea
                            id="masalah"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                            rows="3"
                            value={data.masalah}
                            onChange={(e) => setData('masalah', e.target.value)}
                            required
                        ></textarea>
                        {errors.masalah && <p className="text-red-500 text-sm mt-1">{errors.masalah}</p>}
                    </div>

                    {/* Hasil */}
                    <div>
                        <InputLabel htmlFor="hasil" value="Hasil Konseling / Kesepakatan" />
                        <textarea
                            id="hasil"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                            rows="2"
                            value={data.hasil}
                            onChange={(e) => setData('hasil', e.target.value)}
                        ></textarea>
                        {errors.hasil && <p className="text-red-500 text-sm mt-1">{errors.hasil}</p>}
                    </div>

                    {/* Tindak Lanjut */}
                    <div>
                        <InputLabel htmlFor="tindak_lanjut" value="Rencana Tindak Lanjut" />
                        <textarea
                            id="tindak_lanjut"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                            rows="2"
                            value={data.tindak_lanjut}
                            onChange={(e) => setData('tindak_lanjut', e.target.value)}
                        ></textarea>
                        {errors.tindak_lanjut && <p className="text-red-500 text-sm mt-1">{errors.tindak_lanjut}</p>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('bk.konseling.index')}>
                            <SecondaryButton>Batal</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing}>
                            Simpan Data
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
