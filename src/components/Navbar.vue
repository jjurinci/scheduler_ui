<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Scheduler</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link to="/" class="nav-link">Timetable</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/data/professors" class="nav-link">Data</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/home" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/solver" class="nav-link">Solver</router-link>
            </li>
        </ul>
    </div>

    <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <router-link to="/login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/register" class="nav-link">Register</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/profile" class="nav-link">Profile</router-link>
            </li>
        </ul>
    </div>
    </nav>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>

</style>