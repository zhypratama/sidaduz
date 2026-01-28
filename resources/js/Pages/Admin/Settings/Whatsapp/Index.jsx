import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { MessageSquare, Save, Smartphone, Hash, Terminal, Send, CheckCircle, XCircle, RotateCw, Globe, MessageCircle, QrCode, Wifi, WifiOff, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, settings = {}, logs = [] }) {
    const { data, setData, post, processing } = useForm({
        wa_default_message_header: settings.wa_default_message_header || '*[SIDADU NOTIFICATION]*\n\n',
    });

    const [testData, setTestData] = useState({
        target_number: '',
        message: 'Tes koneksi WhatsApp Gateway SIDADU.'
    });

    const [testing, setTesting] = useState(false);

    // Gateway State
    const [gatewayStatus, setGatewayStatus] = useState({
        connected: false,
        qr: null,
        message: 'Connecting...'
    });
    const [loadingStatus, setLoadingStatus] = useState(true);

    // Poll Gateway Status
    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Dynamic hostname for local gateway
                const hostname = window.location.hostname;
                const res = await fetch(`http://${hostname}:3000/status`);
                const data = await res.json();
                setGatewayStatus(data);
                setLoadingStatus(false);
            } catch (error) {
                console.error('Gateway connection error:', error);
                setGatewayStatus({
                    connected: false,
                    qr: null,
                    message: 'Gateway Offline (Start node server)'
                });
                setLoadingStatus(false);
            }
        };

        checkStatus(); // Initial check
        const interval = setInterval(checkStatus, 3000); // Poll every 3s

        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        if (!confirm('Are you sure you want to disconnect?')) return;
        try {
            const hostname = window.location.hostname;
            await fetch(`http://${hostname}:3000/logout`, { method: 'POST' });
            Swal.fire('Disconnected', 'Session cleared. Scan QR again.', 'info');
        } catch (e) {
            Swal.fire('Error', 'Failed to logout via API.', 'error');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.whatsapp.update'), {
            preserveScroll: true,
            onSuccess: () => Swal.fire('Berhasil', 'Pengaturan tersimpan.', 'success')
        });
    };

    const handleTestSend = (e) => {
        e.preventDefault();
        setTesting(true);
        router.post(route('settings.whatsapp.test'), testData, {
            preserveScroll: true,
            onSuccess: () => {
                setTesting(false);
                Swal.fire('Terkirim', 'Pesan tes berhasil dikirim (Cek Logs).', 'success');
            },
            onError: () => {
                setTesting(false);
                Swal.fire('Gagal', 'Terjadi kesalahan saat mengirim pesan.', 'error');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800 dark:text-white">WhatsApp Gateway (Self-Hosted)</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola koneksi WhatsApp Server Sekolah</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="WhatsApp Gateway" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Connection & Config */}
                <div className="lg:col-span-2 space-y-6">

                    {/* CONNECTION STATUS CARD */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-700 pb-4 mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                            <Wifi size={18} /> Status Koneksi
                        </h3>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* QR Code Area */}
                            <div className="flex-shrink-0">
                                {loadingStatus ? (
                                    <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center animate-pulse">
                                        <span className="text-xs text-gray-400 dark:text-gray-500">Loading Status...</span>
                                    </div>
                                ) : gatewayStatus.connected ? (
                                    <div className="w-48 h-48 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 flex flex-col items-center justify-center p-4">
                                        <div className="bg-green-500 rounded-full p-3 mb-2 shadow-lg shadow-green-200 dark:shadow-none">
                                            <CheckCircle className="text-white" size={32} />
                                        </div>
                                        <span className="font-bold text-green-700 dark:text-green-400">TERHUBUNG</span>
                                        <span className="text-xs text-green-600 dark:text-green-500 text-center mt-1">Siap mengirim pesan</span>
                                    </div>
                                ) : gatewayStatus.qr ? (
                                    <div className="relative group bg-white p-2 rounded-xl">
                                        <img src={gatewayStatus.qr} alt="Scan QR" className="w-48 h-48 border-2 border-gray-200 rounded-lg shadow-sm" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-lg">
                                            Scan Me
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-100 dark:border-red-800 flex flex-col items-center justify-center p-4 text-center">
                                        <div className="bg-red-100 dark:bg-red-800 rounded-full p-3 mb-2">
                                            <WifiOff className="text-red-400 dark:text-white" size={32} />
                                        </div>
                                        <span className="font-bold text-red-700 dark:text-red-400 text-sm">{gatewayStatus.message || 'Gateway Offline'}</span>
                                        <span className="text-[10px] text-red-500 dark:text-red-400 mt-1">Pastikan server 'node server.js' berjalan</span>
                                    </div>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="flex-1 space-y-4">
                                <div className={`p-4 rounded-xl border ${gatewayStatus.connected
                                    ? 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                                    : 'bg-orange-50 border-orange-100 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300'}`}>
                                    <div className="flex items-start gap-3">
                                        <Terminal size={18} className="mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-wide">Server Log</h4>
                                            <p className="text-sm mt-1 font-mono break-all">{gatewayStatus.message}</p>
                                        </div>
                                    </div>
                                </div>

                                {gatewayStatus.connected && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Disconnect / Logout
                                        </button>
                                    </div>
                                )}

                                {!gatewayStatus.connected && (
                                    <button
                                        onClick={() => {
                                            const hostname = window.location.hostname;
                                            fetch(`http://${hostname}:3000/logout`, { method: 'POST' })
                                                .then(() => Swal.fire('Reset Berhasil', 'Mencoba membuat QR baru...', 'success'))
                                                .catch(() => Swal.fire('Error', 'Gagal mereset gateway.', 'error'));
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                    >
                                        <RotateCw size={16} /> Force Reset QR
                                    </button>
                                )}

                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <p>Cara Menghubungkan:</p>
                                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                                        <li>Buka WhatsApp di HP Anda.</li>
                                        <li>Menu {'>'} Perangkat Tertaut {'>'} Tautkan Perangkat.</li>
                                        <li>Scan QR Code di samping (refresh jika QR expired).</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-700 pb-4 mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                            <Globe size={18} /> Konfigurasi Pesan
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Header Pesan Default</label>
                            <textarea
                                value={data.wa_default_message_header}
                                onChange={e => setData('wa_default_message_header', e.target.value)}
                                rows="2"
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500 transition-all font-mono text-sm"
                                placeholder="*[SIDADU SYSTEM]*"
                            ></textarea>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Teks ini akan selalu muncul di awal setiap pesan otomatis.</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 dark:hover:bg-gray-600 flex items-center gap-2 text-sm"
                            >
                                <Save size={16} /> Simpan Config
                            </button>
                        </div>
                    </form>

                    {/* LOGS */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Terminal size={18} /> Riwayat Pesan
                            </h3>
                            <button onClick={() => router.reload()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <RotateCw size={16} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Time</th>
                                        <th className="px-4 py-3">Number</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 rounded-r-lg">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {logs.length > 0 ? logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{log.recipient_number}</td>
                                            <td className="px-4 py-3">
                                                {log.status === 'sent' ? (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-xs">
                                                        <CheckCircle size={12} /> SENT
                                                    </span>
                                                ) : log.status === 'failed' ? (
                                                    <span className="flex items-center gap-1 text-red-500 dark:text-red-400 font-bold text-xs">
                                                        <XCircle size={12} /> FAILED
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="max-w-[150px] truncate text-xs cursor-help" title={log.response_log}>
                                                    {log.response_log || '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-400 italic">
                                                Belum ada log aktivitas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Test Connection */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden border border-gray-700">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
                            <Send size={18} /> Test Kirim Pesan
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 relative z-10">
                            Pastikan status di sebelah kiri "TERHUBUNG" sebelum mencoba mengirim pesan.
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Target Nomor (WA)</label>
                                <input
                                    type="text"
                                    value={testData.target_number}
                                    onChange={e => setTestData({ ...testData, target_number: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="0812xxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Pesan Test</label>
                                <textarea
                                    rows="3"
                                    value={testData.message}
                                    onChange={e => setTestData({ ...testData, message: e.target.value })}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                ></textarea>
                            </div>

                            <button
                                onClick={handleTestSend}
                                disabled={testing || !testData.target_number}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${testing
                                    ? 'bg-gray-600 cursor-wait opacity-75'
                                    : 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-900/50'
                                    }`}
                            >
                                {testing ? <RotateCw className="animate-spin" size={18} /> : <Send size={18} />}
                                {testing ? 'Mengirim...' : 'Kirim Pesan Test'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-sm text-blue-800 dark:text-blue-200">
                        <strong className="block mb-2 font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            Self-Hosted Info
                        </strong>
                        <p className="opacity-90 leading-relaxed mb-2">
                            Sistem ini menggunakan server mandiri (Self-Hosted) yang berjalan di komputer ini pada <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">http://{typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3000</code>.
                        </p>
                        <p className="opacity-90">
                            Jika status "Gateway Offline", pastikan Anda telah menjalankan perintah <b>`node server.js`</b> di folder `wa-gateway`.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

