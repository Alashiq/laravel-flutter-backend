<?php

namespace App\Http\Controllers\AppApi;

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

class AuthAppApiController extends Controller
{
    // Sign Up
    public function create(Request $request){
        if (Validator::make($request->all(), [
            'phone' => 'unique:users',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "رقم الهاتف مسجل مسبقا"], 400);
        }

        if (Validator::make($request->all(), [
            'phone' => 'required|numeric',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "رقم الهاتف يجب ان يكون عبارة عن رقم ومكون من 10 أرقام"], 400);
        }

        if (Validator::make($request->all(), [
            'password' => 'required',
        ])->fails()) {
            return response()->json(["success" => false, "message" => "يجب عليك ادخال كلمة مرور"], 400);
        }

        $user = User::create([
            'firstname' => $request['firstname'],
            'lastname' => $request['lastname'],
            'phone' => $request['phone'],
            'password' => Hash::make($request['password']),
            'gender' => $request['gender'],
            'state' => 1,
        ]);
        return response()->json(['success' => true, 'message' => 'تم إنشاء هذا الحساب بنجاح'], 200);
    }


    


    // Login
    public function login(Request $request)
    {
        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {

            return response()->json(['success' => false, 'message' => 'إسم المستخدم أو كلمة المرور غير صحيحة'], 401);
        }

        if ($user->state == 0) {
            return response()->json(['success' => false, 'message' => 'هذا الحساب غير مفعل قم بالتواصل مع المسؤول لتفعيل حسابك'], 403);
        } elseif ($user->state == 2)
            return response()->json(['success' => false, 'message' => 'هذا الحساب محظور ولا يمكن استخدامه مجددا'], 401);


        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'gender' => $user->gender,
                'photo' => $user->photo,
                'token' => $user->createToken('website', ['role:user'])->plainTextToken

            ],
        ]);
    }

    //  Check Auth
    public function profile(Request $request)
    {
        $userData= $request->user()->makeHidden(['id','state','created_at','updated_at']);

        return response()->json(["success" => true, "message" => "مرحبا بالمستخدم", "user" => $userData]);
    }


    //  Logout
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
