export default {
    data() {
        return {
            data: [],
            loaded: false
        };
    },
    methods: {},
    mounted() {
        this.$store.commit("activePage", 1);
        this.$loading.Start();
        this.$http
            .GetHome()
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.data = response.data.data;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("لم نتمكن من جلب البيانات");
                }
            })
            .catch(error => {
                this.$loading.Stop();
                this.loaded = true;
                this.$alert.BadRequest(error.response);
            });
    },
    computed: {},
    created() {}
};