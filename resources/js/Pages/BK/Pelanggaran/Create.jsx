import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Add Link import here
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ShieldAlert } from 'lucide-react';

export default function PelanggaranCreate({ auth, students, jenis_pelanggarans }) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        jenis_pelanggaran_id: '',
        tanggal_kejadian: new Date().toISOString().split('T')[0],
        catatan: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('bk.pelanggaran.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Catat Pelanggaran</h2>
                    <p className="text-gray-500 text-sm">Input data pelanggaran siswa</p>
                </div>
            }
        >
            <Head title="Input Pelanggaran" />

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-[30px] shadow-sm">
                <form onSubmit={submit} className="space-y-6">

                    {/* Siswa Select */}
                    <div>
                        <InputLabel htmlFor="siswa_id" value="Nama Siswa" />
                        <select
                            id="siswa_id"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
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

                    {/* Jenis Pelanggaran Select */}
                    <div>
                        <InputLabel htmlFor="jenis_pelanggaran_id" value="Jenis Pelanggaran" />
                        <select
                            id="jenis_pelanggaran_id"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                            value={data.jenis_pelanggaran_id}
                            onChange={(e) => setData('jenis_pelanggaran_id', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Pelanggaran --</option>
                            {jenis_pelanggarans.map((jp) => (
                                <option key={jp.id} value={jp.id}>
                                    [{jp.poin} Poin] {jp.nama_pelanggaran} ({jp.kategori})
                                </option>
                            ))}
                        </select>
                        {errors.jenis_pelanggaran_id && <p className="text-red-500 text-sm mt-1">{errors.jenis_pelanggaran_id}</p>}
                    </div>

                    {/* Tanggal */}
                    <div>
                        <InputLabel htmlFor="tanggal_kejadian" value="Tanggal Kejadian" />
                        <TextInput
                            id="tanggal_kejadian"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.tanggal_kejadian}
                            onChange={(e) => setData('tanggal_kejadian', e.target.value)}
                            required
                        />
                        {errors.tanggal_kejadian && <p className="text-red-500 text-sm mt-1">{errors.tanggal_kejadian}</p>}
                    </div>

                    {/* Catatan */}
                    <div>
                        <InputLabel htmlFor="catatan" value="Kronologi / Catatan Tambahan" />
                        <textarea
                            id="catatan"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                            rows="4"
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                        ></textarea>
                        {errors.catatan && <p className="text-red-500 text-sm mt-1">{errors.catatan}</p>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('bk.pelanggaran.index')}>
                            <SecondaryButton>Batal</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing} className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 ring-red-500">
                            Simpan Pelanggaran
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
