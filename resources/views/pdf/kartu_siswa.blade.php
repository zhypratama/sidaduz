<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Kartu Pelajar - Premium</title>
    <style>
        @page {
            margin: 10mm;
            size: A4 portrait;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
            -webkit-print-color-adjust: exact; 
        }
        .card-wrapper {
            float: left;
            margin: 0 5mm 5mm 0;
        }
        
        /* EXACT DIMENSIONS FROM REACT: Aspect Ratio 1.58 */
        .card {
            width: 85.6mm;
            height: 53.98mm;
            position: relative;
            border: 1px solid #e5e7eb; /* gray-200 */
            border-radius: 3mm;
            overflow: hidden;
            background: #fff;
            box-sizing: border-box;
            page-break-inside: avoid;
        }

        /* --- FRONT SIDE --- */
        .front-header {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 30%;
            background-color: #1e3a8a;
            border-bottom: 2px solid #fbbf24;
            box-sizing: border-box;
            z-index: 10;
        }
        
        .header-content {
            width: 100%;
            height: 100%;
            padding: 0 4mm;
            display: table;
        }
        .header-logo {
            display: table-cell;
            vertical-align: middle;
            width: 13mm; 
        }
        .logo-circle {
            width: 11mm;
            height: 11mm;
            background: #fff;
            border-radius: 50%;
            text-align: center;
            /* Vertical Center Hack for PDF */
            line-height: 11mm; 
            margin-right: 2mm;
        }
        .logo-circle img {
            max-width: 80%;
            max-height: 80%;
            vertical-align: middle;
            display: inline-block;
        }
        .header-text {
            display: table-cell;
            vertical-align: middle;
            padding-left: 1mm;
            color: #fff;
        }
        .school-name {
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            line-height: 1.1;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
            margin-bottom: 1px;
        }
        .school-address {
            font-size: 5pt;
            color: #dbeafe; /* Light Blue 100 */
            line-height: 1.1;
            margin-bottom: 2px;
            max-width: 65mm;
        }
        .card-label {
            font-size: 5pt;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.9;
            font-weight: 600;
        }

        .front-body {
            position: absolute;
            top: 30%;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 4mm;
        }
        
        /* ... existing styles ... */
    </style>
