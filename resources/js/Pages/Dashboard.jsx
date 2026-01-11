import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, GraduationCap, School, ArrowUpRight, ArrowDownRight, Clock, MapPin, Globe, Phone, Mail } from 'lucide-react';

export default function Dashboard({ auth, schoolProfile, stats }) {
    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white p-6 rounded-[30px] shadow-sm shadow-gray-200/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform origin-left">{value}</p>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Dashboard</h2>
                        <p className="text-gray-500 text-sm">Pratinjau statistik & profil sekolah</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2 text-sm font-medium text-gray-600 shadow-sm">
                            <Clock size={16} className="text-primary" />
                            <span>Tahun Ajaran: 2024/2025</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Siswa Aktif"
                    value={stats.total_siswa}
                    icon={Users}
                    color="bg-gradient-to-br from-primary to-accent"
                    trend={5.2}
                />
                <StatCard
                    title="Jumlah Kelas"
                    value={stats.total_kelas}
                    icon={School}
                    color="bg-gradient-to-br from-secondary to-pink-600"
                />
                <StatCard
                    title="Total Alumni"
                    value={stats.total_alumni}
                    icon={GraduationCap}
                    color="bg-gradient-to-br from-success to-emerald-600"
                    trend={12.5}
                />
                <StatCard
                    title="Siswa Keluar"
                    value={stats.siswa_keluar}
                    icon={ArrowUpRight}
                    color="bg-gradient-to-br from-warning to-orange-500"
                    trend={-2.1}
                />
            </div>

            {/* School Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[30px] p-8 shadow-sm shadow-gray-200/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <School className="text-primary" />
                            Profil Sekolah
                        </h3>
                        {/* Edit Button or Action */}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Logo Area */}
                        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-[30px] border border-dashed border-gray-200">
                            <img
                                src={schoolProfile?.logo_sekolah || 'https://via.placeholder.com/150'}
                                alt="Logo Sekolah"
                                className="w-32 h-32 object-contain mb-4"
                            />
                            <h4 className="font-bold text-center text-gray-800">{schoolProfile?.nama_sekolah || 'Nama Sekolah'}</h4>
                            <p className="text-sm text-gray-500">{schoolProfile?.npsn || 'NPSN'}</p>
                        </div>

                        {/* Details Area */}
                        <div className="w-full md:w-2/3 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin size={12} /> Alamat</p>
                                    <p className="font-medium text-gray-700 text-sm">{schoolProfile?.alamat_sekolah || '-'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Users size={12} /> Kepala Sekolah</p>
                                    <p className="font-medium text-gray-700 text-sm">{schoolProfile?.nama_kepala_sekolah || '-'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Mail size={12} /> Email</p>
                                    <p className="font-medium text-gray-700 text-sm">{schoolProfile?.email_sekolah || '-'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Phone size={12} /> Telepon</p>
                                    <p className="font-medium text-gray-700 text-sm">{schoolProfile?.no_telp_sekolah || '-'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mt-4">
                                <p className="text-xs text-primary mb-1 flex items-center gap-1"><Globe size={12} /> Website</p>
                                <a href={schoolProfile?.web_sekolah} target="_blank" className="font-medium text-primary hover:underline text-sm truncate block">
                                    {schoolProfile?.web_sekolah || '-'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Widget (e.g., Kop Surat Preview) */}
                <div className="bg-white rounded-[30px] p-8 shadow-sm shadow-gray-200/50 flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold text-gray-800 mb-4">Pratinjau Kop Surat</h3>
                    <div className="w-full aspect-[21/9] bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-gray-400 text-sm">Preview Kop Surat</span>
                    </div>
                    <button className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                        Atur Kop Surat
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
