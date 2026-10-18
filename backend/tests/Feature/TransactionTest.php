<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_transactions(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        Transaction::factory()->count(3)->create([
            'user_id' => $user->id,
            'budget_id' => $budget->id,
            'category_id' => $category->id,
        ]);

        $response = $this->getJson('/api/transactions');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_user_can_create_transaction(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create(['type' => 'expense']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/transactions', [
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '45.50',
            'description' => 'Groceries',
            'transaction_date' => '2026-07-15',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'type' => 'expense',
            'amount' => '45.50',
            'description' => 'Groceries',
        ]);

        $this->assertDatabaseHas('transactions', [
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
            'amount' => '45.50',
        ]);
    }

    public function test_transaction_requires_valid_amount(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/transactions', [
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => '0',
            'transaction_date' => '2026-07-15',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['amount']);
    }

    public function test_user_can_view_transaction(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        $transaction = Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/transactions/' . $transaction->id);

        $response->assertStatus(200);
        $response->assertJson(['id' => $transaction->id, 'type' => $transaction->type]);
    }

    public function test_user_can_update_own_transaction(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        $transaction = Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
            'amount' => '10.00',
        ]);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/transactions/' . $transaction->id, [
            'amount' => '20.00',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['amount' => '20.00']);
    }

    public function test_user_cannot_update_others_transaction(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $category = Category::factory()->create();
        $transaction = Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $owner->id,
        ]);
        Sanctum::actingAs($stranger);

        $response = $this->putJson('/api/transactions/' . $transaction->id, [
            'amount' => '999.00',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_transaction(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        $transaction = Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/transactions/' . $transaction->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }

    public function test_can_filter_transactions_by_type(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $category = Category::factory()->create();
        Sanctum::actingAs($user);

        Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
            'type' => 'income',
        ]);
        Transaction::factory()->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
            'type' => 'expense',
        ]);

        $response = $this->getJson('/api/transactions?type=expense');

        $response->assertStatus(200);
        foreach ($response->json('data') as $transaction) {
            $this->assertSame('expense', $transaction['type']);
        }
    }

    public function test_can_list_transactions_for_budget(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        $budget->users()->attach($user->id, ['role' => 'owner']);
        $category = Category::factory()->create();
        Sanctum::actingAs($user);

        Transaction::factory()->count(2)->create([
            'budget_id' => $budget->id,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/budgets/' . $budget->id . '/transactions');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    public function test_user_cannot_access_transactions_of_others_budget(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $category = Category::factory()->create();
        Sanctum::actingAs($stranger);

        $response = $this->getJson('/api/budgets/' . $budget->id . '/transactions');

        $response->assertStatus(403);
    }
}
