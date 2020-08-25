<template>
  <div id="app">
    <div class="row w-100"> <!-- mx-auto-->
      <div class="col-md-1 col-2" style="padding-right:0px;">
        <Sidebar/>
      </div>
      <div class="col-md-11 col-10" style="padding-left:0px; padding-right:0px;">
      <router-view/>
    </div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
export default {
  data(){
    return {
    }
  },
  components: {
    Navbar,
    Sidebar
  },
  async mounted(){

  }
}
</script>

<style lang="scss">
#app {
  font-family: Geneva, Avenir, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
