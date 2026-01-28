import { forwardRef } from 'react';
import { Users, GraduationCap, Building2, UserCheck, FileText, Mail, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

const icons = {
    users: Users,
    grad: GraduationCap,
    building: Building2,
    check: UserCheck,
    file: FileText,
    mail: Mail
};

const StatCard = forwardRef(({
    style,
    className,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    title,
    value,
    iconName,
    color = 'blue',
    link
}, ref) => {

    const Icon = icons[iconName] || Users;

    // Color mapping
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
        violet: 'from-violet-500 to-violet-600 shadow-violet-500/30',
        amber: 'from-amber-500 to-amber-600 shadow-amber-500/30',
        rose: 'from-rose-500 to-rose-600 shadow-rose-500/30',
        indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/30',
    };

    // Handler untuk drag handle (pastikan hanya area tertentu yang bisa buat drag jika mau)
    // Tapi di sini kita pass ke div utama agar seluruh kartu bisa ditarik

    return (
        <div
            ref={ref}
            style={style}
            className={`${className} bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group overflow-hidden relative`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
        >
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white transform group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                        <Icon size={24} />
                    </div>
                    {link && (
                        <Link href={link} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <ArrowRight size={18} />
                        </Link>
                    )}
                </div>

                <div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
                </div>
            </div>
        </div>
    );
});

export default StatCard;
