import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { Menu, Bell, LogOut, User, Sun, Moon, Activity, Zap } from 'lucide-react';
import WeatherWidget from '@/Components/WeatherWidget';
import Dropdown from '@/Components/Dropdown';
import { useTheme } from '@/Contexts/ThemeContext';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
    const { auth, school_profile } = usePage().props;
    const user = auth.user;
    const { theme, toggleTheme } = useTheme();
    const [loadTime, setLoadTime] = useState(0);

    // Weather Logic
    const isOnline = school_profile?.is_online_mode === true || school_profile?.is_online_mode === 1;
    // Bersihkan nama kota dari prefix (Kota Bogot -> Bogor) agar geocoding lebih akurat
    const cityName = school_profile?.kota
        ? school_profile.kota.replace(/^(Kota|Kabupaten)\s+/i, '')
        : 'Jakarta'; // Default fallback

    useEffect(() => {
        if (window.performance) {
            const updateLoadTime = () => {
                const nav = performance.getEntriesByType("navigation")[0];
                if (nav) {
                    setLoadTime(Math.round(nav.loadEventEnd - nav.startTime));
                } else {
                    // Fallback for older browsers or initial load if timing API is slightly different
                    const timing = performance.timing;
                    setLoadTime(timing.loadEventEnd - timing.navigationStart);
                }
            };

            // Check if load is already complete
            if (document.readyState === 'complete') {
                updateLoadTime();
            } else {
                window.addEventListener('load', updateLoadTime);
                return () => window.removeEventListener('load', updateLoadTime);
            }
        }
    }, []);

    if (!user) return null;

    return (
        <nav className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-gray-100/50 dark:border-gray-800/50 h-16 fixed top-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSidebarOpen ? 'left-64' : 'left-20'}`}>
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Premium Hamburger Button */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 text-gray-500 dark:text-gray-400 hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Welcome Message with Gradient */}
                    <div className="hidden md:block">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Selamat Datang, <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{user.name}</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Weather Widget (New) */}
                    <WeatherWidget cityName={cityName} isOnline={isOnline} />

                    {/* Theme Toggle - Premium */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-500" />}
                    </button>

                    {/* Performance Monitor - Premium */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono border border-emerald-100/50 dark:border-emerald-800/30" title="Page Load Time">
                        <Zap size={14} className="animate-pulse" />
                        <span className="font-semibold">{loadTime > 0 ? `${loadTime}ms` : '...'}</span>
                    </div>

                    {/* Smart Reload Button */}
                    <button
                        onClick={() => {
                            if (confirm('Server tidak merespon? Klik OK untuk menjalankan Smart Reload (membersihkan cache dan memuat ulang halaman).')) {
                                router.post(route('settings.cache.clear'), {}, {
                                    onFinish: () => window.location.reload(true),
                                    onError: () => window.location.reload(true),
                                    preserveScroll: true,
                                    preserveState: true,
                                });
                            }
                        }}
                        className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium border border-orange-100/50 dark:border-orange-800/30 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        title="Server tidak merespon? klik disini untuk menjalankan Smart Reload"
                    >
                        <Activity size={14} />
                        <span>Smart Reload</span>
                    </button>

                    {/* Security Notification Bell - Premium */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 text-gray-500 dark:text-gray-400 hover:text-primary relative transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                                <Bell size={20} className={usePage().props.notifications?.security_alert_count > 0 ? "text-red-500 animate-swing" : ""} />
                                {usePage().props.notifications?.security_alert_count > 0 && (
                                    <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-gray-900"></span>
                                    </span>
                                )}
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content width="64">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Security Notifications</p>
                            </div>

                            {usePage().props.notifications?.security_alert_count > 0 ? (
                                <div className="p-2">
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3 mb-2">
                                        <div className="flex items-start gap-3">
                                            <Activity size={18} className="text-red-600 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Critical Threats Detected!</h4>
                                                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                                                    {usePage().props.notifications.security_alert_count} critical alerts in last 24h.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Dropdown.Link href={route('security.dashboard')} className="text-center font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg mx-2 mb-2">
                                        View Security Dashboard
                                    </Dropdown.Link>
                                </div>
                            ) : (
                                <div className="p-4 text-center">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <div className="text-green-600 dark:text-green-400 text-lg">✓</div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">All systems secure</p>
                                    <p className="text-xs text-gray-400 mt-1">No critical threats detected.</p>

                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <Dropdown.Link href={route('security.dashboard')} className="text-center text-xs text-primary">
                                            Open Security Dashboard
                                        </Dropdown.Link>
                                    </div>
                                </div>
                            )}
                        </Dropdown.Content>
                    </Dropdown>

                    {/* Divider */}
                    <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent dark:via-gray-700 mx-1 hidden sm:block"></div>

                    {/* User Dropdown - Premium */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 p-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 group">
                                {/* Premium Avatar with gradient border */}
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                                    <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 flex items-center justify-center">
                                        <User size={18} className="text-primary" />
                                    </div>
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.roles?.[0]?.name || 'User'}</p>
                                </div>
                                <svg
                                    className="ms-1 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
}

