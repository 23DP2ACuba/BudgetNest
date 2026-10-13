<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Expense Categories
            ['name' => 'Food & Dining', 'icon' => '🍽️', 'color' => '#ef4444', 'type' => 'expense'],
            ['name' => 'Transportation', 'icon' => '🚗', 'color' => '#3b82f6', 'type' => 'expense'],
            ['name' => 'Shopping', 'icon' => '🛍️', 'color' => '#ec4899', 'type' => 'expense'],
            ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#8b5cf6', 'type' => 'expense'],
            ['name' => 'Bills & Utilities', 'icon' => '💡', 'color' => '#f59e0b', 'type' => 'expense'],
            ['name' => 'Healthcare', 'icon' => '🏥', 'color' => '#10b981', 'type' => 'expense'],
            ['name' => 'Education', 'icon' => '📚', 'color' => '#6366f1', 'type' => 'expense'],
            ['name' => 'Travel', 'icon' => '✈️', 'color' => '#14b8a6', 'type' => 'expense'],
            ['name' => 'Housing', 'icon' => '🏠', 'color' => '#f97316', 'type' => 'expense'],
            ['name' => 'Personal Care', 'icon' => '💅', 'color' => '#a855f7', 'type' => 'expense'],
            ['name' => 'Fitness', 'icon' => '💪', 'color' => '#22c55e', 'type' => 'expense'],
            ['name' => 'Gifts & Donations', 'icon' => '🎁', 'color' => '#e11d48', 'type' => 'expense'],
            ['name' => 'Insurance', 'icon' => '🛡️', 'color' => '#0891b2', 'type' => 'expense'],
            ['name' => 'Taxes', 'icon' => '📊', 'color' => '#dc2626', 'type' => 'expense'],
            ['name' => 'Other Expenses', 'icon' => '📦', 'color' => '#6b7280', 'type' => 'expense'],
            
            // Income Categories
            ['name' => 'Salary', 'icon' => '💰', 'color' => '#059669', 'type' => 'income'],
            ['name' => 'Freelance', 'icon' => '💼', 'color' => '#0284c7', 'type' => 'income'],
            ['name' => 'Business', 'icon' => '🏢', 'color' => '#7c3aed', 'type' => 'income'],
            ['name' => 'Investments', 'icon' => '📈', 'color' => '#16a34a', 'type' => 'income'],
            ['name' => 'Rental Income', 'icon' => '🏘️', 'color' => '#ea580c', 'type' => 'income'],
            ['name' => 'Gifts Received', 'icon' => '🎉', 'color' => '#db2777', 'type' => 'income'],
            ['name' => 'Refunds', 'icon' => '↩️', 'color' => '#0891b2', 'type' => 'income'],
            ['name' => 'Other Income', 'icon' => '💵', 'color' => '#10b981', 'type' => 'income'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name'], 'type' => $category['type']],
                $category
            );
        }
    }
}
