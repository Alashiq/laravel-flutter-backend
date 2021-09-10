<template>
    <div
        class="h-16 w-full bg-white mb-8 flex justify-between items-center px-4 layout-shadow"
    >
        <div @click="toggleMenu" class="h-16 w-16 text-gray-600 flex items-center justify-center text-3xl hover:text-red-400 cursor-pointer md:hidden">
            <i class="fas fa-bars"></i>
        </div>
        <div></div>
        <div class="h-16 flex items-center">
            <div>{{ user.name }}</div>
            <img :src="user.photo" class="h-10 w-10 rounded-full mr-2" />
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {};
    },
    methods: {
        toggleMenu(){
                    this.$store.commit("toggleMenu");
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    }
};
</script>

<style></style>
