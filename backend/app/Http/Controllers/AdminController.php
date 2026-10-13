<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_budgets' => Budget::count(),
            'total_transactions' => Transaction::count(),
            'recent_users' => User::latest()->take(5)->get(),
            'recent_budgets' => Budget::with('creator')->latest()->take(5)->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Get all users
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        $users = $query->paginate(15);

        return response()->json($users);
    }
}
