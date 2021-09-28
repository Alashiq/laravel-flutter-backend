<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;

use Closure;
use Illuminate\Http\Request;

class UserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->tokenCan('role:user')) {
            if ($request->user()->state == 0)
                return response()->json([
                    "success" => false,
                    "message" => "حسابك غير مفعل يجب عليك التواصل مع المسؤول لتفعيله"
                ], 401);
            if ($request->user()->state == 2)
                return response()->json([
                    "success" => false,
                    "message" => "تم حظر حسابك ولم بعد بإمكانك استخدامه"
                ], 401);
            return $next($request);
        }

        return response()->json([
            "success" => false,
            "message" => "انتهت الجلسة ا لخاصة بك, يجب عليك إعادة تسجيل الدخول مجددا"
        ], 401);
    }
}
