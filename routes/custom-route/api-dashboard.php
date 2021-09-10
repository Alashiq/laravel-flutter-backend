<?php

use App\Http\Controllers\AdminApi\AuthDashApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;




// Login And Register Admin
Route::post('/admin/login', [AuthDashApiController::class, 'login']);

// Unauthorized
Route::get('/notAuth', function (Request $request) {
    return response()->json(["success" => false, "message" => "انت لم تسجل دخولك أو انتهت الجلسة الخاصة بك"], 401);
});