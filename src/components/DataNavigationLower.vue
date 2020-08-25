<template>
<div class="col-12">
    <button @click="$router.push('Faculties')"
            :class="(clickedSeason == 'Faculties') ? 'NavigationLowerBTN NavigationLowerBTNActive mr-2' : 'NavigationLowerBTN mr-2'">
            <!--<router-link to="/data/faculties">Faculties</router-link>-->
            Faculties
    </button>
    
    <button @click="$router.push('Semesters')"
            :class="(clickedSeason == 'Semesters') ? 'NavigationLowerBTN NavigationLowerBTNActive mr-2' : 'NavigationLowerBTN mr-2'">
            <!--<router-link to="/data/semesters">Semesters</router-link>-->
            Semesters
    </button>
    
    <button @click="$router.push('Professors')"
            :class="(clickedSeason == 'Professors') ? 'NavigationLowerBTN NavigationLowerBTNActive mr-2' : 'NavigationLowerBTN mr-2'">
            <!--<router-link to="/data/professors">Professors</router-link>-->
            Professors
    </button>
    
    <button @click="$router.push('Subjects')"
            :class="(clickedSeason == 'Subjects') ? 'NavigationLowerBTN NavigationLowerBTNActive mr-2' : 'NavigationLowerBTN mr-2'">
            <!--<router-link to="/data/subjects">Subjects</router-link>-->
            Subjects
    </button>
    
    <button @click="$router.push('Classrooms')"
            :class="(clickedSeason == 'Classrooms') ? 'NavigationLowerBTN NavigationLowerBTNActive mr-2' : 'NavigationLowerBTN mr-2'">
            <!--<router-link to="/data/classrooms">Classrooms</router-link>-->
            Classrooms
    </button>
</div>
</template>

<script>
export default {
    data(){
        return {
            clickedSeason: 'faculties',
        }
    },

    mounted(){
        this.clickedSeason = this.$route.name
        console.log(this.$route.name)
    }
}
</script>

<style lang="scss" scoped>
.NavigationLowerBTN{
    background-color:white;
    font-size:20px;
    font-weight: bold;
    color:lightgray;
    outline: none;
    border: none;
}
.NavigationLowerBTN:hover{
    color: #003366;
    border-top: 3px solid #003366;
    color: #003366;
}

.NavigationLowerBTNActive{
    color: #003366;
    border-top: 3px solid #003366;
}

</style>