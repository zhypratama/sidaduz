import React from 'react';

export default function ContentBox({ children, title, icon: Icon, color = 'blue' }) {
    const colors = {
        blue: 'bg-blue-50 border-blue-100 text-blue-900',
        green: 'bg-green-50 border-green-100 text-green-900',
        purple: 'bg-purple-50 border-purple-100 text-purple-900',
        orange: 'bg-orange-50 border-orange-100 text-orange-900',
        red: 'bg-red-50 border-red-100 text-red-900',
    };

    const activeColor = colors[color] || colors.blue;

    return (
        <div className={`rounded-[30px] border p-6 ${activeColor.replace('text-', 'border-').replace('bg-', 'bg-white ')} shadow-sm`}>
            {title && (
                <div className={`flex items-center gap-3 mb-4 pb-3 border-b border-dashed ${activeColor.replace('bg-', 'border-').replace('text-', 'border-opacity-30 ')}`}>
                    {Icon && (
                        <div className={`p-2 rounded-xl ${activeColor}`}>
                            <Icon size={20} />
                        </div>
                    )}
                    <h3 className={`font-bold text-lg ${activeColor.split(' ')[2]}`}>{title}</h3>
                </div>
            )}
            <div>{children}</div>
        </div>
    );
}
