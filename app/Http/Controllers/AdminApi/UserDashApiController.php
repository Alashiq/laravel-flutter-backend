<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Role;
use App\Models\User;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use function PHPUnit\Framework\isEmpty;

class UserDashApiController extends Controller
{


    // GET All Users
    public function index(Request $request)
    {

        $admins = User::latest()->get();
        if ($admins->isEmpty())
            return response()->json(['success' => false, 'message' => 'لا يوجد اي مستخدمين', 'data' => $admins], 204);
        return response()->json(['success' => true, 'message' => 'تم جلب  المستخدمين بنجاح', 'data' => $admins], 200);
    }


    // GET One User API
    public function show($user)
    {
        $user = User::Find($user);
        if ($user == [])
            return response()->json([], 204);

        return response()->json(['success' => true, 'message' => 'تم جلب المستخدم بنجاح', 'data' => $user], 200);
    }



    // Activate User
    public function active($user)
    {
        $user = User::Find($user);
        if (!$user)
            return response()->json(['success' => false, 'message' => 'هذه المستخدم غير موجود'], 204);

        if ($user->state == 1)
            return response()->json(['success' => false, 'message' => 'هذا المستخدم مفعل مسبقا'], 400);

        if ($user->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا المستخدم محظور ولا يمكن تفعيله'], 400);

        $user->state = 1;
        $edit = $user->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم تفعيل المستخدم بنجاح'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }


    // DisActivate User
    public function disActive($user)
    {
        $user = User::Find($user);
        if (!$user)
            return response()->json(['success' => false, 'message' => 'هذه المستخدم غير موجود'], 204);

        if ($user->state == 0)
            return response()->json(['success' => false, 'message' => 'هذا المستخدم غير مفعل مسبقا'], 400);

        if ($user->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا المستخدم محظور ولا يمكن تفعيله'], 400);

        $user->state = 0;
        $edit = $user->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم إلغاء تفعيل هذا المستخدم بنجاح'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }


    // Banned User
    public function banned($user)
    {
        $user = User::Find($user);
        if (!$user)
            return response()->json(['success' => false, 'message' => 'هذه المستخدم غير موجود'], 204);

        if ($user->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا المستخدم محظور مسبقا'], 400);

        $user->state = 2;
        $edit = $user->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم حظر هذا المستخدم ولا يمكنم استخدامه مجددا'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }



    // Reset Password
    public function resetPassword($user)
    {
        $user = User::Find($user);
        if (!$user)
            return response()->json(['success' => false, 'message' => 'هذه المستخدم غير موجود'], 204);

        if ($user->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا المستخدم محظور'], 400);

        $user->password =  Hash::make("123456");
        $edit = $user->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم تغيير كلمة المرور إلى 123456 , يجب عليك تغيير كلمة المرور بمجرد تسجيل دخولك إلى الحساب'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }


    

    // Add New User
    public function create(Request $request)
    {
        if (Validator::make($request->all(), [
            'phone' => 'unique:users',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "رقم الهاتف مسجل من قبل"], 400);
        }


        $user = User::create([
            'firstname' => $request['firstname'],
            'lastname' => $request['lastname'],
            'phone' => $request['phone'],
            'password' => Hash::make($request['password']),
            'gender' => $request['gender'],
            'state' => 1,
        ]);
        return response()->json(['success' => true, 'message' => 'تم إنشاء هذا المستخدم بنجاح'], 200);
    }
}
