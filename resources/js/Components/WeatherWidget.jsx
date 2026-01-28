import React, { useState, useEffect } from 'react';
import { Wind, Sun, CloudRain, CloudLightning, CloudSnow, Loader2, WifiOff } from 'lucide-react';

export default function WeatherWidget({ cityName = 'Jakarta', isOnline = false }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Weather Code Interpretation (WMO Code)
    const getWeatherIcon = (code) => {
        if (code === 0 || code === 1) return <Sun size={18} className="text-orange-500 animate-pulse-slow" />; // Clear/Mainly Clear
        if (code === 2 || code === 3) return <Wind size={18} className="text-gray-400" />; // Partly Cloudy/Overcast
        if (code >= 45 && code <= 48) return <Wind size={18} className="text-blue-300" />; // Fog
        if (code >= 51 && code <= 67) return <CloudRain size={18} className="text-blue-500" />; // Drizzle/Rain
        if (code >= 71 && code <= 77) return <CloudSnow size={18} className="text-cyan-300" />; // Snow
        if (code >= 80 && code <= 82) return <CloudRain size={18} className="text-blue-600" />; // Rain Showers
        if (code >= 95) return <CloudLightning size={18} className="text-yellow-500" />; // Thunderstorm
        return <Wind size={18} className="text-gray-400" />;
    };

    const fetchWeather = async () => {
        if (!isOnline || !cityName) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=id&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('Kota tidak ditemukan');
            }

            const { latitude, longitude, name } = geoData.results[0];

            // 2. Weather Data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
            const weatherData = await weatherRes.json();

            setWeather({
                temp: Math.round(weatherData.current.temperature_2m),
                code: weatherData.current.weather_code,
                name: name
            });

        } catch (err) {
            console.error("Weather Error:", err);
            setError('Gagal memuat cuaca');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOnline) {
            fetchWeather();
            // Refresh every 30 mins
            const interval = setInterval(fetchWeather, 30 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [cityName, isOnline]);

    if (!isOnline) {
        return (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs border border-gray-200" title="Mode Offline Aktif">
                <WifiOff size={14} />
                <span className="font-medium">Offline Mode</span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 animate-pulse">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span className="text-xs text-gray-400">Loading...</span>
            </div>
        );
    }

    if (error || !weather) return null;

    return (
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 hover:shadow-sm transition-all cursor-default" title={`Cuaca di ${weather.name}`}>
            <div className="flex items-center gap-1.5">
                {getWeatherIcon(weather.code)}
                <span className="text-sm font-bold text-gray-700">{weather.temp}°C</span>
            </div>
            <div className="h-3 w-[1px] bg-gray-300"></div>
            <span className="text-xs font-medium text-gray-500 truncate max-w-[100px]">{weather.name}</span>
        </div>
    );
}
