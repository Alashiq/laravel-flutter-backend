<?php

namespace App\Models;

use Hamcrest\Arrays\IsArray;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasApiTokens;
    protected $fillable = [
        'firstname',
        'lastname',
        'phone',
        'password',
        'gender',
        'state',
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];



}
