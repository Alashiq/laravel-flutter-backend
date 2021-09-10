
export default {
    data: function() {
        return {};
    },
    methods: {
        logout: function() {
            this.$loading.Start();
            this.$http
                .Logout()
                .then(response => {
                    this.$loading.Stop();
                        this.$router.push("/admin/login");
                        this.$store.commit("clearUser");
                        localStorage.removeItem("token");
                        axios.defaults.headers.common["Authorization"] = null;
                        this.$alert.Success(response.data.message);
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                });
        }
    },
    computed: {
        pageList() {
            return this.$store.state.pageList;
        },
        user() {
            return this.$store.state.user;
        },
        menu() {
            return this.$store.state.menu;
        }
    }
};
