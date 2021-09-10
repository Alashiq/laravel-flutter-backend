export default {
    Start() {
        root.$store.commit("loadingStart");
    },
    Stop() {
        root.$store.commit("loadingStop");
    },
}