<?php

use App\Http\Controllers\ClientApi\MessageClientApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;



Route::prefix('web')->group(function () {
    // Meessage Route
    Route::post('/message', [MessageClientApiController::class, 'create']);
});
