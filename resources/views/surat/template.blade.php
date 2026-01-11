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
            <table width="100%">
                <tr>
                    <td width="15%">Nomor</td>
                    <td width="2%">:</td>
                    <td width="48%">{{ $surat->no_surat }}</td>
                    <td width="35%" align="right">{{ \Carbon\Carbon::parse($surat->tanggal_surat)->translatedFormat('d F Y') }}</td>
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
            <p style="margin-bottom: 5px;">Bogor, {{ \Carbon\Carbon::parse($surat->tanggal_surat)->translatedFormat('d F Y') }}</p>
        @else
            <p style="margin-bottom: 5px;">Mengetahui,</p>
        @endif
        <p style="margin-bottom: 5px;">Kepala Sekolah</p>
        
        <div style="height: 80px; position: relative; display: flex; align-items: center; justify-content: center;">
            {{-- QR Code only appears if AGREED/APPROVED --}}
            {{-- QR Code only appears if AGREED/APPROVED --}}
            @if($surat->opsi_tanda_tangan == 'tte' && $surat->status === 'approved')
                {{-- QR CODE VALIDASI (TTE ONLY) --}}
                <img src="data:image/svg+xml;base64, {{ base64_encode(QrCode::format('svg')->size(70)->generate(route('surat-keluar.pdf-token', $surat->token ?? 'invalid'))) }}" 
                     style="width: 70px; height: 70px;" 
                     alt="QR">
            @endif

            @if($surat->opsi_tanda_tangan == 'manual')
                <div style="font-style: italic; color: #ccc; position: absolute; top: 30%; width: 100%;">
                    (Tanda Tangan Basah)
                </div>
            @endif
        </div>

        <p style="text-decoration: underline; font-weight: bold; margin-bottom: 0;">{{ $schoolProfile->kepala_sekolah ?? $schoolProfile->nama_kepala_sekolah }}</p>
        <p style="margin-top: 0;">NIP. {{ $schoolProfile->nip_kepala_sekolah ?? '-' }}</p>
    </div>

    <div class="clear"></div>

    {{-- DYNAMIC FOOTER --}}
    @if($surat->footer_enabled)
        @php
            $footerText = str_replace(
                ['[NAMA_SEKOLAH]', '[NAMA]', '{token}', '{hari, tanggal, jam}'],
                [$schoolProfile->nama_sekolah, $schoolProfile->nama_sekolah, $surat->token ?? '-', \Carbon\Carbon::now()->translatedFormat('d F Y H:i')],
                $surat->footer_text ?? ''
            );
        @endphp
        <div style="position: fixed; bottom: {{ $surat->spacing['footer'] ?? 0 }}cm; left: 0; right: 0; text-align: left; font-size: 9pt; font-style: italic; border-top: 2px double #000; padding-top: 10px; color: #555; padding-left: {{ ($surat->opsi_tanda_tangan == 'manual' && $surat->status === 'approved') ? '90px' : '0' }};">
            
            {{-- QR Code for Manual Signature (validation after scan) --}}
            @if($surat->opsi_tanda_tangan == 'manual' && $surat->status === 'approved')
                 <img src="data:image/svg+xml;base64, {{ base64_encode(QrCode::format('svg')->size(60)->generate(route('surat-keluar.pdf-token', $surat->token ?? 'invalid'))) }}" 
                     style="position: absolute; left: 10px; top: 10px; width: 60px; height: 60px;" 
                     alt="Validation QR">
            @endif

            {!! nl2br(e($footerText)) !!}
        </div>
    @endif

</body>
</html>
