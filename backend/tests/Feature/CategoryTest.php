<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_categories(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200);
        $response->assertJsonCount(26); // 3 created + 23 seeded
    }

    public function test_user_can_create_category(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/categories', [
            'name' => 'Entertainment',
            'icon' => '🎬',
            'color' => '#8b5cf6',
            'type' => 'expense',
        ]);

        $response->assertStatus(201);
        $response->assertJson([
            'name' => 'Entertainment',
            'type' => 'expense',
        ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Entertainment',
            'type' => 'expense',
        ]);
    }

    public function test_category_requires_type_to_be_income_or_expense(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/categories', [
            'name' => 'Bad Category',
            'type' => 'invalid',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['type']);
    }

    public function test_user_can_view_category(): void
    {
        $category = Category::factory()->create();
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/categories/' . $category->id);

        $response->assertStatus(200);
        $response->assertJson(['id' => $category->id, 'name' => $category->name]);
    }

    public function test_user_can_update_category(): void
    {
        $category = Category::factory()->create(['name' => 'Old']);
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/categories/' . $category->id, [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['name' => 'New Name']);
    }

    public function test_user_can_delete_category(): void
    {
        $category = Category::factory()->create();
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/categories/' . $category->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
