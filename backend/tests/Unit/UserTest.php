<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Budget;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_user_has_fillable_fields(): void
    {
        $user = new User();

        $this->assertContains('name', $user->getFillable());
        $this->assertContains('email', $user->getFillable());
        $this->assertContains('password', $user->getFillable());
        $this->assertContains('role', $user->getFillable());
    }

    public function test_user_casts_password_as_hashed(): void
    {
        $user = new User(['password' => 'plain-text']);

        $this->assertSame('hashed', $user->getCasts()['password'] ?? null);
    }

    public function test_user_has_owned_budgets_relationship(): void
    {
        $user = User::factory()->create();

        $this->assertArrayHasKey('ownedBudgets', $user->getRelations() ?? []);
        $relation = $user->ownedBudgets();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $relation);
        $this->assertSame('budgets', $relation->getRelated()->getTable());
    }

    public function test_user_has_budgets_relationship(): void
    {
        $user = User::factory()->create();

        $relation = $user->budgets();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsToMany::class, $relation);
    }

    public function test_user_has_transactions_relationship(): void
    {
        $user = User::factory()->create();

        $relation = $user->transactions();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $relation);
    }
}
