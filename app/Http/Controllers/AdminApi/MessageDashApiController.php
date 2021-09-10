<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageDashApiController extends Controller
{

    // GET Messages API =>Auth
    public function index()
    {
        $messages = Message::latest()->get();
        if ($messages->isEmpty())
            return response()->json(['success' => false, 'message' => 'لا يوجد اي رسائل', 'messages' => $messages], 204);
        return response()->json(['success' => true, 'message' => 'تم جلب الرسائل بنجاح', 'messages' => $messages], 200);
    }



    // GET One Messages API =>Auth
    public function show($message)
    {
        $message = Message::Find($message);
        if ($message == [])
            return response()->json([], 204);

        return response()->json(['success' => true, 'message' => 'تم جلب الرسالة بنجاح', 'data' => $message], 200);
    }


    // Delete One Messages API =>Auth
    public function delete($message)
    {
        $message = Message::Find($message);
        if (!$message)
            return response()->json(['success' => false, 'message' => 'هذه الرسالة غير موجودة'], 204);
        $delete = $message->delete();
        if ($delete)
            return response()->json(['success' => true, 'message' => 'تم حذف الرسالة بنجاح', 'data' => $message], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }



    // Slove One Messages API =>Auth
    public function edit($message)
    {
        $message = Message::Find($message);
        if (!$message)
            return response()->json(['success' => false, 'message' => 'هذه الرسالة غير موجودة'], 204);
        $message->state = true;
        $edit = $message->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم تحديث حالة الرسالة'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }
}
