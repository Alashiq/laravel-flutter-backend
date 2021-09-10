<?php

namespace App\Http\Middleware;

use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class VisitorMiddleware
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
        if (Session::has('key') && Session::has('vDate')) {
            $vdate = Session::get('vDate');
            if (Carbon::now()->diffInMinutes($vdate) > 0) {

                Session::put('key', sha1(time()));
                Session::put('vDate', Carbon::now());
                Visitor::create([
                    'key' => sha1(time())
                ]);
            }
        } else {
            Session::put('key', sha1(time()));
            Session::put('vDate', Carbon::now());
            Visitor::create([
                'key' => sha1(time())
            ]);
        }
        return $next($request);
    }
}


//=============================> Calc Vistior Times
// if (Session::has('key')) {
//     $key = Session::get('key');
//     $visitor = Visitor::where('key', '=', $key)->first();
//     if ($visitor && Carbon::now()->diffInMinutes($visitor->created_at) < 15) {
//         $visitor->count = $visitor->count + 1;
//         $visitor->save();
//     } else {
//         Session::put('key', sha1(time()));
//         Visitor::create([
//             'key' => sha1(time())
//         ]);
//     }
// } else {
//     Session::put('key', sha1(time()));
//     Visitor::create([
//         'key' => sha1(time())
//     ]);
// }
// return $next($request);