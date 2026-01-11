import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, XCircle, FileText, Clock, ShieldCheck, Search, Eye } from 'lucide-react';
import { useState } from 'react';

export default function ApprovalIndex({ auth, pending, history }) {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Persetujuan Surat</h2>
                        <p className="text-gray-500 text-sm">Review dan Tanda Tangani surat keluar</p>
                    </div>
                </div>
            }
        >
            <Head title="Persetujuan Surat" />

            <div className="flex flex-col gap-6">

                {/* Stats / Queue Banner */}
                <div className="bg-white p-6 rounded-[30px] shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <Clock size={32} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800">{pending.length}</h3>
                        <p className="text-gray-500 font-medium">Surat Menunggu Tanda Tangan</p>
                    </div>
                </div>

                <div className="bg-white rounded-[30px] shadow-sm min-h-[500px] overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 px-6">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${activeTab === 'pending'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Menunggu Persetujuan ({pending.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${activeTab === 'history'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Riwayat Persetujuan
                        </button>
                    </div>

                    <div className="p-6">
                        {/* PENDING TAB */}
                        {activeTab === 'pending' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left bg-gray-50/50 rounded-xl">
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-l-xl">Info Surat</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pembuat</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-r-xl">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {pending.length > 0 ? pending.map(surat => (
                                            <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md w-fit mb-1">{surat.no_surat}</div>
                                                        <div className="font-bold text-gray-800 text-sm">{surat.perihal}</div>
                                                        <div className="text-xs text-gray-500">Tujuan: {surat.tujuan}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    Staf TU
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {surat.tanggal_surat}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={route('surat-keluar.pdf', surat.id)}
                                                            target="_blank"
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-bold"
                                                        >
                                                            <Eye size={16} /> Preview
                                                        </a>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Setujui surat ini? Token TTE akan dibuat dan surat dinyatakan sah.')) {
                                                                    router.post(route('surat-keluar.approve', surat.id));
                                                                }
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 text-xs font-bold"
                                                        >
                                                            <CheckCircle size={16} /> Setujui
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-12 text-gray-400">
                                                    <ShieldCheck size={48} className="mx-auto mb-3 opacity-20" />
                                                    Semua surat telah diperiksa.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* HISTORY TAB */}
                        {activeTab === 'history' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left bg-gray-50/50 rounded-xl">
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-l-xl">Info Surat</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Token TTE</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-r-xl">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {history.data.length > 0 ? history.data.map(surat => (
                                            <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-bold text-gray-800 text-sm">{surat.perihal}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-1">{surat.no_surat}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${surat.status === 'approved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {surat.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {surat.token ? (
                                                        <div className="flex items-center gap-2">
                                                            <code className="bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs font-mono text-gray-600 select-all">
                                                                {surat.token}
                                                            </code>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <a
                                                        href={route('surat-keluar.pdf', surat.id)}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                                                    >
                                                        <FileText size={18} />
                                                    </a>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-8 text-gray-400">
                                                    Belum ada riwayat.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
