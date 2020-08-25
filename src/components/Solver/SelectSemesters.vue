<template>
<div class="container-fluid">
    <SolverNavigation/>
    <hr/>
    
    <h2 class="mt-4">Semesters (preview only)</h2>
    <small>That have been derived from selected subjects.</small> <br/>

    <button @click="$router.push({ name: 'Solver Professors', params: {propData: propData} })" class="nextBTN mt-3">
        Next
    </button>
    <div class="col-12 mt-4">
      <vue-table-dynamic :params="params" ref="table"></vue-table-dynamic>
    </div>
    

</div>
</template>

<script>
import SolverNavigation from './SolverNavigation.vue'
export default {
    props: {
        propData : Object,
    },
    components: {
        SolverNavigation
    },
    data(){
        return {
            params: {
              data: [
                ['#', 'Name', 'Faculty', 'Students', 'Season'],
              ],
              header: 'row',
              border: true,
              stripe: true,
              enableSearch: true,
              sort: [0,1,2,3,4],
              pagination: true,
              highlight: {row: [1]},
            }
        }
    },

    mounted(){
        for(let i=0; i<this.propData.semesters.length; i++){
            let s = this.propData.semesters[i]
            let row = [i+1, s.name, s.facultyName, s.numStudents, s.season]
            this.params.data.push(row)
        }
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
</style>