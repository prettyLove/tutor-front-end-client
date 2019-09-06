/**
*    lgTable组件，主页面顶部表头样式
*/

<template>
    <table class="lg_table_box" >
        <thead>
        <tr>
            <th v-for="item in getThs()"
                :style="getThStyle(item)"
                :class="(item.click||item.sort?'btn ':'')"
                v-if="(typeof (item) == 'object')"
                @click="clickTh(item)"  >
                <!--el-icon-caret-top-->
                <!--el-icon-caret-bottom-->
                <span v-if="item.sort"><i :class="(currentSort!=item.sort?'el-icon-d-caret':(caret=='asc'?'el-icon-caret-top':'el-icon-caret-bottom'))"></i></span>
                <span v-if="item.checkAll"><lg-table-check-box :value="selectAll"  @checkedChange="handleCheckAllChange" /></span>
                {{item.name}}
            </th>
            <th v-else style="text-align: left; padding-left: 20px;" >{{item}}</th>
        </tr>
        </thead>
        <tbody>
            <tr class="no_data"  v-if="loading"><td :colspan="ths.length" >loading...</td></tr>
            <tr class="no_data"  v-if="!loading && isEmpty()"><td :colspan="ths.length" >暂无数据</td></tr>
            <slot></slot>
        </tbody>
    </table>
</template>

<script>
    import lgTableCheckBox from "@/components/lgTableCheckBox";
    // ['kk']
    // [{ name:'th',align:left,click}
    export default {
        name: "lgTable",
        data() {
            return {
                currentSort:  '' ,
                caret:"",
                checkAll:false,
            }
        },
        props:{
            ths : {},
            // 数据
            dalist :  {
                type:Array,
                defalut: ()=> {
                    return []
                }
            },
            // 加载中
            loading:{
                type:Boolean,
                defalut:false
            },
            selectAll:{
                type:Boolean,
                defalut:false
            }
        },
        model: {
            prop: 'sort',
            event: 'setSort'
        },
        watch:{
            selectAll(val, oldValue) {
                console.log("selectAll",val);
            },

        },
        methods:{
            handleCheckAllChange:function(val){
                this.checkAll = val;
                this.$emit("checkAllChange",val);
            },
            sortChange: function () {
                this.$emit('sortChange', this.currentSort, this.caret);
            },
            isEmpty: function () {
                let vm = this;
                if (!vm.dalist) {
                    return true;
                } else if (vm.dalist.length == 0) {
                    return true;
                }
                //dalist != null || dalist.length == 0
                return false;
            },
            getThStyle:function(item){
                let st = {};
                if(item.align){
                    st['text-align']=item.align;
                    if(item.align == 'left'){
                        st['padding-left'] = '20px';
                    }
                }
                return st;
            },
            //
            getThs : function () {
                if (!this.ths){
                    this.ths = [];
                }
                return this.ths;
            },
            // 点击表头
            clickTh:function (item) {
                if(item.sort){
                    if (item.sort != this.currentSort) {
                        this.currentSort = item.sort;
                        this.caret = "desc";
                        //console.log(this.currentSort);
                    } else {
                        if (this.caret == "desc") {
                            this.caret = "asc";
                        } else {
                            this.caret = "desc";
                        }
                        //console.log(this.caret);
                    }
                    this.sortChange();
                }
                if(item.click){
                    item.click(item);
                }
            }
        },
        components:{
            lgTableCheckBox,
        }
    }
</script>

<style scoped>
    .lg_table_box { width: 100%; }
    .lg_table_box tr th  { background: #5a9a70;  line-height: 18px; text-align: center; font-size: 16px; color: #fff; }
    .lg_table_box th,
    .lg_table_box td { line-height: 18px ; color: #666; font-size: 14px;  vertical-align: middle; height: 46px; }
    .lg_table_box td { padding-left: 20px;   }
    .lg_table_box .no_data td { text-align: center; color: #999; }
    .lg_table_box tr:nth-child(odd) { }
    .lg_table_box tr:nth-child(even) {  background-color: #023C8A09;  }

    .lg_table_box th.btn { cursor: pointer; }
    .lg_table_box th.btn:hover { background-color: #166cba;  }

</style>
