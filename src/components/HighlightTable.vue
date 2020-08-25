<template>
<div class="container-fluid">
    <table cellpadding="0" cellspacing="0" :id="id" style="margin:0 auto;">
        <tr v-for="i in 5" :key="i">
            <th style="text-align:left; padding-right:5px;">{{weekDays[i-1]}}</th>
            <td v-for="j in 16" :key="j" class="highlighted">{{j}}</td>
        </tr>
    </table>
</div>
</template>

<script>
import $ from 'jquery'
export default {
    props: {
        id: String
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
            toggleRowCounter: [1,1,1,1,1]
        }
    },
    methods: {
        getHighlighted(){
            let result = []
            var table = document.getElementById(this.id);
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    let td = col
                    if(!td.classList.contains('highlighted')) continue
                    result.push([i+1, j])
                } 
            }
            return result;
        },
        logit(){
            var table = document.getElementById(this.id);
            for (var i = 0, row; row = table.rows[i]; i++) {
                //iterate through rows
                //rows would be accessed using the "row" variable assigned in the for loop
                for (var j = 0, col; col = row.cells[j]; j++) {
                    //iterate through columns
                    let td = col
                    if(!td.classList.contains('highlighted')) continue
                    //columns would be accessed using the "col" variable assigned in the for loop
                }  
            }
        },
        highlightAll(){
            var table = document.getElementById(this.id);
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    let td = col
                    if(!td.classList.contains('highlighted')) td.classList.toggle("highlighted")
                }  
            }
        },
        removeHighlightAll(){
            var table = document.getElementById(this.id);
            for (var i = 0, row; row = table.rows[i]; i++) {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    let td = col
                    if(td.classList.contains('highlighted')) td.classList.toggle("highlighted")
                }  
            }
        },

        loadTable(){
            let id = this.id
            window.$(function () {
                var isMouseDown = false,
                    isHighlighted;
                window.$("#" + id + " td")
                    .mousedown(function () {
                        isMouseDown = true;
                        window.$(this).toggleClass("highlighted");
                        isHighlighted = window.$(this).hasClass("highlighted");
                        return false; // prevent text selection
                    })
                    .mouseover(function () {
                        if (isMouseDown) {
                            window.$(this).toggleClass("highlighted", isHighlighted);
                        }
                    })
                    .bind("selectstart", function () {
                        return false;
                    })

                window.$(document)
                    .mouseup(function () {
                        isMouseDown = false;
                    });
                });
            }
    },
    mounted(){
        this.loadTable()
    }
}
</script>

<style lang="scss" scoped>
table td {
    width:40px;
    height:40px;
    text-align:center;
    vertical-align:middle;
    color: black;
    background-color:#dadada;
    border:1px solid #f3f3f3;
}
table td.highlighted {
    background-color: #2eb82e;
    color: white;
}
</style>