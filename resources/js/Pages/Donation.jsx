import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FiCopy, FiCheck, FiHeart, FiCoffee } from 'react-icons/fi';

export default function Donation({ auth, donationData }) {
    const [copiedField, setCopiedField] = useState(null);

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    💝 Dukung Pengembangan SIDADUZ
                </h2>
            }
        >
            <Head title="Donasi" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <div className="flex items-center justify-center mb-4">
                            <FiHeart className="text-5xl animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-4">
                            Dukung Inovasi Pendidikan Indonesia
                        </h1>
                        <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
                            {donationData.message}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* QRIS Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                                    <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">QRIS</h3>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                <img
                                    src={donationData.qris_image}
                                    alt="QRIS Code"
                                    className="w-full max-w-xs mx-auto"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif">QRIS Placeholder</text></svg>';
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 text-center mt-3">
                                Scan dengan aplikasi e-wallet Anda
                            </p>
                        </div>

                        {/* Bank Transfer Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full mr-3">
                                    <FiCoffee className="text-green-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Transfer Bank</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Bank</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                        <p className="font-semibold text-gray-800">{donationData.bank_name}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Nomor Rekening</label>
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                        <p className="font-mono font-bold text-gray-800 flex-1">{donationData.bank_account}</p>
                                        <button
                                            onClick={() => copyToClipboard(donationData.bank_account, 'account')}
                                            className="ml-2 p-2 hover:bg-gray-200 rounded-md transition-colors"
                                            title="Salin nomor rekening"
                                        >
                                            {copiedField === 'account' ? (
                                                <FiCheck className="text-green-600" />
                                            ) : (
                                                <FiCopy className="text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Atas Nama</label>
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                        <p className="font-semibold text-gray-800 flex-1">{donationData.account_name}</p>
                                        <button
                                            onClick={() => copyToClipboard(donationData.account_name, 'name')}
                                            className="ml-2 p-2 hover:bg-gray-200 rounded-md transition-colors"
                                            title="Salin nama penerima"
                                        >
                                            {copiedField === 'name' ? (
                                                <FiCheck className="text-green-600" />
                                            ) : (
                                                <FiCopy className="text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thank You Note */}
                    <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                        <div className="flex items-start">
                            <FiHeart className="text-yellow-600 text-2xl mr-3 mt-1" />
                            <div>
                                <h4 className="font-bold text-yellow-800 mb-2">Terima Kasih! 🙏</h4>
                                <p className="text-yellow-700 text-sm leading-relaxed">
                                    Setiap kontribusi Anda, sekecil apapun, sangat berarti untuk keberlanjutan pengembangan SIDADUZ.
                                    Aplikasi ini dan seluruh source code akan tetap <strong>100% gratis & open-source</strong> selamanya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
