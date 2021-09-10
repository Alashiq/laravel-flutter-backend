import Swal from "sweetalert2";
export default {
    data() {
        return {
            messages: [],
            loaded: false,
            filter: [
                {
                    link: "all",
                    name: "كل الرسائل",
                    active: true
                },
                {
                    link: "active",
                    name: "المحلولة",
                    active: false
                },
                {
                    link: "notActive",
                    name: "الغير محلولة",
                    active: true
                }
            ],
            activeFilter: "all"
        };
    },
    methods: {
        deleteMessage: function(id, index) {
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
                        .DeleteMessage(id)
                        .then(response => {
                            this.$loading.Stop();
                            if (response.status == 200) {
                                this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
                                this.$alert.Success(response.data.message);
                            } else if (response.status == 204) {
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
        sloveMessage: function(id, index) {
            this.$loading.Start();
            this.$http
                .SloveMessage(id)
                .then(response => {
                    this.$loading.Stop();
                    if (response.status == 200) {
                        this.messages[this.messages.findIndex(m => m.id === id)].state = true;
                        this.$alert.Success(response.data.message);
                    } else if (response.status == 204) {
                        this.$alert.Empty(
                            "لم تعد هذه الرسالة متوفرة, قد يكون شخص أخر قام بحذفها"
                        );
                    }
                })
                .catch(error => {
                    this.$loading.Stop();
                    this.$alert.BadRequest(error.response);
                });
        },
        changeFilter(filterName) {
            this.activeFilter = filterName;
        }
    },
    mounted() {
        this.$store.commit("activePage", 2);
        this.$loading.Start();
        this.$http
            .GetAllMessages()
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.messages = response.data.messages;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("تنبيه لا يوجد اي رسائل");
                }
            })
            .catch(error => {
                this.$loading.Stop();
                this.loaded = true;
                this.$alert.BadRequest(error.response);
            });
    },
    computed: {
        filterMessage() {
            var list = [];
            if (this.activeFilter == "all") {
                list = this.messages;
            } else if (this.activeFilter == "active") {
                for (var i = 0; i < this.messages.length; i++)
                    if (this.messages[i].state) list.push(this.messages[i]);
            } else if (this.activeFilter == "notActive") {
                for (var i = 0; i < this.messages.length; i++)
                    if (!this.messages[i].state) list.push(this.messages[i]);
            }
            return list;
        }
    },
    created() {}
};