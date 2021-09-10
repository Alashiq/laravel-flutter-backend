<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeDashApiController extends Controller
{

    // GET Home Charts
    public function index()
    {
        $todayMessage = count(Message::where('created_at', '>', Carbon::now()->format('Y-m-d'))->get());
        $notSloveMessage = count(Message::where('state', '=', 0)->get());
        $sloveMessage = count(Message::where('state', '=', 1)->get());

        $todayVisitor = count(Visitor::where('created_at', '>', Carbon::now()->format('Y-m-d'))->get());
        $weekVisitor = count(Visitor::where('created_at', '>', Carbon::now()->subDays(7)->format('Y-m-d'))->get());
        $monthVisitor = count(Visitor::where('created_at', '>=', Carbon::now()->format('Y-m-1'))->get());


        return response()->json(['success' => true, 'message' => 'تم جلب الإحصائيات', 'data' => [
            "todayMessage"=>$todayMessage,
            "notSloveMessage"=>$notSloveMessage,
            "sloveMessage"=>$sloveMessage,
            "todayVisitor"=>$todayVisitor,
            "weekVisitor"=>$weekVisitor,
            "monthVisitor"=>$monthVisitor,
        ]], 200);

    }
}
