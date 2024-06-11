<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    
    public $timestamps = true; // This will automatically handle created_at and updated_at fields

    protected $fillable = ['sender_id', 'recipient_id', 'message'];

}
