<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_delete_their_account_and_owned_data(): void
    {
        $user = User::factory()->create(['password' => 'current-password']);
        Sanctum::actingAs($user);

        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        $transaction = Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
        $token = $user->createToken('test-token')->accessToken;

        $response = $this->deleteJson('/api/auth/profile', [
            'password' => 'current-password',
        ]);

        $response->assertOk()
            ->assertJson(['message' => 'Account deleted successfully']);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->id]);
    }

    public function test_account_deletion_requires_the_correct_password(): void
    {
        $user = User::factory()->create(['password' => 'current-password']);
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/auth/profile', [
            'password' => 'incorrect-password',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_unauthenticated_user_cannot_delete_an_account(): void
    {
        $response = $this->deleteJson('/api/auth/profile', [
            'password' => 'current-password',
        ]);

        $response->assertUnauthorized();
    }

    public function test_last_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'password' => 'current-password',
        ]);
        Sanctum::actingAs($admin);

        $response = $this->deleteJson('/api/auth/profile', [
            'password' => 'current-password',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['account']);

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_delete_their_account_if_another_admin_remains(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'password' => 'current-password',
        ]);
        $remainingAdmin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $response = $this->deleteJson('/api/auth/profile', [
            'password' => 'current-password',
        ]);

        $response->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $admin->id]);
        $this->assertDatabaseHas('users', ['id' => $remainingAdmin->id]);
    }

    public function test_deleting_an_inviter_preserves_the_invited_users_budget_membership(): void
    {
        $inviter = User::factory()->create(['password' => 'current-password']);
        $member = User::factory()->create();
        $budgetOwner = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $budgetOwner->id]);
        $budget->users()->attach($member->id, [
            'role' => 'viewer',
            'status' => 'accepted',
            'invited_by' => $inviter->id,
        ]);
        Sanctum::actingAs($inviter);

        $response = $this->deleteJson('/api/auth/profile', [
            'password' => 'current-password',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('budget_user', [
            'budget_id' => $budget->id,
            'user_id' => $member->id,
            'invited_by' => null,
        ]);
        $this->assertDatabaseHas('budgets', ['id' => $budget->id]);
    }
}
