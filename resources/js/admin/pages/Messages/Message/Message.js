import Swal from "sweetalert2";
export default {
    data() {
        return {
            message: [],
            loaded: false
        };
    },
    methods: {
        deleteMessage: function() {
            Swal.fire({
                title: "هل أنت متأكد",
                text: "هل أنت متأكد من أنك تريد حذف هذه الرسالة !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#16a085",
                cancelButtonColor: "#d33",
                confirmButtonText: "نعم قم بالحذف",
                cancelButtonText: "إلغاء"
            }).then(result => {
                if (result.isConfirmed) {
                    this.$loading.Start();
                    this.$http
                        .DeleteMessage(this.$route.params.id)
                        .then(response => {
                            this.$loading.Stop();
                            if (response.status == 200) {
                                this.message = [];
                                this.$alert.Success(response.data.message);
                            } else if (response.status == 204) {
                                this.message = [];
                                this.$alert.Empty(
                                    "لم تعد هذه الرسالة متوفرة, قد يكون شخص أخر قام بحذفها"
                                );
                            }
                        })
                        .catch(error => {
                            this.$loading.Stop();
                            this.$alert.BadRequest(error.response);
                        });
                }
            });
        },
        sloveMessage: function() {
            this.$loading.Start();
            this.$http
                .SloveMessage(this.$route.params.id)
                .then(response => {
                    this.$loading.Stop();
                    if (response.status == 200) {
                        this.message.state = true;
                        this.$alert.Success(response.data.message);
                    } else if (response.status == 204) {
                        this.message = [];
                        this.$alert.Empty(
                            "لم تعد هذه الرسالة متوفرة, قد يكون شخص أخر قام بحذفها"
                        );
                    }
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                });
        }
    },
    mounted() {
        this.$store.commit("activePage", 2);
        this.$loading.Start();
        this.$http
            .GetMessageById(this.$route.params.id)
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.message = response.data.data;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("هذه الرسالة غير متوفرة");
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