<template>
<div class="container-fluid" style="padding:0;">
    <div class="row w-100">
        <div class="col-3" style="padding:0; max-height:1000px;">
            <WorkspaceSidebar/>
        </div>

        <div class="col-9" style="padding:0">
            <Timetable :getDataFromDB="true"/>
        </div>
    </div>
</div>
</template>

<script>
import WorkspaceSidebar from '@/views/Workspace/WorkspaceSidebar.vue'
import Timetable from '@/components/Timetable/Timetable.vue'
export default {
    components: {
        WorkspaceSidebar,
        Timetable
    },

    data(){
        return {
        }
    },
}
</script>

<style lang="scss" scoped>

</style>