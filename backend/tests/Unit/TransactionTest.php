<?php

namespace Tests\Unit;

use App\Models\Transaction;
use App\Models\Budget;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    public function test_transaction_has_fillable_fields(): void
    {
        $transaction = new Transaction();

        $this->assertContains('budget_id', $transaction->getFillable());
        $this->assertContains('category_id', $transaction->getFillable());
        $this->assertContains('user_id', $transaction->getFillable());
        $this->assertContains('type', $transaction->getFillable());
        $this->assertContains('amount', $transaction->getFillable());
        $this->assertContains('description', $transaction->getFillable());
        $this->assertContains('transaction_date', $transaction->getFillable());
    }

    public function test_transaction_casts_amount_as_decimal(): void
    {
        $transaction = new Transaction(['amount' => '50.00']);

        $this->assertSame('decimal:2', $transaction->getCasts()['amount'] ?? null);
        $this->assertSame('50.00', $transaction->amount);
    }

    public function test_transaction_casts_transaction_date_to_date_object(): void
    {
        $transaction = new Transaction(['transaction_date' => '2026-03-10']);

        $this->assertSame('2026-03-10', $transaction->transaction_date->format('Y-m-d'));
    }

    public function test_transaction_has_budget_relationship(): void
    {
        $transaction = new Transaction();

        $relation = $transaction->budget();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class, $relation);
        $this->assertInstanceOf(Budget::class, $relation->getRelated());
    }

    public function test_transaction_has_category_relationship(): void
    {
        $transaction = new Transaction();

        $relation = $transaction->category();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class, $relation);
    }

    public function test_transaction_has_user_relationship(): void
    {
        $transaction = new Transaction();

        $relation = $transaction->user();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class, $relation);
    }
}
