<template>
<div class="row w-100 mt-3" style="padding:0; margin:0;">
    <div class="col-4">
        <h2 class="text-left mr-4" style="font-weight: bold;">Data Input</h2>
    </div>

    <div class="col-8 text-right" style="">
        <button @click="add" class="topBTN d-inline mr-2"><i class="fas fa-plus-circle"></i></button>
        <button @click="edit" class="topBTN d-inline mr-2"><i class="fas fa-edit"></i></button>
        <button @click="remove" class="topBTN d-inline trash mr-2"><i class="fas fa-trash-alt"></i></button>
    </div>
    <hr/>
</div>
</template>

<script>
export default {
    props: {
        whoIsParent: String
    },
    data(){
        return {

        }
    },
    methods: {
        add(){
            if(this.whoIsParent == 'semester') this.$emit('addSemester')
            else if(this.whoIsParent == 'faculty') this.$emit('addFaculty')
            else if(this.whoIsParent == 'professor') this.$emit('addProfessor')
            else if(this.whoIsParent == 'classroom') this.$emit('addClassroom')
            else if(this.whoIsParent == 'subject') this.$emit('addSubject')
        },
        edit(){
            if(this.whoIsParent == 'semester') this.$emit('editSemester')
            else if(this.whoIsParent == 'faculty') this.$emit('editFaculty')
            else if(this.whoIsParent == 'professor') this.$emit('editProfessor')
            else if(this.whoIsParent == 'classroom') this.$emit('editClassroom')
            else if(this.whoIsParent == 'subject') this.$emit('editSubject')
        },
        remove(){
            if(this.whoIsParent == 'semester') this.$emit('deleteSemester')
            else if(this.whoIsParent == 'faculty') this.$emit('deleteFaculty')
            else if(this.whoIsParent == 'professor') this.$emit('deleteProfessor')
            else if(this.whoIsParent == 'classroom') this.$emit('deleteClassroom')
            else if(this.whoIsParent == 'subject') this.$emit('deleteSubject')
        }
    }
}
</script>

<style lang="scss" scoped>
.topBTN{
    height: 40px;
    width: 40px;
    outline: none;
    border-radius:10px;
    background-color: white;
    color: #3E6781;
    border: 1px solid #3E6781; 
    text-align:center !important;
}
.topBTN i{
    font-size:20px;
    vertical-align:middle;
}
.topBTN:hover{
    background-color: #3E6781;
    color: white;
}

.trash:hover{
    background-color:red !important;
    border: 1px solid white !important;
}
</style>