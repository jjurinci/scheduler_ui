<template>
    <div class="container" style="margin-top:120px;">
        <h1 class="text-center mb-4" style="color: #0069d9; font-weight:bold;">Register</h1>
        <form class="w-75 mx-auto">
            <div class="form-group">
                <input v-model="firstName" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="First name">
            </div>
            <div class="form-group">
                <input v-model="lastName" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Last name">
            </div>
            <div class="form-group">
                <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email">
            </div>
            <div class="form-group">
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
            <div class="form-group">
                <input v-model="confirmPassword" type="password" class="form-control" id="exampleInputPassword1" placeholder="Confirm password">
            </div>
            <p style="color:red;">{{feedback}}</p>
            <button @click.prevent="register" class="btn btn-primary btn-lg">Register</button>
        </form>
    </div>
</template>

<script>
import userService from '@/services/userService'
export default {
    data(){
        return{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            feedback: ''
        }
    },
    methods: {
        async register(){
            try{
                let user = {firstName: this.firstName, lastName: this.lastName, email: this.email,
                        password: this.password, confirmPassword: this.confirmPassword}
                let response = await userService.register(user)
                user = response.data.user
                user.token = response.token
                await localStorage.setItem('user', JSON.stringify(user))
                this.$router.push({name: 'Timetable'}, () => this.$router.go(0))
            }
            catch(err){
                this.feedback = err.response.data.message;
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