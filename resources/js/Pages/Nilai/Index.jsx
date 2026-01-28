import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Users, Plus, ListChecks } from 'lucide-react';

export default function Index({ auth, pembelajarans }) {
    // pembelajarans is Grouped by Kelas Name in Admin view, or just simple list for Teachers.
    // Let's assume generic list for now or handle both.
    // In Controller I used: $user->gtk->pembelajarans()->with(...)->get(); 
    // So it's an array of Pembelajaran objects.

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Nilai Harian</h2>}
        >
            <Head title="Nilai Harian" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Daftar Mata Pelajaran Anda</h3>
                            <p className="text-sm text-gray-500">Pilih mata pelajaran untuk menginput atau melihat nilai.</p>
                        </div>
                        <Link
                            href={route('kurikulum.nilai.create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-blue-600/20 transition-all"
                        >
                            <Plus size={18} />
                            Input Nilai Baru
                        </Link>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pembelajarans.length > 0 ? (
                            pembelajarans.map((pembelajaran) => (
                                <div key={pembelajaran.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl">
                                                <BookOpen size={24} />
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                                                Active
                                            </span>
                                        </div>

                                        <h4 className="text-xl font-bold text-gray-900 mb-1">{pembelajaran.mata_pelajaran?.nama}</h4>
                                        <p className="text-gray-500 text-sm mb-4">{pembelajaran.mata_pelajaran?.kode}</p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-gray-600 gap-3">
                                                <Users size={16} className="text-gray-400" />
                                                <span className="font-medium">Kelas {pembelajaran.kelas?.nama_kelas}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 gap-3">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>Tahun Ajaran {pembelajaran.kelas?.tahun_ajaran?.tahun}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={route('kurikulum.nilai.create', { pembelajaran_id: pembelajaran.id })}
                                                className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold border border-gray-200 transition-colors"
                                            >
                                                Input List
                                            </Link>
                                            <Link
                                                href={route('kurikulum.nilai.show', pembelajaran.id)}
                                                className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-bold border border-blue-100 transition-colors"
                                            >
                                                Riwayat
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                                    <ListChecks size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Belum ada Jadwal Mengajar</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mt-1">
                                    Anda belum ditugaskan ke kelas manapun. Hubungi kurikulum untuk pembagian tugas mengajar.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
