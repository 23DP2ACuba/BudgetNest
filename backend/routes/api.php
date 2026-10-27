<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [ProfileController::class, 'update']);
    Route::put('/auth/password', [ProfileController::class, 'updatePassword']);
    Route::delete('/auth/profile', [ProfileController::class, 'destroy']);
    
    // Category routes
    Route::apiResource('categories', CategoryController::class);
    
    // Budget routes
    Route::apiResource('budgets', BudgetController::class);
    Route::post('/budgets/{budget}/invite', [InvitationController::class, 'invite']);
    Route::delete('/budgets/{budget}/members/{user}', [BudgetController::class, 'removeMember']);
    Route::delete('/budgets/{budget}/leave', [BudgetController::class, 'leave']);
    
    // Invitation routes
    Route::get('/invitations', [InvitationController::class, 'myInvitations']);
    Route::post('/invitations/{budget}/accept', [InvitationController::class, 'accept']);
    Route::post('/invitations/{budget}/decline', [InvitationController::class, 'decline']);
    
    // Transaction routes
    Route::apiResource('transactions', TransactionController::class);
    Route::get('/budgets/{budget}/transactions', [TransactionController::class, 'byBudget']);
    
    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
    });
});
