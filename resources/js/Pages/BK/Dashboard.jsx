import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, Users, Trophy, Activity, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

export default function BkDashboard({ auth, stats, siswa_bermasalah, recent_violations, recent_prestasi }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Bimbingan Konseling</h2>
                        <p className="text-gray-500 text-sm">Monitoring karakter dan kedisiplinan siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('bk.konseling.create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg transition-transform active:scale-95"
                        >
                            <Activity size={16} /> Konseling
                        </Link>
                        <Link
                            href={route('bk.prestasi.create')}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg transition-transform active:scale-95"
                        >
                            <Trophy size={16} /> Catat Prestasi
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard BK" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* ... existing stats ... */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-sm shadow-red-100 dark:shadow-red-900/10 border border-red-50 dark:border-red-900/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl">
                            <ShieldAlert size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Pelanggaran</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.total_pelanggaran}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-sm shadow-blue-100 dark:shadow-blue-900/10 border border-blue-50 dark:border-blue-900/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl">
                            <Users size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Sesi Konseling</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.total_konseling}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-sm shadow-yellow-100 dark:shadow-yellow-900/10 border border-yellow-50 dark:border-yellow-900/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-2xl">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Prestasi</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.total_prestasi}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Siswa Bermasalah */}
                <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" size={20} />
                            Perlu Perhatian (Top 5 Poin)
                        </h3>
                        <Link href={route('bk.pelanggaran.index')} className="text-sm text-primary hover:underline">Lihat Semua</Link>
                    </div>

                    <div className="space-y-4">
                        {siswa_bermasalah.length > 0 ? (
                            siswa_bermasalah.map((siswa, idx) => (
                                <div key={siswa.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-gray-400">#{idx + 1}</div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-200">{siswa.nama_lengkap}</h4>
                                            <p className="text-sm text-gray-500">{siswa.kelas?.nama} • {siswa.nis}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-black text-red-500">{siswa.pelanggarans_sum_poin_saat_ini}</span>
                                        <span className="text-xs text-gray-400">Poin Pelanggaran</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">Tidak ada data siswa bermasalah.</p>
                        )}
                    </div>
                </div>

                {/* Recent Violations */}
                <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <Activity className="text-red-500" size={20} />
                            Pelanggaran Terbaru
                        </h3>
                        <Link href={route('bk.pelanggaran.index')} className="text-sm text-primary hover:underline">Lihat Semua</Link>
                    </div>

                    <div className="space-y-0">
                        {recent_violations.length > 0 ? (
                            recent_violations.map((log) => (
                                <div key={log.id} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl">
                                    <div className="mt-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{log.siswa?.nama_lengkap}</h4>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {log.tanggal_kejadian}
                                            </span>
                                        </div>
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                                            {log.jenis_pelanggaran?.nama_pelanggaran}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">Belum ada data pelanggaran hari ini.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Achievement Section */}
            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-8 shadow-sm border border-amber-50 dark:border-amber-900/20">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                            <Trophy className="text-amber-500" size={24} />
                        </div>
                        Pencapaian Siswa Terbaru
                    </h3>
                    <Link href={route('bk.prestasi.index')} className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1">
                        Lihat Galeri Prestasi <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recent_prestasi.length > 0 ? (
                        recent_prestasi.map((item) => (
                            <div key={item.id} className="group relative bg-gray-50 dark:bg-gray-700/30 p-5 rounded-[24px] hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl hover:shadow-amber-500/10 border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30 transition-all duration-300">
                                <div className="absolute top-4 right-4 text-emerald-500 font-black text-lg opacity-20 group-hover:opacity-100 transition-opacity">
                                    +{item.poin_apresiasi}
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 font-black">
                                        {item.siswa?.nama_lengkap?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-1">{item.siswa?.nama_lengkap}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.siswa?.kelas?.nama}</p>
                                    </div>
                                </div>
                                <h5 className="font-black text-gray-900 dark:text-gray-50 text-base mb-1 line-clamp-2 leading-tight">
                                    {item.nama_prestasi}
                                </h5>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-600">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md uppercase tracking-wider">
                                        {item.tingkat}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">{item.tanggal}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-700/20 rounded-[24px] border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <Trophy size={48} className="mx-auto mb-3 opacity-10" />
                            <p className="font-bold">Belum ada torehan prestasi</p>
                            <p className="text-sm mt-1">Mari apresiasi setiap langkah kecil siswa.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
