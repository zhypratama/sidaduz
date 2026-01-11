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
        $now = now();

        \Illuminate\Support\Facades\DB::table('app_settings')->updateOrInsert(
            ['key' => 'maintenance_mode'],
            [
                'group' => 'general',
                'label' => 'Mode Maintenance',
                'value' => '0',
                'type' => 'boolean',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        \Illuminate\Support\Facades\DB::table('app_settings')->updateOrInsert(
            ['key' => 'maintenance_message'],
            [
                'group' => 'general',
                'label' => 'Pesan Maintenance',
                'value' => 'Sistem sedang dalam perbaikan berkala. Mohon kembali lagi nanti.',
                'type' => 'text',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        \Illuminate\Support\Facades\DB::table('app_settings')->updateOrInsert(
            ['key' => 'maintenance_end_time'],
            [
                'group' => 'general',
                'label' => 'Estimasi Selesai',
                'value' => null,
                'type' => 'datetime',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
