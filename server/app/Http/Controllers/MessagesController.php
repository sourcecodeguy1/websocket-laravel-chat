<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MessagesController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required',
            'recipient_id' => 'required',
            'message' => 'required',
        ]);

        Log::info('Data being inserted:', $validated);

        $message = Message::create($validated);

        return response()->json($message, 201);
    }

    public function getMessages(Request $request)
    {
        $userId = $request->query('userId');
        $recipientId = $request->query('recipientId');

        $messages = Message::join('users', 'messages.sender_id', '=', 'users.id')
            ->select('messages.*', 'users.name as sender_name')
            ->where(function ($query) use ($userId, $recipientId) {
                $query->where('sender_id', $userId)
                    ->where('recipient_id', $recipientId);
            })
            ->orWhere(function ($query) use ($userId, $recipientId) {
                $query->where('sender_id', $recipientId)
                    ->where('recipient_id', $userId);
            })
            ->orderBy('created_at', 'desc') // Order by created_at in descending order
            ->get();

        return response()->json($messages);
    }
}
