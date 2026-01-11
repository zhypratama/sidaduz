import React from 'react';

export default function FormInput({ label, type = 'text', value, onChange, error, placeholder, required, className = '', disabled, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm transition-all disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1 animate-pulse">{error}</p>}
        </div>
    );
}
