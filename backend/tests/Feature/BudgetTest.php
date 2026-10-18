<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Budget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_budgets(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Budget::factory()->count(3)->create(['created_by' => $user->id]);

        $response = $this->getJson('/api/budgets');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_budget(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/budgets', [
            'name' => 'Vacation Budget',
            'description' => 'Summer trip',
            'total_amount' => '2000.00',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-31',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'name' => 'Vacation Budget',
            'total_amount' => '2000.00',
        ]);

        $this->assertDatabaseHas('budgets', [
            'name' => 'Vacation Budget',
            'created_by' => $user->id,
        ]);
    }

    public function test_budget_creation_requires_valid_dates(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/budgets', [
            'name' => 'Bad Budget',
            'total_amount' => '100.00',
            'start_date' => '2026-07-31',
            'end_date' => '2026-07-01',
        ]);

        $response->assertStatus(422);
        $response->assertSessionHasErrors('end_date');
    }

    public function test_user_can_view_own_budget(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/budgets/' . $budget->id);

        $response->assertStatus(200);
        $response->assertJson(['id' => $budget->id, 'name' => $budget->name]);
    }

    public function test_user_cannot_view_others_budget(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        Sanctum::actingAs($stranger);

        $response = $this->getJson('/api/budgets/' . $budget->id);

        $response->assertStatus(403);
    }

    public function test_user_can_update_own_budget(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create([
            'created_by' => $user->id,
            'name' => 'Old Name',
        ]);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/budgets/' . $budget->id, [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['name' => 'New Name']);

        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'name' => 'New Name',
        ]);
    }

    public function test_user_cannot_update_others_budget(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        Sanctum::actingAs($stranger);

        $response = $this->putJson('/api/budgets/' . $budget->id, [
            'name' => 'Hacked Name',
        ]);

        $response->assertStatus(403);
    }

    public function test_only_creator_can_delete_budget(): void
    {
        $user = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/budgets/' . $budget->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }

    public function test_non_creator_cannot_delete_budget(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        Sanctum::actingAs($stranger);

        $response = $this->deleteJson('/api/budgets/' . $budget->id);

        $response->assertStatus(403);
    }
}
