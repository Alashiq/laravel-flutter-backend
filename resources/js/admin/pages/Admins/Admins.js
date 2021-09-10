
import Swal from "sweetalert2";
export default {
    data() {
        return {
            admins: [],
            loaded: false,
            filter: [
                {
                    link: "all",
                    name: "الكل",
                    active: true
                },
                {
                    link: "active",
                    name: "المفعلين",
                    active: false
                },
                {
                    link: "notActive",
                    name: "الغير مفعل",
                    active: true
                },
                {
                    link: "banned",
                    name: "المحظورين",
                    active: true
                }
            ],
            activeFilter: "all"
        };
    },
    methods: {
        activeAdmin: function(id, index) {
            Swal.fire({
                title: "هل أنت متأكد",
                text: "هل أنت متأكد من أنك تريد تفعيل هذا الحساب !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#16a085",
                cancelButtonColor: "#d33",
                confirmButtonText: "نعم تفعيل",
                cancelButtonText: "إلغاء"
            }).then(result => {
                if (result.isConfirmed) {
                    this.$loading.Start();
                    this.$http
                        .ActiveAdmin(id)
                        .then(response => {
                            this.$loading.Stop();
                            if (response.status == 200) {
                                this.admins[this.admins.findIndex(m => m.id === id)].state = 1;
                                this.$alert.Success(response.data.message);
                            } else if (response.status == 204) {
                                this.$alert.Empty(
                                    "لم يعد هذا الحساب متوفرة, قد يكون شخص أخر قام بحذفه"
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
        disActiveAdmin: function(id, index) {
            Swal.fire({
                title: "هل أنت متأكد",
                text: "هل أنت متأكد من أنك تريد الغاء تفعيل هذا الحساب !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#16a085",
                cancelButtonColor: "#d33",
                confirmButtonText: "نعم إلغاء التفعيل",
                cancelButtonText: "إلغاء"
            }).then(result => {
                if (result.isConfirmed) {
                    this.$loading.Start();
                    this.$http
                        .DisActiveAdmin(id)
                        .then(response => {
                            this.$loading.Stop();
                            if (response.status == 200) {
                                this.admins[this.admins.findIndex(m => m.id === id)].state = 0;
                                this.$alert.Success(response.data.message);
                            } else if (response.status == 204) {
                                this.$alert.Empty(
                                    "لم يعد هذا الحساب متوفرة, قد يكون شخص أخر قام بحذفه"
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
        bannedAdmin: function(id, index) {
            Swal.fire({
                title: "هل أنت متأكد",
                text:
                    "هل أنت متأكد من أنك تريد حظر هذا الحساب ؟ إذا قمت بحظر الحساب فلا يمكنك استخدامه مجددا",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#16a085",
                cancelButtonColor: "#d33",
                confirmButtonText: "نعم حظر الحساب",
                cancelButtonText: "إلغاء"
            }).then(result => {
                if (result.isConfirmed) {
                    this.$loading.Start();
                    this.$http
                        .BannedAdmin(id)
                        .then(response => {
                            this.$loading.Stop();
                            if (response.status == 200) {
                                this.admins[this.admins.findIndex(m => m.id === id)].state = 2;
                                this.$alert.Success(response.data.message);
                            } else if (response.status == 204) {
                                this.$alert.Empty(
                                    "لم يعد هذا الحساب متوفرة, قد يكون شخص أخر قام بحذفه"
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
        changeFilter(filterName) {
            this.activeFilter = filterName;
        }
    },
    mounted() {
        this.$store.commit("activePage", 3);
        this.$loading.Start();
        this.$http
            .GetAllAdmins()
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.admins = response.data.data;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("تنبيه لا يوجد اي مشرفين");
                }
            })
            .catch(error => {
                this.loaded = true;
                this.$loading.Stop();
                this.$alert.BadRequest(error.response);
            });
    },
    computed: {
        filterAdmin() {
            var list = [];
            if (this.activeFilter == "all") {
                list = this.admins;
            } else if (this.activeFilter == "active") {
                for (var i = 0; i < this.admins.length; i++)
                    if (this.admins[i].state == 1) list.push(this.admins[i]);
            } else if (this.activeFilter == "notActive") {
                for (var i = 0; i < this.admins.length; i++)
                    if (this.admins[i].state == 0) list.push(this.admins[i]);
            } else if (this.activeFilter == "banned") {
                for (var i = 0; i < this.admins.length; i++)
                    if (this.admins[i].state == 2) list.push(this.admins[i]);
            }
            return list;
        }
    },
    created() {}
};
