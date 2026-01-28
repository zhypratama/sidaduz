<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicInventoryController extends Controller
{
    public function index()
    {
        $facilities = Inventory::where('is_public', true)
            ->latest()
            ->get(); // Or paginate

        return Inertia::render('Public/Facilities', [
            'facilities' => $facilities
        ]);
    }
}
