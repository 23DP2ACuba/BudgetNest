<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('budget_user', function (Blueprint $table) {
            $table->enum('status', ['pending', 'accepted', 'declined'])->default('accepted')->after('role');
            $table->foreignId('invited_by')->nullable()->constrained('users')->onDelete('cascade')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('budget_user', function (Blueprint $table) {
            $table->dropColumn(['status', 'invited_by']);
        });
    }
};
