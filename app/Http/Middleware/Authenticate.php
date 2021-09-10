<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use PhpParser\Node\Stmt\Return_;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        //return response()->json(["success"=>false]);

        if (! $request->expectsJson()) {
            return '/api/notAuth';
            //return route('aa');
        }
    }
}
