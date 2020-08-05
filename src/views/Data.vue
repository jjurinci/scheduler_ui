<template>
    <div class="container-fluid">
        <Toolbar class="mx-auto w-75" style="margin-top:50px;"/>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    components: {
        Toolbar
    }
}
</script>

<style lang="scss" scoped>


</style>