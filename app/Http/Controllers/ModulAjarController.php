<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ModulAjarController extends Controller
{
    public function index()
    {
        return Inertia::render('ModulAjar/Index');
    }

    public function search(Request $request)
    {
        // Simulasi AI Search
        // Di aplikasi nyata, ini akan memanggil OpenAI / Gemini API
        $query = $request->input('query');
        
        // Mock results
        $results = [
            [
                'title' => 'Modul Ajar Matematika Fase E - Logaritma',
                'summary' => 'Modul ini dirancang dengan pendekatan PBL (Problem Based Learning) untuk membantu siswa memahami konsep dasar logaritma melalui masalah kontekstual.',
                'tags' => ['Matematika', 'Fase E', 'PBL'],
                'author' => 'AI Generated',
                'relevance' => 98
            ],
            [
                'title' => 'RPP Diferensiasi Bahasa Indonesia - Teks Eksplanasi',
                'summary' => 'Rencana ajar yang memfasilitasi gaya belajar visual dan auditori dalam menganalisis struktur teks eksplanasi kompleks.',
                'tags' => ['B. Indonesia', 'Fase F', 'Diferensiasi'],
                'author' => 'AI Generated',
                'relevance' => 92
            ],
            [
                'title' => 'Projek Penguatan Profil Pelajar Pancasila (P5) - Gaya Hidup Berkelanjutan',
                'summary' => 'Panduan lengkap koordinator projek untuk tema Gaya Hidup Berkelanjutan dengan fokus pengelolaan sampah plastik.',
                'tags' => ['P5', 'Limbah', 'Project'],
                'author' => 'AI Generated',
                'relevance' => 88
            ]
        ];

        return response()->json([
            'results' => $results,
            'ai_analysis' => "Berdasarkan kata kunci '$query', saya menyarankan materi yang fokus pada pendekatan praktis dan diferensiasi pembelajaran sesuai Kurikulum Merdeka."
        ]);
    }
}
