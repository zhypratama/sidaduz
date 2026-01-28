<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form;
use App\Models\FormResponse;
use App\Models\FormResponseValue;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PublicFormController extends Controller
{
    public function show($slug)
    {
        $form = Form::where('slug', $slug)
            ->where('is_active', true)
            ->with(['fields' => function ($q) {
                $q->orderBy('order');
            }])
            ->firstOrFail();

        // Check Date Constraints
        $now = now();
        if ($form->start_at && $now->lessThan($form->start_at)) {
            return Inertia::render('Public/FormError', [
                'title' => 'Formulir Belum Dibuka',
                'message' => 'Silakan kembali lagi pada ' . $form->start_at->translatedFormat('d F Y H:i')
            ]);
        }
        if ($form->end_at && $now->greaterThan($form->end_at)) {
            return Inertia::render('Public/FormError', [
                'title' => 'Formulir Ditutup',
                'message' => 'Batas waktu pengisian formulir ini telah berakhir.'
            ]);
        }

        return Inertia::render('Public/FormView', [
            'form' => $form
        ]);
    }

    public function submit(Request $request, $slug)
    {
        $form = Form::where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        // Simple Validation based on required fields
        $rules = [
            'consent' => 'required|accepted',
        ];
        foreach ($form->fields as $field) {
            if ($field->is_required) {
                $rules['field_' . $field->id] = 'required';
            }
        }
        $request->validate($rules);

        DB::beginTransaction();
        try {
            $response = FormResponse::create([
                'form_id' => $form->id,
                'user_id' => auth()->id(), // null if guest
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            foreach ($form->fields as $field) {
                $inputKey = 'field_' . $field->id;
                $value = null;

                if ($request->hasFile($inputKey) && $field->type === 'file') {
                    $file = $request->file($inputKey);
                    $path = $file->store('form_uploads/' . $form->id, 'public');
                    $value = $path;
                } else {
                    $value = $request->input($inputKey);
                    if (is_array($value)) {
                        $value = json_encode($value);
                    }
                }

                if ($value) {
                    FormResponseValue::create([
                        'form_response_id' => $response->id,
                        'form_field_id' => $field->id,
                        'value' => $value,
                    ]);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Formulir berhasil dikirim!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal mengirim formulir: ' . $e->getMessage());
        }
    }
}
