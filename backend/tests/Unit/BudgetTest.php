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
