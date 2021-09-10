export default {
    data() {
        return {
            formData: {
                username: "",
                password: ""
            },
            formValidate: {
                username: "",
                password: ""
            }
        };
    },
    methods: {
        login: function() {
            this.validateUsername();
            this.validatePassword();
            if (
                this.formValidate.username != "" ||
                this.formValidate.password != ""
            )
                return 0;

            this.$loading.Start();
            this.$http
                .Login(this.formData)
                .then(response => {
                    this.$loading.Stop();
                    localStorage.setItem("token", response.data.user.token);
                    axios.defaults.headers.common["Authorization"] =
                        "Bearer " + response.data.user.token;
                    this.$store.commit("setUser", response.data.user);
                    this.$store.commit(
                        "setPermissions",
                        response.data.permissions
                    );
                    this.$store.commit("authLoaded");
                    this.$alert.Success(response.data.message);
                    this.$router.push("/admin");
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                    this.$store.commit("authLoaded");
                });
        },
        validateUsername: function() {
            this.formValidate.username = "";
            if (this.formData.username.trim() == "") {
                this.formValidate.username = "لا يمكن ترك هذا الحقل فارغ";
                return 1;
            }
            if (this.formData.username.trim().length < 3) {
                this.formValidate.username =
                    "يجب ان يكون اسم المستخدم 3 أحرف أو اكثر";
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
                    "يجب ان تكون كلمة المرور أكثر من 6 حرف وأرقام";
                return 1;
            }
        }
    },
    computed: {
        loadAuth() {
            return this.$store.state.loadAuth;
        },
        auth() {
            return this.$store.state.auth;
        },
        loading() {
            return this.$store.state.loading;
        }
    },
    mounted() {
        if (this.auth) {
            this.$router.push("/admin");
        } else if (localStorage.getItem("token") && !this.loadAuth) {
            axios.defaults.headers.common["Authorization"] ="Bearer " + localStorage.getItem("token");
            this.$http.CheckToken()
                .then(response => {
                    this.$loading.Stop();
                    this.$alert.Success(response.data.message);
                    this.$store.commit("setUser", response.data.user);
                    this.$store.commit("setPermissions",response.data.permissions);
                    this.$store.commit("authLoaded");
                    this.$router.push("/admin");
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                    this.$store.commit("authLoaded");
                });
        }
    },
    created() {}
};