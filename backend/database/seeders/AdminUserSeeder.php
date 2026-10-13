<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user (idempotent for container restarts)
        User::firstOrCreate(
            ['email' => 'admin@budgetnest.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create sample regular users
        User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'jane@example.com'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
    }
}
