import { Head, Link } from '@inertiajs/react';
import { User, Calendar, Award, AlertCircle, LogOut, CheckCircle, XCircle, Clock, BookOpen, ChevronRight } from 'lucide-react';

export default function Dashboard({ students, nama_ibu }) {

    // Helper to get initials
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        // Submit POST request for logout
        import('@inertiajs/react').then(({ router }) => {
            router.post(route('wali.logout'));
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <Head title="Dashboard Wali Murid" />

            {/* Header */}
            <div className="bg-blue-600 px-6 pt-8 pb-16 rounded-b-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full -ml-8 -mb-8 blur-xl"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Selamat Datang,</p>
                        <h1 className="text-2xl font-bold text-white leading-tight">Ibu {nama_ibu}</h1>
                    </div>
                    <form method="POST" action={route('wali.logout')}>
                        <button
                            type="submit"
                            className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Students Cards (Swipable if multiple?) For now just list vertical */}
            <div className="px-6 -mt-12 space-y-6 relative z-10">
                {students.map((student) => (
                    <div key={student.id} className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100">
                        {/* Student Profile */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-xl border-2 border-white shadow-sm">
                                {getInitials(student.nama_lengkap)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{student.nama_lengkap}</h3>
                                <p className="text-gray-500 text-sm">
                                    Kelas {student.kelas?.nama_kelas || 'Belum Masuk Kelas'} • {student.nisn}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* Attendance Today */}
                            <div className={`p-4 rounded-2xl ${student.presensis && student.presensis.length > 0
                                    ? 'bg-green-50 border border-green-100'
                                    : 'bg-orange-50 border border-orange-100'
                                }`}>
                                <div className="flex items-start justify-between mb-2">
                                    <Clock size={20} className={
                                        student.presensis && student.presensis.length > 0 ? "text-green-600" : "text-orange-500"
                                    } />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Absensi</span>
                                </div>
                                {student.presensis && student.presensis.length > 0 ? (
                                    <div>
                                        <p className="font-black text-lg text-green-700 capitalize">
                                            {student.presensis[0].status}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            Masuk: {student.presensis[0].jam_masuk}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-black text-lg text-orange-700">Belum</p>
                                        <p className="text-xs text-orange-600">Menunggu scan...</p>
                                    </div>
                                )}
                            </div>

                            {/* Poin Pelanggaran */}
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                                <div className="flex items-start justify-between mb-2">
                                    <AlertCircle size={20} className="text-red-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Poin</span>
                                </div>
                                <p className="font-black text-lg text-red-700">
                                    {student.pelanggarans.reduce((acc, curr) => acc + curr.poin_saat_ini, 0)}
                                </p>
                                <p className="text-xs text-red-600">Total Pelanggaran</p>
                            </div>
                        </div>

                        {/* Menu Actions */}
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <BookOpen size={18} />
                                    </div>
                                    <span className="font-semibold text-gray-700">Lihat Laporan Nilai</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Award size={18} />
                                    </div>
                                    <span className="font-semibold text-gray-700">Catatan Prestasi</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <Clock size={18} />
                                    </div>
                                    <span className="font-semibold text-gray-700">Riwayat Kehadiran</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Empty State */}
            {students.length === 0 && (
                <div className="text-center py-20 px-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">Data Siswa Tidak Ditemukan</h3>
                    <p className="text-gray-500 text-sm mt-2">
                        Kami tidak dapat menemukan data anak berdasarkan Nama Ibu Anda. Hubungi TU Sekolah untuk verifikasi data.
                    </p>
                </div>
            )}
        </div>
    );
}
