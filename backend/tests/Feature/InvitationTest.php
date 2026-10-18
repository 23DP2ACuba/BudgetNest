<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Budget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InvitationTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_invite_member_to_budget(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $friend = User::factory()->create(['email' => 'friend@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/budgets/' . $budget->id . '/invite', [
            'email' => 'friend@example.com',
            'role' => 'viewer',
        ]);

        $response->assertStatus(201);
        $response->assertJson(['message' => 'Invitation sent successfully']);

        $this->assertDatabaseHas('budget_user', [
            'budget_id' => $budget->id,
            'user_id' => $friend->id,
            'role' => 'viewer',
        ]);
    }

    public function test_invite_requires_valid_email_and_role(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/budgets/' . $budget->id . '/invite', [
            'email' => 'not-a-email',
            'role' => 'invalid-role',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'role']);
    }

    public function test_invite_requires_invited_user_to_exist(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/budgets/' . $budget->id . '/invite', [
            'email' => 'nonexistent@example.com',
            'role' => 'viewer',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_cannot_invite_already_member(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $friend = User::factory()->create(['email' => 'friend@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        // Directly insert into pivot to ensure status is persisted
        \Illuminate\Support\Facades\DB::table('budget_user')->insert([
            'budget_id' => $budget->id,
            'user_id' => $friend->id,
            'role' => 'viewer',
            'status' => 'accepted',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/budgets/' . $budget->id . '/invite', [
            'email' => 'friend@example.com',
            'role' => 'editor',
        ]);

        $response->assertStatus(400);
        $response->assertJson(['message' => 'User is already a member']);
    }

    public function test_non_owner_cannot_invite(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $member = User::factory()->create(['email' => 'member@example.com']);
        $friend = User::factory()->create(['email' => 'friend@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        $budget->users()->attach($member->id, ['role' => 'viewer']);
        Sanctum::actingAs($member);

        $response = $this->postJson('/api/budgets/' . $budget->id . '/invite', [
            'email' => 'friend@example.com',
            'role' => 'viewer',
        ]);

        $response->assertStatus(403);
    }

    public function test_owner_can_remove_member(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $member = User::factory()->create(['email' => 'member@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        $budget->users()->attach($member->id, ['role' => 'viewer']);
        Sanctum::actingAs($owner);

        $response = $this->deleteJson('/api/budgets/' . $budget->id . '/members/' . $member->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('budget_user', [
            'budget_id' => $budget->id,
            'user_id' => $member->id,
        ]);
    }

    public function test_owner_cannot_remove_self(): void
    {
        $owner = User::factory()->create(['email' => 'owner@example.com']);
        $budget = Budget::factory()->create(['created_by' => $owner->id]);
        $budget->users()->attach($owner->id, ['role' => 'owner']);
        Sanctum::actingAs($owner);

        $response = $this->deleteJson('/api/budgets/' . $budget->id . '/members/' . $owner->id);

        $response->assertStatus(400);
        $response->assertJson(['message' => 'Cannot remove budget creator']);
    }
}
