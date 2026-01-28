<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $surat->perihal }}</title>
    <style>
        @page {
            /* Define Paper Size explicitly to prevent cutting */
            size: {{ match($surat->paper_size) {
                'F4' => '215mm 330mm', // Legal/Folio
                'Letter' => '216mm 279mm',
                default => '210mm 297mm' // A4
            } }};
            margin-top: {{ $surat->margins['top'] ?? 2.5 }}cm;
            margin-bottom: {{ $surat->margins['bottom'] ?? 2.5 }}cm;
            margin-left: {{ $surat->margins['left'] ?? 2.5 }}cm;
            margin-right: {{ $surat->margins['right'] ?? 2.5 }}cm;
        }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; }
        .header { text-align: center; @if(!$schoolProfile->kop_surat) border-bottom: 3px double #000; @endif padding-bottom: 10px; margin-bottom: 20px; }
        .logo { width: 80px; position: absolute; left: 0; top: 0; }
        .kop-teks { margin-left: 90px; }
        .nama-sekolah { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
        .alamat { font-size: 10pt; }
        .content { margin-bottom: 40px; text-align: justify; }
        .content table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .content table th, .content table td { border: 1px solid #000; padding: 4px; vertical-align: top; }
        .ttd-area { float: right; width: 40%; text-align: center; position: relative; }
        .footer-validation { position: fixed; bottom: 0; left: 0; right: 0; width: 100%; font-size: 9pt; border-top: 1px solid #ccc; padding-top: 5px; }
        .qr-validation { float: left; width: 60px; margin-right: 10px; }
        .validation-text { float: left; width: 80%; color: #555; }
        .clear { clear: both; }
        .ttd-image { width: 100px; height: 100px; object-fit: contain; }
        .no-surat { text-align: center; margin-bottom: 20px; font-weight: bold; text-decoration: underline; }
    </style>
</head>
<body>

    {{-- KOP SURAT --}}
    <div class="header">
        @if($schoolProfile->kop_surat)
            {{-- Use Uploaded Kop Image (Full Width/Auto) --}}
            <img src="{{ public_path('storage/' . $schoolProfile->kop_surat) }}" style="width: 100%; height: auto; max-height: 4cm; object-fit: contain;" alt="Kop Surat">
        @elseif($schoolProfile->logo_sekolah)
            {{-- Fallback to Logo + Text --}}
            <img src="{{ public_path($schoolProfile->logo_sekolah) }}" class="logo" alt="Logo">
            <div class="kop-teks">
                <div class="nama-sekolah">{{ $schoolProfile->nama_sekolah }}</div>
                <div class="alamat">{{ $schoolProfile->alamat_sekolah }}</div>
                <div class="alamat">Telp: {{ $schoolProfile->no_telp_sekolah }} | Email: {{ $schoolProfile->email_sekolah }}</div>
                <div class="alamat">Website: {{ $schoolProfile->web_sekolah }}</div>
            </div>
        @else
            {{-- Text Only --}}
             <div class="kop-teks" style="margin-left: 0;">
                <div class="nama-sekolah">{{ $schoolProfile->nama_sekolah }}</div>
                <div class="alamat">{{ $schoolProfile->alamat_sekolah }}</div>
            </div>
        @endif
    </div>

    @if($surat->klasifikasi && $surat->klasifikasi->kode === 'SK')
        {{-- SK HEADER --}}
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-weight: bold; font-size: 14pt; text-decoration: underline; text-transform: uppercase;">SURAT KEPUTUSAN</div>
            <div style="font-weight: bold; font-size: 14pt; margin-bottom: 20px;">{{ $surat->no_surat }}</div>
            
            <div style="font-weight: bold; font-size: 12pt;">Kepala Sekolah {{ $schoolProfile->nama_sekolah }}</div>
            <div style="font-weight: bold; font-size: 12pt;">Memutuskan</div>
            <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-top: 5px;">{{ $surat->perihal }}</div>
        </div>
    @else
        {{-- INFO SURAT --}}
        <div style="margin-bottom: 20px;">
            {{-- Date moved 1 line above "Nomor" and added City --}}
            <div style="text-align: right; margin-bottom: 5px;">
                {{ $schoolProfile->kota ?? 'Bogor' }}, {{ \Carbon\Carbon::parse($surat->tanggal_surat)->locale('id')->translatedFormat('d F Y') }}
            </div>

            <table width="100%">
                <tr>
                    <td width="15%">Nomor</td>
                    <td width="2%">:</td>
                    <td width="83%">{{ $surat->no_surat }}</td>
                </tr>
                <tr>
                    <td>Lampiran</td>
                    <td>:</td>
                    <td>{{ $surat->lampiran ?? '-' }}</td>
                </tr>
                <tr>
                    <td>Perihal</td>
                    <td>:</td>
                    <td><strong>{{ $surat->perihal }}</strong></td>
                </tr>
            </table>
        </div>

        {{-- TUJUAN --}}
        <div style="margin-bottom: 20px;">
            Kepada Yth.<br>
            <strong>{{ $surat->tujuan }}</strong><br>
            di Tempat
        </div>
    @endif

    {{-- ISI SURAT --}}
    <div class="content">
        {!! $surat->isi_surat !!}
    </div>

    {{-- TANDA TANGAN --}}
    {{-- TANDA TANGAN & QR --}}
    <div class="ttd-area">
        @if($surat->posisi_tanggal == 'kanan_bawah' || ($surat->klasifikasi && $surat->klasifikasi->kode === 'SK'))
            <p style="margin: 0; line-height: 1.2;">{{ $schoolProfile->kota ?? 'Bogor' }}, {{ \Carbon\Carbon::parse($surat->tanggal_surat)->locale('id')->translatedFormat('d F Y') }}</p>
        @else
            <p style="margin: 0; line-height: 1.2;">Mengetahui,</p>
        @endif
        <p style="margin: 0; line-height: 1.2;">Kepala Sekolah</p>
        
        <div style="height: 75px; width: 75px; margin: 15px auto 5px auto; position: relative;">
            {{-- QR Code only appears if AGREED/APPROVED --}}
            @if($surat->opsi_tanda_tangan == 'tte' && $surat->status === 'approved')
                {{-- SMART URL GENERATION --}}
                @php
                    $baseUrl = $schoolProfile->online_url ? rtrim($schoolProfile->online_url, '/') : url('/');
                    $validationUrl = $baseUrl . '/surat-keluar/validasi/' . ($surat->token ?? 'invalid');
                @endphp

                {{-- QR CODE VALIDASI (TTE ONLY) --}}
                {{-- Centered 70px QR in 75px container --}}
                <img src="data:image/svg+xml;base64, {{ base64_encode(QrCode::format('svg')->size(70)->errorCorrection('H')->generate($validationUrl)) }}" 
                     style="width: 70px; height: 70px; position: absolute; top: 50%; left: 50%; margin-top: -35px; margin-left: -35px;" 
                     alt="QR">

                {{-- LOGO OVERLAY --}}
                @php
                    $logoFile = $schoolProfile->logo_sekolah ?: $schoolProfile->logo;
                    $logoData = null;
                    if ($logoFile) {
                        $path = storage_path('app/public/' . $logoFile);
                        $fallbackPath = public_path('storage/' . $logoFile);
                        
                        if (file_exists($path)) {
                            $type = pathinfo($path, PATHINFO_EXTENSION);
                            $logoData = 'data:image/' . $type . ';base64,' . base64_encode(file_get_contents($path));
                        } elseif (file_exists($fallbackPath)) {
                            $type = pathinfo($fallbackPath, PATHINFO_EXTENSION);
                            $logoData = 'data:image/' . $type . ';base64,' . base64_encode(file_get_contents($fallbackPath));
                        }
                    }
                @endphp

                @if($logoData)
                    {{-- White circle background - 22px --}}
                    <div style="position: absolute; top: 50%; left: 50%; width: 22px; height: 22px; margin-top: -11px; margin-left: -11px; background-color: #ffffff; border-radius: 50%;"></div>
                    
                    {{-- Logo - 18px --}}
                    <img src="{{ $logoData }}" 
                         style="position: absolute; top: 50%; left: 50%; width: 18px; height: 18px; margin-top: -9px; margin-left: -9px; object-fit: contain;" 
                         alt="Logo">
                @endif
            @endif
        </div>

        <p style="text-decoration: underline; font-weight: bold; margin-bottom: 0; margin-top: 5px;">{{ $schoolProfile->kepala_sekolah ?? $schoolProfile->nama_kepala_sekolah }}</p>
        <p style="margin-top: 0;">
            @if($schoolProfile->nip_kepala_sekolah)
                NIP. {{ $schoolProfile->nip_kepala_sekolah }}
            @else
                NUPTK. {{ $schoolProfile->nuptk ?? '-' }}
            @endif
        </p>
    </div>

    <div class="clear"></div>

    {{-- DYNAMIC FOOTER --}}
    @if($surat->footer_enabled)
        @php
            $placeholders = [
                '[NAMA_SEKOLAH]', '{NAMA_SEKOLAH}',
                '[NAMA]', '{NAMA}',
                '[ALAMAT]', '{ALAMAT}',
                '[WEBSITE]', '{WEBSITE}',
                '{token}', '[token]',
                '{hari, tanggal, jam}', '[hari, tanggal, jam]',
                '{jenis_tanda_tangan}',
                '{nama_aplikasi}'
            ];
            
            $replacements = [
                $schoolProfile->nama_sekolah, $schoolProfile->nama_sekolah,
                $schoolProfile->nama_sekolah, $schoolProfile->nama_sekolah,
                $schoolProfile->alamat, $schoolProfile->alamat,
                $schoolProfile->web_sekolah, $schoolProfile->web_sekolah,
                $surat->token ?? '-', $surat->token ?? '-',
                \Carbon\Carbon::now()->locale('id')->translatedFormat('l, d F Y H:i'), \Carbon\Carbon::now()->locale('id')->translatedFormat('l, d F Y H:i'),
                $surat->opsi_tanda_tangan == 'tte' ? 'Tanda Tangan Elektronik' : 'Tanda Tangan Basah',
                config('app.name', 'SISKO')
            ];

            $footerText = str_replace($placeholders, $replacements, $surat->footer_text ?? '');
        @endphp
        <div style="position: fixed; bottom: {{ $surat->spacing['footer'] ?? 0 }}cm; left: 0; right: 0; text-align: left; font-size: 9pt; font-style: italic; border-top: 2px double #000; padding-top: 10px; color: #555; padding-left: {{ ($surat->opsi_tanda_tangan == 'manual' && $surat->status === 'approved') ? '90px' : '0' }};">
            
            {{-- QR Code for Manual Signature (validation after scan) --}}
            @if($surat->opsi_tanda_tangan == 'manual' && $surat->status === 'approved')
                 @php
                    $baseUrl = $schoolProfile->online_url ? rtrim($schoolProfile->online_url, '/') : url('/');
                    $validationUrl = $baseUrl . '/surat-keluar/validasi/' . ($surat->token ?? 'invalid');
                 @endphp
                 <img src="data:image/svg+xml;base64, {{ base64_encode(QrCode::format('svg')->size(60)->generate($validationUrl)) }}" 
                     style="position: absolute; left: 10px; top: 10px; width: 60px; height: 60px;" 
                     alt="Validation QR">
            @endif

            {!! nl2br(e($footerText)) !!}
        </div>
    @endif

</body>
</html>
