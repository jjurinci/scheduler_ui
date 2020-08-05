import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Timetable from '../views/Timetable.vue'
import Solver from '../views/Solver.vue'
import DataClassrooms from '../components/DataClassrooms.vue'
import DataProfessors from '../components/DataProfessors.vue'
import DataSemesters from '../components/DataSemesters.vue'
import DataSchedules from '../components/DataSchedules.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/data/classrooms',
    name: 'Classrooms',
    component: DataClassrooms
  },
  {
    path: '/data/schedules',
    name: 'Schedules',
    component: DataSchedules
  },
  {
    path: '/data/professors',
    name: '/Professors',
    component: DataProfessors
  },
  {
    path: '/data/semesters',
    name: 'Semesters',
    component: DataSemesters
  },
  {
    path: '/solver',
    name: 'Solver',
    component: Solver
  },
  {
    path: '/',
    name: 'Timetable',
    component: Timetable
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
