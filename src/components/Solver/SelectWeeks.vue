<template>
<div class="container-fluid">
    <SolverNavigation/>
    <hr/>
    <form class="col-6 mx-auto" style="margin-top:40px;">        
        <div class="form-group mb-4">
            <i class="fas fa-calendar-week mb-4" style="font-size:100px;"></i>
            <h2 class="inputWeeksLabel">Number of weeks in year's semester</h2>
            <input v-model="weeks" type="number" class="form-control inputWeeks w-75 mx-auto mb-3" placeholder="17"/>
            <small style="font-size:15px;">Example: a semester might have 17 weeks at your faculty.</small>
        </div>
        
        <button @click.prevent="$router.push({name: 'Solver Subjects', params: {propData: {weeks: calculatedWeeks}}})" v-if="this.calculatedWeeks > 0" class="nextBTN">
            Next
        </button>
        <button v-else class="btn btn-primary btn-lg" disabled>Next</button>

        <p style="color: red;" class="mt-4">{{feedback}}</p>
    </form>
</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import SolverNavigation from './SolverNavigation.vue'
import $ from 'jquery'
export default {
    components: {
        Datepicker,
        SolverNavigation
    },
    data(){
        return {
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            weeks: 17,
            feedback: '',
            calculatedWeeks: 17,
        }
    },

    methods: {
        checkDates(){
            this.feedback = ''

            if(this.weeks > 0){
                this.calculatedWeeks = parseInt(this.weeks)
            }
            
            else this.feedback = "Enter a valid input."
        },
    },
}
</script>

<style lang="scss" scoped>
.nextBTN{
    border-radius:10px;
    outline: none;
    height: 100%;
    font-size: 25px;
    background-color: #3E6781;
    color: white;
    border: 1px solid #3E6781; 
    text-align:center !important;
    width: 350px;
    height:60px;
}

.inputWeeks{
    border: none;
    border-radius:0;

    width:800px;
    border: 1px solid lightgray;
    border-radius: 5px;
    font-size:20px;
    text-align:center;
}

.inputWeeks:focus{
    border: 1px solid black;
    box-shadow: none;
}

.inputWeeksLabel{
    margin-bottom:20px;
}
</style>