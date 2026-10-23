<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'budget_id' => 1,
            'category_id' => 1,
            'user_id' => 1,
            'type' => fake()->randomElement(['income', 'expense']),
            'amount' => fake()->randomFloat(2, 1, 1000),
            'description' => fake()->sentence(),
            'transaction_date' => fake()->date(),
        ];
    }
}
