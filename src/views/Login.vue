<template>
    <div class="container" style="margin-top:150px;">
        <form class="mx-auto">
        <h1 class="text-center mb-4" style="color: #0069d9; font-weight:bold;">Login</h1>
            <div class="form-group mb-4">
                <input v-model="email"  type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            </div>
            <div class="form-group">
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
            <p style="color:red;">{{feedback}}</p>
            <button @click.prevent="login" class="btn btn-primary btn-lg">Login</button>
        </form>
    </div>
</template>

<script>
import userService from '@/services/userService'
export default {
    data(){
        return {
            email: '',
            password: '',
            feedback: ''
        }
    },
    methods: {
        async login(){
            try{
                let user = {email: this.email, password: this.password}
                let response = await userService.login(user)
                user = response.data.user
                user.token = response.token
                await localStorage.setItem('user', JSON.stringify(user))
                this.$router.push({name: 'Timetable'}, () => this.$router.go(0))
            }
            catch(err){
                this.feedback = err.response.data.message
            }
        }
    }
}
</script>

<style lang="scss" scoped>
input{
    height:50px;
    width:500px;
    margin: 0 auto;
    font-size:20px;
}
button{
    width:150px;
    border-radius:20px;
}
</style>