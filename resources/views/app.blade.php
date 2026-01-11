<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <script>
            // Anti-White Screen Rescue System
            setTimeout(() => {
                const app = document.getElementById('app');
                // Check if app is empty or has no significant height/content
                if (!app || app.innerHTML.trim() === '' || app.clientHeight < 50) {
                    
                    // Create Rescue Button
                    const btn = document.createElement('a');
                    btn.href = '/dashboard'; // Try forcing to dashboard or root
                    btn.innerHTML = '⚠️ Aplikasi tidak merespon? <b>Klik untuk Reset</b>';
                    
                    // Style it Floating Center
                    Object.assign(btn.style, {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fca5a5', // Light Red
                        color: '#7f1d1d', // Dark Red
                        padding: '20px 30px',
                        borderRadius: '50px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '18px',
                        textDecoration: 'none',
                        zIndex: '99999',
                        border: '2px solid #ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    });

                    // Add click handler to force reload clearing cache if needed
                    btn.onclick = (e) => {
                        e.preventDefault();
                        if(confirm('Layar putih terdeteksi. Reset aplikasi sekarang?')) {
                             window.location.href = '/';
                        }
                    };

                    document.body.appendChild(btn);
                    console.error('WSOD Detected: Rescue button activated.');
                }
            }, 4000); // 4 seconds delay to allow normal load
        </script>
    </body>
</html>
