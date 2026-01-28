
import { Head, Link } from '@inertiajs/react';
import { Users, GraduationCap, School, MapPin, Phone, Globe, BookOpen, Clock, CheckCircle2, Search, User, BarChart3, Radio } from 'lucide-react';
import React, { useState } from 'react';

export default function Overview({ school, stats, pageSettings, attendance = [], currentDate }) {
    const [activeTab, setActiveTab] = useState('statistik');
    const [search, setSearch] = useState('');

    // Default Settings
    const heroTitle = pageSettings?.landing_hero_title || 'Gateway Informasi SIDADU';
    const heroSubtitle = pageSettings?.landing_hero_subtitle || 'Portal layanan informasi statistik dan monitoring presensi real-time.';
    const showStats = pageSettings?.landing_show_stats === '1';
    const bgImage = pageSettings?.landing_bg_image ? `/storage/${pageSettings.landing_bg_image}` : null;
    const welcomeText = pageSettings?.landing_welcome_text;

    const filteredAttendance = attendance.filter(item =>
        item.nama_masking.toLowerCase().includes(search.toLowerCase()) ||
        item.kelas.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Head title="Portal Informasi Publik" />

            {/* Navbar */}
            <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {school?.logo ? (
                        <img src={`/storage/${school.logo}`} alt="Logo" className="h-10 w-10 object-contain" />
                    ) : (
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                    )}
                    <div>
                        <h1 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{school?.nama_sekolah || 'SIDADU'}</h1>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">Public Insight Portal</p>
                    </div>
                </div>
                <Link href="/login" className="px-6 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    Portal Login
                </Link>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-24 px-6 text-center overflow-hidden">
                {bgImage && (
                    <div className="absolute inset-0 z-0">
                        <img src={bgImage} alt="School Banner" className="w-full h-full object-cover opacity-30 grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    </div>
                )}
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-400/30 backdrop-blur-md">
                        Smart Data Education Dashboard
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{heroTitle}</h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {heroSubtitle}
                    </p>
                </div>
            </div>

            {/* Tabs Control */}
            <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-30">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex gap-2">
                    <button
                        onClick={() => setActiveTab('statistik')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${activeTab === 'statistik'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <BarChart3 size={18} /> Statistik
                    </button>
                    <button
                        onClick={() => setActiveTab('presensi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${activeTab === 'presensi'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Radio size={18} className={activeTab === 'presensi' ? 'animate-pulse' : ''} /> Live Presensi
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {activeTab === 'statistik' ? (
                    <div className="space-y-12">
                        {showStats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard icon={<Users />} label="Total Siswa" value={stats.total_students} subtext={`${stats.students_male} L, ${stats.students_female} P`} />
                                <StatCard icon={<GraduationCap />} label="Guru & Staff" value={stats.total_teachers} subtext="Expert Educators" />
                                <StatCard icon={<BookOpen />} label="Total Kelas" value={stats.total_classes} subtext="Active Learning Groups" />
                            </div>
                        )}

                        {welcomeText && (
                            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                    <div className="h-8 w-1.5 bg-blue-600 rounded-full italic"></div>
                                    Selamat Datang
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">{welcomeText}</p>
                            </div>
                        )}

                        <div className="bg-blue-600 rounded-[32px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-blue-200 dark:shadow-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <div className="relative z-10 flex-1">
                                <h3 className="text-3xl font-black mb-8 italic tracking-tight">Detail Lembaga</h3>
                                <div className="space-y-6">
                                    <InfoItem icon={<MapPin className="text-blue-200" />} text={school?.alamat || '-'} />
                                    <InfoItem icon={<Phone className="text-blue-200" />} text={school?.no_telp_sekolah || '-'} />
                                    <InfoItem icon={<Globe className="text-blue-200" />} text={school?.web_sekolah || '-'} />
                                </div>
                            </div>
                            <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
                                {school?.logo ? (
                                    <img src={`/storage/${school.logo}`} alt="School Logo" className="max-h-48 drop-shadow-2xl" />
                                ) : (
                                    <School size={120} className="text-white/20" />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Attendance Tab Content */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                                    <div className="h-8 w-1.5 bg-blue-600 rounded-full italic"></div>
                                    Live Mentoring Attendance
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{currentDate}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-2 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                                <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={20} />
                                <span className="text-sm font-black text-blue-800 dark:text-blue-200 uppercase tracking-tighter">
                                    Total Hadir: {attendance.length}
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Filter Nama (Masked) atau Kelas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-5 pl-14 pr-6 shadow-sm focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-700">
                                            <th className="px-8 py-6">Identity (Masked)</th>
                                            <th className="px-8 py-6">Class</th>
                                            <th className="px-8 py-6">Check In</th>
                                            <th className="px-8 py-6 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {filteredAttendance.length > 0 ? filteredAttendance.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                                            <User size={20} />
                                                        </div>
                                                        <span className="font-bold text-gray-800 dark:text-gray-200 tracking-tight">
                                                            {item.nama_masking}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-medium text-gray-600 dark:text-gray-400">
                                                    {item.kelas}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-tighter">
                                                        <Clock size={14} />
                                                        {item.jam}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="inline-block px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 dark:border-green-800">
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center font-medium text-gray-400 italic">
                                                    Data tidak ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Privacy Information:</span> Data nama dilakukan penyensoran otomatis menggunakan algoritma Masking SIDADU untuk melindungi privasi data pribadi siswa sesuai kebijakan sekolah.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-12 text-center transition-colors">
                <div className="flex justify-center gap-6 mb-4">
                    <School className="text-gray-300 dark:text-gray-600" size={24} />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} {school?.nama_sekolah || 'SIDADU'}. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}

function StatCard({ icon, label, value, subtext }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-blue-200 dark:hover:shadow-none hover:-translate-y-2 transition-all duration-500 group">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110">
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic">{value}</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">{label}</p>
            {subtext && <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold mt-4 uppercase tracking-tighter">{subtext}</p>}
        </div>
    );
}

function InfoItem({ icon, text }) {
    return (
        <div className="flex items-start gap-4 text-white/80 group">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-white group-hover:text-blue-600">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <span className="font-semibold text-lg leading-snug pt-1">{text}</span>
        </div>
    );
}
