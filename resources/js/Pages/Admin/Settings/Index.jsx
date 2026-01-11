import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Settings, Monitor, FileText, Server, Save, RefreshCw, Shield, Database, Archive, Download, Wifi, AlertTriangle, BookOpen } from 'lucide-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, settings = {}, roles = [], permissions = [], system_info = {}, cache_stats = {} }) {
    const [activeTab, setActiveTab] = useState('umum');
    const { data, setData, post, processing, errors } = useForm({
        settings: []
    });

    // Speed Test State
    const [speedTest, setSpeedTest] = useState({ loading: false, speed: null, stable: null, tested: false, error: false });

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

    const runSpeedTest = () => {
        setSpeedTest({ loading: true, speed: null, stable: null, tested: false, error: false });

        // Simulating Speed Test with Fetch from Browser
        const startTime = new Date().getTime();
        const imageAddr = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png?n=" + startTime;
        const downloadSize = 5000; // estimated bytes (approx 5KB)

        const download = new Image();

        download.onload = function () {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000; // in seconds

            // Avoid division by zero
            const safeDuration = duration > 0 ? duration : 0.001;

            // Logic for estimation (rough, client-side only)
            // This tests local browser's connection to Google, which is a good proxy for general internet health.
            // On XAMPP (Localhost), the User IS the Server, so this is valid.

            let estimatedSpeed = 0;
            // Calibrate: < 0.2s is fast for a small ping.
            if (duration < 0.2) estimatedSpeed = 50;
            else if (duration < 0.5) estimatedSpeed = 20;
            else if (duration < 1.0) estimatedSpeed = 5;
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
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Pengaturan Umum</h3>
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
                                                value={getSettingValue('maintenance_message')}
                                                onChange={e => updateSetting('maintenance_message', e.target.value)}
                                            ></textarea>
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
                                                                <td className="px-4 py-3 font-medium text-gray-700">{permission.name}</td>
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
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 relative">
                                    {/* Red Notice for Connection */}
                                    {(!speedTest.tested || (speedTest.tested && !speedTest.stable)) && (
                                        <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" />
                                                <div className="text-red-800">
                                                    <p className="font-bold text-sm">Peringatan: Kestabilan Koneksi Diperlukan</p>
                                                    <p className="text-xs mt-1 leading-relaxed">
                                                        Untuk update, pastikan koneksi internet stabil (Test Ping OK).<br />
                                                        {speedTest.tested
                                                            ? (speedTest.error ? 'Koneksi gagal/offline. Cek internet Anda.' : 'Kecepatan dianggap kurang stabil.')
                                                            : 'Harap lakukan "Cek Koneksi" di atas sebelum melanjutkan.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600 hidden sm:block"><RefreshCw size={32} /></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">Update Aplikasi</h4>
                                                    <p className="text-sm text-gray-600">Sinkronisasi fitur terbaru dari repositori GitHub.</p>
                                                </div>
                                                <span className="text-xs font-mono bg-blue-200 text-blue-800 px-2 py-1 rounded">Dev Branch</span>
                                            </div>

                                            {usePage().props.flash?.update_log && (
                                                <div className="mb-4 bg-gray-900 text-gray-100 p-4 rounded-xl text-xs font-mono overflow-auto max-h-48 whitespace-pre-wrap shadow-inner border border-gray-700">
                                                    {usePage().props.flash.update_log}
                                                </div>
                                            )}

                                            {can('app.update') ? (
                                                <button
                                                    type="button"
                                                    onClick={handleAppUpdate}
                                                    disabled={processing || (speedTest.tested && !speedTest.stable)}
                                                    className={`px-5 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition-all w-full sm:w-auto justify-center ${speedTest.tested && !speedTest.stable
                                                            ? 'bg-gray-400 text-gray-100 cursor-not-allowed opacity-75'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                                                        }`}
                                                >
                                                    <RefreshCw size={18} className={processing ? 'animate-spin' : ''} />
                                                    {processing ? 'Memproses Update...' : 'Jalankan Update Sekarang'}
                                                </button>
                                            ) : (
                                                <div className="p-3 bg-gray-100 border rounded-lg text-sm text-gray-500 italic text-center">
                                                    Hanya Role Admin yang diizinkan melakukan update.
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

                        {activeTab !== 'sistem' && activeTab !== 'akses' && (
                            <div className="mt-8 pt-4 border-t flex justify-end">
                                <button type="submit" disabled={processing} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 shadow-lg flex items-center gap-2">
                                    <Save size={18} /> Simpan Perubahan
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
