export default {
    computed: {
        loadAuth() {
            return this.$store.state.loadAuth;
        },
        user() {
            return this.$store.state.user;
        },
        auth() {
            return this.$store.state.auth;
        },
        permissions() {
            return this.$store.state.permissions;
        },
        loading() {
            return this.$store.state.loading;
        }
    },
    methods: {
        checkPermission: function(perName) {
            var item = this.permissions.filter(project => {
                return project.name == perName;
                //return project.name.match(perName);
            });
            if (item[0] != null) return item[0].state;
            return false;
        }
    },
    mounted() {
        if (this.auth) {
        } else if (localStorage.getItem("token") && !this.auth) {
            axios.defaults.headers.common["Authorization"] =
                "Bearer " + localStorage.getItem("token");
            this.$http
                .CheckToken()
                .then(response => {
                    this.$loading.Stop();
                    this.$alert.Success(response.data.message);
                    this.$store.commit("setUser", response.data.user);
                    this.$store.commit(
                        "setPermissions",
                        response.data.permissions
                    );
                    this.$store.commit("authLoaded");
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                    this.$store.commit("authLoaded");
                });
        } else {
            this.$router.push("/admin/login");
        }
    }
};
