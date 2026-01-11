import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Quicksand', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#6366f1', // Indigo 500
                secondary: '#ec4899', // Pink 500
                accent: '#8b5cf6', // Violet 500
                success: '#10b981', // Emerald 500
                warning: '#f59e0b', // Amber 500
                danger: '#ef4444', // Red 500
                info: '#3b82f6', // Blue 500
                dark: '#1f2937', // Gray 800
                light: '#f3f4f6', // Gray 100
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
        },
    },

    plugins: [forms],
};
