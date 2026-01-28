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
        Schema::create('security_logs', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // sql_injection, xss, brute_force, unauthorized_access, etc
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable(); // GET, POST, etc
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('payload')->nullable(); // JSON of suspicious data
            $table->text('description');
            $table->boolean('blocked')->default(false);
            $table->timestamp('detected_at')->useCurrent();
            $table->timestamps();
            
            $table->index(['type', 'severity']);
            $table->index('ip_address');
            $table->index('detected_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_logs');
    }
};
