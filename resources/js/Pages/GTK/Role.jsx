import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Search, Shield, Users, ChevronDown, UserCircle, Briefcase, Download } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

// Helper for Initials
const getInitials = (name) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

// Helper for Color based on name
const getColor = (name) => {
    const colors = [
        'bg-red-100 text-red-600',
        'bg-orange-100 text-orange-600',
        'bg-amber-100 text-amber-600',
        'bg-green-100 text-green-600',
        'bg-emerald-100 text-emerald-600',
        'bg-teal-100 text-teal-600',
        'bg-cyan-100 text-cyan-600',
        'bg-blue-100 text-blue-600',
        'bg-indigo-100 text-indigo-600',
        'bg-violet-100 text-violet-600',
        'bg-purple-100 text-purple-600',
        'bg-fuchsia-100 text-fuchsia-600',
        'bg-pink-100 text-pink-600',
        'bg-rose-100 text-rose-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export default function Role({ auth, gtks, roles }) {
    const [search, setSearch] = useState('');

    const handleRoleUpdate = (gtk, index, newRoleName) => {
        let currentRoles = gtk.user?.roles?.map(r => r.name) || [];
        if (currentRoles.length === 0) currentRoles = [null, null];
        if (currentRoles.length === 1) currentRoles.push(null);

        if (newRoleName === '') {
            currentRoles[index] = null;
        } else {
            currentRoles[index] = newRoleName;
        }

        const rolesToSubmit = currentRoles.filter(r => r);

        router.post(route('gtk.role.update', gtk.id), {
            roles: rolesToSubmit
        }, {
            preserveScroll: true,
            onSuccess: () => { }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="font-black text-2xl text-gray-800 tracking-tight">Manajemen Role User</h2>
                        <p className="text-gray-500 text-sm mt-1">Kelola hak akses pengguna dengan sistem Multi-Role</p>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Role User" />

            {/* Main Content Card */}
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

                {/* Header Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-2xl border border-blue-100 w-full md:w-auto">
                        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20">
                            <Users size={20} />
                        </div>
                        <div className="text-sm">
                            <h4 className="font-bold">Mode Dual-Role Aktif</h4>
                            <p className="opacity-80 text-xs">Anda dapat mengatur hingga 2 role per user.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <a
                            href={route('gtk.role.export')}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                        >
                            <Download size={18} />
                            Export Excel
                        </a>
                        <div className="relative group w-full md:w-auto">
                            <select
                                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full md:w-40 transition-all hover:border-gray-300 shadow-sm"
                                defaultValue={10}
                                onChange={(e) => {
                                    router.get(route('gtk.role.index'), { per_page: e.target.value }, { preserveScroll: true, preserveState: true });
                                }}
                            >
                                {[10, 30, 50, 100, 200].map(n => <option key={n} value={n}>{n} Data / Hal</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[35%]">Pengguna</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[25%] text-center">Role Utama</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[5%] text-center"></th> {/* Spacer/Indicator */}
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-[25%] text-center">Role Tambahan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {gtks.data.map((gtk) => {
                                const role1 = gtk.user?.roles?.[0]?.name || '';
                                const role2 = gtk.user?.roles?.[1]?.name || '';
                                const userColor = getColor(gtk.nama);

                                return (
                                    <tr key={gtk.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${userColor}`}>
                                                    {getInitials(gtk.nama)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-base">{gtk.nama}</h3>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-gray-500 text-xs font-medium bg-gray-100/80 px-2 py-0.5 rounded-md w-fit">
                                                        <Briefcase size={10} />
                                                        {gtk.jenis_ptk || 'Tidak ada jabatan'}
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-mono mt-1">{gtk.user?.email || 'Belum ada akun'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role 1 */}
                                        <td className="py-5 px-4 align-middle">
                                            <div className="relative group/select w-full max-w-[200px] mx-auto">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10">
                                                    <Shield size={16} />
                                                </div>
                                                <select
                                                    className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-blue-100 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 appearance-none shadow-sm hover:border-blue-300 transition-all cursor-pointer"
                                                    value={role1}
                                                    onChange={(e) => handleRoleUpdate(gtk, 0, e.target.value)}
                                                >
                                                    <option value="" disabled className="text-gray-400">Pilih Role...</option>
                                                    {roles.map(r => (
                                                        <option key={`r1-${r.id}`} value={r.name}>{r.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/select:text-primary transition-colors" />

                                                {/* Label Indicator inside or above? Let's denote visually with color */}
                                                <div className="absolute -top-2.5 left-2 bg-white px-1 text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                                                    Utama
                                                </div>
                                            </div>
                                        </td>

                                        {/* Separator / Arrow */}
                                        <td className="py-5 px-1 text-center">
                                            <div className="w-8 h-0.5 bg-gray-200 mx-auto rounded-full group-hover:bg-blue-200 transition-colors"></div>
                                        </td>

                                        {/* Role 2 */}
                                        <td className="py-5 px-4 align-middle">
                                            <div className="relative group/select w-full max-w-[200px] mx-auto">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                                    <Shield size={16} />
                                                </div>
                                                <select
                                                    className={`w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-4 focus:ring-gray-100 appearance-none shadow-sm hover:border-gray-300 transition-all cursor-pointer ${role2 ? 'bg-white font-semibold text-gray-700' : 'bg-gray-50/50 text-gray-400 font-normal italic'}`}
                                                    value={role2}
                                                    onChange={(e) => handleRoleUpdate(gtk, 1, e.target.value)}
                                                >
                                                    <option value="">-- Kosong --</option>
                                                    {roles.map(r => (
                                                        <option key={`r2-${r.id}`} value={r.name} disabled={r.name === role1}>
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/select:text-gray-600 transition-colors" />

                                                <div className="absolute -top-2.5 left-2 bg-white px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                    Tambahan
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                    <Pagination links={gtks.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
