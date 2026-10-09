<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BudgetUser extends Pivot
{
    protected $fillable = [
        'budget_id',
        'user_id',
        'role',
    ];

    /**
     * The budget
     */
    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * The user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
