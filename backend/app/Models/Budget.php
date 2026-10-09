<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'total_amount',
        'start_date',
        'end_date',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    /**
     * The user who created the budget
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Users who are members of this budget
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'budget_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Transactions in this budget
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
