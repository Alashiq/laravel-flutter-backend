export default {
    data() {
        return {
            roleList: [],
            formData: {
                name: "",
                username: "",
                password: "",
                role_id: null,
                confirmPassword: ""
            },
            formValidate: {
                name: "",
                username: "",
                password: "",
                confirmPassword: ""
            },
            loaded: false
        };
    },
    methods: {
        addAdmin: function() {
            this.validateName();
            this.validateUsername();
            this.validateRole();
            this.validatePassword();
            this.validateConfirmPassword();
            if (this.formValidate.name != "") return 0;
            if (this.formValidate.username != "") return 0;
            if (this.formValidate.role != "") return 0;
            if (this.formValidate.password != "") return 0;
            if (this.formValidate.confirmPassword != "") return 0;

        this.$loading.Start();
        this.$http
            .PostNewAdmin(this.formData)
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                    this.$alert.Success(response.data.message);
                    this.formData.name = "";
                    this.formData.username = "";
                    this.formData.password = "";
                    this.formData.role_id = null;
                    this.formData.confirmPassword = "";
            })
            .catch(error => {
                this.$loading.Stop();
                this.$alert.BadRequest(error.response);
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
        validateUsername: function() {
            this.formValidate.username = "";
            if (this.formData.username.trim() == "") {
                this.formValidate.username = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.username.trim().length < 5) {
                this.formValidate.username =
                    "يجب ان يكون إسم الدخول 5 أحرف أو اكثر";
                return 1;
            }
            if (this.formData.username.trim().length > 16) {
                this.formValidate.username =
                    "يجب ان يكون إسم الدخول أقل من 16 حرف";
                return 1;
            }
        },
        validateRole: function() {
            this.formValidate.role = "";
            if (this.formData.role_id == null) {
                this.formValidate.role = "يجب عليك تحديد دور المشرف";
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
        this.$store.commit("activePage", 3);

        this.$loading.Start();
        this.$http
            .GetAdminRolesForNewAdmin()
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.roleList = response.data.roleList;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("تنبيه لا يوجد اي أدوار");
                }
            })
            .catch(error => {
                this.$loading.Stop();
                this.$alert.BadRequest(error.response);
            });
    },
    computed: {},
    created() {}
};