</head>
<body>
    @foreach($students as $student)
        {{-- FRONT SIDE --}}
        <div class="card-wrapper">
            <div class="card">
                <div class="front-header">
                    <div class="header-content">
                        <div class="header-logo">
                            <div class="logo-circle">
                               @if($school->logo && file_exists(public_path('storage/' . $school->logo)))
                                    <img src="{{ public_path('storage/' . $school->logo) }}">
                               @else
                                    <img src="{{ public_path('images/logo-sekolah.png') }}" onerror="this.style.display='none'">
                               @endif
                            </div>
                        </div>
                        <div class="header-text">
                            <div class="school-name">{{ $school->nama_sekolah ?? 'SEKOLAH' }}</div>
                            <div class="school-address">
                                {{ $school->alamat ?? '' }}
                                {{ $school->kelurahan ? ', ' . $school->kelurahan : '' }}
                                {{ $school->kecamatan ? ', ' . $school->kecamatan : '' }}
                                {{ $school->kota ? ', ' . $school->kota : '' }}
                            </div>
                            <div class="card-label">Kartu Tanda Siswa</div>
                        </div>
                    </div>
                </div>

                <div class="front-body">
                    <table class="content-table">
                        <tr>
                            <td class="col-photo">
                                <div class="photo-box">
                                    @if($student->foto && file_exists(public_path('storage/' . $student->foto)))
                                        <img src="{{ public_path('storage/' . $student->foto) }}">
                                    @else
                                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:20pt; font-weight:bold;">?</div>
                                    @endif
                                </div>
                            </td>
                            <td class="col-info">
                                <div class="student-name-box">
                                    <div class="student-name">{{ Str::limit($student->nama_lengkap, 25) }}</div>
                                </div>
                                <table class="details-table">
                                    <tr>
                                        <td class="lbl">NISN/NIS</td>
                                        <td class="sep">:</td>
                                        <td class="val">{{ $student->nisn ?? '-' }} / {{ $student->nipd ?? '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="lbl">Kelas</td>
                                        <td class="sep">:</td>
                                        <td class="val">{{ $student->kelas->nama ?? '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="lbl">TTL</td>
                                        <td class="sep">:</td>
                                        <td class="val">
                                            {{ $student->tempat_lahir }}, {{ \Carbon\Carbon::parse($student->tanggal_lahir)->locale('id')->translatedFormat('d M Y') }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="lbl">Berlaku</td>
                                        <td class="sep">:</td>
                                        <td class="val">Selama menjadi siswa</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="front-footer">
                    <div class="print-label">Dicetak pada</div>
                    <div class="print-date">{{ \Carbon\Carbon::now()->locale('id')->translatedFormat('d M Y') }}</div>
                </div>
            </div>
        </div>

        {{-- BACK SIDE --}}
        <div class="card-wrapper">
            <div class="card back-bg">
                {{-- Background Watermark --}}
                @if($school->logo && file_exists(public_path('storage/' . $school->logo)))
                    <img src="{{ public_path('storage/' . $school->logo) }}" class="watermark">
                @endif
                
                <div class="table back-content">
                    {{-- Row wrapper for table-cell display --}}
                    <div style="display: table-row;">
                        <div class="col-qr">
                            <div class="qr-frame">
                                @php
                                    // Match React: Priority NISN > NIPD > ID
                                    $qrValue = $student->nisn ?? $student->nipd ?? $student->id;
                                    $qrCode = base64_encode(SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')->size(64)->errorCorrection('H')->generate($qrValue));
                                @endphp
                                <img src="data:image/svg+xml;base64, {!! $qrCode !!} " style="width:18mm; height:18mm;">
                            </div>
                            <div class="qr-text">{{ $student->nipd }}</div>
                        </div>

                        <div class="col-right">
                            <div class="rules-card">
                                <div class="rules-head">Tata Tertib Kartu</div>
                                <ul class="rules-list">
                                    <li>Kartu identitas resmi siswa.</li>
                                    <li>Wajib dibawa ke sekolah.</li>
                                    <li>Dilarang meminjamkan ke orang lain.</li>
                                    <li>Hilang/rusak lapor Tata Usaha.</li>
                                </ul>
                            </div>

                            <div class="sign-area">
                                <div class="sign-date">{{ $school->kota ?? 'Bogor' }}, {{ date('Y') }}</div>
                                
                                <div class="sign-img-box">
                                     {{-- Logic for Signature Image --}}
                                     @if(!empty($school->ttd_stempel_gabungan) && file_exists(public_path('storage/' . $school->ttd_stempel_gabungan)))
                                         <img src="{{ public_path('storage/' . $school->ttd_stempel_gabungan) }}" style="height: 100%; width: auto; max-width: 100%; object-fit: contain;">
                                     @else
                                         {{-- Manual Stack --}}
                                         <div style="position: relative; width: 100%; height: 100%;">
                                             @if(!empty($school->stempel) && file_exists(public_path('storage/' . $school->stempel)))
                                                <img src="{{ public_path('storage/' . $school->stempel) }}" style="position: absolute; right: 8mm; top: 0; height: 12mm; opacity: 0.8; transform: rotate(-5deg);">
                                             @endif
                                             @if(!empty($school->ttd_kepala_sekolah) && file_exists(public_path('storage/' . $school->ttd_kepala_sekolah)))
                                                <img src="{{ public_path('storage/' . $school->ttd_kepala_sekolah) }}" style="position: absolute; right: 0; top: 2mm; height: 10mm;">
                                             @endif
                                         </div>
                                     @endif
                                </div>
                                <div style="border-bottom: 1px solid #1f2937; width: 25mm; float: right; margin-right: 2mm; margin-bottom: 0.5mm;"></div>
                                <div style="clear: both;"></div>
                                <div class="sign-label">KEPALA SEKOLAH</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {{-- Force Page Break every 5 pairs (10 cards) or as needed --}}
        @if($loop->iteration % 5 == 0)
            <div style="clear:both; page-break-after:always;"></div>
        @endif
    @endforeach
</body>
</html>
