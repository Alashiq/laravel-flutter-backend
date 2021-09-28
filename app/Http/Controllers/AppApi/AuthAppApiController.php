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

class AuthDashApiController extends Controller
{

    // Login Admin
    public function login(Request $request)
    {
        $customer = Admin::where('username', $request->username)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {

            return response()->json(['success' => false, 'message' => 'إسم المستخدم أو كلمة المرور غير صحيحة'], 400);
        }

        if ($customer->state == 0) {
            return response()->json(['success' => false, 'message' => 'هذا الحساب غير مفعل قم بالتواصل مع المسؤول لتفعيل حسابك'], 400);
        } elseif ($customer->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا الحساب محظور ولا يمكن استخدامه مجددا'], 400);

            $permissions = [];
            foreach (config('global.permissions') as $name => $value) {
                $boolVal = false;
                for ($i = 0; $i < count($customer->role->permissions); $i++)
                    if ($name == $customer->role->permissions[$i]) {
                        $boolVal = true;
                    }
                array_push($permissions, ["name" => $name, "description" => $value, "state" => $boolVal]);
            }

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'username' => $customer->username,
                'role' => $customer->role->name,
                'photo' => $customer->photo,
                'token' => $customer->createToken('website', ['role:admin'])->plainTextToken

            ],
            "permissions"=>$permissions
        ]);
    }

    //  Get Admin Info
    public function profile(Request $request)
    {
        $role=Role::find($request->user()->role_id);
        if(!$role)
        return response()->json(["success"=>false,"message"=>"هذا الحساب غير مرتبط بأي دور, قم بالتواصل مع المسؤول لإصلاح الخلل"],400);

        $permissions = [];
        foreach (config('global.permissions') as $name => $value) {
            $boolVal = false;
            for ($i = 0; $i < count($role->permissions); $i++)
                if ($name == $role->permissions[$i]) {
                    $boolVal = true;
                }
            array_push($permissions, ["name" => $name, "description" => $value, "state" => $boolVal]);
        }

        $request->user()->role=$role->name;
        return response()->json(["success" => true, "message" => "مرحبا بالمستخدم", "user" => $request->user(),"permissions"=>$permissions]);
    }


    //  Logout Admin
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        return response()->json(["success" => true, "message" => "تم تسجيل الخروج بنجاح"]);
    }


    //  Change Admin Name
    public function update(Request $request)
    {
        if ($request->name) {
            $user = $request->user()->update($request->only(
                "name"
            ));
            return response()->json(["success" => true, "message" => "تم تحديث الإسم بنجاح", "user" => $request->user()]);
        } elseif ($request->oldPassword && $request->newPassword) {

            if (!Hash::check($request->oldPassword, $request->user()->password)) {

                return response()->json(['success' => false, 'message' => 'كلمة المرور القديمة غير صحيحة'], 400);
            }
            $request->user()->password = Hash::make($request->newPassword);
            $request->user()->save();
            return response()->json(["success" => true, "message" => "تم تغيير كلمة المرور بنجاح"], 200);
        } else {
            return response()->json(["success" => false, "message" => "لم تقم بإرسال اي حقول لتعديلها"], 400);
        }
    }


    //  Change Admin Photo
    public function updatePhoto(Request $request)
    {



        if (Validator::make($request->all(), [
            'file' => 'required',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "يجب عليك إختيار صورة ليتم رفعها"], 400);
        }


        if (Validator::make($request->all(), [
            'file' => 'mimes:jpg,jpeg,png',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "الملف الذي اخترته ليس صورة"], 400);
        }

        $file_name = time() . '_' . $request->file->getClientOriginalName();
        $file_path = $request->file('file')->storeAs('user_images', $file_name, 'public');



        $request->user()->photo = '/storage/' . $file_path;
        $request->user()->save();

        return response()->json([
            "success" => true,
            "message" => "تم تحديث صورة المستخدم بنجاح",
            "photo" => '/storage/' . $file_path
        ]);
    }
}
