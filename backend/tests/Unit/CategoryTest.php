<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Transaction;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    public function test_category_has_fillable_fields(): void
    {
        $category = new Category();

        $this->assertContains('name', $category->getFillable());
        $this->assertContains('icon', $category->getFillable());
        $this->assertContains('color', $category->getFillable());
        $this->assertContains('type', $category->getFillable());
    }

    public function test_category_has_transactions_relationship(): void
    {
        $category = new Category();

        $relation = $category->transactions();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $relation);
    }
}
