<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(string $id)
    {
        // Get the currently authenticated user
        $authenticatedUser = Auth::user();

        // Check if the authenticated user's ID matches the ID provided in the request
        if ($authenticatedUser->id != $id) {
            // If they don't match, return a 403 Forbidden response
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        return response()->json([
            'message' => 'Success',
            'user' => $authenticatedUser
        ]);
    }
}
