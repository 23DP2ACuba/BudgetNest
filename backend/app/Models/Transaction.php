<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'category_id',
        'user_id',
        'type',
        'amount',
        'description',
        'transaction_date',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * The budget this transaction belongs to
     */
    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * The category of this transaction
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * The user who created this transaction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
