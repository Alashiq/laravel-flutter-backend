<?php

use App\Models\Receiver;
use Illuminate\Support\Facades\Route;


Route::view('/','admin.admin');
Route::view('/{a?}/{b?}/{c?}/{d?}/{e?}','admin.admin');
