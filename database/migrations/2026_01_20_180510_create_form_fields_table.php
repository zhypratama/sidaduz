<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('form_id')->constrained('forms')->cascadeOnDelete();
            $table->string('type'); // text, textarea, number, date, time, select, checkbox, radio, file
            $table->string('label');
            $table->text('description')->nullable();
            $table->json('options')->nullable(); // For select, radio, checkbox
            $table->boolean('is_required')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
