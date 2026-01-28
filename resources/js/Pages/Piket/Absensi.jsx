import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { QrCode, UserCheck, UserX, Clock, Users, Activity, Search, AlertCircle, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Modal from '@/Components/Modal';

export default function Absensi({ auth, stats = {}, recent_activities = [], jam_masuk = '07:00', jam_pulang = '15:00' }) {
    // --- State ---
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scanResult, setScanResult] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [lastScanned, setLastScanned] = useState(null); // { code, time }
    const [cameraFeedback, setCameraFeedback] = useState(null); // { type, message, student } for overlay

    // Form for Manual/QR Input
    const { data, setData, post, reset, errors, clearErrors } = useForm({
        qr_code: '',
    });

    const inputRef = useRef(null);
    const scannerRef = useRef(null);

    // --- Clock ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Auto Focus & Keep Focus ---
    useEffect(() => {
        if (!showCamera && inputRef.current) inputRef.current.focus();
    }, [processing, showCamera]);

    // --- Camera Scanner Logic ---
    useEffect(() => {
        let mounted = true;

        const startScanner = async () => {
            if (showCamera) {
                // Wait for Modal animation/render
                await new Promise(r => setTimeout(r, 300));

                if (!mounted) return;

                const element = document.getElementById("reader");
                if (!element) {
                    // console.error("Reader element not found");
                    return;
                }

                try {
                    const { Html5Qrcode } = await import("html5-qrcode");
                    if (!mounted) return;

                    const scanner = new Html5Qrcode("reader");
                    scannerRef.current = scanner;

                    await scanner.start(
                        { facingMode: "environment" },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (decodedText) => {
                            if (mounted) {
                                handleCameraResult(decodedText);
                                // Continuous scan: do not stop scanner
                            }
                        },
                        (errorMessage) => { /* ignore */ }
                    );
                } catch (err) {
                    console.error("Error starting scanner", err);
                    alert("Gagal membuka kamera: " + (err.message || err));
                    setShowCamera(false);
                }
            }
        };

        startScanner();

        return () => {
            mounted = false;
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) {
                        scannerRef.current.stop().catch(console.error);
                    }
                    scannerRef.current.clear();
                } catch (e) {
                    // ignore
                }
                scannerRef.current = null;
            }
        };
    }, [showCamera]);

    const handleCameraResult = (code) => {
        // Prevent duplicate scan within 3 seconds
        const now = Date.now();
        if (lastScanned && lastScanned.code === code && (now - lastScanned.time < 3000)) {
            return;
        }

        setLastScanned({ code, time: now });
        processScan(code, true);
    };

    // --- Handle Scan/Submit ---
    const handleScan = (e) => {
        e.preventDefault();
        processScan(data.qr_code, false);
    };

    const processScan = (code, isCamera = false) => {
        if (processing || !code) return;

        setProcessing(true);
        if (!isCamera) {
            setScanResult(null);
        }
        clearErrors();

        window.axios.post(route('gtk.piket.scan'), {
            qr_code: code,
            is_qr: isCamera
        })
            .then(res => {
                const result = {
                    type: res.data.type,
                    message: res.data.message,
                    student: res.data.student
                };

                if (isCamera) {
                    setCameraFeedback(result);
                    // Clear feedback after 3s
                    setTimeout(() => setCameraFeedback(null), 3000);
                } else {
                    setScanResult(result);
                    reset('qr_code');
                }

                if (res.data.type === 'success') playAudio('success');
                else if (res.data.type === 'error') playAudio('error');
                else playAudio('notification');

                router.reload({ only: ['stats', 'recent_activities'] });
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || 'Terjadi kesalahan saat memproses data.';
                if (isCamera) {
                    setCameraFeedback({ type: 'error', message: errorMsg });
                    setTimeout(() => setCameraFeedback(null), 3000);
                } else {
                    setScanResult({ type: 'error', message: errorMsg });
                }
                playAudio('error');
            })
            .finally(() => {
                setProcessing(false);
                if (!showCamera && !isCamera) setTimeout(() => inputRef.current?.focus(), 100);
            });
    };

    const playAudio = (type) => {
        // Simple beep implementation
        // const audio = new Audio(`/sounds/${type}.mp3`);
        // audio.play().catch(e => console.log(e));
    };

    // --- Components ---
    const StatCard = ({ title, count, icon: Icon, color }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-800 dark:text-gray-100">{count}</h3>
            </div>
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Piket & Absensi</h2>
                        <p className="text-gray-500 text-sm">Monitoring kehadiran siswa secara real-time</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Menu Cepat */}
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                            <button onClick={() => router.visit(route('gtk.piket.berita-tamu'))} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors">
                                <AlertCircle size={16} className="text-orange-500" />
                                <span className="hidden sm:inline">Berita/Tamu</span>
                            </button>
                            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="px-4 py-2 flex items-center gap-2 text-primary font-mono font-bold">
                                <Clock size={16} />
                                {currentTime.toLocaleTimeString('id-ID', { hour12: false })}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Absensi Piket" />

            <div className="py-8 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard title="Total Siswa" count={stats?.total_students || 0} icon={Users} color="bg-blue-500" />
                    <StatCard title="Hadir" count={stats?.hadir || 0} icon={UserCheck} color="bg-emerald-500" />
                    <StatCard title="Sakit" count={stats?.sakit || 0} icon={Activity} color="bg-yellow-500" />
                    <StatCard title="Izin" count={stats?.izin || 0} icon={Clock} color="bg-purple-500" />
                    <StatCard title="Alpha" count={stats?.alpha || 0} icon={UserX} color="bg-red-500" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8 h-full">
                    {/* Left: Scan Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Scanner Box */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border-2 border-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <QrCode size={200} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                                <QrCode className="text-primary" /> Scan Kartu / Input NIPD
                            </h3>

                            <form onSubmit={handleScan} className="relative z-10 max-w-xl">
                                <div className="flex gap-2 md:gap-4">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="text-gray-400" />
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 text-lg font-mono focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none md:text-xl"
                                            placeholder="Scan QR / Masukkan NIPD atau NISN..."
                                            value={data.qr_code}
                                            onChange={e => setData('qr_code', e.target.value)}
                                            autoComplete="off"
                                            disabled={processing}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowCamera(true)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 md:px-6 rounded-xl font-bold transition-colors flex items-center gap-2 border-2 border-transparent hover:border-gray-300"
                                        title="Buka Kamera"
                                    >
                                        <QrCode size={24} />
                                        <span className="hidden md:inline">Scan</span>
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary hover:bg-primary/90 text-white px-4 md:px-8 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? '...' : 'Check'}
                                    </button>
                                </div>
                                <p className="mt-3 text-sm text-gray-500 ml-1">
                                    *Pastikan kursor aktif di kolom input saat menggunakan scanner USB.
                                </p>
                            </form>

                            {/* Result Display */}
                            {scanResult && (
                                <div className={`mt-8 p-6 rounded-2xl border flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300
                                    ${scanResult.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                        scanResult.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                            scanResult.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                'bg-blue-50 border-blue-200 text-blue-800'
                                    }
                                `}>
                                    <div className={`p-3 rounded-full shrink-0 ${scanResult.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                        scanResult.type === 'error' ? 'bg-red-100 text-red-600' :
                                            'bg-white/50'
                                        }`}>
                                        {scanResult.type === 'success' ? <UserCheck size={24} /> :
                                            scanResult.type === 'error' ? <AlertCircle size={24} /> :
                                                <Activity size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{scanResult.type === 'success' ? 'Berhasil!' : scanResult.type === 'error' ? 'Gagal' : 'Info'}</h4>
                                        <p className="text-lg">{scanResult.message}</p>
                                        {scanResult.student && (
                                            <div className="mt-3 p-3 bg-white/60 rounded-xl flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                                    {scanResult.student.nama_lengkap.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{scanResult.student.nama_lengkap}</p>
                                                    <p className="text-xs opacity-70">{scanResult.student.kelas?.nama || 'Tanpa Kelas'} • {scanResult.student.nipd}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" /> Aktivitas Terakhir
                            </h3>
                            <div className="space-y-4">
                                {Array.isArray(recent_activities) && recent_activities.length > 0 ? recent_activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0
                                            ${activity.status === 'H' ? 'bg-emerald-500' :
                                                activity.status === 'A' ? 'bg-red-500' :
                                                    'bg-yellow-500'}
                                        `}>
                                            {activity.status}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{activity.student?.nama_lengkap}</p>
                                            <div className="flex items-center text-xs text-gray-500 mt-0.5 gap-2">
                                                <span>{activity.student?.kelas?.nama}</span>
                                                <span>•</span>
                                                <span className="font-mono text-gray-400">
                                                    {activity.jam_masuk ? activity.jam_masuk.substring(0, 5) : '-'}
                                                    {activity.jam_pulang ? ` - ${activity.jam_pulang.substring(0, 5)}` : activity.status === 'H' ? ' (Masuk)' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">
                                            {new Date(activity.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-gray-400">
                                        Belum ada aktivitas hari ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Only */}
                    <div className="space-y-6">
                        {/* Info Jam */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-4 opacity-90">Jadwal Sekolah</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Clock size={16} /></div>
                                        <span className="font-medium">Jam Masuk</span>
                                    </div>
                                    <span className="font-mono font-bold text-lg">{jam_masuk}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Clock size={16} /></div>
                                        <span className="font-medium">Jam Pulang</span>
                                    </div>
                                    <span className="font-mono font-bold text-lg">{jam_pulang}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-sm opacity-75 text-center">
                                Lewat dari jam masuk dianggap <span className="font-bold text-yellow-300">Terlambat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Camera Modal */}
            <Modal show={showCamera} onClose={() => setShowCamera(false)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Scan QR Code</h3>
                        <button onClick={() => setShowCamera(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    </div>
                    <div className="bg-black rounded-2xl overflow-hidden aspect-square relative">
                        <div id="reader" className="w-full h-full"></div>
                        <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-primary/50 rounded-xl relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                            </div>
                        </div>

                        {/* Camera Scan Feedback Overlay */}
                        {cameraFeedback && (
                            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-20 animate-in fade-in duration-200`}>
                                <div className={`p-4 rounded-full mb-4 ${cameraFeedback.type === 'success' ? 'bg-emerald-500' :
                                    cameraFeedback.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                    }`}>
                                    {cameraFeedback.type === 'success' ? <UserCheck size={48} /> :
                                        cameraFeedback.type === 'error' ? <UserX size={48} /> : <Activity size={48} />}
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-center px-4">
                                    {cameraFeedback.student ? cameraFeedback.student.nama_lengkap : cameraFeedback.message}
                                </h3>
                                {cameraFeedback.student && (
                                    <p className="text-lg opacity-80">{cameraFeedback.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
