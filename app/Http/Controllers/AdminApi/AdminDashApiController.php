<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Role;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use function PHPUnit\Framework\isEmpty;

class AdminDashApiController extends Controller
{


    // GET All Admins
    public function index(Request $request)
    {
        //return response()->json(['success' => false, 'message' => 'حدث خطأ فادح'], 204);

        $admins = Admin::latest()->where('id', '<>', $request->user()->id)->get();
        if ($admins->isEmpty())
            return response()->json(['success' => false, 'message' => 'لا يوجد اي مشرفين في الموقع', 'data' => $admins], 204);
        return response()->json(['success' => true, 'message' => 'تم جلب  المشرفين بنجاح', 'data' => $admins], 200);
    }


    // GET One Admin API =>Auth
    public function show($admin)
    {
        $admin = Admin::with('role:id,name')->Find($admin);
        if ($admin == [])
            return response()->json([], 204);

        $roles = Role::select('id', 'name')->get();
        if (count($roles) == 0)
            return response()->json([], 204);


        return response()->json(['success' => true, 'message' => 'تم جلب المشرف بنجاح', 'data' => $admin, "roles" => $roles], 200);
    }



    // Activate Admin
    public function active($admin)
    {
        $admin = Admin::Find($admin);
        if (!$admin)
            return response()->json(['success' => false, 'message' => 'هذه الحساب غير موجود'], 204);

        if ($admin->state == 1)
            return response()->json(['success' => false, 'message' => 'هذا الحساب مفعل مسبقا'], 400);

        if ($admin->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا الحساب محظور ولا يمكن تفعيله'], 400);

        $admin->state = 1;
        $edit = $admin->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم تفعيل هذا الحساب'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }


    // DisActivate Admin
    public function disActive($admin)
    {
        $admin = Admin::Find($admin);
        if (!$admin)
            return response()->json(['success' => false, 'message' => 'هذه الحساب غير موجود'], 204);

        if ($admin->state == 0)
            return response()->json(['success' => false, 'message' => 'هذا الحساب غير مفعل مسبقا'], 400);

        if ($admin->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا الحساب محظور ولا يمكن تفعيله'], 400);

        $admin->state = 0;
        $edit = $admin->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم إلغاء تفعيل هذا الحساب'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }


    // Banned Admin
    public function banned($admin)
    {
        $admin = Admin::Find($admin);
        if (!$admin)
            return response()->json(['success' => false, 'message' => 'هذه الحساب غير موجود'], 204);

        if ($admin->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا الحساب محظور مسبقا'], 400);

        $admin->state = 2;
        $edit = $admin->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم حظر هذا الحساب ولا يمكنم استخدامه مجددا'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }



    // Banned Admin
    public function resetPassword($admin)
    {
        $admin = Admin::Find($admin);
        if (!$admin)
            return response()->json(['success' => false, 'message' => 'هذه الحساب غير موجود'], 204);

        if ($admin->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا الحساب محظور'], 400);

        $admin->password =  Hash::make("123456");
        $edit = $admin->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم تغيير كلمة المرور إلى 123456 , يجب عليك تغيير كلمة المرور بمجرد تسجيل دخول إلى الحساب'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }



    // Get Role Short List For New Admin
    public function role(Request $request)
    {
        $roles = Role::select('id', 'name')->get();
        if ($roles->isEmpty())
            return response()->json(["success" => false, "message" => "لا يوجد اي رتب للمستخدمين حتى الان"], 204);
        return response()->json(["success" => true, "message" => "تم جلب جميع الرتب بنجاح", "roleList" => $roles]);
    }


    //  Change Admin Role
    public function changeAdminRole($admin, Request $request)
    {
        $admin = Admin::Find($admin);
        if (!$admin)
            return response()->json(['success' => false, 'message' => 'هذه المشرف غير موجود'], 400);

        if (Validator::make($request->all(), [
            'role_id' => 'required',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "يجب عليك إرسال رقم الدور"], 400);
        }

        $role = Role::Find($request['role_id']);
        if (!$role)
            return response()->json(['success' => false, 'message' => 'هذا الدور لم يعد متاح قم بإختيار دور اخر'], 400);

        $admin->role_id = $request['role_id'];
        $edit = $admin->save();
        if ($edit)
            return response()->json(['success' => true, 'message' => 'تم تحديث دور الحساب بنجاح'], 200);
        return response()->json(['success' => true, 'message' => 'حدث خطأ ما'], 400);
    }

    // Add New Admin
    public function create(Request $request)
    {
        if (Validator::make($request->all(), [
            'username' => 'unique:admins',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "اسم الدخول محجوز مسبقا"], 400);
        }

        if (Validator::make($request->all(), [
            'username' => 'regex:/(^([a-zA-Z]+)(\d+)?$)/u',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "اسم الدخول غير مقبول, يجب ان يبدأ بحرف ويحتوي على حروف انجليزية وأرقام فقط, وأن لا يحتوي على أي مسافات"], 400);
        }

        $role = Role::Find($request['role_id']);
        if (!$role)
            return response()->json(['success' => false, 'message' => 'دور المشرف غير متاح'], 400);


        $admin = Admin::create([
            'name' => $request['name'],
            'username' => $request['username'],
            'role_id' => $request['role_id'],
            'password' => Hash::make($request['password']),
        ]);
        return response()->json(['success' => true, 'message' => 'تم إنشاء هذا الحساب بنجاح'], 200);
    }
}
