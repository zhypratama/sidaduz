import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home, Calendar, Mail, Users, UserCheck,
    ChevronDown, School, BookOpen,
    ClipboardList, UserCog, Settings, GraduationCap
} from 'lucide-react';

export default function Sidebar({ isOpen, className = '' }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // Helper to check permission
    const hasPermission = (permissionName) => {
        return auth.user?.permissions?.includes(permissionName) || auth.user?.roles?.includes('Admin Sekolah');
    };

    // Structure of the sidebar menus
    const menus = [
        {
            title: 'Dashboard',
            icon: Home,
            route: 'dashboard',
            active: url.startsWith('/dashboard')
        },
        {
            title: 'Profil Sekolah',
            icon: School,
            route: 'profil-sekolah.index',
            active: url.startsWith('/profil-sekolah'),
            hidden: !hasPermission('view.sekolah')
        },
        {
            title: 'Tahun Ajaran',
            icon: Calendar,
            route: 'tahun-ajaran.index',
            active: url.startsWith('/tahun-ajaran'),
            hidden: !hasPermission('view.sekolah')
        },
        {
            title: 'Manajemen Kelas',
            icon: GraduationCap,
            route: 'kelas.index',
            active: url.startsWith('/kelas'),
            hidden: !hasPermission('view.kelas')
        },
        {
            title: 'Pengelolaan Surat',
            icon: Mail,
            active: url.startsWith('/surat') && !url.startsWith('/surat/approval'),
            hidden: !hasPermission('view.surat'),
            submenus: [
                { title: 'Surat Masuk', route: 'surat-masuk.index' },
                { title: 'Surat Keluar', route: 'surat-keluar.index' },
                { title: 'Template Surat', route: 'surat-template.index' },
                { title: 'Arsip Surat', route: 'surat-arsip.index' },
                { title: 'Pengaturan Surat', route: 'surat-pengaturan.index' },
            ]
        },
        {
            title: 'Persetujuan Surat',
            icon: UserCheck,
            route: 'surat-approval.index',
            active: url.startsWith('/surat/approval'),
            hidden: !hasPermission('surat.approve')
        },
        {
            title: 'Manajemen GTK',
            icon: UserCog,
            active: url.startsWith('/gtk'),
            hidden: !hasPermission('view.gtk'),
            submenus: [
                { title: 'Data GTK', route: 'gtk.index' },
                { title: 'Akun GTK', route: 'gtk.akun.index' },
                { title: 'Role User', route: 'gtk.role.index' },
            ]
        },
        {
            title: 'Manajemen Siswa',
            icon: Users,
            active: url.startsWith('/siswa'),
            hidden: !hasPermission('view.siswa'),
            submenus: [
                { title: 'Data Siswa', route: 'siswa.index' },
                { title: 'Akun Siswa', route: 'siswa.akun.index' },
                { title: 'Kehadiran', route: '#' },
                { title: 'Mutasi & Alumni', route: '#' },
            ]
        },
        {
            title: 'Kurikulum',
            icon: BookOpen,
            active: url.startsWith('/kurikulum') || url.startsWith('/gtk/piket'),
            hidden: !hasPermission('view.kurikulum'),
            submenus: [
                { title: 'Jadwal Piket', route: 'gtk.piket.index' },
                { title: 'Kalender Akademik', route: 'kurikulum.kalender.index' },
                { title: 'Jadwal Pelajaran', route: '#' },
                { title: 'Modul Ajar', route: '#' },
            ]
        },
        {
            title: 'PPDB',
            icon: ClipboardList,
            active: url.startsWith('/ppdb'),
            hidden: !hasPermission('view.ppdb'),
            submenus: [
                { title: 'Informasi PPDB', route: '#' },
                { title: 'Calon Siswa', route: '#' },
                { title: 'Seleksi', route: '#' },
            ]
        },
        {
            title: 'Pengaturan',
            icon: Settings,
            route: 'settings.index',
            active: url.startsWith('/settings'),
            hidden: !hasPermission('view.settings')
        },
    ];

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-xl dark:shadow-gray-900/50 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'w-64' : 'w-20'} ${className}`}>
            <div className="flex items-center justify-center h-20 border-b border-gray-100 dark:border-gray-800">
                {isOpen ? (
                    <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transform transition-all hover:scale-105 cursor-default">
                        SIDADU
                    </h1>
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                        <School className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>

            <div className="overflow-y-auto h-[calc(100vh-5rem)] p-4 space-y-2 custom-scrollbar">
                {menus.filter(menu => !menu.hidden).map((menu, index) => (
                    <div key={index}>
                        {menu.submenus ? (
                            // Menu with Submenu
                            <div className={`overflow-hidden rounded-2xl transition-all duration-300 ${openSubmenu === index && isOpen ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                                <button
                                    onClick={() => isOpen && toggleSubmenu(index)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group relative ${menu.active
                                        ? 'text-primary dark:text-primary font-bold'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary'
                                        }`}
                                >
                                    {menu.active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>}

                                    <div className="flex items-center gap-3 z-10">
                                        <div className={`p-2 rounded-xl transition-all duration-300 ${menu.active
                                            ? 'bg-primary/10 text-primary dark:bg-primary/20 shadow-sm'
                                            : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 shadow-sm group-hover:scale-110 group-hover:text-primary'
                                            }`}>
                                            <menu.icon size={20} />
                                        </div>
                                        {isOpen && <span className="text-sm tracking-wide">{menu.title}</span>}
                                    </div>
                                    {isOpen && (
                                        <ChevronDown size={16} className={`transition-transform duration-300 text-gray-400 ${openSubmenu === index ? 'rotate-180 text-primary' : ''}`} />
                                    )}
                                </button>

                                {/* Submenu Items */}
                                <div className={`transition-all duration-300 ease-in-out border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-6 pl-2 mr-2 ${openSubmenu === index && isOpen ? 'max-h-96 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                                    {menu.submenus.map((sub, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={sub.route && sub.route !== '#' ? route(sub.route) : '#'}
                                            className={`block px-3 py-2 text-sm rounded-xl transition-all duration-200 relative overflow-hidden ${route().current(sub.route)
                                                ? 'text-primary font-semibold bg-white dark:bg-gray-800 shadow-sm translate-x-1'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm hover:translate-x-1'
                                                }`}
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Single Menu Item
                            <Link
                                href={menu.route && menu.route !== '#' ? route(menu.route) : '#'}
                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group relative ${menu.active
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 transform scale-[1.02]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl transition-all duration-300 ${menu.active
                                    ? 'bg-white/20 text-white rotate-3'
                                    : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 shadow-sm group-hover:scale-110 group-hover:text-primary group-hover:rotate-3'
                                    }`}>
                                    <menu.icon size={20} />
                                </div>
                                {isOpen && <span className={`text-sm tracking-wide ${menu.active ? 'font-bold' : 'font-medium'}`}>{menu.title}</span>}
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Dark Mode Decorator */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
        </aside>
    );
}
