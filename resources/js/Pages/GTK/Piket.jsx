import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Save, Trash2, User, Clock } from 'lucide-react';

export default function Piket({ auth, gtks, pikets }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        gtk_id: '',
        hari: 'Senin',
        semester: 'Ganjil',
        tahun_ajaran: new Date().getFullYear().toString(),
        jam_mulai: '07:00',
        jam_selesai: '15:00',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gtk.piket.store'), {
            onSuccess: () => reset('gtk_id'),
        });
    };

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Jadwal Piket</h2>
                        <p className="text-gray-500 text-sm">Kelola petugas piket harian sekolah</p>
                    </div>
                </div>
            }
        >
            <Head title="Jadwal Piket" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
                {/* Form Input (Left) */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-none sticky top-24">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <Clock className="text-primary" size={20} />
                            Set Petugas
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hari</label>
                                <select
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:ring-primary focus:border-primary"
                                    value={data.hari}
                                    onChange={e => setData('hari', e.target.value)}
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mulai</label>
                                    <input
                                        type="time"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:ring-primary focus:border-primary"
                                        value={data.jam_mulai}
                                        onChange={e => setData('jam_mulai', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selesai</label>
                                    <input
                                        type="time"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:ring-primary focus:border-primary"
                                        value={data.jam_selesai}
                                        onChange={e => setData('jam_selesai', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Petugas Guru/Staff</label>
                                <select
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:ring-primary focus:border-primary"
                                    value={data.gtk_id}
                                    onChange={e => setData('gtk_id', e.target.value)}
                                >
                                    <option value="">Pilih Petugas...</option>
                                    {gtks.map(g => (
                                        <option key={g.id} value={g.id}>{g.nama} ({g.jabatan})</option>
                                    ))}
                                </select>
                                {errors.gtk_id && <div className="text-danger text-xs mt-1">{errors.gtk_id}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                            >
                                <Save size={18} /> Tambah
                            </button>
                        </form>
                    </div>
                </div>

                {/* Schedule Grid (Right) */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {days.map(day => (
                        <div key={day} className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-none flex flex-col h-full border-t-4 border-primary">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-50 dark:border-gray-700 pb-2">
                                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{day}</h4>
                            </div>

                            <div className="flex-1 space-y-3">
                                {pikets[day] && pikets[day].length > 0 ? (
                                    pikets[day].map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl group hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {p.gtk.nama.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{p.gtk.nama}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {p.jam_mulai.substring(0, 5)} - {p.jam_selesai.substring(0, 5)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-24 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-xl">
                                        Belum ada petugas
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
