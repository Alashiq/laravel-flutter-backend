
export default {
    data() {
        return {
            role: [],
            formData: {
                name: "",
                permissions: []
            },
            formValidate: {
                name: "",
                permissions: ""
            },
            loaded: false
        };
    },
    methods: {
        togglePermission(index) {
            this.role.permissions[index].state = !this.role.permissions[index]
                .state;
        },
        editRole: function() {
            this.formData.permissions = [];

            for (var i = 0; i < this.role.permissions.length; i++) {
                if (this.role.permissions[i].state == true)
                    this.formData.permissions.push(
                        this.role.permissions[i].name
                    );
            }

            this.validateName();
            this.validatePermissions();
            if (this.formValidate.name != "") return 0;
            if (this.formValidate.permissions != "") return 0;

        this.$loading.Start();
        this.$http
            .UpdateRole(this.$route.params.id, this.formData)
            .then(response => {
                this.$loading.Stop();
                if (response.status == 200) {
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("هذا الدور غير موجود");
                }
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
        validatePermissions: function() {
            this.formValidate.permissions = "";
            if (this.formData.permissions.length == 0) {
                this.formValidate.permissions =
                    "يجب عليك اختيار صلاحية واحدة على الأقل";
                return 1;
            }
        }
    },
    mounted() {
        this.$store.commit("activePage", 4);

        this.$loading.Start();
        this.$http
            .GetRoleById(this.$route.params.id)
            .then(response => {
                this.$loading.Stop();
                this.loaded = true;
                if (response.status == 200) {
                    this.role = response.data.role;
                    this.formData.name = this.role.name;
                    this.$alert.Success(response.data.message);
                } else if (response.status == 204) {
                    this.$alert.Empty("هذا الدور غير موجود");
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
