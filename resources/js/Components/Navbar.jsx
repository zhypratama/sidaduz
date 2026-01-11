import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Menu, Bell, LogOut, User, Sun, Moon } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import { useTheme } from '@/Contexts/ThemeContext';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { theme, toggleTheme } = useTheme();

    if (!user) return null;

    return (
        <nav className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-64' : 'left-20'}`}>
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 hidden md:block">
                        Selamat Datang, <span className="text-primary">{user.name}</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
                    </button>

                    <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white dark:border-gray-900"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                        <User size={16} className="text-primary" />
                                    </div>
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.roles?.[0]?.name || 'User'}</p>
                                </div>
                                <svg
                                    className="ms-2 -me-0.5 h-4 w-4 text-gray-400"
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
