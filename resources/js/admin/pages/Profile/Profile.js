
export default {
    data() {
        return {
            formData: {
                file: "",
                name: "",
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            },
            formValidate: {
                name: "",
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            }
        };
    },
    methods: {
        onChange(e) {
            this.formData.file = e.target.files[0];
        },
        changePhoto: function() {
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            let data = new FormData();
            data.append("file", this.formData.file);
            this.$loading.Start();
            this.$http
                .ChangePhoto(data, config)
                .then(response => {
                    this.$loading.Stop();
                    this.$alert.Success(response.data.message);
                    this.$store.commit("updatePhoto", response.data.photo);
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                });
        },
        changeName: function() {
            if (this.user.name == this.formData.name.trim()) {
                this.formValidate.name = "لم تقم بإدخال اي اسم جديد";
                return 0;
            }
            this.validateName();
            if (this.formValidate.name != "") return 0;

            this.$loading.Start();
            this.$http
                .ChangeNameOrPassword({
                    name: this.formData.name
                })
                .then(response => {
                    this.$loading.Stop();
                    this.$alert.Success(response.data.message);
                    this.$store.commit("updateName", this.formData.name);
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                });
        },
        changePassword: function() {
            this.validateOldPassword();
            this.validateNewPassword();
            this.validateConfirmPassword();
            if (this.formValidate.oldPassword != "") return 0;
            if (this.formValidate.newPassword != "") return 0;
            if (this.formValidate.confirmPassword != "") return 0;

            this.$loading.Start();
            this.$http
                .ChangeNameOrPassword({
                    oldPassword: this.formData.oldPassword,
                    newPassword: this.formData.newPassword
                })
                .then(response => {
                    this.$loading.Stop();
                    this.$alert.Success(response.data.message);
                    this.formData.oldPassword = "";
                    this.formData.newPassword = "";
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
                this.formValidate.name =
                    "يجب ان يكون الإسم اكثر 5 أحرف أو اكثر";
                return 1;
            }
            if (this.formData.name.trim().length > 16) {
                this.formValidate.name = "يجب ان يكون الإسم أقل من 16";
                return 1;
            }
        },
        validateOldPassword: function() {
            this.formValidate.oldPassword = "";
            if (this.formData.oldPassword.trim() == "") {
                this.formValidate.oldPassword = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.oldPassword.trim().length < 6) {
                this.formValidate.oldPassword =
                    "يجب ان تكون كلمة المرور أكثر من 6 أرقام ورموز";
                return 1;
            }
        },
        validateNewPassword: function() {
            this.formValidate.newPassword = "";
            if (this.formData.newPassword.trim() == "") {
                this.formValidate.newPassword = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.newPassword.trim().length < 6) {
                this.formValidate.newPassword =
                    "يجب ان تكون كلمة المرور أكثر من 6 أرقام ورموز";
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
            if (this.formData.confirmPassword != this.formData.newPassword) {
                this.formValidate.confirmPassword =
                    "يجب ان يتطابق كلمة المرور الجديدة مع تأكيد كلمة المرور";
                return 1;
            }
        }
    },
    mounted() {
        this.$store.commit("activePage", 0);
        this.formData.name = this.user.name;
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {}
};
