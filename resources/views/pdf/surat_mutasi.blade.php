<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Surat Keterangan Pindah Sekolah</title>
    <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 3px double black; padding-bottom: 10px; }
        .header img { max-height: 80px; position: absolute; left: 0; top: 0; }
        .title { font-weight: bold; font-size: 14pt; text-decoration: underline; text-align: center; margin-bottom: 5px; }
        .subtitle { text-align: center; margin-bottom: 30px; }
        .content { margin-left: 20px; margin-right: 20px; text-align: justify; }
        .table-data { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .table-data td { padding: 5px; vertical-align: top; }
        .footer { margin-top: 50px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        @if($school->logo)
            <img src="{{ public_path('storage/' . $school->logo) }}" alt="Logo">
        @endif
        <div style="font-weight: bold; font-size: 16pt;">{{ strtoupper($school->nama_sekolah) }}</div>
        <div>{{ $school->alamat }}</div>
        <div>Telp: {{ $school->no_telp_sekolah }} | Email: {{ $school->email }}</div>
    </div>

    <div class="title">SURAT KETERANGAN PINDAH SEKOLAH</div>
    <div class="subtitle">Nomor: {{ $no_surat }}</div>

    <div class="content">
        <p>Yang bertanda tangan di bawah ini Kepala {{ $school->nama_sekolah }}, menerangkan bahwa:</p>

        <table class="table-data">
            <tr>
                <td width="30%">Nama Lengkap</td>
                <td width="2%">:</td>
                <td><strong>{{ $student->nama_lengkap }}</strong></td>
            </tr>
            <tr>
                <td>NIS / NISN</td>
                <td>:</td>
                <td>{{ $student->nis }} / {{ $student->nisn }}</td>
            </tr>
            <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>:</td>
                <td>{{ $student->tempat_lahir }}, {{ $student->tanggal_lahir ? $student->tanggal_lahir->translatedFormat('d F Y') : '-' }}</td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>{{ $student->jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
            </tr>
            <tr>
                <td>Kelas Terakhir</td>
                <td>:</td>
                <td>{{ $student->kelas_temp }}</td>
            </tr>
        </table>

        <p>Telah mengajukan permohonan pindah sekolah (mutasi) dari {{ $school->nama_sekolah }}.</p>
        
        <p>Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
    </div>

    <div class="footer">
        <div>{{ $school->kabupaten ?? 'Bogor' }}, {{ $date }}</div>
        <div>Kepala Sekolah,</div>
        <br><br><br><br>
        <div><strong>{{ $school->kepala_sekolah }}</strong></div>
        <div>NIP. {{ $school->nip_kepala_sekolah }}</div>
    </div>
</body>
</html>
