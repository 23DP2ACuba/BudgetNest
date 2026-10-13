<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Only transactions from budgets the user created or is a member of
        $query = Transaction::with(['budget', 'category', 'user'])
            ->whereHas('budget', function ($q) use ($user) {
                $q->where('created_by', $user->id)
                    ->orWhereHas('users', function ($q2) use ($user) {
                        $q2->where('user_id', $user->id);
                    });
            });

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('transaction_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('transaction_date', '<=', $request->end_date);
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->paginate(15);

        return response()->json($transactions);
    }

    /**
     * Get transactions for a specific budget
     */
    public function byBudget(Budget $budget, Request $request)
    {
        // Check if user has access to this budget
        if (!$budget->users->contains($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $budget->transactions()->with(['category', 'user']);

        // Apply filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->paginate(15);

        return response()->json($transactions);
    }

    /**
     * Store a newly created transaction
     */
    public function store(Request $request)
    {
        $request->validate([
            'budget_id' => 'required|exists:budgets,id',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
        ]);

        $transaction = Transaction::create([
            'budget_id' => $request->budget_id,
            'category_id' => $request->category_id,
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'transaction_date' => $request->transaction_date,
        ]);

        $transaction->load(['budget', 'category', 'user']);

        return response()->json($transaction, 201);
    }

    /**
     * Display the specified transaction
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['budget', 'category', 'user']);
        return response()->json($transaction);
    }

    /**
     * Update the specified transaction
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Check if user owns this transaction or is budget owner
        if ($transaction->user_id !== $request->user()->id && 
            $transaction->budget->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'type' => 'sometimes|required|in:income,expense',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'description' => 'nullable|string',
            'transaction_date' => 'sometimes|required|date',
        ]);

        $transaction->update($request->all());
        $transaction->load(['budget', 'category', 'user']);

        return response()->json($transaction);
    }

    /**
     * Remove the specified transaction
     */
    public function destroy(Request $request, Transaction $transaction)
    {
        // Check if user owns this transaction or is budget owner
        if ($transaction->user_id !== $request->user()->id && 
            $transaction->budget->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully',
        ]);
    }
}
