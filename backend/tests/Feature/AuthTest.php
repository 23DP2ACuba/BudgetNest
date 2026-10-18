<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'user' => ['id', 'name', 'email', 'role'],
            'token',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'user',
        ]);
    }

    public function test_registration_requires_password_confirmation(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertSessionHasErrors('password_confirmation');
    }

    public function test_registration_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertSessionHasErrors('email');
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create(['password' => 'password123']);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user' => ['id', 'email'],
            'token',
        ]);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'test@example.com', 'password' => 'password123']);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
        $response->assertSessionHasErrors('email');
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Logged out successfully']);
    }

    public function test_authenticated_user_can_get_own_profile(): void
    {
        $user = User::factory()->create(['name' => 'Me']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(200);
        $response->assertJson(['name' => 'Me', 'email' => $user->email]);
    }

    public function test_unauthenticated_user_cannot_get_profile(): void
    {
        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(401);
    }
}
