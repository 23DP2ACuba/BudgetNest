<?php

namespace Database\Factories;

use App\Models\Budget;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Budget>
 */
class BudgetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->word() . ' Budget',
            'description' => fake()->sentence(),
            'total_amount' => fake()->randomFloat(2, 100, 10000),
            'start_date' => now()->subMonth()->format('Y-m-d'),
            'end_date' => now()->addMonth()->format('Y-m-d'),
            'created_by' => 1,
        ];
    }
}
