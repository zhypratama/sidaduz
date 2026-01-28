import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home, Calendar, Mail, Users, UserCheck,
    ChevronDown, School, BookOpen,
    ClipboardList, UserCog, Settings, GraduationCap,
    ScanLine, StickyNote, QrCode, ClipboardCheck, Sparkles, FileText,
    Building2, CalendarDays, LayoutTemplate, Send, Archive, Cog,
    Shield, Contact, Clock, UserMinus, LayoutDashboard, AlertTriangle,
    MessageSquare, Trophy, FileBarChart, ListChecks, Scan, Users2,
    Monitor, Globe, BookMarked, GitMerge, GraduationCap as Grad, Box
} from 'lucide-react';

export default function Sidebar({ isOpen, className = '' }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // Helper to check permission
    const hasPermission = (permissionName) => {
        return auth.user?.permissions?.includes(permissionName) || auth.user?.roles?.includes('Admin Sekolah') || auth.user?.roles?.includes('Super Admin');
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
            title: 'Manajemen Sekolah',
            icon: School,
            active: url.startsWith('/profil-sekolah') || url.startsWith('/tahun-ajaran') || url.startsWith('/kelas'),
            hidden: !hasPermission('view.sekolah') && !hasPermission('view.kelas'),
            submenus: [
                { title: 'Profil Sekolah', icon: Building2, route: 'profil-sekolah.index', hidden: !hasPermission('view.sekolah') },
                { title: 'Tahun Ajaran', icon: CalendarDays, route: 'tahun-ajaran.index', hidden: !hasPermission('view.sekolah') },
                { title: 'Manajemen Kelas', icon: LayoutTemplate, route: 'kelas.index', hidden: !hasPermission('view.kelas') },
            ]
        },
        {
            title: 'Pengelolaan Surat',
            icon: Mail,
            active: url.startsWith('/surat') && !url.startsWith('/surat/approval'),
            hidden: !hasPermission('view.surat'),
            submenus: [
                { title: 'Surat Masuk', icon: StickyNote, route: 'surat-masuk.index' },
                { title: 'Surat Keluar', icon: Send, route: 'surat-keluar.index' },
                { title: 'Template Surat', icon: LayoutTemplate, route: 'surat-template.index' },
                { title: 'Disposisi Surat', icon: MessageSquare, route: 'surat-disposisi.index' },
                { title: 'Arsip Surat', icon: Archive, route: 'surat-arsip.index' },
                { title: 'Pengaturan Surat', icon: Cog, route: 'surat-pengaturan.index' },
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
            title: 'Formulir Online',
            icon: FileText,
            route: 'forms.index',
            active: url.startsWith('/forms'),
            hidden: !auth.user?.roles?.includes('Admin Sekolah') && !auth.user?.roles?.includes('Super Admin'),
        },
        {
            title: 'Sarana Prasarana',
            icon: Box,
            route: 'inventory.index',
            active: url.startsWith('/inventory'),
            hidden: !hasPermission('view.sekolah') && !auth.user?.roles?.includes('Admin Sekolah'),
        },
        {
            title: 'Manajemen GTK',
            icon: UserCog,
            active: url.startsWith('/gtk') && !url.startsWith('/gtk/piket'),
            hidden: !hasPermission('view.gtk'),
            submenus: [
                { title: 'Data GTK', icon: Users, route: 'gtk.index' },
                { title: 'Akun GTK', icon: UserCheck, route: 'gtk.akun.index' },
                { title: 'Role User', icon: Shield, route: 'gtk.role.index' },
            ]
        },
        {
            title: 'Manajemen Siswa',
            icon: Users,
            active: url.startsWith('/siswa'),
            hidden: !hasPermission('view.siswa'),
            submenus: [
                { title: 'Data Siswa', icon: Grad, route: 'siswa.index' },
                { title: 'Akun Siswa', icon: UserCheck, route: 'siswa.akun.index' },
                { title: 'Kartu Siswa', icon: Contact, route: 'siswa.kartu.index' },
                { title: 'Kehadiran Siswa', icon: Clock, route: 'absensi.index' },
                { title: 'Mutasi & Alumni', icon: UserMinus, route: 'mutasi.index' },
            ]
        },
        {
            title: 'Bimbingan Konseling',
            icon: HeartHandshakeIcon, // Using custom placeholder as it's common
            active: url.startsWith('/bk'),
            hidden: !hasPermission('view.bk') && !auth.user?.roles?.includes('Guru BK') && !auth.user?.roles?.includes('Admin Sekolah'),
            submenus: [
                { title: 'Dashboard BK', icon: LayoutDashboard, route: 'bk.dashboard' },
                { title: 'Pelanggaran Siswa', icon: AlertTriangle, route: 'bk.pelanggaran.index' },
                { title: 'Jurnal Konseling', icon: MessageSquare, route: 'bk.konseling.index' },
                { title: 'Prestasi Siswa', icon: Trophy, route: 'bk.prestasi.index' },
                { title: 'Laporan BK', icon: FileBarChart, route: 'bk.laporan.index' },
                { title: 'Aturan & Poin', icon: ListChecks, route: 'bk.aturan.index' },
            ]
        },
        {
            title: 'Piket',
            icon: ClipboardCheck,
            active: url.startsWith('/gtk/piket'),
            hidden: !hasPermission('view.gtk'),
            submenus: [
                { title: 'Absensi Siswa', icon: Scan, route: 'gtk.piket.absensi' },
                { title: 'Berita & Tamu', icon: Users2, route: 'gtk.piket.berita-tamu' },
                { title: 'Pengaturan Piket', icon: Cog, route: 'gtk.piket.settings', hidden: !auth.user?.roles?.includes('Admin Sekolah') },
            ]
        },
        {
            title: 'Kurikulum',
            icon: BookOpen,
            active: url.startsWith('/kurikulum'),
            hidden: !hasPermission('view.kurikulum'),
            submenus: [
                { title: 'Jadwal Piket', icon: Calendar, route: 'gtk.piket.index' },
                { title: 'Jadwal Pelajaran', icon: BookOpen, route: 'kurikulum.jadwal.index' },
                { title: 'Jurnal Guru', icon: BookOpen, route: 'kurikulum.jurnal.index' }, // Added
                { title: 'Distribusi Guru Mapel', icon: GitMerge, route: 'kurikulum.pembelajaran.index' },
                { title: 'Kalender Akademik', icon: CalendarDays, route: 'kurikulum.kalender.index' },
                { title: 'Mata Pelajaran', icon: BookMarked, route: 'kurikulum.mata-pelajaran.index' },
                { title: 'Modul Ajar', icon: FileText, route: 'modul-ajar.index' },
            ]
        },
        {
            title: 'Broadcast Center',
            icon: Send,
            route: 'broadcast.index',
            active: url.startsWith('/broadcast')
        },
        {
            title: '💰 Donasi',
            icon: Heart,
            route: 'donation',
            active: url.startsWith('/donasi')
        },
        {
            title: 'Sistem & Pengaturan',
            icon: Settings,
            active: url.startsWith('/settings'),
            hidden: !hasPermission('view.settings'),
            submenus: [
                { title: 'Aplikasi', icon: Monitor, route: 'settings.index' },
                { title: 'Website Sekolah', icon: Globe, route: 'settings.public-page.index' },
                { title: 'Keamanan Sistem', icon: Shield, route: 'security.dashboard' },
                { title: 'WhatsApp Gateway', icon: MessageSquare, route: 'settings.whatsapp.index' },
            ]
        },
    ];

    // Placeholder for missed icon
    function HeartHandshakeIcon(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.96 0l3.07-3.07" />
                <path d="m12 13 2 2" />
                <path d="m12 18 2-2" />
            </svg>
        );
    }

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const scrollRef = React.useRef(null);
    const scrollInterval = React.useRef(null);

    const handleMouseMove = (e) => {
        if (!isOpen || !scrollRef.current) return;

        const container = scrollRef.current;
        const { top, bottom } = container.getBoundingClientRect();
        const clientY = e.clientY;
        const threshold = 100; // Activation area height (px)
        const maxSpeed = 15; // Max scroll speed

        // Clear existing interval to update speed/direction dynamically
        if (scrollInterval.current) clearInterval(scrollInterval.current);

        // Scroll Down
        if (clientY > bottom - threshold) {
            const intensity = (clientY - (bottom - threshold)) / threshold; // 0 to 1
            const speed = Math.max(2, intensity * maxSpeed);

            scrollInterval.current = setInterval(() => {
                container.scrollTop += speed;
            }, 16);
        }
        // Scroll Up
        else if (clientY < top + threshold) {
            const intensity = ((top + threshold) - clientY) / threshold; // 0 to 1
            const speed = Math.max(2, intensity * maxSpeed);

            scrollInterval.current = setInterval(() => {
                container.scrollTop -= speed;
            }, 16);
        }
    };

    const handleMouseLeave = () => {
        setOpenSubmenu(null);
        if (scrollInterval.current) clearInterval(scrollInterval.current);
    }

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/50 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-64' : 'w-20'} ${className}`}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            {/* Premium Header with Animated Gradient */}
            <div className="flex items-center justify-center h-20 border-b border-gray-100/80 dark:border-gray-800/80 relative overflow-hidden flex-shrink-0">
                {/* Subtle animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-50"></div>

                {isOpen ? (
                    <div className="relative z-10 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-lg shadow-primary/30 animate-pulse-glow">
                            <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            SIDADU
                        </h1>
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-lg shadow-primary/30 hover:scale-110 transition-transform duration-300">
                        <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div
                ref={scrollRef}
                className="overflow-y-auto h-[calc(100vh-5rem)] p-4 pb-20 space-y-1.5 custom-scrollbar scroll-smooth"
            >
                {menus.filter(menu => !menu.hidden).map((menu, index) => (
                    <div
                        key={index}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onMouseEnter={() => isOpen && setOpenSubmenu(menu.submenus ? index : null)}
                    >
                        {menu.submenus ? (
                            // Menu with Submenu
                            <div className={`overflow-hidden rounded-2xl transition-all duration-300 ${openSubmenu === index && isOpen ? 'bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30' : ''}`}>
                                <button
                                    onClick={() => isOpen && toggleSubmenu(index)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ease-out group relative ${menu.active
                                        ? 'text-primary dark:text-primary font-bold'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-primary dark:hover:text-primary'
                                        }`}
                                >
                                    {menu.active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full shadow-lg shadow-primary/50"></div>}

                                    <div className="flex items-center gap-3 z-10">
                                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${menu.active
                                            ? 'bg-gradient-to-br from-primary/20 to-secondary/10 text-primary shadow-lg shadow-primary/20'
                                            : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:text-primary group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-secondary/5 group-hover:rotate-3'
                                            }`}>
                                            <menu.icon size={20} strokeWidth={menu.active ? 2.5 : 2} />
                                        </div>
                                        {isOpen && <span className="text-sm tracking-wide">{menu.title}</span>}
                                    </div>
                                    {isOpen && (
                                        <ChevronDown size={16} className={`transition-transform duration-300 text-gray-400 ${openSubmenu === index ? 'rotate-180 text-primary' : ''}`} />
                                    )}
                                </button>

                                {/* Submenu Items */}
                                <div className={`transition-all duration-300 ease-in-out border-l-2 border-dashed border-primary/30 dark:border-primary/20 ml-7 pl-3 mr-2 ${openSubmenu === index && isOpen ? 'max-h-[500px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                                    {menu.submenus.filter(sub => !sub.hidden).map((sub, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={sub.route && sub.route !== '#' ? route(sub.route) : '#'}
                                            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 relative overflow-hidden ${route().current(sub.route)
                                                ? 'text-primary font-semibold bg-white dark:bg-gray-800 shadow-md shadow-primary/10 translate-x-1'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:translate-x-1'
                                                }`}
                                        >
                                            {sub.icon && <sub.icon size={16} className={route().current(sub.route) ? 'text-primary' : 'text-gray-400'} />}
                                            <span className="truncate">{sub.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Single Menu Item - Premium Active State
                            <Link
                                href={menu.route && menu.route !== '#' ? route(menu.route) : '#'}
                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ease-out group relative overflow-hidden ${menu.active
                                    ? 'bg-gradient-to-r from-primary via-primary/90 to-secondary text-white shadow-xl shadow-primary/40'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-primary'
                                    }`}
                            >
                                {/* Active Shimmer Effect */}
                                {menu.active && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                )}

                                <div className={`p-2.5 rounded-xl transition-all duration-300 relative z-10 ${menu.active
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:text-primary group-hover:rotate-3'
                                    }`}>
                                    <menu.icon size={20} strokeWidth={menu.active ? 2.5 : 2} />
                                </div>
                                {isOpen && <span className={`text-sm tracking-wide relative z-10 ${menu.active ? 'font-bold' : 'font-medium'}`}>{menu.title}</span>}
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Fade Gradient - REDUCED HEIGHT AND OPACITY */}
            <div className={`absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-gray-900 pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        </aside>
    );
}
