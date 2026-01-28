<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIDADU | Akses Ditolak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .gradient-bg {
            background: radial-gradient(circle at 50% 50%, #1a1b26 0%, #0d0e12 100%);
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body class="gradient-bg min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse"></div>
    </div>

    <div class="max-w-md w-full text-center relative z-10">
        <div class="mb-8 flex justify-center">
            <div class="relative">
                <div class="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <div class="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/40">
                    Firewall
                </div>
            </div>
        </div>

        <h1 class="text-3xl font-extrabold text-white mb-4 tracking-tight">Akses Terblokir!</h1>
        
        <div class="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl mb-8">
            <p class="text-gray-400 text-sm leading-relaxed">
                {{ $message }}
            </p>
            <div class="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-500 uppercase tracking-widest">
                Security Engine v1.0 • ID: {{ request()->ip() }}
            </div>
        </div>

        <div class="space-y-4">
            <a href="/" class="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                Coba Akses Ulang
            </a>
            <p class="text-xs text-gray-500">
                Jika menurut Anda ini adalah kesalahan, silakan hubungi Tim IT Sekolah.
            </p>
        </div>
    </div>
</body>
</html>
