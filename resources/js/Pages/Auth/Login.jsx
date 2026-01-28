import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Heart, Calculator, Smartphone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Swal from 'sweetalert2';

export default function Login({ status, canResetPassword, captcha_question, school_logo_url, school_name }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        captcha: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password', 'captcha'),
        });
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-blue-500 selection:text-white">
            <Head title="Login Administrator" />

            {/* LEFT SIDE - BRANDING PREMIUM */}
            <div className="hidden lg:flex w-7/12 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-10 text-white">
                {/* Advanced Background Effects */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[35rem] h-[35rem] bg-cyan-500/10 rounded-full blur-[80px]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30"
                    style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Top Content */}
                <div className="relative z-10 animate-fade-in-up w-full h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/5 p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3">
                                <ApplicationLogo className="w-12 h-12 fill-current text-white" />
                                {school_logo_url && (
                                    <>
                                        <div className="w-px h-8 bg-white/20"></div>
                                        <img src={school_logo_url} alt="School Logo" className="w-12 h-12 object-contain" />
                                    </>
                                )}
                            </div>
                            <div>
                                <span className="block font-bold tracking-[0.2em] text-xs uppercase text-blue-200/60 mb-1">OFFICIAL PORTAL</span>
                                <span className="font-bold tracking-widest text-lg uppercase text-white">{school_name || '[NAMA INSTITUSI SEKOLAH]'}</span>
                            </div>
                        </div>

                        {/* Feature Pills - Top Right (Removed) */}
                    </div>


                    <div className="mt-32">
                        <h1 className="text-6xl font-black leading-tight mb-8 tracking-tight text-white drop-shadow-sm">
                            Sistem Informasi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Data Terpadu</span>
                        </h1>
                        <p className="text-slate-300 text-xl max-w-xl leading-relaxed font-light border-l-4 border-indigo-500 pl-6 mb-10">
                            Platform manajemen sekolah terintegrasi dengan teknologi enkripsi modern dan keamanan berlapis.
                        </p>

                        {/* Feature Pills - Moved Below Text */}
                        <div className="flex flex-wrap gap-4 animate-fade-in-up delay-100">
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors shadow-lg shadow-black/20">
                                <ShieldCheck size={20} className="text-emerald-400" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">E2E Encryption</span>
                                    <span className="text-[10px] text-slate-400">Data terlindungi</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors shadow-lg shadow-black/20">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-300 p-1.5 rounded-full">
                                    <Smartphone size={16} className="text-gray-700" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">Authenticator</span>
                                    <span className="text-[10px] text-slate-400">Google, Microsoft, Samsung Pass</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors shadow-lg shadow-black/20">
                                <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-1.5 rounded-full">
                                    <MessageCircle size={16} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">WA Integrated</span>
                                    <span className="text-[10px] text-slate-400">Notifikasi Real-time</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Independent Declaration */}
                    <div className="mt-auto pt-10 opacity-40 flex items-center gap-2">
                        <div className="w-6 h-[1px] bg-slate-500"></div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                            Independent & Standalone System
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-5/12 bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative shadow-2xl">

                <div className="w-full max-w-[28rem] mx-auto animate-fade-in-down">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-12 text-center">
                        <ApplicationLogo className="w-20 h-20 fill-current text-[#0F172A] mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">SIDADU PORTAL</h2>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                            <Smartphone size={12} /> Secure Login
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Selamat Datang 👋</h2>
                        <p className="text-slate-500 text-base font-medium">Masuk untuk mengelola data sekolah.</p>
                    </div>

                    {status && (
                        <div className="p-4 mb-8 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-pulse">
                            <ShieldCheck size={20} />
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <InputLabel htmlFor="email" value="Email Institusi" className="text-slate-700 font-bold text-sm" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-12 block w-full rounded-2xl border-slate-200 bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all py-3.5 font-medium shadow-sm hover:border-blue-300"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@sekolah.id"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <InputLabel htmlFor="password" value="Password" className="text-slate-700 font-bold text-sm" />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="pl-12 pr-12 block w-full rounded-2xl border-slate-200 bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all py-3.5 font-medium shadow-sm hover:border-blue-300"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Captcha - Premium Look */}
                        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <InputLabel htmlFor="captcha" value="Verifikasi Keamanan" className="text-slate-700 font-bold text-sm" />
                            <div className="flex items-center gap-3">
                                <div className="bg-white text-slate-800 font-mono font-black text-lg px-5 py-2.5 rounded-xl border-2 border-slate-200 shadow-sm min-w-[5rem] text-center select-none flex items-center gap-2 tracking-widest relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-100 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #ccc 5px, #ccc 10px)' }}></div>
                                    <Calculator size={16} className="text-slate-400 relative z-10" />
                                    <span className="relative z-10">{captcha_question || '...'}</span>
                                </div>
                                <TextInput
                                    id="captcha"
                                    type="number"
                                    name="captcha"
                                    value={data.captcha}
                                    className="block w-full rounded-xl border-slate-200 bg-white focus:border-blue-600 focus:ring-blue-100 py-2.5 font-bold text-center text-blue-900 placeholder-slate-300 transition-all"
                                    onChange={(e) => setData('captcha', e.target.value)}
                                    placeholder="Hasil?"
                                />
                            </div>
                            {errors.captcha && <InputError message={errors.captcha} className="mt-1" />}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-[6px] border-slate-300 text-blue-600 focus:ring-blue-500 transition-all w-5 h-5"
                                />
                                <span className="ml-2.5 text-sm text-slate-600 group-hover:text-blue-700 transition-colors font-semibold">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-xl shadow-blue-600/20 text-base font-bold text-white bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:to-[#334155] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all transform hover:-translate-y-1 active:scale-[0.99]"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : 'Masuk Dashboard'}
                        </PrimaryButton>
                    </form>

                    {/* Footer */}
                    <div className="pt-10 mt-8 border-t border-slate-100 text-center space-y-3">
                        <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'KEBIJAKAN PRIVASI & KETENTUAN PENGGUNAAN',
                                    html: `
                                        <div class="text-left text-sm space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar leading-relaxed font-sans">
                                            
                                            <div class="p-6 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 mb-8">
                                                <h2 class="text-xl font-bold text-slate-900 mb-2">KEBIJAKAN PRIVASI DAN SYARAT PENGGUNAAN</h2>
                                                <hr class="border-slate-300 my-3"/>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div><strong>Terakhir Diperbarui:</strong> ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                    <div><strong>Nomor Dokumen:</strong> LEG-PRIV-2026/001</div>
                                                    <div><strong>Status:</strong> Berlaku Efektif</div>
                                                    <div><strong>Yurisdiksi:</strong> Republik Indonesia</div>
                                                </div>
                                            </div>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB I: KETENTUAN UMUM</h3>
                                            <p class="text-justify mb-4">
                                                1.1. Kebijakan Privasi ini ("Kebijakan") merupakan perjanjian hukum yang mengikat antara Pengguna ("Anda", "Wali Murid", "Siswa", "Tenaga Pendidik") dan Institusi Pendidikan Pengelola ("Kami", "Sekolah") terkait penggunaan Sistem Informasi Data Terpadu ("SIDADU").
                                            </p>
                                            <p class="text-justify mb-4">
                                                1.2. Dengan mengunduh, menginstal, mengakses, atau menggunakan Aplikasi ini, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh syarat dan ketentuan yang tercantum dalam Kebijakan ini. Jika Anda tidak setuju dengan sebagian atau seluruh ketentuan ini, Anda tidak diperkenankan menggunakan Aplikasi.
                                            </p>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB II: DEFINISI DAN INTERPRETASI</h3>
                                            <p class="mb-4">Dalam Kebijakan ini, istilah-istilah berikut memiliki arti sebagai berikut:</p>
                                            <ul class="list-disc pl-5 space-y-2 mb-4 text-justify">
                                                <li><strong>"Data Pribadi"</strong> adalah setiap data tentang seseorang baik yang teridentifikasi dan/atau dapat diidentifikasi secara tersendiri atau dikombinasi dengan informasi lainnya baik secara langsung maupun tidak langsung melalui sistem elektronik atau nonelektronik.</li>
                                                <li><strong>"Pemrosesan"</strong> meliputi pemerolehan, pengumpulan, pengolahan, penganalisisan, penyimpana, perbaikan, pembaruan, penampilan, pengumuman, transfer, penyebarluasan, atau pengungkapan Data Pribadi.</li>
                                                <li><strong>"Cookies"</strong> adalah file teks kecil yang ditempatkan pada perangkat Anda untuk menyimpan preferensi dan menganalisis trafik.</li>
                                            </ul>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB III: JENIS DATA YANG DIKUMPULKAN</h3>
                                            <p class="mb-4">Kami mengumpulkan berbagai jenis informasi untuk mendukung operasional pendidikan, termasuk namun tidak terbatas pada:</p>
                                            
                                            <h4 class="font-bold text-sm text-slate-800 mb-2">3.1. Data Identitas Pribadi</h4>
                                            <ul class="list-disc pl-5 space-y-1 mb-4">
                                                <li>Nama Lengkap sesuai Akta Kelahiran/KTP/KK.</li>
                                                <li>Nomor Induk Kependudukan (NIK) dan Nomor Kartu Keluarga (KK).</li>
                                                <li>Nomor Induk Siswa Nasional (NISN) dan Nomor Induk Pegawai (NIP).</li>
                                                <li>Tempat dan Tanggal Lahir.</li>
                                                <li>Jenis Kelamin dan Agama.</li>
                                                <li>Foto Profil Biometrik (untuk keperluan Kartu Pelajar/Pegawai).</li>
                                            </ul>

                                            <h4 class="font-bold text-sm text-slate-800 mb-2">3.2. Data Kontak & Lokasi</h4>
                                            <ul class="list-disc pl-5 space-y-1 mb-4">
                                                <li>Alamat tempat tinggal domisili dan sesuai KTP (Jalan, RT/RW, Kelurahan, Kecamatan).</li>
                                                <li>Titik Koordinat Lokasi (Lintang/Bujur) tempat tinggal siswa (untuk keperluan Zonasi PPDB).</li>
                                                <li>Nomor Telepon Seluler, WhatsApp, dan Alamat Email aktif.</li>
                                            </ul>

                                            <h4 class="font-bold text-sm text-slate-800 mb-2">3.3. Data Akademik & Perilaku</h4>
                                            <ul class="list-disc pl-5 space-y-1 mb-4">
                                                <li>Riwayat nilai rapor, transkrip akademik, dan capaian pembelajaran.</li>
                                                <li>Catatan kehadiran (presensi) harian dan riwayat izin/sakit.</li>
                                                <li>Catatan pelanggaran tata tertib, poin perilaku, dan sanksi yang diberikan.</li>
                                                <li>Riwayat prestasi akademik dan non-akademik.</li>
                                                <li>Jurnal konseling dan catatan bimbingan karir.</li>
                                            </ul>

                                            <h4 class="font-bold text-sm text-slate-800 mb-2">3.4. Data Keluarga & Wali</h4>
                                            <ul class="list-disc pl-5 space-y-1 mb-4">
                                                <li>Nama Ayah, Ibu, dan Wali.</li>
                                                <li>Pekerjaan, Penghasilan, dan Pendidikan terakhir orang tua/wali.</li>
                                                <li>Status kepemilikan tempat tinggal.</li>
                                            </ul>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB IV: TUJUAN PEMROSESAN DATA</h3>
                                            <p class="text-justify mb-4">Kami menggunakan Data Pribadi Anda semata-mata untuk tujuan yang sah dan legal, yaitu:</p>
                                            <ol class="list-decimal pl-5 space-y-2 mb-4">
                                                <li><strong>Administrasi Pendidikan:</strong> Mengelola database siswa, penempatan kelas, dan manajemen kurikulum.</li>
                                                <li><strong>Pelaporan Nasional:</strong> Memenuhi kewajiban pelaporan data pokok pendidikan (Dapodik) kepada Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia.</li>
                                                <li><strong>Layanan Akademik:</strong> Penerbitan rapor, ijazah, surat keterangan, dan dokumen akademik lainnya.</li>
                                                <li><strong>Komunikasi:</strong> Mengirimkan notifikasi penting, pengumuman sekolah, dan laporan perkembangan siswa melalui WhatsApp Gateway atau Email.</li>
                                                <li><strong>Kesejahteraan Siswa:</strong> Memproses pengajuan beasiswa (PIP/KIP) dan bantuan sosial lainnya.</li>
                                                <li><strong>Keamanan Sistem:</strong> Memantau aktivitas login, mendeteksi akses tidak sah, dan mencegah penyalahgunaan aplikasi.</li>
                                            </ol>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB V: PENYIMPANAN DAN RETENSI DATA</h3>
                                            <p class="text-justify mb-4">
                                                5.1. <strong>Lokasi Penyimpanan:</strong> Seluruh Data Pribadi disimpan secara lokal (On-Premise) pada infrastruktur server fisik yang dikelola mandiri oleh Sekolah. Tidak ada data yang disimpan di cloud publik atau server pihak ketiga tanpa perjanjian tertulis terpisah.
                                            </p>
                                            <p class="text-justify mb-4">
                                                5.2. <strong>Masa Retensi:</strong> Kami akan menyimpan Data Pribadi Anda selama Anda terdaftar sebagai siswa/pegawai aktif dan selama jangka waktu yang diwajibkan oleh peraturan perundang-undangan kearsipan negara (minimal 5 tahun setelah kelulusan atau pemutusan hubungan kerja).
                                            </p>
                                            <p class="text-justify mb-4">
                                                5.3. <strong>Pemusnahan Data:</strong> Setelah masa retensi berakhir atau jika data tidak lagi diperlukan, kami akan melakukan pemusnahan data secara permanen baik fisik maupun elektronik sesuai standar prosedur penghapusan data yang aman.
                                            </p>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB VI: KEAMANAN INFORMASI</h3>
                                            <p class="text-justify mb-2">Kami berkomitmen menjaga kerahasiaan Data Pribadi Anda dengan menerapkan langkah-langkah keamanan teknis dan organisasional yang ketat:</p>
                                            <ul class="list-disc pl-5 space-y-2 mb-4">
                                                <li><strong>Enkripsi Data:</strong> Data sensitif seperti NIK, Password, dan Token disimpan dalam format terenkripsi menggunakan algoritma standar industri (AES-256-CBC dan Bcrypt Hash).</li>
                                                <li><strong>Kontrol Akses:</strong> Penerapan Role-Based Access Control (RBAC) untuk memastikan data hanya dapat diakses oleh personil yang berwenang (Kepala Sekolah, Admin, Guru Wali).</li>
                                                <li><strong>Keamanan Jaringan:</strong> Penggunaan Firewall, perlindungan terhadap serangan CSRF (Cross-Site Request Forgery), XSS (Cross-Site Scripting), dan SQL Injection.</li>
                                                <li><strong>Audit Trail:</strong> Pencatatan log aktivitas sistem untuk melacak siapa yang mengakses, mengubah, atau menghapus data.</li>
                                            </ul>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB VII: HAK-HAK SUBJEK DATA</h3>
                                            <p class="text-justify mb-4">Sesuai dengan Undang-Undang Perlindungan Data Pribadi, Anda memiliki hak-hak sebagai berikut:</p>
                                            <ul class="list-disc pl-5 space-y-2 mb-4">
                                                <li><strong>Hak Akses:</strong> Meminta salinan Data Pribadi Anda yang tersimpan dalam sistem kami.</li>
                                                <li><strong>Hak Perbaikan:</strong> Meminta perbaikan atas data yang tidak akurat, tidak lengkap, atau ralat.</li>
                                                <li><strong>Hak Penghapusan:</strong> Meminta penghapusan data Anda (Right to be Forgotten) apabila data tersebut tidak lagi relevan dengan tujuan pemrosesan, dengan ketentuan tidak bertentangan dengan kewajiban penyimpanan arsip negara.</li>
                                                <li><strong>Hak Pembatasan:</strong> Meminta pembatasan pemrosesan data dalam situasi tertentu.</li>
                                                <li><strong>Hak Keberatan:</strong> Mengajukan keberatan atas pemrosesan data yang didasarkan pada kepentingan sah pengendali data.</li>
                                            </ul>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB VIII: PENGUNGKAPAN KEPADA PIHAK KETIGA</h3>
                                            <p class="text-justify mb-4">Kami tidak akan menjual, menyewakan, atau menukar Data Pribadi Anda kepada pihak ketiga manapun untuk tujuan komersial/pemasaran. Pengungkapan data hanya dilakukan kepada:</p>
                                            <ol class="list-decimal pl-5 space-y-2 mb-4">
                                                <li>Kementerian Pendidikan dan Kebudayaan (untuk keperluan Dapodik).</li>
                                                <li>Dinas Pendidikan setempat (untuk keperluan administrasi daerah).</li>
                                                <li>Aparat Penegak Hukum (apabila diperintahkan oleh Pengadilan atau Undang-Undang).</li>
                                                <li>Pihak Medis (dalam keadaan darurat yang mengancam nyawa siswa).</li>
                                            </ol>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB IX: PENGGUNAAN COOKIES DAN TEKNOLOGI PELACAKAN</h3>
                                            <p class="text-justify mb-4">
                                                9.1. Aplikasi SIDADU menggunakan "Cookies" sesi untuk mengelola otentikasi pengguna dan menjaga keamanan sesi login Anda. Cookies ini bersifat wajib agar aplikasi dapat berfungsi.
                                            </p>
                                            <p class="text-justify mb-4">
                                                9.2. Kami tidak menggunakan Cookies pelacakan pihak ketiga (Third-Party Tracking Cookies) untuk tujuan periklanan.
                                            </p>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB X: KEBIJAKAN PENGGUNAAN YANG DAPAT DITERIMA (AUP)</h3>
                                            <p class="mb-2">Anda setuju untuk tidak melakukan hal-hal berikut saat menggunakan Aplikasi:</p>
                                            <ul class="list-disc pl-5 space-y-1 mb-4">
                                                <li>Menggunakan aplikasi untuk tujuan ilegal atau melanggar hukum.</li>
                                                <li>Mencoba meretas, membobol, atau melakukan reverse engineering terhadap kode sumber aplikasi.</li>
                                                <li>Mengunggah konten yang mengandung virus, malware, atau kode berbahaya lainnya.</li>
                                                <li>Melakukan scraping atau pengambilan data massal secara otomatis tanpa izin.</li>
                                            </ul>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB XI: PELEPASAN TANGGUNG JAWAB (DISCLAIMER)</h3>
                                            <div class="bg-red-50 p-6 rounded-xl border border-red-200 text-red-900 text-justify space-y-4">
                                                <p>
                                                    <strong>11.1. Layanan "SEBAGAIMANA ADANYA":</strong> Aplikasi ini disediakan dengan basis "As Is" (Apa Adanya) dan "As Available" (Sebagaimana Tersedia). Kami tidak memberikan jaminan tercurat maupun tersirat mengenai ketersediaan tanpa gangguan, ketepatan waktu, keamanan, atau kebebasan dari kesalahan.
                                                </p>
                                                <p>
                                                    <strong>11.2. Batasan Tanggung Jawab Pengembang:</strong> Pengembang Aplikasi (Software Developer) bertindak sebagai penyedia teknologi semata. Tanggung jawab atas pengelolaan infrastruktur server, keamanan fisik, backup data, dan kepatuhan hukum operasional berada sepenuhnya pada Pihak Sekolah.
                                                </p>
                                                <p>
                                                    <strong>11.3. Force Majeure:</strong> Kami tidak bertanggung jawab atas kegagalan kinerja aplikasi yang disebabkan oleh kejadian di luar kendali wajar kami, termasuk namun tidak terbatas pada bencana alam, kebakaran, kerusuhan, perang, sabotase, serangan siber masif (DDOS), atau gangguan jaringan telekomunikasi nasional.
                                                </p>
                                            </div>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB XII: PERUBAHAN KEBIJAKAN</h3>
                                            <p class="text-justify mb-4">
                                                Kami berhak untuk mengubah, memodifikasi, menambah, atau menghapus bagian-bagian dari Kebijakan ini sewaktu-waktu. Setiap perubahan akan diberitahukan melalui notifikasi dalam aplikasi atau email. Penggunaan berkelanjutan Anda atas Aplikasi setelah perubahan tersebut diposting merupakan persetujuan Anda terhadap perubahan tersebut.
                                            </p>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB XIII: YURISDIKSI DAN PENYELESAIAN SENGKETA</h3>
                                            <p class="text-justify mb-4">
                                                Kebijakan ini diatur dan ditafsirkan sesuai dengan hukum Negara Republik Indonesia. Segala perselisihan yang timbul dari atau sehubungan dengan Kebijakan ini akan diselesaikan terlebih dahulu melalui musyawarah untuk mufakat. Apabila tidak tercapai kesepakatan, maka perselisihan akan diselesaikan melalui Pengadilan Negeri yang berwenang di wilayah domisili Sekolah.
                                            </p>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB XIV: INFORMASI KONTAK</h3>
                                            <p class="mb-4">Jika Anda memiliki pertanyaan, keluhan, atau ingin melaksanakan hak perlindungan data Anda, silakan hubungi Pejabat Pengelola Informasi dan Dokumentasi (PPID) Sekolah melalui:</p>
                                            <div class="bg-slate-100 p-4 rounded-lg">
                                                <ul class="space-y-2 text-sm font-mono text-slate-700">
                                                    <li><strong>Unit:</strong> Tata Usaha & IT Support</li>
                                                    <li><strong>Lokasi:</strong> Kantor Administrasi Sekolah</li>
                                                    <li><strong>Jam Operasional:</strong> Senin - Jumat, 07.30 - 15.00 WIB</li>
                                                </ul>
                                            </div>

                                            <h3 class="font-bold text-lg text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">BAB XV: PENUTUP</h3>
                                            <p class="text-justify mb-8">
                                                Demikian Kebijakan Privasi dan Syarat Penggunaan ini dibuat untuk melindungi kepentingan semua pihak. Terima kasih atas kepercayaan Anda menggunakan SIDADU.
                                            </p>

                                            <div class="mt-12 pt-8 border-t-2 border-slate-200 text-center space-y-2">
                                                <p class="text-sm font-bold text-slate-900">DISETUJUI SECARA ELEKTRONIK OLEH PENGGUNA SAAT LOGIN</p>
                                                <p class="text-xs text-slate-400 font-mono">HASH DOKUMEN: ${new Date().getTime().toString(16).toUpperCase()}-SECURE-DOC</p>
                                            </div>
                                        </div>
                                    `,
                                    icon: null,
                                    width: '800px',
                                    padding: '2em',
                                    confirmButtonText: 'SAYA MENGERTI & SETUJU',
                                    confirmButtonColor: '#0F172A',
                                    customClass: {
                                        popup: 'rounded-3xl',
                                        confirmButton: 'rounded-xl px-8 py-4 font-bold text-sm uppercase tracking-wider shadow-xl w-full'
                                    }
                                });
                            }} className="hover:text-blue-600 transition-colors">Kebijakan Privasi</a>
                            <span>•</span>
                            <span>Lisensi MIT</span>
                        </div>
                        <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                            &copy; {new Date().getFullYear()} SIDADU System v1.0
                        </p>
                        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-300">
                            Developed with <Heart size={10} className="text-red-400 fill-red-400 animate-pulse" /> by Fanzhy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
