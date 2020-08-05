<template>
<nav class="nav nav-pills nav-justified">
    <router-link to="/data/professors" class="nav-item nav-link active">Professors</router-link>
    <router-link to="/data/semesters" class="nav-item nav-link">Semesters</router-link>
    <router-link to="/data/schedules" class="nav-item nav-link">Courses</router-link>
    <router-link to="/data/classrooms" class="nav-item nav-link">Classrooms</router-link>
</nav>
</template>

<script>
export default {
    data(){
        return {

        }
    },
}
</script>

<style lang="scss" scoped>

</style>