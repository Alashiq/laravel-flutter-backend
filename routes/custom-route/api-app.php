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


        Route::get('/review', function(){
        $list[0]['id']=3;
        $list[0]['name']='عبدالسميع';
        $list[0]['job']='محلل نظم';
        $list[0]['photo']='http://localhost:8000/storage/assets/avatar.png';
            return response()->json([
                'success'=>true,
                'message'=>'تم جلب قائمة المنتجات بنجاح',
                'data'=>$list
            ],200);
        });



        # # # # # # # # # # # # # # # User # # # # # # # # # # # # # # # 
        Route::group(['prefix' => 'user'], function () {
            Route::get('/auth', [AuthAppApiController::class, 'profile']);
            Route::get('/logout', [AuthAppApiController::class, 'logout']);
            Route::put('/', [AuthAppApiController::class, 'update']);
            Route::post('/photo', [AuthAppApiController::class, 'updatePhoto']);
        });
        # # # # # # # # # # # # # # # End User # # # # # # # # # # # # # # # 




    });
    # # # # # # # # # # # # # # # End Auth # # # # # # # # # # # # # # # 



});
