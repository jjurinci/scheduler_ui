import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import DataClassrooms from '../components/DataClassrooms.vue'
import DataProfessors from '../components/DataProfessors.vue'
import DataSemesters from '../components/DataSemesters.vue'
import DataFaculties from '../components/DataFaculties.vue'
import DataSubjects from '../components/DataSubjects.vue'
import SelectSubjects from '../components/Solver/SelectSubjects.vue'
import SelectWeeks from '../components/Solver/SelectWeeks.vue'
import SelectSemesters from '../components/Solver/SelectSemesters.vue'
import SelectProfessors from '../components/Solver/SelectProfessors.vue'
import SelectClassrooms from '../components/Solver/SelectClassrooms.vue'
import SolverResults from '../components/Solver/SolverResults.vue'
import SolverCalendar from '../components/Solver/SolverCalendar.vue'
import Workspace from '../views/Workspace/Workspace.vue'

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
    path: '/data/professors',
    name: 'Professors',
    component: DataProfessors
  },
  {
    path: '/data/semesters',
    name: 'Semesters',
    component: DataSemesters
  },
  {
    path: '/data/faculties',
    name: 'Faculties',
    component: DataFaculties
  },
  {
    path: '/data/subjects',
    name: 'Subjects',
    component: DataSubjects
  },
  {
    path: '/solver',
    name: 'Solver Subjects',
    component: SelectSubjects,
    props: true
  },
  {
    path: '/solver/weeks',
    name: 'Solver Weeks',
    component: SelectWeeks
  },
  {
    path: '/solver/semesters',
    name: 'Solver Semesters',
    component: SelectSemesters,
    props: true
  },
  {
    path: '/solver/professors',
    name: 'Solver Professors',
    component: SelectProfessors,
    props: true
  },
  {
    path: '/solver/classrooms',
    name: 'Solver Classrooms',
    component: SelectClassrooms,
    props: true
  },
  {
    path: '/solver/results',
    name: 'Solver Results',
    component: SolverResults,
    props: true
  },
  {
    path: '/solver/calendar',
    name: 'Solver Calendar',
    component: SolverCalendar,
    props: true
  },
  {
    path: '/',
    name: 'Workspace',
    component: Workspace
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  let user = await localStorage.getItem('user')
  if(!user && to.name != 'Login' && to.name != 'Register'){
    next('/login')
  }
  else next()
})

export default router
