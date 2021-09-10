import Swal from "sweetalert2";
import store from '../store/index'
export default {
    Success(message) {
        Swal.mixin({
            position: "bottom-start",
            timer: 3000,
            toast: true,
            showConfirmButton: false
        }).fire("نجاح", message, "success");
    },
    Empty(message) {
        if(!message)
        Swal.mixin({
            position: "bottom-start",
            timer: 3000,
            toast: true,
            showConfirmButton: false
        }).fire("تنبيه", "لا يوجد اي بيانات", "warning");
        else
        Swal.mixin({
            position: "bottom-start",
            timer: 3000,
            toast: true,
            showConfirmButton: false
        }).fire("تنبيه", message, "warning");
    },



    BadRequest(response) {
        if (response.status == 401) {
            Swal.fire(
                "فشل",
                "انتهت الجلسة الخاصة بك قم بعمل تسجيل دخول مجددا",
                "warning"
            );
            localStorage.removeItem("token");
            root.$store.commit("clearUser");
            root.$router.push("/admin/login");
        } else if (response.status == 404) Swal.fire("فشل", "لم نتمكن من  الإتصال بالخادم", "warning");
        else Swal.fire("فشل", response.data.message, "warning");
    },



}