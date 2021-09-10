<template>
    <!-- Contact Form -->
    <div class="container mx-auto px-4 py-4 pb-36">
        <div
            class="text-center my-8 text-6xl tanseek secondary"
            data-aos="fade-right"
            data-aos-duration="1000"
        >
            <span class="primary">نموذج الإتصال</span>
            <span> بنا</span>
        </div>
        <div
            class="text-gray-400 text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="800"
        >
            يمكنك التواصل معنا عبر ملئ النموذج التالي
        </div>
        <div class="w-full grid xl:grid-cols-4 md:grid-cols-2">
            <!-- Input Name -->
            <div
                class="mx-3  my-4"
                data-aos-delay="200"
                data-aos="fade-up"
                data-aos-duration="800"
            >
                <input
                    v-model="formData.name"
                    v-on:change="validateName"
                    type="text"
                    class="rounded w-full bg-gray-50 border h-12 px-4 outline-none focus:border-0 text-lg focus:ring-2 focus:ring-red-400 "
                    placeholder="الإسم"
                />
                <div class="text-sm w-full h-8 text-red-500 flex items-center">
                    {{ formValidate.name }}
                </div>
            </div>
            <!-- End Input Name -->

            <!-- Input Phone -->
            <div
                class="mx-3  my-4"
                data-aos-delay="600"
                data-aos="fade-up"
                data-aos-duration="800"
            >
                <input
                    v-model="formData.phone"
                    v-on:change="validatePhone"
                    type="text"
                    class="rounded w-full bg-gray-50 border h-12 px-4 outline-none focus:border-0 text-lg focus:ring-2 focus:ring-red-400 "
                    placeholder="رقم الهاتف"
                />
                <div class="text-sm w-full h-8 text-red-500 flex items-center">
                    {{ formValidate.phone }}
                </div>
            </div>
            <!-- End Input Phone -->

            <!-- Input Email -->
            <div
                class="mx-3  my-4"
                data-aos-delay="400"
                data-aos="fade-up"
                data-aos-duration="800"
            >
                <input
                    v-model="formData.email"
                    v-on:change="validateEmail"
                    type="text"
                    class="rounded w-full bg-gray-50 border h-12 px-4 outline-none focus:border-0 text-lg focus:ring-2 focus:ring-red-400 "
                    placeholder="البريد الإلكتروني"
                />
                <div class="text-sm w-full h-8 text-red-500 flex items-center">
                    {{ formValidate.email }}
                </div>
            </div>
            <!-- End Input Email -->

            <!-- Input Receiver -->
            <div
                class="mx-3  my-4"
                data-aos-delay="800"
                data-aos="fade-up"
                data-aos-duration="800"
            >
                <select
                    v-model="formData.receiver_id"
                    class="rounded w-full bg-gray-50 border h-12 px-4 outline-none focus:border-0 text-lg focus:ring-2 focus:ring-red-400 "
                    placeholder="موجه إلى"
                >
                    <option v-for="(item,index) in receivers"  :key="index"  :value="item.id">{{item.name}}</option>
                </select>
                <div
                    class="text-sm w-full h-8 text-red-500 flex items-center"
                ></div>
            </div>
            <!-- End Input Receiver -->
        </div>

        <!-- Textarea Content -->
        <div
            class="mx-3"
            data-aos-delay="1000"
            data-aos="fade-up"
            data-aos-duration="800"
        >
            <textarea
                v-model="formData.content"
                v-on:change="validateContent"
                class="rounded bg-gray-50 border text-lg px-3 py-3 w-full focus:ring-red-400 h-32"
                placeholder="محتوى الرسالة"
            ></textarea>
            <div class="text-sm w-full h-8 text-red-500 flex items-center">
                {{ formValidate.content }}
            </div>
        </div>
        <!-- Ent Textarea Content -->

        <!-- Send Button -->
        <div
            v-on:click="send"
            data-aos-delay="1200"
            data-aos="fade-up"
            data-aos-duration="800"
            class="px-4 mt-5 mx-3 text-lg text-white bg-blue-400 hover:bg-blue-500 cursor-pointer rounded-full shadow-lg w-40 h-12 flex items-center justify-center"
        >
            إرسال
        </div>
        <!-- End Send Button -->
    </div>
    <!-- End Contact Form -->
</template>

<script>
import Swal from "sweetalert2";
export default {
    props: ["receivers"],
    data: function() {
        return {
            formData: {
                name: "",
                email: "",
                phone: "",
                receiver_id: this.receivers[0].id,
                content: ""
            },
            formValidate: {
                name: "",
                email: "",
                phone: "",
                content: ""
            }
        };
    },
    mounted() {},
    methods: {
        send: function() {
            this.validateName();
            this.validateContent();
            this.validatePhone();
            this.validateEmail();
            if (this.formValidate.name != "") return 0;
            if (this.formValidate.content != "") return 0;
            if (this.formValidate.phone != "") return 0;
            if (this.formValidate.email != "") return 0;

            if (this.formData.email == "" && this.formData.phone == "") {
                this.formValidate.email =
                    "قم بإدخال إما رقم الهاتف أو كلمة المرور";
                this.formValidate.phone =
                    "قم بإدخال إما رقم الهاتف أو كلمة المرور";

                return 0;
            }

            Swal.showLoading();
            axios
                .post("api/web/message", this.formData)
                .then(response => {
                    this.formData.content = "";
                    Swal.fire("تهانينا", response.data.message, "success");
                })
                .catch(function(error) {
                    Swal.fire("فشل", error.response.data.message, "error");
                });
        },

        validateName: function() {
            this.formValidate.name = "";
            if (this.formData.name.trim() == "") {
                this.formValidate.name = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.name.trim().length < 5) {
                this.formValidate.name = "يجب ان يكون الإسم 5 أحرف أو اكثر";
                return 1;
            }
            if (this.formData.name.trim().length > 16) {
                this.formValidate.name = "يجب ان يكون الإسم أقل من 16 حرف";
                return 1;
            }
        },
        validateContent: function() {
            this.formValidate.content = "";
            if (this.formData.content.trim() == "") {
                this.formValidate.content = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.content.trim().length < 10) {
                this.formValidate.content =
                    "يجب ان تكون الرسالة 10 أحرف أو اكثر";
                return 1;
            }
        },
        validatePhone: function() {
            this.formValidate.phone = "";
            if (this.formData.phone.trim() == "") {
                this.formValidate.phone = "";
                return 1;
            }
            if (this.formData.phone.trim().length < 7) {
                this.formValidate.phone =
                    "يجب ان يكون رقم الهاتف اكثر من 7 أرقام";
                return 1;
            }
            if (/\D/.test(this.formData.phone)) {
                this.formValidate.phone = "يمكن فقط ادخال الأرقام في هذا الحقل";
                return 1;
            }
        },
        validateEmail: function() {
            this.formValidate.email = "";
            if (this.formData.email.trim() == "") {
                this.formValidate.email = "";
                return 1;
            }
            if (
                !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
                    this.formData.email
                )
            ) {
                this.formValidate.email = "هذا البريد غير صحيح";
                return 1;
            }
        }
    }
};
</script>
