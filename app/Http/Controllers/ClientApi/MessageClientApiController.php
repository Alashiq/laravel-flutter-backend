<?php

namespace App\Http\Controllers\ClientApi;

use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Receiver;
use Illuminate\Http\Request;

class MessageClientApiController extends Controller
{
    // Add New Admin
    public function create(Request $request)
    {

        if (Validator::make($request->all(), [
            'name' => 'required',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "يجب عليك إدخال إسمك"], 400);
        }


        if (Validator::make($request->all(), [
            'receiver_id' => 'required',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "يجب عليك اختيار الجهة التي ستستلم الرسالة"], 400);
        }

        if (Validator::make($request->all(), [
            'receiver_id' => 'integer',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "خطأ في اختيار الجهة الموجه لها الرسالة"], 400);
        }


        if (Validator::make($request->all(), [
            'content' => 'required',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "يجب عليك ادخال الرسالة المراد إرسالها"], 400);
        }

        $receiver = Receiver::Find($request->receiver_id);
        if ($receiver == [])
            return response()->json(["success" => false, "message" => "يبدو ان الجهة التي ترغب في ارسالة الرسالة لها غير متاحة"], 400);



        if (!$request->email && !$request->phone)
            return response()->json(["success" => false, "message" => "يجب عليك إدخال رقم الهاتف أو البريد الإلكتروني"], 400);


        $message = Message::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'phone' => $request['phone'],
            'receiver_id' => $request['receiver_id'],
            'content' => nl2br(e($request['content'])),
        ]);
        return response()->json(['success' => true, 'message' => 'تم إرسال الرسالة بنجاح'], 200);
    }
}
