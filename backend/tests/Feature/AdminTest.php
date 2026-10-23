<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_users',
            'total_budgets',
            'total_transactions',
            'recent_users',
            'recent_budgets',
        ]);
    }

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        User::factory()->count(5)->create();

        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(200);
        $count = count($response->json('data'));
        $this->assertGreaterThanOrEqual(6, $count);
    }

    public function test_admin_can_search_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        User::factory()->create(['name' => 'Alice Smith', 'email' => 'alice@example.com']);
        User::factory()->create(['name' => 'Bob Jones', 'email' => 'bob@example.com']);

        $response = $this->getJson('/api/admin/users?search=Alice');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $this->assertSame('Alice Smith', $response->json('data.0.name'));
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(403);
    }
}
