<?php

use App\Http\Controllers\AppApi\AuthAppApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;



Route::prefix('app')->group(function () {


    # # # # # # # # # # # # # # # User # # # # # # # # # # # # # # # 
    Route::group(['prefix' => 'user'], function () {
        Route::post('/create', [AuthAppApiController::class, 'create']);
        Route::post('/login', [AuthAppApiController::class, 'login']);
    });
    # # # # # # # # # # # # # # # End User # # # # # # # # # # # # # # # 


    # # # # # # # # # # # # # # # Auth # # # # # # # # # # # # # # # 
    Route::middleware(['auth:sanctum', 'type.user'])->group(function () {

        # # # # # # # # # # # # # # # User # # # # # # # # # # # # # # # 
        Route::group(['prefix' => 'user'], function () {
            Route::get('/auth', [AuthAppApiController::class, 'profile']);
            Route::get('/logout', [AuthAppApiController::class, 'logout']);
        });
        # # # # # # # # # # # # # # # End User # # # # # # # # # # # # # # # 




    });
    # # # # # # # # # # # # # # # End Auth # # # # # # # # # # # # # # # 



});
