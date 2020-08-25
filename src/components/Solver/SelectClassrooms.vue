<template>
<div class="container-fluid">
    <SolverNavigation :whoIsParent="'selectClassrooms'" @toggleLegend="toggleLegend"/>
    <hr/>
    
    <ul v-if="legend" class="list-group" style="float:left; position: relative; margin:0px; 0px 0px 0px;">
        <li v-for="j in 16" :key="j" class="list-group-item">{{j}} : {{dayHours[j]}}</li>
    </ul>
    
    <button @click="getHighlighted" class="nextBTN mt-4">Next</button>


    <h3 class="mt-4">Select available teaching hours for all classrooms</h3>
    <div class="row">
        <div v-for="classroom in this.classrooms" :key="classroom._id" class="col-12 mt-4">
            <h5 class="mb-4">
                <span class="mr-1">{{classroom.name}} |</span>
                <span class="mr-3"><i class="fas fa-chair"></i> {{classroom.capacity}}</span> 
                
                <span>
                    <i class="fas fa-tv mr-1"></i>
                    <div v-if="!classroom.hasComputers" class="circle" style="width: 8px; height:8px; background-color:red;"></div>
                    <div v-else class="circle" style="width: 8px; height:8px; background-color:#7FFF00;"></div>
                </span>
             </h5>

            <HighlightTable :id="classroom._id" :ref="classroom._id"/>
            <div class="btn-group mt-4">
                <button @click="selectAll(classroom._id, true)" class="selectBTN mr-2">Select All</button>
                <button @click="selectAll(classroom._id, false)" class="selectBTN">Deselect All</button>
            </div>
            <hr/>
        </div>
    </div>
</div> 
</template>

<script>
import HighlightTable from '@/components/HighlightTable.vue'
import classroomService from '@/services/classroomService'
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
            user: null,
            classrooms: [],

            weekDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            dayHours: {
                1: "08:00-08:45", 2: "08:50-09:35", 3: "10:00-10:45",
                4: "10:50-11:35", 5: "11:40-12:25", 6: "12:30-13:15",
                7: "13:15-14:00", 8: "14:00-14:40", 9: "14:45-15:25",
                10: "15:30-16:10", 11: "16:15-16:55", 12: "17:00-17:40",
                13: "17:45-18:25", 14: "18:30-19:10", 15: "19:15-20:00",
                16: "20:05-20:50"
            },
            moreInfo: false,            
            legend: false,
        }
    },

    methods: {
        selectAll(classroomId, all = true){
            if(all) this.$refs[classroomId][0].highlightAll()
            else this.$refs[classroomId][0].removeHighlightAll()
        },
        async getHighlighted(){
            for(let i=0; i<this.classrooms.length; i++){
                let classroom = this.classrooms[i]._id
                this.classrooms[i].free = this.$refs[classroom][0].getHighlighted()
            }
            this.propData.classrooms = this.classrooms
            let propData = this.propData
            this.$router.push({ name: 'Solver Results', params: {propData: propData} })
        },
        toggleLegend(){
            this.legend = !this.legend
        }
    },

    async mounted(){
        this.user = JSON.parse(await localStorage.getItem('user'))
        this.classrooms = (await classroomService.getClassrooms()).filter(el => el.userId == this.user._id)
    }
}
</script>

<style lang="scss" scoped>
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
.circle {
    background: #f00;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display:inline-block;
}
</style>