export default {
    data() {
        return {
            formData: {
                phone:"",
                firstname: "",
                lastname: "",
                password: "",
                confirmPassword: "",
                gender:true
            },
            formValidate: {
                phone:"",
                firstname: "",
                lastname: "",
                password: "",
                confirmPassword: ""
            },
        };
    },
    methods: {
        addUser: function() {
            this.validatePhone();
            this.validateFirstName();
            this.validateLastName();
            this.validatePassword();
            this.validateConfirmPassword();
            if (this.formValidate.phone != "") return 0;
            if (this.formValidate.firstname != "") return 0;
            if (this.formValidate.lastname != "") return 0;
            if (this.formValidate.password != "") return 0;
            if (this.formValidate.confirmPassword != "") return 0;

        this.$loading.Start();
        this.$http
            .PostNewUser(this.formData)
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                    this.$alert.Success(response.data.message);
                    this.formData.phone = "";
                    this.formData.firstname = "";
                    this.formData.lastname = "";
                    this.formData.password = "";
                    this.formData.confirmPassword = "";
            })
            .catch(error => {
                this.$loading.Stop();
                this.$alert.BadRequest(error.response);
            });
        },
        validatePhone: function() {
            this.formValidate.phone = "";
            if (this.formData.phone.trim() == "") {
                this.formValidate.phone = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.phone.trim().length != 10) {
                this.formValidate.phone = "يجب ان يكون رقم الهاتف 10 أرقام";
                return 1;
            }
            if (/\D/.test(this.formData.phone)) {
                this.formValidate.phone = "يمكن فقط ادخال الأرقام في هذا الحقل";
                return 1;
            }
        },
        validateFirstName: function() {
            this.formValidate.firstname = "";
            if (this.formData.firstname.trim() == "") {
                this.formValidate.firstname = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.firstname.trim().length < 3) {
                this.formValidate.firstname = "يجب ان يكون الإسم 3 أحرف أو اكثر";
                return 1;
            }
            if (this.formData.firstname.trim().length > 16) {
                this.formValidate.firstname = "يجب ان يكون الإسم أقل من 16 حرف";
                return 1;
            }
        },
        validateLastName: function() {
            this.formValidate.lastname = "";
            if (this.formData.lastname.trim() == "") {
                this.formValidate.lastname = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.lastname.trim().length < 3) {
                this.formValidate.lastname =
                    "يجب ان يكون اللقب 3 أحرف أو اكثر";
                return 1;
            }
            if (this.formData.lastname.trim().length > 16) {
                this.formValidate.lastname =
                    "يجب ان يكون اللقب أقل من 16 حرف";
                return 1;
            }
        },
        validatePassword: function() {
            this.formValidate.password = "";
            if (this.formData.password.trim() == "") {
                this.formValidate.password = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.password.trim().length < 6) {
                this.formValidate.password =
                    "يجب ان تكون كلمة المرور أكثر من 6 أرقام ورموز";
                return 1;
            }
            if (this.formData.password.trim() != this.formData.password) {
                this.formValidate.password =
                    "يجب أن لا تحتوي كلمة المرور على اي فراغات";
                return 1;
            }
        },
        validateConfirmPassword: function() {
            this.formValidate.confirmPassword = "";
            if (this.formData.confirmPassword.trim() == "") {
                this.formValidate.confirmPassword =
                    "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.confirmPassword != this.formData.password) {
                this.formValidate.confirmPassword =
                    "يجب ان يتطابق كلمة المرور الجديدة مع تأكيد كلمة المرور";
                return 1;
            }
        }
    },
    mounted() {
        this.$store.commit("activePage", 5);
    },
    computed: {},
    created() {}
};
