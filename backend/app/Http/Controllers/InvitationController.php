<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\User;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    /**
     * Invite a user to a budget
     */
    public function invite(Request $request, Budget $budget)
    {
        // Check if user has permission to invite
        $userRole = $budget->users()->where('user_id', $request->user()->id)->first()?->pivot->role;
        
        if ($budget->created_by !== $request->user()->id && $userRole !== 'owner') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:owner,editor,viewer',
        ]);

        $invitedUser = User::where('email', $request->email)->first();

        // Check if user is already a member
        if ($budget->users->contains($invitedUser)) {
            return response()->json(['message' => 'User is already a member'], 400);
        }

        // Attach user to budget
        $budget->users()->attach($invitedUser->id, ['role' => $request->role]);

        return response()->json([
            'message' => 'User invited successfully',
            'user' => $invitedUser,
        ], 201);
    }
}
