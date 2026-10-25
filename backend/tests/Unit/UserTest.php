<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
        $this->assertNotSame('plain-text', $user->password);
        $this->assertTrue(Hash::check('plain-text', $user->password));
    }

    public function test_user_hides_password_and_remember_token_when_serialized(): void
    {
        $user = new User([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'plain-text',
        ]);
        $user->setAttribute('remember_token', 'secret-token');

        $serialized = $user->toArray();

        $this->assertArrayNotHasKey('password', $serialized);
        $this->assertArrayNotHasKey('remember_token', $serialized);
    }

    public function test_user_has_owned_budgets_relationship(): void
    {
        $user = new User();

        $relation = $user->ownedBudgets();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $relation);
        $this->assertSame('budgets', $relation->getRelated()->getTable());
    }

    public function test_user_has_budgets_relationship(): void
    {
        $user = new User();

        $relation = $user->budgets();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsToMany::class, $relation);
    }

    public function test_user_has_transactions_relationship(): void
    {
        $user = new User();

        $relation = $user->transactions();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $relation);
    }
}
