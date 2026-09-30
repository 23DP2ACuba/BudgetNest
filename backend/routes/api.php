<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // Category routes
    Route::apiResource('categories', CategoryController::class);
    
    // Budget routes
    Route::apiResource('budgets', BudgetController::class);
    Route::post('/budgets/{budget}/invite', [InvitationController::class, 'invite']);
    Route::delete('/budgets/{budget}/members/{user}', [BudgetController::class, 'removeMember']);
    
    // Transaction routes
    Route::apiResource('transactions', TransactionController::class);
    Route::get('/budgets/{budget}/transactions', [TransactionController::class, 'byBudget']);
    
    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
    });
});
