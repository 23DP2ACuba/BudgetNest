<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Budgets owned by the user
     */
    public function ownedBudgets()
    {
        return $this->hasMany(Budget::class, 'created_by');
    }

    /**
     * Budgets the user is a member of
     */
    public function budgets()
    {
        return $this->belongsToMany(Budget::class, 'budget_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Transactions created by the user
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
