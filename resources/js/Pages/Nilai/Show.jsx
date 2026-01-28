import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Show({ auth, pembelajaran, grades }) {
    // grades is grouped by 'judul' (Title)
    // Structure: { "UH 1": [ { ...NilaiHarian... }, ... ], "Tugas 1": ... }

    // We want to sort grades keys if needed, but Controller likely did order.

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Riwayat Nilai Harian</h2>}
        >
            <Head title={`Riwayat Nilai - ${pembelajaran.mata_pelajaran?.nama}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-start gap-6">
                        <Link
                            href={route('kurikulum.nilai.index')}
                            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
                                    {pembelajaran.mata_pelajaran?.kode}
                                </span>
                                <h3 className="text-2xl font-bold text-gray-900">{pembelajaran.mata_pelajaran?.nama}</h3>
                            </div>
                            <div className="flex gap-6 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} />
                                    Kelas {pembelajaran.kelas?.nama_kelas || '-'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Tahun {pembelajaran.kelas?.tahun_ajaran?.tahun || '-'}
                                </div>
                            </div>
                        </div>

                        <div className="ml-auto">
                            <Link
                                href={route('kurikulum.nilai.create', { pembelajaran_id: pembelajaran.id })}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20"
                            >
                                + Input Nilai Baru
                            </Link>
                        </div>
                    </div>

                    {/* Grades History List */}
                    <div className="space-y-6">
                        {Object.keys(grades).length > 0 ? (
                            Object.keys(grades).map((judul, index) => (
                                <GradeSection
                                    key={index}
                                    title={judul}
                                    gradeItems={grades[judul]}
                                />
                            ))
                        ) : (
                            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                                <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                                    <BookOpen size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Belum Ada Data Nilai</h3>
                                <p className="text-gray-500">Belum ada penilaian yang dimasukkan untuk mata pelajaran ini.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function GradeSection({ title, gradeItems }) {
    const [isOpen, setIsOpen] = useState(false);

    // Summary Stats
    const total = gradeItems.reduce((acc, curr) => acc + curr.nilai, 0);
    const avg = total / gradeItems.length;
    const date = gradeItems[0]?.tanggal; // Take first one
    const type = gradeItems[0]?.jenis;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">{title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-xs font-semibold">{type}</span>
                            <span>•</span>
                            <span>{new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{gradeItems.length} Siswa Diuji</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Rata-Rata Kelas</div>
                    <div className={`text-xl font-black ${avg >= 75 ? 'text-emerald-600' : avg >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {avg.toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Content Accordion */}
            {isOpen && (
                <div className="border-t border-gray-100 bg-slate-50/50 p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Nilai</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {gradeItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.student?.nama_lengkap}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-center font-bold">
                                            <span className={`px-2 py-1 rounded ${item.nilai >= 75 ? 'bg-emerald-100 text-emerald-700' :
                                                    item.nilai >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {item.nilai}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 italic">
                                            {item.keterangan || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
