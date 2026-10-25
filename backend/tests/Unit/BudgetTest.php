<?php

namespace Tests\Unit;

use App\Models\Budget;
use App\Models\Transaction;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    public function test_budget_has_fillable_fields(): void
    {
        $budget = new Budget();

        $this->assertContains('name', $budget->getFillable());
        $this->assertContains('description', $budget->getFillable());
        $this->assertContains('total_amount', $budget->getFillable());
        $this->assertContains('start_date', $budget->getFillable());
        $this->assertContains('end_date', $budget->getFillable());
        $this->assertContains('created_by', $budget->getFillable());
    }

    public function test_budget_casts_total_amount_as_decimal(): void
    {
        $budget = new Budget(['total_amount' => '100.00']);

        $this->assertSame('decimal:2', $budget->getCasts()['total_amount'] ?? null);
        $this->assertSame('100.00', $budget->total_amount);
    }

    public function test_budget_casts_dates_to_date_objects(): void
    {
        $budget = new Budget([
            'start_date' => '2026-01-15',
            'end_date' => '2026-02-15',
        ]);

        $this->assertSame('2026-01-15', $budget->start_date->format('Y-m-d'));
        $this->assertSame('2026-02-15', $budget->end_date->format('Y-m-d'));
    }

    public function test_budget_has_creator_relationship(): void
    {
        $budget = new Budget();

        $relation = $budget->creator();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class, $relation);
    }

    public function test_budget_has_users_relationship(): void
    {
        $budget = new Budget();

        $relation = $budget->users();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsToMany::class, $relation);
    }

    public function test_budget_has_transactions_relationship(): void
    {
        $budget = new Budget();

        $relation = $budget->transactions();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $relation);
        $this->assertSame('transactions', $relation->getRelated()->getTable());
    }
}
