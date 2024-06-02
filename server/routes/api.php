<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\UsersController;

/* Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); */


Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard/{id}', [DashboardController::class, 'index']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/users', [UsersController::class, 'users']);
    Route::post('/send-message', [MessagesController::class, 'store']);
    Route::get('/messages', [MessagesController::class, 'getMessages']);
});