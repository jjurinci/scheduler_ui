<template>
<div class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar">
        <div class="sidebar-header">
            <h3 id="logo"><i class="fas fa-stream"></i></h3>
        </div>

        <ul class="list-unstyled tabs">
            <li v-if="user"
                :class="(active == 'Workspace') ? 'active' : ''">
                <router-link to="/"><i class="fas fa-calendar-alt"></i></router-link>
            </li>
            <li v-if="user" 
                :class="(active == 'Faculties') ? 'active' : ''">
                <router-link to="/data/faculties"><i class="fas fa-database"></i></router-link>

            </li>
            <li v-if="user" 
                :class="(active == 'Solver Weeks') ? 'active' : ''">
                <router-link to="/solver/weeks"><i class="fas fa-dna"></i></router-link>
            </li>
            <li v-if="user" @click="active = 'Profile'"
                :class="(active == 'Profile') ? 'active' : ''">
                <router-link to="/profile"><i class="fas fa-user"></i></router-link>
            </li>
            <li v-if="user" @click="active = 'Logout'"
                :class="(active == 'Logout') ? 'active': ''"
                style="margin-top:50px; font-size:15px; color:gray;">

                <a @click="logout" href="" class="nav-link">Logout</a>
            </li>

            <li v-if="!user" 
                :class="(active == 'Login') ? 'active': ''"
                style="margin-top:50px; font-size:15px; color:gray; padding:20px 0px 20px 0px;">

                <router-link to="/login">Login</router-link>
            </li>
            <li v-if="!user" 
                :class="(active == 'Register') ? 'active': ''"
                style="font-size:15px; color:gray; padding:20px 0px 20px 0px;">

                <router-link to="/register">Register</router-link>
            </li>

        </ul>
    </nav>

</div>
</template>

<script>
export default {
    data(){
        return {
            active: 'timetable',
            user: null,
        }
    },
    methods: {
        async logout(){
            await localStorage.removeItem('user')
            this.$router.push({name: 'Login'})
        }
    },
    async mounted(){
        this.user = JSON.parse(await localStorage.getItem('user'))
        this.active = this.$route.name
    },
    watch: {
        $route(to, from){
            this.active = to.name
        }
    }
}
</script>

<style lang="scss" scoped>
//Sidebar
.wrapper {
    display: flex;
    align-items: stretch;
    //border: 1px solid #3E6781;
    height:100%;
}

#sidebar {
    width: 100%;
}

#sidebar ul{
    margin: 0px;
}

#logo{
    margin: 20px 0px 80px 0px;
}

#logo i{
    color: #3E6781;
    font-size: 40px;
}
.tabs{
    font-size:25px;
    margin: 60px 0px 0px 20px;
}

.tabs li{
    margin: 0 auto;
    width: 100%;
    padding: 0px !important;
    //padding: 10px 0px 10px 0px;
}

.tabs .active{
    border-left: 3px solid ;    
}

.tabs .active a{
    color: #3E6781;
}

.tabs li a{
    color: gray;
    text-decoration: none !important;
    display:inline-block;
    padding: 15px 0px 15px 0px;
}
</style>