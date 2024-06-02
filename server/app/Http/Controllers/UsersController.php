<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    // Get a list of all users
    public function users()
    {
        $users = User::where('id', '!=', auth()->id())->get();

        return response()->json([
            'users' => $users,
        ]);
    }
}
