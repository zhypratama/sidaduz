import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Save, Clock } from 'lucide-react';

export default function Pengaturan({ auth, settings }) {
    const { data, setData, post, processing, errors, newlySuccessful } = useForm({
        jam_masuk_sekolah: settings.jam_masuk_sekolah || '07:00',
        jam_pulang_sekolah: settings.jam_pulang_sekolah || '15:00',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gtk.piket.update-settings'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">Pengaturan Piket</h2>}
        >
            <Head title="Pengaturan Piket" />

            <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="p-8">
                        <header className="mb-8">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Clock className="text-primary" /> Jam Operasional Sekolah
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Mengatur jam masuk dan pulang standar untuk validasi kehadiran.
                            </p>
                        </header>

                        <form onSubmit={submit} className="max-w-xl space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="jam_masuk_sekolah" value="Jam Masuk Sekolah" />
                                    <TextInput
                                        id="jam_masuk_sekolah"
                                        type="time"
                                        className="mt-1 block w-full text-center font-mono text-lg"
                                        value={data.jam_masuk_sekolah}
                                        onChange={(e) => setData('jam_masuk_sekolah', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.jam_masuk_sekolah} />
                                    <p className="text-xs text-gray-500 mt-2">Siswa/Guru yang hadir setelah jam ini ditandai terlambat.</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="jam_pulang_sekolah" value="Jam Pulang Sekolah" />
                                    <TextInput
                                        id="jam_pulang_sekolah"
                                        type="time"
                                        className="mt-1 block w-full text-center font-mono text-lg"
                                        value={data.jam_pulang_sekolah}
                                        onChange={(e) => setData('jam_pulang_sekolah', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.jam_pulang_sekolah} />
                                    <p className="text-xs text-gray-500 mt-2">Jam minimal untuk checkout/pulang.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing} className="w-full justify-center py-3 text-base">
                                    <Save className="mr-2" size={18} /> Simpan Pengaturan
                                </PrimaryButton>

                                {newlySuccessful && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                                        Tersimpan.
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
