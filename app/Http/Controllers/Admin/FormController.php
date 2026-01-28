<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\FormField;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class FormController extends Controller
{
    public function index()
    {
        $forms = Form::withCount('responses')
            ->orderByRaw('is_active DESC, created_at DESC')
            ->paginate(10);

        return Inertia::render('Admin/Forms/Index', [
            'forms' => $forms
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $slug = Str::slug($request->title) . '-' . Str::random(6);

        $form = Form::create([
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'created_by' => auth()->id(),
            'is_active' => false,
        ]);

        return redirect()->route('forms.edit', $form->id)->with('success', 'Form berhasil dibuat! Silakan atur pertanyaan.');
    }

    public function edit(Form $form)
    {
        $form->load('fields');
        return Inertia::render('Admin/Forms/Builder', [
            'form' => $form
        ]);
    }

    public function update(Request $request, Form $form)
    {
        // 1. Update Form Details
        if ($request->has('settings')) {
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'is_active' => 'boolean',
                'is_public' => 'boolean',
                'start_at' => 'nullable|date',
                'end_at' => 'nullable|date',
            ]);
            
            $form->update($data);
            return back()->with('success', 'Pengaturan form berhasil disimpan.');
        }

        // 2. Update Form Fields (Builder Save)
        if ($request->has('fields')) {
            $fieldsData = $request->input('fields');
            $existingIds = [];

            foreach ($fieldsData as $index => $fieldData) {
                // Check if field has an ID (existing field)
                if (isset($fieldData['id']) && !str_starts_with($fieldData['id'], 'temp_')) {
                    $field = FormField::find($fieldData['id']);
                    if ($field) {
                        $field->update([
                            'type' => $fieldData['type'],
                            'label' => $fieldData['label'],
                            'description' => $fieldData['description'] ?? null,
                            'options' => $fieldData['options'] ?? [],
                            'is_required' => $fieldData['is_required'] ?? false,
                            'section' => $fieldData['section'] ?? null,
                            'logic' => $fieldData['logic'] ?? null,
                            'order' => $index,
                        ]);
                        $existingIds[] = $field->id;
                    }
                } else {
                    // Create New Field
                    $newField = FormField::create([
                        'form_id' => $form->id,
                        'type' => $fieldData['type'],
                        'label' => $fieldData['label'],
                        'description' => $fieldData['description'] ?? null,
                        'options' => $fieldData['options'] ?? [],
                        'is_required' => $fieldData['is_required'] ?? false,
                        'section' => $fieldData['section'] ?? null,
                        'logic' => $fieldData['logic'] ?? null,
                        'order' => $index,
                    ]);
                    $existingIds[] = $newField->id;
                }
            }

            // Delete fields that are removed from the builder
            $form->fields()->whereNotIn('id', $existingIds)->delete();

            return back()->with('success', 'Struktur form berhasil disimpan.');
        }

        return back();
    }

    public function destroy(Form $form)
    {
        $form->delete();
        return redirect()->route('forms.index')->with('success', 'Form berhasil dihapus.');
    }
    
    public function show(Form $form)
    {
        // View Responses
        $form->load(['fields', 'responses.values']);
        
        $responses = $form->responses()->with('values')->latest()->paginate(20);

        return Inertia::render('Admin/Forms/Responses', [
            'form' => $form,
            'responses' => $responses
        ]);
    }
}
