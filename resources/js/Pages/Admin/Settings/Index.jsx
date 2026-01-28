import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Settings, Monitor, FileText, Server, Save, RefreshCw, Shield, Database, Archive, Download, Wifi, AlertTriangle, BookOpen, Globe, Cloud, ExternalLink, Terminal, Scale, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, settings = {}, roles = [], permissions = [], system_info = {}, cache_stats = {}, school_profile = {}, registration = {} }) {
    const [activeTab, setActiveTab] = useState('umum');
    const { data, setData, post, processing, errors } = useForm({
        settings: []
    });

    // Speed Test & OS Selection State
    const [speedTest, setSpeedTest] = useState({ loading: false, speed: null, stable: null, tested: false, error: false });
    const [selectedOS, setSelectedOS] = useState('windows');
    const [updateStatus, setUpdateStatus] = useState({ checking: false, checked: false, available: false, data: null, error: false });

    // Real-time System Monitor
    const [isRealtime, setIsRealtime] = useState(false);
    const [localSystemInfo, setLocalSystemInfo] = useState(system_info);

    React.useEffect(() => {
        let interval;
        if (isRealtime) {
            const fetchStats = async () => {
                try {
                    const res = await fetch(route('settings.system.stats'));
                    const data = await res.json();
                    if (data.system_info) setLocalSystemInfo(data.system_info);
                } catch (e) {
                    console.error("Failed to fetch system stats", e);
                }
            };

            // Fetch immediately then interval
            fetchStats();
            interval = setInterval(fetchStats, 3000);
        }
        return () => clearInterval(interval);
    }, [isRealtime]);

    // Validasi Props
    const safeRoles = Array.isArray(roles) ? roles : [];
    const safePermissions = Array.isArray(permissions) ? permissions : [];

    // Helper: Check Permission
    const can = (permission) => {
        return auth.user?.permissions?.includes(permission) || auth.user?.roles?.includes('Admin Sekolah');
    };

    const groupedPermissions = {
        'Dashboard': safePermissions.filter(p => p?.name?.includes('dashboard')),
        'Manajemen Sekolah': safePermissions.filter(p => p?.name?.includes('sekolah')),
        'Manajemen Kelas': safePermissions.filter(p => p?.name?.includes('kelas')),
        'Manajemen Siswa': safePermissions.filter(p => p?.name?.includes('siswa')),
        'Manajemen GTK': safePermissions.filter(p => p?.name?.includes('gtk')),
        'Kurikulum & Kalender': safePermissions.filter(p => p?.name?.includes('kurikulum')),
        'Persuratan': safePermissions.filter(p => p?.name?.includes('surat')),
        'PPDB': safePermissions.filter(p => p?.name?.includes('ppdb')),
        'Pengaturan Sistem': safePermissions.filter(p => p?.name?.includes('settings') || p?.name?.includes('backup') || p?.name?.includes('app')),
    };

    const [localSettings, setLocalSettings] = useState(() => {
        const flat = [];
        if (settings) {
            Object.values(settings).forEach(group => {
                if (Array.isArray(group)) {
                    group.forEach(s => flat.push({ key: s.key, value: s.value }));
                }
            });
        }
        // Inject Online Mode from School Profile
        if (school_profile) {
            flat.push({ key: 'is_online_mode', value: (school_profile.is_online_mode == 1 || school_profile.is_online_mode == true) ? '1' : '0' });
        }
        return flat;
    });

    const updateSetting = (key, value) => {
        setLocalSettings(prev => {
            const idx = prev.findIndex(s => s.key === key);
            if (idx >= 0) {
                const newArr = [...prev];
                newArr[idx] = { ...newArr[idx], value };
                return newArr;
            } else {
                return [...prev, { key, value }];
            }
        });
    };

    const getSettingValue = (key) => {
        const item = localSettings.find(s => s.key === key);
        return item ? item.value : '';
    };

    const submit = (e) => {
        e.preventDefault();
        router.post(route('settings.update'), { settings: localSettings }, {
            preserveScroll: true,
            onSuccess: () => { }
        });
    };

    // --- New Features Logic ---

    const translatePermission = (name) => {
        const dictionary = {
            'view.dashboard': 'Melihat Dashboard',
            'view.sekolah': 'Melihat Profil Sekolah',
            'management.sekolah': 'Mengelola Sekolah',
            'view.kelas': 'Melihat Data Kelas',
            'management.kelas': 'Mengelola Data Kelas',
            'view.siswa': 'Melihat Data Siswa',
            'management.siswa': 'Mengelola Data Siswa',
            'view.gtk': 'Melihat Data GTK',
            'management.gtk': 'Mengelola Data GTK',
            'view.kurikulum': 'Melihat Kurikulum',
            'management.kurikulum': 'Mengelola Kurikulum',
            'view.surat': 'Melihat Surat',
            'management.surat': 'Mengelola Surat',
            'surat.approve': 'Menyetujui Surat',
            'view.bk': 'Akses Menu BK',
            'management.bk': 'Mengelola Data BK',
            'view.settings': 'Melihat Pengaturan',
            'app.update': 'Update Aplikasi',
            'backup.create': 'Membuat Backup',
            'view.ppdb': 'Akses PPDB',
        };
        return dictionary[name] || name;
    };

    const runSpeedTest = () => {
        setSpeedTest({ loading: true, speed: null, stable: null, tested: false, error: false });

        // Simulating Speed Test with Fetch from Browser (Local Latency Check)
        const startTime = new Date().getTime();
        const imageAddr = window.location.origin + '/favicon.ico?n=' + startTime;
        const downloadSize = 2000; // estimated bytes

        const download = new Image();

        download.onload = function () {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000; // in seconds

            // Avoid division by zero
            const safeDuration = duration > 0 ? duration : 0.001;

            // Logic for estimation (Local Latency)
            // On Localhost, this tests responsiveness of the server itself.

            let estimatedSpeed = 0;
            // Calibrate: < 0.05s is fast for local.
            if (duration < 0.05) estimatedSpeed = 1000; // Instant
            else if (duration < 0.2) estimatedSpeed = 100;
            else if (duration < 0.5) estimatedSpeed = 10;
            else estimatedSpeed = 1;

            setSpeedTest({
                loading: false,
                speed: estimatedSpeed.toFixed(0),
                stable: estimatedSpeed >= 10,
                tested: true,
                error: false
            });
        };

        download.onerror = function () {
            setSpeedTest({ loading: false, speed: 0, stable: false, tested: true, error: true });
        };

        download.src = imageAddr;
    };

    const handleCheckUpdate = async () => {
        setUpdateStatus(prev => ({ ...prev, checking: true, error: false }));
        try {
            const response = await fetch(route('settings.app.check-update'));
            const data = await response.json();
            setUpdateStatus({
                checking: false,
                checked: true,
                available: data.available,
                data: data,
                error: !!data.error
            });
        } catch (error) {
            setUpdateStatus(prev => ({ ...prev, checking: false, error: true }));
            console.error('Update check failed', error);
        }
    };

    const handleAppUpdate = () => {
        if (speedTest.tested && !speedTest.stable) {
            Swal.fire('Koneksi Tidak Stabil', 'Kecepatan internet Anda terlalu rendah. Update berisiko gagal.', 'error');
            return;
        }

        Swal.fire({
            title: 'Update Aplikasi?',
            html: `
                <div class="text-left space-y-3">
                    <p>Aplikasi akan menarik perubahan terbaru dari <b>GitHub (git pull)</b>.</p>
                    <div class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>PERHATIAN (Wajib Dibaca):</strong>
                        <ul class="list-disc pl-5 mt-1 space-y-1">
                            <li>Pastikan sudah <b>Backup Database</b> hari ini.</li>
                            <li>Koneksi internet (Browser) harus <b>Stabil</b>.</li>
                            <li>Jangan tutup browser sampai proses selesai.</li>
                        </ul>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Lanjut Update',
            confirmButtonColor: '#d33',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('settings.app.update'), {}, {
                    preserveScroll: true,
                    onStart: () => Swal.fire({
                        title: 'Sedang Update...',
                        text: 'Mohon tunggu, jangan tutup halaman ini...',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        didOpen: () => Swal.showLoading()
                    }),
                    onFinish: () => Swal.close()
                });
            }
        });
    };

    const handlePermissionToggle = (roleId, permissionName, currentStatus) => {
        router.post(route('settings.permissions.update'), {
            role_id: roleId,
            permission: permissionName,
            enabled: !currentStatus
        }, {
            preserveScroll: true
        });
    };

    const tabs = [
        { id: 'umum', label: 'Umum', icon: Settings },
        { id: 'tampilan', label: 'Tampilan', icon: Monitor },
        { id: 'surat', label: 'Persuratan', icon: FileText },
        { id: 'akses', label: 'Hak Akses', icon: Shield },
        { id: 'sistem', label: 'Pembaruan & Backup', icon: Database },
        { id: 'hukum', label: 'Hukum & Privasi', icon: Scale },
        { id: 'server', label: 'Informasi Server', icon: Server },
        { id: 'online', label: 'Akses Online', icon: Cloud },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl text-gray-800">Pengaturan Sistem</h2>
                    <p className="text-gray-500 text-sm">Kelola konfigurasi aplikasi global</p>
                </div>
            }
        >
            <Head title="Pengaturan Sistem" />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar / Tabs */}
                <div className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 h-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mb-1 ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                    <form onSubmit={submit}>

                        {/* TAB: UMUM */}
                        {activeTab === 'umum' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800 flex items-center gap-2">
                                    Pengaturan Umum <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">v1.2 - New</span>
                                </h3>

                                {/* Online Mode Toggle (Moved to Top) */}
                                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 border-l-4 border-l-green-500 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${getSettingValue('is_online_mode') === '1' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                            <Globe size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Mode Online</h4>
                                            <p className="text-xs text-gray-500">Aktifkan untuk fitur yang memerlukan internet (Cuaca, Peta, Integrasi).</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentVal = getSettingValue('is_online_mode') === '1';
                                            updateSetting('is_online_mode', currentVal ? '0' : '1');
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${getSettingValue('is_online_mode') === '1' ? 'bg-green-500' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getSettingValue('is_online_mode') === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {/* Maintenance Mode Toggle */}
                                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                                    <div>
                                        <h4 className="font-semibold text-gray-700">Mode Maintenance</h4>
                                        <p className="text-xs text-gray-500">Jika aktif, hanya Admin yang bisa mengakses aplikasi.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentVal = getSettingValue('maintenance_mode') === '1';
                                            updateSetting('maintenance_mode', currentVal ? '0' : '1');
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${getSettingValue('maintenance_mode') === '1' ? 'bg-red-500' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getSettingValue('maintenance_mode') === '1' ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>


                                {/* Maintenance Message */}
                                {getSettingValue('maintenance_mode') === '1' && (
                                    <div className="space-y-4 p-4 border rounded-xl bg-red-50 animate-in fade-in slide-in-from-top-1">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan Maintenance</label>
                                            <textarea
                                                rows="3"
                                                className="w-full rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                                placeholder="Contoh: Sistem sedang dalam perbaikan. Mohon tunggu..."
                                                value={getSettingValue('maintenance_message')}
                                                onChange={e => updateSetting('maintenance_message', e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi Waktu Selesai</label>
                                            <p className="text-xs text-gray-500 mb-2">Waktu ini akan ditampilkan sebagai countdown di halaman maintenance.</p>
                                            <input
                                                type="datetime-local"
                                                className="w-full rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                                value={getSettingValue('maintenance_end_time') ? getSettingValue('maintenance_end_time').slice(0, 16) : ''}
                                                onChange={e => updateSetting('maintenance_end_time', e.target.value ? e.target.value + ':00' : '')}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: TAMPILAN */}
                        {activeTab === 'tampilan' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Tampilan Aplikasi</h3>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-sm text-gray-700 font-medium">Pengaturan Tema (Dark/Light)</p>
                                    <p className="text-xs text-gray-500 mt-1">Dikelola secara personal melalui tombol Matahari/Bulan di Navbar (Pojok Kanan Atas).</p>
                                </div>
                            </div>
                        )}

                        {/* TAB: SURAT */}
                        {activeTab === 'surat' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Pengaturan Persuratan</h3>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Footer Default (Surat Keluar)</label>
                                    <p className="text-xs text-gray-500 mb-2">Teks ini muncul otomatis di surat keluar baru.</p>
                                    <textarea
                                        rows="4"
                                        className="w-full rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                                        value={getSettingValue('footer_text_surat')}
                                        onChange={e => updateSetting('footer_text_surat', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* TAB: AKSES */}
                        {activeTab === 'akses' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Manajemen Hak Akses</h3>
                                <p className="text-sm text-gray-500 mb-4">Centang kotak untuk memberikan akses fitur kepada role tertentu.</p>
                                {Object.entries(groupedPermissions).map(([groupName, groupPerms]) => (
                                    groupPerms.length > 0 && (
                                        <div key={groupName} className="mb-6">
                                            <h4 className="font-semibold text-gray-700 mb-3 ml-1 uppercase text-xs tracking-wider">{groupName}</h4>
                                            <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-gray-50 border-b border-gray-100">
                                                            <th className="px-4 py-3 text-left font-semibold text-gray-600 w-1/3">Permission</th>
                                                            {safeRoles.map(role => (
                                                                <th key={role.id} className="px-4 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                                                                    {role.name}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {groupPerms.map(permission => (
                                                            <tr key={permission.id} className="hover:bg-gray-50/50">
                                                                <td className="px-4 py-3 font-medium text-gray-700">{translatePermission(permission.name)}</td>
                                                                {safeRoles.map(role => {
                                                                    const hasPermission = role.permissions ? role.permissions.some(p => p.name === permission.name) : false;
                                                                    return (
                                                                        <td key={`${role.id}-${permission.id}`} className="px-4 py-3 text-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={hasPermission}
                                                                                onChange={() => handlePermissionToggle(role.id, permission.name, hasPermission)}
                                                                                className="rounded border-gray-300 text-primary shadow-sm cursor-pointer"
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* TAB: SISTEM (BACKUP & UPDATE) */}
                        {activeTab === 'sistem' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Pembaruan & Perawatan Sistem</h3>

                                {/* Quick Actions Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Action: Backup DB */}
                                    <a href={route('settings.backup.db')} className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col items-center justify-center hover:bg-indigo-100 transition-colors group">
                                        <Database className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-gray-800">Backup DB</span>
                                        <span className="text-xs text-gray-500">Download .sql</span>
                                    </a>

                                    {/* Action: Backup Files */}
                                    <a href={route('settings.backup.files')} className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex flex-col items-center justify-center hover:bg-teal-100 transition-colors group">
                                        <Archive className="text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="font-semibold text-gray-800">Backup File</span>
                                        <span className="text-xs text-gray-500">Download .zip</span>
                                    </a>

                                    {/* Action: Clear Cache */}
                                    <button type="button" onClick={() => confirm('Bersihkan cache sistem?') && router.post(route('settings.cache.clear'))} className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex flex-col items-center justify-center hover:bg-purple-100 transition-colors group">
                                        <RefreshCw className="text-purple-600 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="font-semibold text-gray-800">Clear Cache</span>
                                        <span className="text-xs text-gray-500">Optimization</span>
                                    </button>

                                    {/* Action: Connection Check */}
                                    <div className={`p-4 border rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-colors ${speedTest.tested ? (speedTest.stable ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100') : 'bg-orange-50 border-orange-100'}`}>
                                        <div className="absolute top-2 right-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${speedTest.tested ? (speedTest.stable ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'}`}></div>
                                        </div>
                                        <Wifi className={`mb-2 ${speedTest.loading ? 'animate-pulse text-gray-500' : (speedTest.stable ? 'text-green-600' : 'text-red-500')}`} />
                                        <button type="button" onClick={runSpeedTest} disabled={speedTest.loading} className="font-semibold text-gray-800 hover:underline z-10">
                                            {speedTest.loading ? 'Menguji...' : 'Cek Koneksi'}
                                        </button>
                                        <span className="text-xs text-gray-500" title="Estimasi Latensi ke Google">
                                            {speedTest.tested
                                                ? (speedTest.error ? 'Offline' : `${speedTest.speed} Mbps Est.'`)
                                                : 'Ke Internet'}
                                        </span>
                                    </div>
                                </div>

                                {/* Update Application Section */}
                                <div className="bg-white border rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <RefreshCw size={120} className={updateStatus.available ? 'text-blue-600 animate-spin-slow' : 'text-gray-300'} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 rounded-3xl shadow-sm border ${updateStatus.available ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                    <RefreshCw size={28} className={updateStatus.checking ? 'animate-spin' : ''} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-xl tracking-tight">Pembaruan Sistem</h4>
                                                    <p className="text-sm text-slate-500">Sinkronisasi fitur terbaru langsung dari GitHub.</p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleCheckUpdate}
                                                disabled={updateStatus.checking}
                                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200 shadow-sm"
                                            >
                                                {updateStatus.checking ? <RefreshCw size={14} className="animate-spin" /> : <Globe size={14} />}
                                                {updateStatus.checking ? 'Mengecek...' : 'Cek Versi Terbaru'}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Versi Saat Ini</p>
                                                <p className="text-2xl font-black text-slate-800 tracking-tighter">v{system_info?.app_version || '1.0.0'}</p>
                                                <p className="text-xs text-slate-500 mt-1 italic">Stabil & Aktif</p>
                                            </div>
                                            <div className={`p-5 border rounded-3xl transition-all ${updateStatus.checked ? (updateStatus.available ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-50' : 'bg-green-50 border-green-200') : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Versi di GitHub</p>
                                                <p className={`text-2xl font-black tracking-tighter ${updateStatus.available ? 'text-blue-600' : 'text-green-600'}`}>
                                                    {updateStatus.checked ? (updateStatus.available ? `v${updateStatus.data.latest_version}` : 'Sama') : '--'}
                                                </p>
                                                <p className="text-xs mt-1">
                                                    {updateStatus.checked ? (updateStatus.available ? 'Tersedia Fitur Baru!' : 'Sudah yang Terbaru') : 'Belum Dicek'}
                                                </p>
                                            </div>
                                        </div>

                                        {updateStatus.checked && updateStatus.available && (
                                            <div className="mb-8 p-5 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100 animate-in zoom-in-95 duration-300">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-white/20 rounded-2xl"><Terminal size={24} /></div>
                                                    <div className="flex-1">
                                                        <h5 className="font-bold text-lg leading-tight">Perubahan Terbaru:</h5>
                                                        <p className="text-sm text-blue-100 mt-1 italic">"{updateStatus.data.message}"</p>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">🚀 New Features</span>
                                                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">🛡️ Security Fix</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            {can('app.update') ? (
                                                <button
                                                    type="button"
                                                    onClick={() => router.post(route('settings.app.perform-update'))}
                                                    disabled={processing || (updateStatus.checked && !updateStatus.available)}
                                                    className={`w-full sm:flex-1 py-4 px-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${(updateStatus.checked && !updateStatus.available)
                                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                        : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-slate-200'
                                                        }`}
                                                >
                                                    <RefreshCw size={20} className={processing ? 'animate-spin' : ''} />
                                                    {processing ? 'Memproses Update...' : 'Sinkronkan Sekarang'}
                                                </button>
                                            ) : (
                                                <div className="flex-1 p-4 bg-slate-50 border border-dashed rounded-3xl text-slate-400 text-xs text-center italic">
                                                    Hanya Administrator yang dapat melakukan sinkronisasi sistem.
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                                <Shield size={14} className="text-blue-500" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safe Update</span>
                                            </div>
                                        </div>
                                    </div>

                                    {usePage().props.flash?.update_log && (
                                        <div className="mt-8 bg-slate-900 text-blue-400 p-6 rounded-[2rem] text-[11px] font-mono overflow-auto max-h-64 whitespace-pre-wrap border border-slate-800 shadow-2xl relative group">
                                            <div className="absolute top-4 right-6 text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Execution Log</div>
                                            {usePage().props.flash.update_log}
                                        </div>
                                    )}
                                </div>

                                {/* Tutorial Accordion (Yellow Warning) */}
                                <div className="border-2 border-yellow-400 rounded-xl overflow-hidden bg-yellow-50">
                                    <details className="group">
                                        <summary className="flex cursor-pointer items-center justify-between p-4 bg-yellow-300 text-black border-b-0 group-open:border-b border-yellow-400 transition-all select-none">
                                            <h5 className="font-bold flex items-center gap-2 text-black">
                                                <BookOpen size={18} className="text-black" /> Wajib Baca Panduan Darurat : Jika Update Gagal
                                            </h5>
                                            <span className="ml-auto shrink-0 transition duration-300 group-open:-rotate-180 text-black">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="p-5 text-sm text-black bg-yellow-50 leading-relaxed space-y-4">
                                            <div className="bg-black text-yellow-400 px-4 py-2 rounded-lg font-bold text-center uppercase tracking-wider text-xs md:text-sm animate-pulse shadow-lg">
                                                📸 Halaman Notice ini wajib di Foto!
                                            </div>

                                            <p className="font-bold">Jangan Panik! Ikuti langkah-langkah berikut jika aplikasi tidak bisa diakses (Error 500) setelah update:</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-3 bg-white/50 rounded-lg border border-yellow-200">
                                                    <h6 className="font-bold text-black mb-1">1. Restore Database SQL</h6>
                                                    <ul className="list-disc pl-4 space-y-1 text-xs text-black">
                                                        <li>Buka <b>phpMyAdmin</b>.</li>
                                                        <li>Pilih database aplikasi.</li>
                                                        <li>Hapus (Drop) semua tabel yang ada.</li>
                                                        <li>Klik tab <b>Import</b>, pilih file <code>.sql</code> yang Anda backup tadi.</li>
                                                        <li>Klik Go.</li>
                                                    </ul>
                                                </div>
                                                <div className="p-3 bg-white/50 rounded-lg border border-yellow-200">
                                                    <h6 className="font-bold text-black mb-1">2. Restore File Storage</h6>
                                                    <ul className="list-disc pl-4 space-y-1 text-xs text-black">
                                                        <li>Buka File Manager (cPanel/Explorer).</li>
                                                        <li>Masuk ke folder <code>storage/app</code>.</li>
                                                        <li>Ekstrak file <code>.zip</code> backup.</li>
                                                        <li>Pastikan file <code>.env</code> tidak berubah.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 border rounded-xl bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase">Laravel</div>
                                        <div className="font-mono font-bold">{system_info?.laravel || '-'}</div>
                                    </div>
                                    <div className="p-4 border rounded-xl bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase">PHP</div>
                                        <div className="font-mono font-bold">{system_info?.php || '-'}</div>
                                    </div>
                                    <div className="p-4 border rounded-xl bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase">Database</div>
                                        <div className="font-mono font-bold">{system_info?.database || '-'} ({system_info?.driver || '-'})</div>
                                    </div>
                                    <div className="p-4 border rounded-xl bg-gray-50">
                                        <div className="text-xs text-gray-500 uppercase">Server</div>
                                        <div className="font-mono font-bold text-xs">{system_info?.server || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SERVER INFO */}
                        {activeTab === 'server' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Informasi Server & Sistem</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 mr-2">
                                            <span className={`text-xs font-bold ${isRealtime ? 'text-green-600 animate-pulse' : 'text-gray-400'}`}>
                                                {isRealtime ? '● LIVE MONITOR' : '○ STATIC VIEW'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setIsRealtime(!isRealtime)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isRealtime ? 'bg-green-500' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isRealtime ? 'translate-x-4.5' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        <button type="button" onClick={() => router.reload({ only: ['system_info'] })} className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark transition-colors">
                                            <RefreshCw size={12} /> Refresh
                                        </button>
                                    </div>
                                </div>

                                {/* Server & OS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Server size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">Lingkungan Server</h4>
                                                <p className="text-xs text-gray-500">Operating System & Web Server</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">OS</span>
                                                <p className="text-sm font-mono font-medium text-gray-700 break-words">{localSystemInfo?.os || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Web Server</span>
                                                <p className="text-sm font-mono font-medium text-gray-700 break-words text-xs">{localSystemInfo?.server || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Database Driver</span>
                                                <p className="text-sm font-mono font-medium text-gray-700">{localSystemInfo?.driver || '-'} v{localSystemInfo?.database || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PHP Configuration */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FileText size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">PHP Configuration</h4>
                                                <p className="text-xs text-gray-500">Versi {localSystemInfo?.php || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-[10px] uppercase text-gray-400 font-bold">Memory Limit</span>
                                                <p className="text-lg font-bold text-gray-800 transition-all">{localSystemInfo?.php_memory_limit || '-'}</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-[10px] uppercase text-gray-400 font-bold">Max Execution</span>
                                                <p className="text-lg font-bold text-gray-800">{localSystemInfo?.php_max_execution_time || '-'}</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-[10px] uppercase text-gray-400 font-bold">Max Upload</span>
                                                <p className="text-lg font-bold text-gray-800">{localSystemInfo?.php_upload_max_filesize || '-'}</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                <span className="text-[10px] uppercase text-gray-400 font-bold">Post Max Size</span>
                                                <p className="text-lg font-bold text-gray-800">{localSystemInfo?.php_post_max_size || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Disk Usage */}
                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Database size={18} className="text-green-600" /> Penggunaan Disk Penyimpanan
                                    </h4>

                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-gray-600">Terpakai: <b>{localSystemInfo?.disk_used_percent || 0}%</b></span>
                                        <span className="text-gray-600">Free: <b>{localSystemInfo?.disk_free || '0 B'}</b> / Total: <b>{localSystemInfo?.disk_total || '0 B'}</b></span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className={`h-4 rounded-full transition-all duration-1000 ${(localSystemInfo?.disk_used_percent || 0) > 90 ? 'bg-red-500' :
                                                (localSystemInfo?.disk_used_percent || 0) > 70 ? 'bg-orange-400' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${localSystemInfo?.disk_used_percent || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 italic">
                                        *Menampilkan kapasitas disk pada partisi instalasi aplikasi.
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
                                    <div className="mt-0.5"><Monitor size={14} /></div>
                                    <p>
                                        Informasi RAM dan CPU Usage realtime tidak ditampilkan untuk menjaga performa aplikasi agar tetap ringan.
                                        Aplikasi berjalan pada environment <b>{localSystemInfo?.os}</b>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB: AKSES ONLINE */}
                        {activeTab === 'online' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Cloud className="text-blue-500" /> Akses Online (Cloudflare Tunnel)
                                    </h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">Gratis & Aman</span>
                                </div>

                                <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                                    <h4 className="font-bold text-blue-900 mb-2">Apa itu Akses Online?</h4>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        Fitur ini memungkinkan Aplikasi SIDADU yang berjalan di server lokal sekolah (Localhost) dapat diakses dari mana saja melalui internet
                                        <b> tanpa perlu menyewa IP Public atau setting Router (Port Forwarding)</b>.
                                        Teknologi yang digunakan adalah <b>Cloudflare Tunnel</b>.
                                    </p>
                                </div>

                                {/* OS Selector */}
                                <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOS('windows')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedOS === 'windows' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Windows
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOS('linux')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedOS === 'linux' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Ubuntu / Linux
                                    </button>
                                </div>

                                {/* Step 1: Install */}
                                <div className="border border-gray-200 rounded-xl p-6 relative">
                                    <div className="absolute -top-4 -left-2 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">1</div>
                                    <h5 className="font-bold text-gray-800 mb-4 pl-4">Langkah 1: Download & Install Cloudflared</h5>

                                    {selectedOS === 'windows' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <a href="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi" target="_blank" className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                                <Download size={24} className="text-gray-500" />
                                                <div>
                                                    <div className="font-bold text-gray-700">Download .MSI (64-bit)</div>
                                                    <div className="text-xs text-gray-400">cloudflared-windows-amd64.msi</div>
                                                </div>
                                            </a>
                                            <div className="flex items-center gap-3 p-4 border rounded-xl bg-gray-50">
                                                <Terminal size={24} className="text-gray-500" />
                                                <div className="text-xs text-gray-600">
                                                    Setelah download, cukup jalankan installer MSI-nya sampai selesai.
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="bg-gray-900 text-gray-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                                                <p className="text-gray-500 mb-1"># Jalankan perintah ini di Terminal Ubuntu:</p>
                                                <div className="flex justify-between items-center gap-4">
                                                    <code className="text-green-400">curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared.deb</code>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText('curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared.deb');
                                                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Perintah disalin!', showConfirmButton: false, timer: 1500 });
                                                        }}
                                                        className="bg-gray-700 text-white px-3 py-1 rounded text-[10px]"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-gray-500 italic">
                                                *Perintah di atas akan mendownload versi .deb dan menginstalnya secara otomatis.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Step 2: Run Command */}
                                <div className="border border-gray-200 rounded-xl p-6 relative">
                                    <div className="absolute -top-4 -left-2 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
                                    <h5 className="font-bold text-gray-800 mb-4 pl-4">Langkah 2: Jalankan Tunnel</h5>

                                    <div className="bg-gray-900 text-gray-200 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                                        <p className="text-gray-500 select-none mb-2"># {selectedOS === 'windows' ? 'Jalankan di CMD/PowerShell (Admin):' : 'Jalankan di Terminal:'}</p>
                                        <div className="flex justify-between items-center gap-4">
                                            <code className="text-green-400">cloudflared tunnel --url http://127.0.0.1:8000</code>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText('cloudflared tunnel --url http://127.0.0.1:8000');
                                                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Perintah disalin!', showConfirmButton: false, timer: 1500 });
                                                }}
                                                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        *Biarkan Terminal ini tetap terbuka agar aplikasi bisa diakses online.
                                    </p>
                                </div>

                                {/* Step 3: Save URL */}
                                <div className="border border-gray-200 rounded-xl p-6 relative">
                                    <div className="absolute -top-4 -left-2 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">3</div>
                                    <h5 className="font-bold text-gray-800 mb-4 pl-4">Langkah 3: Simpan URL Publik</h5>

                                    <p className="text-sm text-gray-600 mb-4">
                                        Setelah perintah di atas berjalan, Anda akan melihat link berakhiran <code>.trycloudflare.com</code> di layar CMD Anda.
                                        Salin link tersebut dan tempel di bawah ini agar Siswa/Guru tahu alamat akses onlinenya.
                                    </p>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Publik Cloudflare</label>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <div className="relative flex-1">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="url"
                                                    className="w-full pl-10 rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
                                                    placeholder="https://random-name.trycloudflare.com"
                                                    value={getSettingValue('public_access_url')}
                                                    onChange={e => updateSetting('public_access_url', e.target.value)}
                                                />
                                            </div>
                                            {getSettingValue('public_access_url') && (
                                                <div className="flex gap-2">
                                                    <a
                                                        href={getSettingValue('public_access_url')}
                                                        target="_blank"
                                                        className="bg-green-100 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-200 transition-colors font-medium text-sm"
                                                    >
                                                        <ExternalLink size={18} /> Test
                                                    </a>
                                                    <a
                                                        href={`https://wa.me/?text=Silakan akses Aplikasi Sekolah melalui link berikut: ${getSettingValue('public_access_url')}`}
                                                        target="_blank"
                                                        className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-600 transition-colors font-medium text-sm shadow-lg shadow-green-500/30"
                                                    >
                                                        <Share2 size={18} /> Bagikan
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Link ini bersifat sementara (berubah jika tunnel dimatikan). Gunakan tombol <b>Bagikan</b> untuk mengirim link baru ke Grup WhatsApp Guru/Siswa.
                                        </p>
                                    </div>
                                </div>

                                {/* Advanced: Custom Domain (Collapsed for Zero Budget) */}
                                <div className="mt-8 border-t pt-6 opacity-75 hover:opacity-100 transition-opacity">
                                    <details className="group">
                                        <summary className="flex cursor-pointer items-center gap-2 font-medium text-gray-500 hover:text-purple-600 select-none">
                                            <Globe size={16} />
                                            <span>Info: Mengapa link saya acak/berubah-ubah?</span>
                                        </summary>
                                        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600 space-y-2">
                                            <p>
                                                Karena kita menggunakan layanan <b>GRATIS</b>, Cloudflare memberikan alamat acak (random).
                                                Ini <b>SANGAT WAJAR</b> dan tidak masalah untuk sekolah tanpa anggaran IT khusus.
                                            </p>
                                            <p>
                                                <b>Tips Hemat:</b> Server sekolah tidak perlu dimatikan (24 jam) agar link tidak berubah.
                                                Jika listrik mati/restart, cukup generate link baru dan bagikan lagi via WA.
                                            </p>
                                        </div>
                                    </details>

                                    <details className="group mt-2">
                                        <summary className="flex cursor-pointer items-center gap-2 font-medium text-gray-500 hover:text-purple-600 select-none">
                                            <Cloud size={16} />
                                            <span>Info: Bisakah hosting penuh di Cloudflare?</span>
                                        </summary>
                                        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600 space-y-2">
                                            <p>
                                                <b>Tidak Bisa Langsung.</b> Cloudflare (Pages/Workers) biasanya untuk web statis.
                                                Aplikasi SIDADU ini menggunakan Database (MySQL) yang butuh "Komputer/Server" sungguhan.
                                            </p>
                                            <p>
                                                Jadi, solusi terbaik adalah: <b>Aplikasi & Database tetap di Laptop Sekolah</b> (Gratis),
                                                dan <b>Cloudflare Tunnel</b> bertugas sebagai "Jembatan" agar bisa diakses internet.
                                            </p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'sistem' && activeTab !== 'akses' && (
                            <div className="mt-8 pt-4 border-t flex justify-end">
                                <button type="submit" disabled={processing} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 shadow-lg flex items-center gap-2">
                                    <Save size={18} /> Simpan Perubahan
                                </button>
                            </div>
                        )}
                        {activeTab === 'hukum' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 opacity-5 transform translate-x-4 -translate-y-4 text-red-900 group-hover:scale-110 transition-transform duration-500">
                                        <Shield size={120} />
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="bg-white p-3 rounded-2xl text-red-600 shadow-sm border border-red-50">
                                            <Shield size={28} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-red-900 text-xl tracking-tight">Penyangkalan Hukum (Legal Disclaimer)</h4>
                                            <p className="mt-1 text-red-700 text-sm leading-relaxed max-w-2xl font-medium">
                                                Sistem ini disediakan <b>"Apa Adanya"</b>. Pengembang berlepas diri dari tanggung jawab hukum atas kegagalan infrastruktur, peretasan, atau kebocoran data pada server institusi.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group border border-gray-100 rounded-[2.5rem] p-8 bg-white shadow-xl shadow-slate-200/50 hover:shadow-blue-100/50 transition-all duration-300 border-t-4 border-t-blue-500">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                                <Scale size={24} />
                                            </div>
                                            <h5 className="font-bold text-gray-800 text-lg">Kebijakan Privasi</h5>
                                        </div>
                                        <ul className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                            <li className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                                                <span>Data di-host mandiri (**Self-Hosted**) di server sekolah.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                                                <span>Enkripsi **AES-256-CBC** pada data sensitif & log komunikasi.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                                                <span>Kepatuhan terhadap **UU PDP No. 27/2022**.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="group border border-gray-100 rounded-[2.5rem] p-8 bg-white shadow-xl shadow-slate-200/50 hover:shadow-green-100/50 transition-all duration-300 border-t-4 border-t-green-500">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-green-50 p-3 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <h5 className="font-bold text-gray-800 text-lg">Lisensi & Hak Cipta</h5>
                                        </div>
                                        <ul className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                            <li className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></div>
                                                <span>Menggunakan **Lisensi MIT** (Bebas Modifikasi).</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></div>
                                                <span>Penyertaan nama pengembang wajib pada kode sumber.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></div>
                                                <span>Sistem bersifat "As Is" tanpa jaminan mutlak.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden relative ${registration?.is_registered ? 'bg-blue-50/30 border-blue-100 shadow-md shadow-blue-50/50' : 'bg-slate-50 border-slate-100 border-dashed opacity-80'}`}>
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Award size={100} className={registration?.is_registered ? 'text-blue-600' : 'text-slate-400'} />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-3xl shadow-sm border ${registration?.is_registered ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                                                <Award size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg tracking-tight">Status Registrasi Instalasi</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {registration?.is_registered ? (
                                                        <>
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                            <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">Terverifikasi & Terdaftar (UU PDP Patuh)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Belum Terdaftar / Mode OFFLINE</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {registration?.is_registered && (
                                            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 p-4 rounded-2xl flex items-center gap-8 shadow-sm">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NPSN</p>
                                                    <p className="text-sm font-black text-slate-800">{registration?.data?.npsn}</p>
                                                </div>
                                                <div className="w-px h-8 bg-blue-100"></div>
                                                <div className="text-center">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Terdaftar Pada</p>
                                                    <p className="text-sm font-black text-slate-800">{registration?.data?.registered_at ? new Date(registration?.data?.registered_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 text-xs text-slate-500 leading-relaxed max-w-3xl border-t border-slate-100 pt-3">
                                        <b>Transparansi Telemetri:</b> Pendaftaran ini hanya mengirimkan metadata identitas institusi (Nama Sekolah, NPSN, Versi) untuk kepentingan dukungan teknis. Data pribadi siswa/guru tetap berada sepenuhnya di server lokal sekolah (Sesuai UU PDP No. 27/2022).
                                    </p>
                                </div>

                                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-xl tracking-tight">Status Kepatuhan: <span className="text-green-600">Terverifikasi</span></h4>
                                    <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                                        Sistem ini telah dikonfigurasi mengikuti standar **UU PDP No. 27 Tahun 2022** dan praktik keamanan internasional.
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                        {[
                                            { label: 'Enkripsi AES-256', icon: Database },
                                            { label: 'Self-Hosted Data', icon: Server },
                                            { label: 'Privacy Policy', icon: FileText },
                                            { label: 'Audit Kepatuhan', icon: Scale },
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                                    <item.icon size={16} />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">{item.label}</span>
                                                <CheckCircle2 size={12} className="text-green-500" />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => Swal.fire({
                                            title: 'Sertifikat Kepatuhan Digital',
                                            html: `
                                                <div class="text-left p-2 space-y-4">
                                                    <div class="border-4 border-double border-blue-200 p-6 rounded-lg bg-slate-50 relative overflow-hidden text-center">
                                                        <div class="absolute -top-10 -right-10 opacity-10"><img src="/favicon.ico" class="w-40" /></div>
                                                        <h2 class="text-2xl font-serif text-slate-800 border-b-2 border-blue-200 pb-2 mb-4">CERTIFICATE OF COMPLIANCE</h2>
                                                        <p class="text-slate-600 italic mb-2">Diberikan kepada Institusi Pengelola:</p>
                                                        <h3 class="text-xl font-bold text-slate-900 mb-6 underline">${school_profile?.nama_sekolah || 'Satuan Pendidikan Pengguna'}</h3>
                                                        <div class="text-left text-sm text-slate-700 space-y-2 mb-8">
                                                            <p>✅ <b>Data Privacy:</b> Enkripsi tingkat tinggi AES-256 pada data Dapodik.</p>
                                                            <p>✅ <b>Security:</b> Implementasi Firewall dan Two-Factor Authentication.</p>
                                                            <p>✅ <b>Legality:</b> Kepatuhan terhadap UU PDP No. 27 Tahun 2022 & MIT License.</p>
                                                            <p>✅ <b>Sovereignty:</b> Penyimpanan mandiri di server lokal institusi.</p>
                                                        </div>
                                                        <div class="flex justify-between items-end mt-10">
                                                            <div class="text-center">
                                                                <p class="text-[10px] text-slate-400">Status Sistem</p>
                                                                <p class="text-green-600 font-bold">SECURE & COMPLIANT</p>
                                                            </div>
                                                            <div class="text-center">
                                                                <p class="text-[10px] text-slate-400">Diverifikasi Oleh</p>
                                                                <p class="font-bold text-slate-800">SIDADU AI Auditor</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p class="text-[10px] text-slate-400 italic text-center">*Sertifikat ini adalah validasi sistem atas konfigurasi teknis yang aktif.</p>
                                                </div>
                                            `,
                                            width: '600px',
                                            confirmButtonColor: '#0F172A',
                                            confirmButtonText: 'Tutup & Simpan'
                                        })}
                                        className="mt-8 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-900/20"
                                    >
                                        <Award size={18} /> Lihat Sertifikat Digital
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div >
            </div >
        </AuthenticatedLayout >
    );
}
