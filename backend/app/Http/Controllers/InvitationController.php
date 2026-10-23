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

        // Check if user is already a member (accepted or pending)
        $existingMembership = $budget->users()->where('user_id', $invitedUser->id)->first();
        if ($existingMembership) {
            $status = $existingMembership->pivot->status;
            if ($status === 'accepted') {
                return response()->json(['message' => 'User is already a member'], 400);
            }
            if ($status === 'pending') {
                return response()->json(['message' => 'Invitation already pending'], 400);
            }
            // Re-attach if previously declined
            $existingMembership->pivot->update(['status' => 'pending', 'invited_by' => $request->user()->id]);
            return response()->json([
                'message' => 'Invitation re-sent successfully',
                'user' => $invitedUser,
            ], 200);
        }

        // Attach user to budget with pending status
        $budget->users()->attach($invitedUser->id, [
            'role' => $request->role,
            'status' => 'pending',
            'invited_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Invitation sent successfully',
            'user' => $invitedUser,
        ], 201);
    }

    /**
     * Accept a pending invitation
     */
    public function accept(Request $request, Budget $budget)
    {
        $user = $request->user();
        $membership = $budget->users()->where('user_id', $user->id)->first();

        if (!$membership) {
            return response()->json(['message' => 'No invitation found for this budget'], 404);
        }

        if ($membership->pivot->status !== 'pending') {
            return response()->json(['message' => 'Invitation is not in pending status'], 400);
        }

        $membership->pivot->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'Invitation accepted successfully',
            'budget' => $budget,
        ]);
    }

    /**
     * Decline a pending invitation
     */
    public function decline(Request $request, Budget $budget)
    {
        $user = $request->user();
        $membership = $budget->users()->where('user_id', $user->id)->first();

        if (!$membership) {
            return response()->json(['message' => 'No invitation found for this budget'], 404);
        }

        if ($membership->pivot->status !== 'pending') {
            return response()->json(['message' => 'Invitation is not in pending status'], 400);
        }

        $membership->pivot->update(['status' => 'declined']);

        return response()->json([
            'message' => 'Invitation declined successfully',
        ]);
    }

    /**
     * Get pending invitations for the current user
     */
    public function myInvitations(Request $request)
    {
        $user = $request->user();
        
        $invitations = \App\Models\Budget::whereHas('users', function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->where('status', 'pending');
        })->with(['creator'])->get();

        return response()->json($invitations);
    }
}
