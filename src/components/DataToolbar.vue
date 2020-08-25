<template>
<nav class="nav nav-pills nav-justified">
    <router-link to="/data/faculties" 
        :class="route == 'Faculties' ? 'nav-item nav-link active' : 'nav-item nav-link'">
        Faculties
    </router-link>
    
    <router-link to="/data/semesters"
        :class="route == 'Semesters' ? 'nav-item nav-link active' : 'nav-item nav-link'">
        Semesters
    </router-link>
    
    <router-link to="/data/subjects"
        :class="route == 'Subjects' ? 'nav-item nav-link active' : 'nav-item nav-link'">
        Subjects
    </router-link>
    
    <router-link to="/data/professors"
        :class="route == 'Professors' ? 'nav-item nav-link active' : 'nav-item nav-link'">
        Professors
    </router-link>
    
    <router-link to="/data/classrooms"
        :class="route == 'Classrooms' ? 'nav-item nav-link active' : 'nav-item nav-link'">
        Classrooms
    </router-link>
</nav>
</template>

<script>
export default {
    data(){
        return {
            route: 'Faculties',
        }
    },

    mounted(){
        this.route = this.$router.currentRoute.name
    }
}
</script>

<style lang="scss" scoped>

</style>