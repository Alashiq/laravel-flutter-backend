export default {
    state: () => ({
        loadAuth: false,
        auth: false,
        user: {
            id: null,
            name: "",
            username: "",
            photo: "",
            role:""
        },
        permissions: [],
        pageList: [
            {
                id: 1,
                name: "الرئيسية",
                role: "HomeChart",
                active: true,
                path: "/admin",
                icon: "fas fa-home"
            },

            {
                id: 2,
                name: "الرسائل",
                role: "ReadMessage",
                active: false,
                path: "/admin/message",
                icon: "fas fa-comment-dots"
            },

            {
                id: 3,
                name: "المشرفين",
                role: "ReadAdmin",
                active: false,
                path: "/admin/admin",
                icon: "fas fa-users"
            },
            {
                id: 4,
                name: "أدوار المشرفين",
                role: "ReadRole",
                active: false,
                path: "/admin/role",
                icon: "fas fa-user-shield"
            },            {
                id: 5,
                name: "مستخدمي التطبيق",
                role: "ReadUser",
                active: false,
                path: "/admin/user",
                icon: "fas fa-user-shield"
            }
        ],
        menu: false,
        loading:false
    }),

    mutations: {
        setUser(state, data) {
            state.user = data;
            state.auth = true;
        },
        setPermissions(state, data) {
            state.permissions = data;
        },
        authLoaded(state) {
            state.loadAuth = true;
        },
        clearUser(state) {
            state.user = {
                id: null,
                name: "",
                username: "",
                photo: ""
            };
            state.auth = false;
            state.loadAuth = false;
        },
        updateName(state, name) {
            state.user.name = name;
        },
        updatePhoto(state, photo) {
            state.user.photo = photo;
        },
        activePage(state, pageNumber) {
            for (var i = 0; i < state.pageList.length; i++) {
                if (state.pageList[i].id == pageNumber)
                    state.pageList[i].active = true;
                else state.pageList[i].active = false;
            }
        },
        toggleMenu(state) {
            state.menu = !state.menu;
        },
        loadingStart(state) {
            state.loading = true;
        },
        loadingStop(state) {
            state.loading = false;
        },
    },

    actions: {
        // If 401 Error
        async clearAuth({ commit }) {
            this.commit("clearUser");
        },

    }
};
