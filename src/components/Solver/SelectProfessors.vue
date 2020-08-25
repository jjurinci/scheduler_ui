<template>
<div class="container-fluid">
    <SolverNavigation :whoIsParent="'selectProfessors'" @toggleLegend="toggleLegend"/>
    <hr/>
    
    <ul v-if="legend" class="list-group" style="float:left; position: relative; margin:0px; 0px 0px 0px;">
        <li v-for="j in 16" :key="j" class="list-group-item">{{j}} : {{dayHours[j]}}</li>
    </ul>
    
    <button @click="getHighlighted" class="nextBTN mt-4">Next</button>


    <h3 class="mt-4">Select available teaching hours for all professors</h3>

    <div class="row">
        <div v-for="professor in propData.professors" :key="professor._id" class="col-12 mt-4">
            <h5 class="mb-4">{{professor.firstName + " " + professor.lastName}}</h5>

            <HighlightTable :id="professor._id" :ref="professor._id"/>
            
            <div class="btn-group mt-4">
                <button @click="selectAll(professor._id, true)" class="selectBTN mr-2">Select all</button>
                <button @click="selectAll(professor._id, false)" class="selectBTN">Deselect all</button>
            </div>
            <hr/>
        </div>
    </div>
</div>    
</template>

<script>
import HighlightTable from '@/components/HighlightTable.vue'
import SolverNavigation from './SolverNavigation.vue'
export default {
    props: {
        propData: Object
    },
    components: {
        HighlightTable,
        SolverNavigation
    },
    data(){
        return {
            weekDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            dayHours: {
                1: "08:00-08:45", 2: "08:50-09:35", 3: "10:00-10:45",
                4: "10:50-11:35", 5: "11:40-12:25", 6: "12:30-13:15",
                7: "13:15-14:00", 8: "14:00-14:40", 9: "14:45-15:25",
                10: "15:30-16:10", 11: "16:15-16:55", 12: "17:00-17:40",
                13: "17:45-18:25", 14: "18:30-19:10", 15: "19:15-20:00",
                16: "20:05-20:50"
            },
            legend: false,
        }
    },
    methods: {
        selectAll(professorId, all = true){
            if(all) this.$refs[professorId][0].highlightAll()
            else this.$refs[professorId][0].removeHighlightAll()
        },
        getHighlighted(){
            for(let i=0; i<this.propData.professors.length; i++){
                let prof = this.propData.professors[i]._id
                this.propData.professors[i].free = this.$refs[prof][0].getHighlighted()
            }
            let propData = this.propData
            this.$router.push({ name: 'Solver Classrooms', params: {propData: propData} })
        },
        toggleLegend(){
            this.legend = !this.legend
        }
    },
    mounted(){

    },
}
</script>

<style lang="scss" scoped>
.vue-slider .vue-slider-dot{
    width:20px !important;
    height:20px !important;
}

.nextBTN{
    border-radius:10px;
    outline: none;
    height: 100%;
    font-size: 20px;
    background-color: #3E6781;
    color: white;
    border: 1px solid #3E6781; 
    text-align:center !important;
    width: 150px;
    height:40px;
}

.selectBTN{
    height: 40px;
    width: 150px;
    font-size: 20px;
    outline: none;
    border-radius:10px;
    background-color: white;
    color: #3E6781;
    border: 1px solid #3E6781; 
    text-align:center !important;
}
.selectBTN:hover{
    background-color: #3E6781;
    color: white;
}
</style>