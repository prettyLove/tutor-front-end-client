<template>
    <div class="gx_week_select ">
        <div>gxWeekSelect hourRow:{{hourRow}}</div>
        <div>
            <div>
                <el-checkbox v-model="checkedAll" @change="onSelectAll">全选</el-checkbox>
            </div>
            <table class="table noselect" @mouseleave="onLeaveTable" >
                <tr>
                    <th width="80px"></th>
                    <th v-for="(item,index) in weektable" :key="index">{{item}}</th>
                </tr>
                <tr v-for="(hour,index) in 25" v-if="weekSelect[hour]">
                    <td v-bind:class="{avtive_row:hourRow==hour , has_select:hastSelectInTr(weekSelect[hour])}"
                        @click="onClickHour(weekSelect[hour],index)"
                        style="text-align: center;">{{hour<11?'0':''}}{{hour-1}}:00 --  {{hour<10?'0':''}}{{hour}}:00</td>
                    <!--v-bind:class="{backgroundColor:weekSelect[hour][weekIndex]?'#0f0':'#f00'}"-->
                    <td v-for="(week,weekIndex) in weektable"
                        v-bind:class="{avtive:weekSelect[hour][weekIndex].selected , avtive_row:hourRow==hour, box_select: weekSelect[hour][weekIndex].boxSelect  }"
                        @click="onClickTd(hour,weekIndex)"
                        @mouseenter="e=>onEnterTd(e,hour,weekIndex)"
                        @mouseleave="e=>onLeaveTd(e,hour,weekIndex)"
                        @mousedown="e=>onMouseDown(e,hour,weekIndex)"
                        @mousemove="e=>onMouseMove(e,hour,weekIndex)"
                        @mouseup="e=>onTdMouseUp(e,hour,weekIndex)" >
                        <!--<div v-for="(item,k) in weekSelect[hour][weekIndex]" >
                            {{k}}:{{item}}
                        </div>-->
                        <span v-if="weekSelect[hour][weekIndex].selected">
                            <!--{{hour<11?'0':''}}{{hour-1}}:00 &#45;&#45;-->
                            <!--{{hour<10?'0':''}}{{hour}}:00-->
                            yes
                        </span>

                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    // 周选择视图

    import Vue from 'vue'

    let weekList={
        'zh-cn':['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
    }



    export default {
        name: "gxWeekSelect",
        components: { },
        props: {
            // 已经选择的背景
            selectedBackground: {
                type:String,
                default: "#78dbff",
            },
        },
        data() {
            return {
                weektable:[],
                weekSelect:[],
                hourRow:-1,
                clickHour:-1,
                clickWeek:-1,
                checkedAll:'',
                isMove:false,
            }
        },
        created(){
            this.weektable = weekList['zh-cn'];
            // 初始化数组
            this.weekSelect = [];
            for (let hour = 0; hour < 25; hour++) {
                this.weekSelect[hour] = [];
                for (let week=0; week < this.weektable.length; week++) {
                    this.weekSelect[hour][week] = {
                        selected:false,
                        disable:false,
                        work:week<5?true:false,
                        boxSelect:false,
                    };
                }
            }
        },

        mounted() {

            this.$bus.$on('document_mouseup',e=>{
                // console.log("document_mouseup",e);
                this.onTdMouseUp(e);
            });
        },
        computed:{

        },
        destroyed () {
            // bux
            this.$bus.$off('document_mouseup')
        },
        methods: {
            onClickHour:function(list,index){
                let sl = this.hastSelectInTr(list);
                list.map(item=>{
                    item.selected = !sl;
                })
                this.$set(this.weekSelect, index, this.weekSelect[index])
            },
            onSelectAll:function(val){
                console.log("onSelectAll",val);
                this.selectAll(val);
            },
            selectAll:function(val){
                for (let k = 0; k < this.weekSelect.length; k++) {
                    let hours = this.weekSelect[k];
                    for (let h = 0; h < hours.length; h++) {
                        let item = hours[h];
                        item.selected = val;
                    }
                    this.$set(this.weekSelect, k, this.weekSelect[k])
                }
            },
            onLeaveTable:function(){
                this.clickHour = -1;
                this.clickWeek = -1;
            },
            hastSelectInTr:function(list){
                let has = false
                list.map(item=>{
                    if(item.selected){
                        has = true;
                        return false;
                    }
                })
                return has;
            },
            onEnterTd:function(e,hour,week){
                let buttons = e.buttons;
                // console.log("onEnterTd:",buttons);
                /*if(buttons==1){
                    this.onClickTd(hour,week);
                }*/
                this.hourRow = hour;
            },
            onLeaveTd:function(e,hour,week){
                this.hourRow = -1;
            },
            onMouseMove:function(e,hour,week){
                let buttons = e.buttons;
                if(buttons==1 && this.clickHour>-1 && this.clickWeek>-1){
                    this.boxSelect(this.clickHour,this.clickWeek,hour,week);
                    this.isMove = true;
                    console.log("onMouseMove",   this.clickHour,this.clickWeek);
                }
                e.stopPropagation();
                e.preventDefault();
            },
            onTdMouseUp:function(e,hour,week){
                console.log("onTdMouseUp",   this.clickHour,this.clickWeek);
                for (let k = 0; k < this.weekSelect.length; k++) {
                    let hours = this.weekSelect[k];
                    for (let h = 0; h < hours.length; h++) {
                        let item = hours[h];
                        if(item.boxSelect){
                            item.selected = ! item.selected;
                            item.boxSelect = false;
                            console.log("item",item.selected)
                        }
                    }
                    // this.$set(this.weekSelect, k, this.weekSelect[k])
                }
                console.log("isMove:",this.isMove)
                e.stopPropagation();
                e.preventDefault();
            },
            boxSelect:function(x1,y1,x2,y2){

                let minX = Math.min(x1,x2);
                let minY = Math.min(y1,y2);
                let maxX = Math.max(x1,x2);
                let maxY = Math.max(y1,y2);

                for (let k = 0; k < this.weekSelect.length; k++) {
                    let hours = this.weekSelect[k];
                    for (let h = 0; h < hours.length; h++) {
                        let item = hours[h];
                        if (k >= minX && h >= minY && k <= maxX && h <= maxY ) {
                            item.boxSelect = true;
                        } else {
                            item.boxSelect = false;
                        }
                    }
                    this.$set(this.weekSelect, k, this.weekSelect[k])
                }

            },
            onClickTd:function (hour,week) {
                if(this.isMove){
                    return;
                }
                console.log("onClickTd",hour,week,"isMove:",this.isMove);
                this.weekSelect[hour][week].selected = ! this.weekSelect[hour][week].selected;
                this.$set(this.weekSelect,hour,this.weekSelect[hour]);
            },
            onMouseDown:function (e,hour,week) {
                this.clickHour = hour;
                this.clickWeek = week;
                // this.weekSelect[hour][week].boxSelect = true;
                this.isMove = false;
                console.log("onMouseDown",   this.clickHour,this.clickWeek);
                e.stopPropagation();
                e.preventDefault();
            },

        },
    }
</script>

<style scoped lang="scss">
    .gx_week_select {
        background-color: #fff;
        padding: 10px;

        .table {
            width: 100%;

            td,th {
                padding: 8px 8px;
                border: 1px solid rgba(47, 154, 81, 0.21);
                line-height: 12px;
            }

            th {
                text-align: center;
                background-color: rgba(37, 132, 72, 0.34);
                color: #0b6332;
            }

            td {
                /*min-height: 32px;*/
                color: #0b6332;
                font-size: 10px;

                &.avtive_row {
                    background-color: rgba(197, 163, 88, 0.18);
                }

                &:hover {
                    background-color: rgba(37, 132, 72, 0.24);
                }

                &.has_select {
                    background-color: rgba(255, 172, 124, 0.54);
                    color: #c4484a;
                }
                &.box_select {
                    background-color: rgba(47, 154, 81, 0.69);
                    color: #fff;
                }
                &.avtive {
                    background-color: rgba(47, 154, 81, 0.67);
                    color: #fff;
                }

                &.box_select.avtive {
                    background-color: #bfbfc8;
                }


            }

        }
    }
</style>
