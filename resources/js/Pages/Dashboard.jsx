import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import StatCard from '@/Components/DashboardWidgets/StatCard';
import ChartWidget from '@/Components/DashboardWidgets/ChartWidget';
import SecurityWidget from '@/Components/DashboardWidgets/SecurityWidget';
import WeatherWidget from '@/Components/DashboardWidgets/WeatherWidget';
import { DraggableGrid } from '@/Components/Dashboard/DraggableGrid';
import { SortableItem } from '@/Components/Dashboard/SortableItem';
import {
    LayoutDashboard,
    Calendar,
    Users,
    GraduationCap,
    Building2,
    ShieldCheck,
    Sparkles,
    Settings2,
    Save,
    X,
    RotateCcw
} from 'lucide-react';

import Swal from 'sweetalert2';
const DEFAULT_LAYOUT = [
    'stat-siswa', 'stat-gtk', 'stat-kelas', 'stat-alumni',
    'chart-gender-siswa', 'chart-status-siswa', 'chart-gender-guru',
    'widget-weather', 'widget-security'
];

export default function Dashboard({
    auth,
    schoolProfile = {},
    stats = {},
    activeYear,
    securityStats = null,
    recentThreats = [],
    weather = null, // Receive weather prop
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem('dashboard_layout');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Simple validation: ensure it's an array and has items
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Check if we are missing any new widgets from default
                    const missing = DEFAULT_LAYOUT.filter(id => !parsed.includes(id));
                    if (missing.length > 0) {
                        return [...parsed, ...missing];
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Layout load error", e);
        }
        return DEFAULT_LAYOUT;
    });

    const isAdmin = !!securityStats;
    const weatherData = weather; // Use the direct prop

    // Prepare Chart Data
    const studentGenderData = [
        { name: 'Laki-laki', value: stats.chart_data?.siswa?.L || 0, color: '#3b82f6' },
        { name: 'Perempuan', value: stats.chart_data?.siswa?.P || 0, color: '#ec4899' },
    ];

    const teacherGenderData = [
        { name: 'Laki-laki', value: stats.chart_data?.guru?.L || 0, color: '#8b5cf6' },
        { name: 'Perempuan', value: stats.chart_data?.guru?.P || 0, color: '#f43f5e' },
    ];

    const studentStatusData = [
        { name: 'Aktif', value: stats.siswa_status?.aktif || 0, color: '#10b981' },
        { name: 'Mutasi', value: stats.siswa_status?.mutasi || 0, color: '#f59e0b' },
        { name: 'Lulus', value: stats.siswa_status?.lulus || 0, color: '#3b82f6' },
        { name: 'Keluar', value: stats.siswa_status?.keluar || 0, color: '#ef4444' },
    ];

    const handleSaveLayout = () => {
        try {
            localStorage.setItem('dashboard_layout', JSON.stringify(items));
            setIsEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Tersimpan!',
                text: 'Susunan dashboard berhasil disimpan.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal menyimpan susunan dashboard.',
            });
        }
    };

    const handleResetLayout = () => {
        Swal.fire({
            title: 'Reset Layout?',
            text: "Susunan dashboard akan kembali ke pengaturan awal.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Reset!'
        }).then((result) => {
            if (result.isConfirmed) {
                setItems(DEFAULT_LAYOUT);
                localStorage.removeItem('dashboard_layout');
                setIsEditing(false);
                Swal.fire(
                    'Direset!',
                    'Layout dashboard telah dikembalikan.',
                    'success'
                )
            }
        })
    };

    if (!auth || !auth.user) {
        return <div className="p-10 text-center text-red-500">Error: Auth Missing</div>;
    }

    const renderWidget = (id) => {
        switch (id) {
            case 'stat-siswa':
                return <StatCard title="Total Siswa" value={stats.total_siswa ?? 0} iconName="users" color="blue" />;
            case 'stat-gtk':
                return <StatCard title="Total GTK" value={stats.total_guru ?? 0} iconName="grad" color="emerald" />;
            case 'stat-kelas':
                return <StatCard title="Total Kelas" value={stats.total_kelas ?? 0} iconName="building" color="violet" />;
            case 'stat-alumni':
                return <StatCard title="Total Alumni" value={stats.total_alumni ?? 0} iconName="check" color="amber" />;
            case 'chart-gender-siswa':
                return <ChartWidget title="Siswa per Gender" data={studentGenderData} colors={['#3b82f6', '#ec4899']} type="pie" />;
            case 'chart-status-siswa':
                return <ChartWidget title="Status Siswa" data={studentStatusData} colors={['#10b981', '#f59e0b', '#3b82f6', '#ef4444']} type="bar" />;
            case 'chart-gender-guru':
                return <ChartWidget title="Guru per Gender" data={teacherGenderData} colors={['#8b5cf6', '#f43f5e']} type="pie" />;
            case 'widget-weather':
                return <WeatherWidget data={weatherData} />;
            case 'widget-security':
                return (
                    <SecurityWidget
                        securityStats={securityStats || { secure_score: 95, threat_count: 0 }}
                        recentThreats={recentThreats || []}
                    />
                );
            default:
                return null;
        }
    };

    const getColSpan = (id) => {
        if (id.startsWith('stat-')) return 'col-span-12 sm:col-span-6 lg:col-span-3';
        if (id.startsWith('chart-')) return 'col-span-12 md:col-span-6 lg:col-span-4';
        if (id === 'widget-weather') return 'col-span-12 lg:col-span-4';
        if (id === 'widget-security') return 'col-span-12 lg:col-span-8';
        return 'col-span-12';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100 leading-tight">
                                Dashboard Utama
                            </h2>
                            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                                <Calendar size={14} className="text-gray-400" />
                                {activeYear ? `Tahun Ajaran ${activeYear.tahun} (${activeYear.semester})` : 'Tahun Ajaran Tidak Aktif'}
                            </p>
                        </div>
                    </div>


                    <div className="flex items-center gap-2">


                        {isEditing ? (
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <button
                                    onClick={handleResetLayout}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    title="Reset Layout"
                                >
                                    <RotateCcw size={18} />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSaveLayout}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                                >
                                    <Save size={16} />
                                    Simpan
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                            >
                                <Settings2 size={16} />
                                Kustomisasi
                            </button>
                        )}
                        <div className="hidden sm:flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 items-center gap-3 shadow-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </ div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 space-y-6">
                {/* Premium Welcome Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-primary to-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={160} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-black mb-3">Selamat Datang, {auth.user.name}! 👋</h1>
                        <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                            Kelola data pendidikan secara modern, cepat, dan aman dengan SIDADU. <br className="hidden md:block" />
                            Pantau statistik sekolah dan laporan keamanan sistem secara real-time.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
                                <ShieldCheck size={18} />
                                <span className="text-sm font-semibold">Sistem Terlindungi</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
                                <Sparkles size={18} />
                                <span className="text-sm font-semibold">TTE BSrE Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Settings2 size={20} />
                            </div>
                            <div>
                                <p className="font-bold">Mode Kustomisasi Aktif</p>
                                <p className="text-sm opacity-80">Geser (Drag) kartu untuk mengatur posisi dashboard sesuai keinginan Anda.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                <DraggableGrid items={items} setItems={setItems} isEditing={isEditing}>
                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        {items.map((id) => (
                            <SortableItem key={id} id={id} isEditing={isEditing} className={getColSpan(id)}>
                                {renderWidget(id)}
                            </SortableItem>
                        ))}
                    </div>
                </DraggableGrid>
            </div>
        </AuthenticatedLayout>
    );
}

