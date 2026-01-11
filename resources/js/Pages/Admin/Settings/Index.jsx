import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

import { Settings, Monitor, FileText, Server, Save, RefreshCw, Shield } from 'lucide-react';
import React, { useState } from 'react';

export default function Index({ auth, settings, roles, permissions }) {
    const [activeTab, setActiveTab] = useState('umum');
    const { data, setData, post, processing, errors } = useForm({
        settings: []
    });

    // Helper to get value
    const getValue = (key) => {
        for (const group in settings) {
            const found = settings[group].find(s => s.key === key);
            if (found) return found.value;
        }
        return '';
    };

    // Helper to handle change
    const handleChange = (key, value, group) => {
        // Optimistic UI update or local state management needed here is tricky with grouped data
        // For simplicity, we can post direct single updates or formatted array
        // Here we'll just use a form submission approach

        // We find the setting in a flat list or reconstruct
        // For now, let's create a payload on submit. 
        // But to control inputs, we need local state mirroring props.settings
    };

    // Better approach: Local state initialized from props
    const [localSettings, setLocalSettings] = useState(settings);

    const updateLocalSetting = (group, key, value) => {
        const newSettings = { ...localSettings };
        const settingIndex = newSettings[group].findIndex(s => s.key === key);
        if (settingIndex > -1) {
            newSettings[group][settingIndex].value = value;
            setLocalSettings(newSettings);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Flatten for submission
        const payload = [];
        Object.keys(localSettings).forEach(group => {
            localSettings[group].forEach(setting => {
                payload.push({ key: setting.key, value: setting.value });
            });
        });

        router.post(route('settings.update'), { settings: payload }, {
            preserveScroll: true,
            onSuccess: () => {
                // Flash success handled by global layout
            }
        });
    };

    const handleAppUpdate = () => {
        if (confirm('Apakah Anda yakin ingin memperbarui aplikasi? Pastikan koneksi internet stabil.')) {
            router.post(route('settings.app.update'));
        }
    };

    const tabs = [
        { id: 'umum', label: 'Umum', icon: Settings },
        { id: 'tampilan', label: 'Tampilan', icon: Monitor },
        { id: 'surat', label: 'Persuratan', icon: FileText },
        { id: 'akses', label: 'Hak Akses', icon: Shield },
        { id: 'sistem', label: 'Pembaruan & Sistem', icon: Server },
    ];

    const handlePermissionToggle = (roleId, permissionName, currentStatus) => {
        router.post(route('settings.permissions.update'), {
            role_id: roleId,
            permission: permissionName,
            enabled: !currentStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional toast
            }
        });
    };

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

                                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                                    <div>
                                        <h4 className="font-semibold text-gray-700">Mode Maintenance</h4>
                                        <p className="text-xs text-gray-500">Jika aktif, hanya Admin yang bisa mengakses aplikasi.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentVal = localSettings?.general?.find(s => s.key === 'maintenance_mode')?.value === '1';
                                            updateLocalSetting('general', 'maintenance_mode', currentVal ? '0' : '1');
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${localSettings?.general?.find(s => s.key === 'maintenance_mode')?.value === '1' ? 'bg-red-500' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localSettings?.general?.find(s => s.key === 'maintenance_mode')?.value === '1' ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>

                                {/* Maintenance Details - Show always or conditional */}
                                {localSettings?.general?.find(s => s.key === 'maintenance_mode')?.value === '1' && (
                                    <div className="space-y-4 p-4 border rounded-xl bg-red-50 animate-in fade-in slide-in-from-top-1">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan Maintenance</label>
                                            <textarea
                                                rows="3"
                                                className="w-full rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                                value={localSettings?.general?.find(s => s.key === 'maintenance_message')?.value || ''}
                                                onChange={e => updateLocalSetting('general', 'maintenance_message', e.target.value)}
                                                placeholder="Contoh: Sistem sedang dalam perbaikan..."
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi Selesai (Countdown)</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                                value={localSettings?.general?.find(s => s.key === 'maintenance_end_time')?.value || ''}
                                                onChange={e => updateLocalSetting('general', 'maintenance_end_time', e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Countdown akan muncul di halaman maintenance berdasarkan waktu ini.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: TAMPILAN */}
                        {activeTab === 'tampilan' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Tampilan Aplikasi</h3>
                                <p className="text-sm text-gray-500">Pengaturan tema (Dark/Light) saat ini dikelola per-user melalui toggle di Navbar.</p>
                                {/* Future: Global default theme */}
                            </div>
                        )}

                        {/* TAB: SURAT */}
                        {activeTab === 'surat' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Pengaturan Persuratan</h3>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Footer Default (Surat Keluar)</label>
                                    <p className="text-xs text-gray-500 mb-2">Teks ini akan muncul otomatis saat membuat surat keluar baru.</p>
                                    <textarea
                                        rows="4"
                                        className="w-full rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                                        value={localSettings?.surat?.find(s => s.key === 'footer_text_surat')?.value || ''}
                                        onChange={e => updateLocalSetting('surat', 'footer_text_surat', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* TAB: HAK AKSES */}
                        {activeTab === 'akses' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Manajemen Hak Akses (Role & Permission)</h3>

                                {/* Permission Grouping Helper */}
                                {(() => {
                                    // Helper function to group permissions
                                    // Helper function to group permissions
                                    const groupedPermissions = {
                                        'Dashboard': permissions.filter(p => p.name.includes('dashboard')),
                                        'Manajemen Sekolah': permissions.filter(p => p.name.includes('sekolah')),
                                        'Manajemen Kelas': permissions.filter(p => p.name.includes('kelas')),
                                        'Manajemen Siswa': permissions.filter(p => p.name.includes('siswa')),
                                        'Manajemen GTK': permissions.filter(p => p.name.includes('gtk')),
                                        'Kurikulum & Kalender': permissions.filter(p => p.name.includes('kurikulum')),
                                        'Persuratan': permissions.filter(p => p.name.includes('surat')),
                                        'PPDB': permissions.filter(p => p.name.includes('ppdb')),
                                        'Pengaturan Sistem': permissions.filter(p => p.name.includes('settings')),
                                        'Lainnya': permissions.filter(p =>
                                            !p.name.includes('dashboard') &&
                                            !p.name.includes('sekolah') &&
                                            !p.name.includes('kelas') &&
                                            !p.name.includes('siswa') &&
                                            !p.name.includes('gtk') &&
                                            !p.name.includes('kurikulum') &&
                                            !p.name.includes('surat') &&
                                            !p.name.includes('ppdb') &&
                                            !p.name.includes('settings')
                                        )
                                    };

                                    return Object.entries(groupedPermissions).map(([groupName, groupPerms]) => (
                                        groupPerms.length > 0 && (
                                            <div key={groupName} className="mb-6">
                                                <h4 className="font-semibold text-gray-700 mb-3 ml-1">{groupName}</h4>
                                                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-1/3">Permission</th>
                                                                {roles.map(role => (
                                                                    <th key={role.id} className="px-4 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                                                                        {role.name}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50">
                                                            {groupPerms.map(permission => (
                                                                <tr key={permission.id} className="hover:bg-gray-50/50">
                                                                    <td className="px-4 py-3 font-medium text-gray-700">
                                                                        {permission.name}
                                                                    </td>
                                                                    {roles.map(role => {
                                                                        const hasPermission = role.permissions.some(p => p.name === permission.name);
                                                                        return (
                                                                            <td key={`${role.id}-${permission.id}`} className="px-4 py-3 text-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={hasPermission}
                                                                                    onChange={() => handlePermissionToggle(role.id, permission.name, hasPermission)}
                                                                                    className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 cursor-pointer"
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
                                    ));
                                })()}
                                <p className="text-xs text-gray-500 mt-2">*Perubahan akan disimpan otomatis saat kotak dicentang.</p>
                            </div>
                        )}

                        {/* TAB: SISTEM */}
                        {activeTab === 'sistem' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">Pembaruan & Perawatan</h3>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                            <RefreshCw size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">Update Aplikasi</h4>
                                            <p className="text-sm text-gray-600 mb-3">Periksa dan unduh pembaruan terbaru dari repositori pusat.</p>
                                            <button
                                                type="button"
                                                onClick={handleAppUpdate}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                Cek Pembaruan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'sistem' && activeTab !== 'akses' && (
                            <div className="mt-8 pt-4 border-t flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Simpan Perubahan
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
