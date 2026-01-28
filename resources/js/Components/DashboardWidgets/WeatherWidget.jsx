import React from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, MapPin, RefreshCcw } from 'lucide-react';

export default function WeatherWidget({ data }) {
    if (!data) return null;

    const getWeatherIcon = (code, isDay) => {
        // WMO Weather interpretation codes (WW)
        if (code === 0) return <Sun className="text-amber-400" size={48} strokeWidth={1.5} />; // Clear sky
        if (code >= 1 && code <= 3) return <Cloud className="text-gray-400" size={48} strokeWidth={1.5} />; // Cloudy
        if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={48} strokeWidth={1.5} />; // Rain
        if (code >= 95) return <CloudLightning className="text-purple-400" size={48} strokeWidth={1.5} />; // Storm
        return <Cloud className="text-gray-400" size={48} strokeWidth={1.5} />;
    };

    const getConditionName = (code) => {
        if (code === 0) return 'Cerah';
        if (code >= 1 && code <= 3) return 'Berawan';
        if (code >= 51 && code <= 67) return 'Hujan';
        if (code >= 95) return 'Badai';
        return 'Sebagian Berawan';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-between relative overflow-hidden group">
            {/* Background Decorative */}
            <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${data.temp > 30 ? 'bg-amber-500' : 'bg-blue-500'}`}></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                        <MapPin size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">{data.location}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-gray-800 dark:text-gray-100 tracking-tighter">
                            {data.temp}°
                        </span>
                        <span className="text-lg font-bold text-gray-400">C</span>
                    </div>
                </div>
                <div className="animate-float">
                    {getWeatherIcon(data.condition_code, data.is_day)}
                </div>
            </div>

            <div className="mt-6 space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {getConditionName(data.condition_code)}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <RefreshCcw size={10} />
                        {data.updated_at}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800 transition-transform group-hover:scale-105 duration-300">
                        <Droplets size={16} className="text-blue-500 mb-1" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Humid</span>
                        <span className="text-xs font-black text-gray-700 dark:text-gray-200">{data.humidity}%</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800 transition-transform group-hover:scale-105 duration-300 delay-75">
                        <Wind size={16} className="text-emerald-500 mb-1" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Wind</span>
                        <span className="text-xs font-black text-gray-700 dark:text-gray-200">{data.wind} <span className="text-[8px]">km/h</span></span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800 transition-transform group-hover:scale-105 duration-300 delay-150">
                        <Sun size={16} className="text-amber-500 mb-1" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Feels</span>
                        <span className="text-xs font-black text-gray-700 dark:text-gray-200">{data.feel}°</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
