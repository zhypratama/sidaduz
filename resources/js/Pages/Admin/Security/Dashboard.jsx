import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Shield,
    AlertTriangle,
    Ban,
    Activity,
    TrendingUp,
    Clock,
    ShieldCheck,
    Plus,
    Trash2,
    Search,
    RefreshCw,
    Info,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function SecurityDashboard({
    auth,
    stats,
    threatsByType,
    threatsBySeverity,
    topIPs,
    recentThreats,
    timeline,
    blockedIps = [],
    whitelistedIps = [],
    filters
}) {
    const [activeTab, setActiveTab] = useState('threats'); // 'threats', 'blocked', 'whitelist'
    const [selectedDays, setSelectedDays] = useState(filters.days);
    const [selectedType, setSelectedType] = useState(filters.type);
    const [selectedSeverity, setSelectedSeverity] = useState(filters.severity);

    const applyFilters = () => {
        router.get(route('security.dashboard'), {
            days: selectedDays,
            type: selectedType,
            severity: selectedSeverity,
        }, { preserveState: true });
    };

    const clearOldLogs = () => {
        Swal.fire({
            title: 'Bersihkan Semua Log?',
            text: 'Seluruh riwayat log keamanan akan dihapus permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus Semua'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('security.clear'), { days: 0 });
            }
        });
    };

    const handleBlockIP = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Blokir Alamat IP',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="IP Address (ex: 192.168.1.1)">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Alasan Pemblokiran">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });

        if (formValues) {
            router.post(route('security.block-ip'), {
                ip_address: formValues[0],
                reason: formValues[1]
            });
        }
    };

    const handleUnblockIP = (ip) => {
        Swal.fire({
            title: 'Pulihkan IP?',
            text: `Apakah Anda yakin ingin membuka blokir untuk ${ip}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Pulihkan'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('security.unblock-ip'), { ip_address: ip });
            }
        });
    };

    const handleWhitelistIP = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah ke Daftar Putih (Whitelist)',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="IP Address">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Nama/Label (ex: Indihome Kantor)">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });

        if (formValues) {
            router.post(route('security.whitelist-ip'), {
                ip_address: formValues[0],
                name: formValues[1]
            });
        }
    };

    const handleRemoveWhitelist = (ip) => {
        Swal.fire({
            title: 'Hapus dari Whitelist?',
            text: `IP ${ip} akan kembali terkena filter keamanan normal.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('security.remove-whitelist'), { ip_address: ip });
            }
        });
    };

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'bg-blue-100 text-blue-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
        };
        return colors[severity] || colors.medium;
    };

    const getTypeIcon = (type) => {
        const icons = {
            sql_injection: '💉',
            xss: '🔗',
            brute_force: '🔨',
            path_traversal: '📁',
            unauthorized_access: '🚫',
            ip_blocked: '⛔',
            ip_unblocked: '🔓',
            ip_whitelisted: '⚪'
        };
        return icons[type] || '⚠️';
    };

    const tabs = [
        { id: 'threats', label: 'Log Ancaman', icon: AlertTriangle },
        { id: 'blocked', label: 'IP Terblokir', icon: Ban },
        { id: 'whitelist', label: 'Daftar Putih', icon: ShieldCheck },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Keamanan Sistem" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <Shield className="text-primary" size={32} />
                            Keamanan Sistem
                        </h1>
                        <p className="text-gray-500 mt-1">Pemantauan ancaman real-time & manajemen akses IP</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={clearOldLogs}
                            className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 font-semibold text-sm"
                        >
                            <RefreshCw size={16} />
                            Bersihkan Log Lama
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                                <Activity size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400">TOTAL</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.total_threats}</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Ancaman Terdeteksi</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400">CRITICAL</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.critical_threats}</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Ancaman Berbahaya</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                                <Ban size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400">SYSTEM</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.blocked_attacks}</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Serangan Dicegah</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400">IPS</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.unique_ips}</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">IP Penyerang Unik</p>
                    </div>
                </div>

                {/* Tabs & Management */}
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex flex-col sm:flex-row border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${activeTab === tab.id
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'threats' && (
                            <div className="space-y-6">
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Rentang Waktu</label>
                                        <select
                                            value={selectedDays}
                                            onChange={(e) => setSelectedDays(e.target.value)}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm font-bold"
                                        >
                                            <option value="1">Terakhir 24 Jam</option>
                                            <option value="7">Terakhir 7 Hari</option>
                                            <option value="30">Terakhir 30 Hari</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tipe Ancaman</label>
                                        <select
                                            value={selectedType}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm font-bold"
                                        >
                                            <option value="all">Semua Tipe</option>
                                            <option value="sql_injection">SQL Injection</option>
                                            <option value="xss">XSS</option>
                                            <option value="brute_force">Brute Force</option>
                                            <option value="path_traversal">Path Traversal</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tingkat Bahaya</label>
                                        <select
                                            value={selectedSeverity}
                                            onChange={(e) => setSelectedSeverity(e.target.value)}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm font-bold"
                                        >
                                            <option value="all">Semua Level</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={applyFilters}
                                            className="w-full bg-primary text-white py-2.5 rounded-xl hover:bg-primary/90 transition-all font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            <Search size={16} />
                                            Terapkan Filter
                                        </button>
                                    </div>
                                </div>

                                {/* Threat Table */}
                                <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Waktu</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Tipe & Level</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Alamat IP</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Keterangan</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {recentThreats.data.map((threat) => (
                                                <tr key={threat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                            <Clock size={14} className="text-gray-300" />
                                                            {new Date(threat.detected_at).toLocaleString('id-ID', {
                                                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-sm font-black text-gray-700 dark:text-gray-200">
                                                                <span>{getTypeIcon(threat.type)}</span>
                                                                <span className="capitalize">{threat.type.replace('_', ' ')}</span>
                                                            </div>
                                                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${getSeverityColor(threat.severity)}`}>
                                                                {threat.severity}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-sm font-bold bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                                                            {threat.ip_address}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <p className="text-sm text-gray-500 truncate">{threat.description}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {threat.blocked ? (
                                                            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs">
                                                                <CheckCircle2 size={14} />
                                                                <span>DIBLOKIR</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs">
                                                                <Info size={14} />
                                                                <span>DICATAT</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {!threat.blocked && threat.ip_address !== '127.0.0.1' && (
                                                            <button
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: 'Blokir IP ini?',
                                                                        text: `IP ${threat.ip_address} akan diblokir dari seluruh akses sistem.`,
                                                                        icon: 'warning',
                                                                        showCancelButton: true
                                                                    }).then(r => r.isConfirmed && router.post(route('security.block-ip'), { ip_address: threat.ip_address, reason: threat.description }));
                                                                }}
                                                                className="text-xs font-black text-red-500 hover:text-red-700 py-1 px-3 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                                                            >
                                                                BLOKIR IP
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'blocked' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-gray-800 dark:text-gray-200">Manajemen IP Terblokir</h3>
                                    <button
                                        onClick={handleBlockIP}
                                        className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Blokir IP Manual
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {blockedIps.map((ip) => (
                                        <div key={ip.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-mono font-black text-primary text-lg">{ip.ip_address}</p>
                                                    <p className="text-xs text-gray-500 font-medium">Alasan: {ip.reason}</p>
                                                    <p className="text-[10px] text-gray-400">Diblokir pada: {new Date(ip.blocked_at).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleUnblockIP(ip.ip_address)}
                                                    className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                                                    title="Lepas Blokir"
                                                >
                                                    <CheckCircle2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {blockedIps.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                                            <ShieldCheck size={48} className="mx-auto mb-3 opacity-20" />
                                            <p className="font-bold uppercase tracking-widest text-xs">Aman! Tidak ada IP yang diblokir</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'whitelist' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-gray-800 dark:text-gray-200">Daftar Putih (Whitelist)</h3>
                                    <button
                                        onClick={handleWhitelistIP}
                                        className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Tambah Whitelist
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {whitelistedIps.map((ip) => (
                                        <div key={ip.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group border-l-4 border-l-emerald-500">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-mono font-black text-emerald-600 text-lg">{ip.ip_address}</p>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{ip.label || 'Tanpa Label'}</p>
                                                    <p className="text-[10px] text-gray-400">Ditambahkan: {new Date(ip.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveWhitelist(ip.ip_address)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                    title="Hapus dari Whitelist"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {whitelistedIps.length === 0 && (
                                        <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                                            <Info size={48} className="mx-auto mb-3 opacity-20" />
                                            <p className="font-bold uppercase tracking-widest text-xs">Kosong! Belum ada IP Whitelist</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Attacking IPs & Timeline Chart would go here if needed to restore, 
                    but these tabs provide much better management utility */}
            </div>
        </AuthenticatedLayout>
    );
}

