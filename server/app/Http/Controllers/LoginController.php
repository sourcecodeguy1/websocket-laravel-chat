<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!auth()->attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details',
            ], 401);
        }

        $user = User::where('email', strtolower($request['email']))->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie('jwt', $token, 60 * 24, null, null, false, true); // 1 day

        return response()->json([
            'message' => 'Success',
            'id' => $user->id, // Add the user's id to the response
        ])->withCookie($cookie);
    }

    public function logout(Request $request)
{
    $request->user()->tokens()->delete();

    return response()->json('Logged out successfully', 200);
}
}
