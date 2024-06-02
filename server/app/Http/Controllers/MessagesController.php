<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessagesController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required',
            'recipient_id' => 'required',
            'message' => 'required',
        ]);

        $message = Message::create($validated);

        return response()->json($message, 201);
    }

    public function getMessages()
{
    $messages = Message::join('users', 'messages.sender_id', '=', 'users.id')
        ->select('messages.*', 'users.name as sender_name')
        ->get();

    return response()->json($messages);
}
}
