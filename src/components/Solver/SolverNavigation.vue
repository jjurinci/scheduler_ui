<template>
<div class="row w-100 mt-3" style="padding:0; margin:0;">
    <div class="col-4">
        <h2 class="text-left mr-4" style="font-weight: bold;">Genetic algorithm</h2>
    </div>

    <div v-if="whoIsParent == 'selectSubjects'" class="col-8 text-right" style="">
        <!--<select class="form-control w-50 d-inline mr-3" placeholder="Select timetable">
            <option>Zimski 2019/2020</option>
            <option>Timetable 2</option>
        </select>-->
        <button @click="subjectWinter" :class="(subjectSeason == 'winter') ? 'topBTN topBTNactive d-inline mr-2' :'topBTN d-inline mr-2'">Winter</button>
        <button @click="subjectSummer" :class="(subjectSeason == 'summer') ? 'topBTN topBTNactive d-inline mr-2' :'topBTN d-inline mr-2'">Summer</button>
        <button @click="detailSubject" class="topBTN d-inline mr-4" style="width:40px; height:40px;"><i class="fas fa-info"></i></button>
    </div>

    <div v-if="whoIsParent == 'selectProfessors' || whoIsParent ==  'selectClassrooms'" class="col-8 text-right">
        <button @click="toggleLegend" class="topBTN" style="width:40px;"><i class="fas fa-map-signs"></i></button>
    </div>

    <div v-if="whoIsParent == 'solverResults'" class="col-8 text-right">
        <button @click="startSolver" v-if="!startActive && !finalTimetables" class="topBTN topBTNactive d-inline mr-2" style="background-color: #0275d8  !important; border: 1px solid  #0275d8;">
            Start
        </button>
        <button v-if="startActive && !finalTimetables" class="topBTN topBTNactive d-inline mr-2" style="background-color:  #0275d8 !important" disabled>Start</button>
        <button @click="stopSolver" v-if="!stopActive && !finalTimetables" class="topBTN trash d-inline mr-2">Stop and get results</button>
        <button v-if="stopActive && !finalTimetables" class="topBTN trash d-inline mr-2" disabled>Stop and get results</button>
    </div>
    <hr/>
</div>
</template>

<script>
export default {
    props: {
        whoIsParent: String,
        finalTimetables: Object
    },
    data(){
        return {
            subjectSeason: 'winter',
            startActive: false,
            stopActive: false
        }
    },
    methods: {
        subjectWinter(){
            if(this.subjectSeason == 'winter') return
            this.subjectSeason = 'winter'
            this.$emit('winterSubjects')
        },
        subjectSummer(){
            if(this.subjectSeason == 'summer') return
            this.subjectSeason = 'summer'
            this.$emit('summerSubjects')
        },
        detailSubject(){
            this.$emit('detailsSubject')
        },
        toggleLegend(){
            this.$emit('toggleLegend')
        },

        startSolver(){
            this.startActive = true
            this.$emit('startSolver')
        },
        stopSolver(){
            this.stopActive = true
            this.$emit('stopSolver')
        }
    }
}
</script>

<style lang="scss" scoped>
.topBTN{
    height: 40px;
    width: 100px;
    font-size: 20px;
    outline: none;
    border-radius:10px;
    background-color: white;
    color: #3E6781;
    border: 1px solid #3E6781; 
    text-align:center !important;
}
.topBTNactive{
    color: white;
    background-color: #3E6781;
}
.topBTN i{
    font-size:20px;
    vertical-align:middle;
}
.topBTN:hover{
    background-color: #3E6781;
    color: white;
}

.trash{
    background-color: white;
    color: #d9534f;
    border: 1px solid #d9534f;
    width: 250px;
}

.trash:hover{
    background-color:#d9534f !important;
    color: white;
    border: 1px solid white !important;
}
</style>