
import Swal from "sweetalert2";
export default {
    data() {
        return {
            roles: [],
            loaded: false
        };
    },
    methods: {
        deleteRole: function(id, index) {
            Swal.fire({
                title: "هل أنت متأكد",
                text: "هل أنت متأكد من أنك تريد حذف هذا الدور !",
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
                        .DeleteRole(id)
                        .then(response => {
                            this.$loading.Stop();
                            if (response.status == 200) {
                                this.roles.splice(index, 1);
                                this.$alert.Success(response.data.message);
                            } else if (response.status == 204) {
                                this.$alert.Empty(
                                    "لم يعد هذا الدور متوفر, قد يكون شخص أخر قام بحذفه",
                                );
                            }
                        })
                        .catch(error => {
                            this.$loading.Stop();
                            this.$alert.BadRequest(error.response);
                        });
                }
            });
        }
    },
    mounted() {
        this.$store.commit("activePage", 4);
        this.$loading.Start();
        this.$http
            .GetAllRoles()
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.roles = response.data.roleList;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("تنبيه لا يوجد اي أدوار");
                }
            })
            .catch(error => {
                this.loaded = true;
                this.$loading.Stop();
                this.$alert.BadRequest(error.response);
            });
    },
    computed: {}
};
