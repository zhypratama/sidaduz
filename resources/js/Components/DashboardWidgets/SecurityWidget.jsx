import { forwardRef, useState } from 'react';
import { Shield, AlertTriangle, ArrowRight, Zap, CheckCircle, Activity } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

const SecurityWidget = forwardRef(({
    style,
    className,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    securityStats,
    recentThreats
}, ref) => {
    const [isFixing, setIsFixing] = useState(false);

    // Safety check
    if (!securityStats) return null;

    // Calculate "Health Score" (Gimmick calculation)
    // Start at 100, deduct for threats
    const totalToday = securityStats.total_today || 0;
    const critical = securityStats.critical_threats || 0;
    const high = 0; // Assuming we might add this later, or use total

    let score = 100 - (critical * 25) - (totalToday * 5);
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // Color based on score
    const scoreColor = score > 80 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-white';
    const bgColor = score > 80 ? 'from-emerald-600 to-green-600 shadow-emerald-500/20'
        : score > 50 ? 'from-orange-500 to-red-600 shadow-orange-500/20'
            : 'from-red-600 to-rose-700 shadow-red-500/20';

    const handleAutoFix = () => {
        setIsFixing(true);

        const steps = [
            { msg: 'Memindai seluruh sistem file...', timer: 1000 },
            { msg: 'Menganalisis anomali pada log akses...', timer: 1500 },
            { msg: 'Mengisolasi IP berbahaya...', timer: 800 },
            { msg: 'Menambal celah keamanan (Virtual Patching)...', timer: 1500 },
            { msg: 'Membersihkan cache sistem...', timer: 1000 },
        ];

        let currentStep = 0;

        const showStep = () => {
            if (currentStep >= steps.length) {
                // Done
                Swal.fire({
                    icon: 'success',
                    title: 'Sistem Diamankan!',
                    text: 'Seluruh ancaman berhasil dinetralisir. Sistem kembali stabil.',
                    confirmButtonText: 'Mantap!',
                    confirmButtonColor: '#10B981',
                    background: '#fff',
                    color: '#333'
                }).then(() => {
                    setIsFixing(false);
                    // Actual backend call to perform the fix
                    console.log('Calling security.auto-fix route...');
                    router.post(route('security.auto-fix'), {}, {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            console.log('Auto-fix success:', page);
                            // After success, reload to get new stats
                            router.reload({ only: ['securityStats', 'recentThreats'], preserveScroll: true });
                        },
                        onError: (errors) => {
                            console.error('Auto-fix error:', errors);
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: 'Terjadi kesalahan saat memperbaiki sistem. Silakan coba lagi.',
                                confirmButtonColor: '#EF4444'
                            });
                        }
                    });
                });
                return;
            }

            const step = steps[currentStep];
            Swal.fire({
                title: 'Auto-Fix Protocol Engage',
                html: `
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                        <div class="font-mono text-sm text-gray-600">${step.msg}</div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${((currentStep + 1) / steps.length) * 100}%"></div>
                        </div>
                    </div>
                `,
                showConfirmButton: false,
                allowOutsideClick: false,
                timer: step.timer,
                didClose: () => {
                    currentStep++;
                    showStep();
                }
            });
        };

        showStep();
    };

    return (
        <div
            ref={ref}
            style={style}
            className={`${className} bg-gradient-to-br ${bgColor} rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between transition-all duration-500`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Shield className={`transition-all ${score < 80 ? 'animate-pulse text-yellow-300' : 'text-white'}`} />
                        Security Monitor
                    </h3>
                    <p className="text-white/80 text-xs mt-1">Real-time Intrusion Detection System</p>
                </div>

                {/* Score Indicator */}
                <div className="relative group">
                    <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                            className="text-black/20"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="transparent"
                            r="28"
                            cx="32"
                            cy="32"
                        />
                        <circle
                            className={`${scoreColor} transition-all duration-1000 ease-out`}
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * ((100 - score) / 100)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="28"
                            cx="32"
                            cy="32"
                        />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-sm font-black">{score}%</span>
                        <span className="text-[8px] font-bold uppercase opacity-80">Safe</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                        <p className="text-[10px] uppercase font-bold text-white/60 mb-1">Threats Today</p>
                        <p className="text-2xl font-black flex items-center gap-2">
                            {securityStats.total_today}
                            {securityStats.total_today > 0 && <Activity size={16} className="text-red-400" />}
                        </p>
                    </div>
                    <div className={`rounded-xl p-3 backdrop-blur-sm border border-white/10 ${score < 50 ? 'bg-red-500/20 animate-pulse' : 'bg-black/20'}`}>
                        <p className="text-[10px] uppercase font-bold text-white/60 mb-1">Critical</p>
                        <p className="text-2xl font-black flex items-center gap-2">
                            {securityStats.critical_threats}
                            {securityStats.critical_threats > 0 && <AlertTriangle size={16} className="text-yellow-300" />}
                        </p>
                    </div>
                </div>

                {/* Gimmick Action Button */}
                {score < 100 && (
                    <button
                        onClick={handleAutoFix}
                        disabled={isFixing}
                        className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 active:scale-95 border border-white/30 rounded-xl flex items-center justify-center gap-2 transition-all group"
                    >
                        <Zap size={16} className={`text-yellow-300 ${isFixing ? 'animate-spin' : 'group-hover:scale-110'}`} />
                        <span className="font-bold text-sm">{isFixing ? 'Memperbaiki...' : 'Perbaiki Otomatis'}</span>
                    </button>
                )}

                {score === 100 && (
                    <div className="w-full py-2 px-3 bg-emerald-500/30 border border-emerald-400/30 rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle size={16} className="text-emerald-300" />
                        <span className="font-bold text-sm text-emerald-100">System Secure</span>
                    </div>
                )}
            </div>

            <Link
                href={route('security.dashboard')}
                className="block w-full text-center py-2 mt-4 text-xs font-semibold hover:tracking-wider transition-all opacity-80 hover:opacity-100"
            >
                View Full Logs →
            </Link>
        </div>
    );
});

export default SecurityWidget;
