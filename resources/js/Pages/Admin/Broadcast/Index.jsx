import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Send, Users, User, School, MessageCircle, AlertCircle, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, kelas_list = [], recent_logs = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        target_type: 'individual',
        target_phone: '',
        target_class_id: '',
        message: '',
    });

    const [logs, setLogs] = useState(recent_logs);

    const submit = (e) => {
        e.preventDefault();

        // Confirmation (SweetAlert)
        Swal.fire({
            title: 'Kirim Pesan Broadcast?',
            text: "Pesan akan dikirim antrian ke WhatsApp Gateway.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Kirim Sekarang!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('broadcast.send'), {
                    onSuccess: () => {
                        Swal.fire('Terkirim!', 'Proses broadcast berjalan di latar belakang.', 'success');
                        reset('message');
                        // Reload logs (Partial reload usually handles this, but here just UI feedback)
                    }
                });
            }
        });
    };

    const targetOptions = [
        { id: 'individual', label: 'Tujuan Khusus', icon: <User size={18} />, desc: 'Kirim ke satu nomor spesifik' },
        { id: 'all_students', label: 'Semua Siswa', icon: <Users size={18} />, desc: 'Broadcast ke seluruh siswa aktif' },
        { id: 'all_teachers', label: 'Semua Guru & Staff', icon: <School size={18} />, desc: 'Info dinas untuk pegawai' },
        { id: 'per_class', label: 'Per Kelas', icon: <Users size={18} />, desc: 'Target siswa di kelas tertentu' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Broadcast Center</h2>
                        <p className="text-gray-500 text-sm">Kirim pengumuman massal via WhatsApp Gateway</p>
                    </div>
                </div>
            }
        >
            <Head title="Broadcast Center" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        {/* Target Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Pilih Penerima</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {targetOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setData('target_type', option.id)}
                                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex items-start gap-3 ${data.target_type === option.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-100 hover:border-green-100 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`mt-0.5 ${data.target_type === option.id ? 'text-green-600' : 'text-gray-400'}`}>
                                            {option.icon}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm ${data.target_type === option.id ? 'text-green-800' : 'text-gray-700'}`}>
                                                {option.label}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-1 leading-snug">{option.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Inputs */}
                        {data.target_type === 'individual' && (
                            <div className="mb-6 animate-fadeIn">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp Target (Awali 08/62)</label>
                                <input
                                    type="text"
                                    value={data.target_phone}
                                    onChange={e => setData('target_phone', e.target.value)}
                                    placeholder="0812xxxxxxxx"
                                    className="w-full rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.target_phone && <p className="text-red-500 text-xs mt-1">{errors.target_phone}</p>}
                            </div>
                        )}

                        {data.target_type === 'per_class' && (
                            <div className="mb-6 animate-fadeIn">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Kelas</label>
                                <select
                                    value={data.target_class_id}
                                    onChange={e => setData('target_class_id', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelas_list.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                                    ))}
                                </select>
                                {errors.target_class_id && <p className="text-red-500 text-xs mt-1">{errors.target_class_id}</p>}
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Isi Pesan</label>
                            <div className="relative">
                                <textarea
                                    rows="5"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 pl-4 pr-12 py-3"
                                    placeholder="Tulis pesan pengumuman di sini... Gunakan {nama} untuk menyebut nama penerima secara otomatis."
                                ></textarea>
                                <div className="absolute bottom-3 right-3 text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded">
                                    {data.message.length} chars
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <AlertCircle size={12} /> Tips: Gunakan <b>{'{nama}'}</b> untuk menyisipkan nama lengkap penerima otomatis.
                            </p>
                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-600/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2"
                            >
                                <Send size={20} />
                                {processing ? 'Sedang Mengirim...' : 'Kirim Broadcast'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Right Column: History */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[600px]">
                        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <RotateCw size={18} /> Riwayat Terakhir
                            </h3>
                            <button onClick={() => router.reload()} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 transition-colors">
                                Refresh
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {recent_logs.length > 0 ? recent_logs.map((log) => (
                                <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-green-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-mono text-gray-500">
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${log.status === 'sent' ? 'bg-green-100 text-green-700' :
                                                log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {log.status}
                                        </div>
                                    </div>
                                    <div className="font-medium text-gray-800 text-sm mb-1">{log.recipient_number}</div>
                                    <div className="text-xs text-gray-500 line-clamp-2 italic group-hover:line-clamp-none transition-all">
                                        "{log.message.substring(0, 100)}..."
                                    </div>
                                    {log.status === 'failed' && (
                                        <div className="mt-2 text-[10px] text-red-500 bg-red-50 p-1.5 rounded border border-red-100">
                                            Error: {log.response_log}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    Belum ada riwayat broadcast.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
