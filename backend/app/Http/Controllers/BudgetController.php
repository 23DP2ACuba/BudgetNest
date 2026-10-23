<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    /**
     * Display a listing of budgets
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get budgets the user owns or is a member of
        $budgets = Budget::where('created_by', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['creator', 'users'])
            ->get();

        return response()->json($budgets);
    }

    /**
     * Store a newly created budget
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $budget = Budget::create([
            'name' => $request->name,
            'description' => $request->description,
            'total_amount' => $request->total_amount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'created_by' => $request->user()->id,
        ]);

        // Attach the creator as owner
        $budget->users()->attach($request->user()->id, ['role' => 'owner']);

        $budget->load(['creator', 'users']);

        return response()->json($budget, 201);
    }

    /**
     * Display the specified budget
     */
    public function show(Request $request, Budget $budget)
    {
        // Check if user has access to this budget
        if ($budget->created_by !== $request->user()->id && 
            !$budget->users->contains($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $budget->load(['creator', 'users', 'transactions.category']);

        return response()->json($budget);
    }

    /**
     * Update the specified budget
     */
    public function update(Request $request, Budget $budget)
    {
        // Only creator or owners can update
        $userRole = $budget->users()->where('user_id', $request->user()->id)->first()?->pivot->role;
        
        if ($budget->created_by !== $request->user()->id && $userRole !== 'owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'total_amount' => 'sometimes|required|numeric|min:0',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
        ]);

        $budget->update($request->all());
        $budget->load(['creator', 'users']);

        return response()->json($budget);
    }

    /**
     * Remove the specified budget
     */
    public function destroy(Request $request, Budget $budget)
    {
        // Only creator can delete
        if ($budget->created_by !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $budget->delete();

        return response()->json([
            'message' => 'Budget deleted successfully',
        ]);
    }

    /**
     * Remove a member from the budget
     */
    public function removeMember(Request $request, Budget $budget, $userId)
    {
        // Only creator or owners can remove members
        $userRole = $budget->users()->where('user_id', $request->user()->id)->first()?->pivot->role;
        
        if ($budget->created_by !== $request->user()->id && $userRole !== 'owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cannot remove the creator
        if ($budget->created_by == $userId) {
            return response()->json(['message' => 'Cannot remove budget creator'], 400);
        }

        $budget->users()->detach($userId);

        return response()->json([
            'message' => 'Member removed successfully',
        ]);
    }

    /**
     * Leave the budget (current user detaches themselves)
     */
    public function leave(Request $request, Budget $budget)
    {
        $user = $request->user();

        // Cannot leave if you are the creator
        if ($budget->created_by === $user->id) {
            return response()->json([
                'message' => 'Budget creator cannot leave. Transfer ownership or delete the budget instead.',
            ], 400);
        }

        // Check if user is a member
        if (!$budget->users->contains($user)) {
            return response()->json([
                'message' => 'You are not a member of this budget.',
            ], 403);
        }

        $budget->users()->detach($user->id);

        return response()->json([
            'message' => 'You have left the budget successfully.',
        ]);
    }
}
