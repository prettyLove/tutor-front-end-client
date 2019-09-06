<template>
    <div>
        <!-- 查询内容 -->
        <slot name="head"></slot>

        <!--  dialog -->
        <slot name="dialog"></slot>

        <div class="table_box" >
            <slot name="table_info"></slot>
            <div class="title clearfix">
                <h3>{{title}}<span class="sub_title" v-if="subTitle">{{subTitle}}</span></h3>
                <div class="btn_box">
                    <!-- 按钮内容 -->
                    <slot name="table_btns"></slot>
                </div>
            </div>
            <div style="margin-top: 2px;" v-if="ths">
                <lgTable :ths="ths" :dalist="pageInfo.list" :loading="pageInfo.loading" @sortChange="onSortChange" @checkAllChange="thCheckAllChange" :selectAll="selectAll">
                    <!-- 表格内容 -->
                    <slot name="table"></slot>
                </lgTable>
            </div>

            <!--翻页组件-->
            <el-pagination
                :visible.sync="!pageInfo.loading"
                layout="prev, pager, next"
                :current-page="pageInfo.pageNum"
                :total="pageInfo.total"
                @current-change="setPage">
            </el-pagination>

        </div>

        <!-- 其它内容 -->
        <slot name="footer"></slot>

    </div>
</template>

<script>

    import lgTable from "./lgTable" ;
    import lgSearchBox from "./lgSearchBox"

    export default {
        name: "lgBody",
        data(){
            return {
            }
        },
        props : {
            ths:Array,
            pageInfo:{},
            title:String,
            subTitle:String,
            subTitle:String,
            selectAll:Boolean,
        },
        methods:{
            thCheckAllChange:function(val){
                // console.log('checkAllChange',val);
                this.$emit('checkAllChange',val);
            },
            sortChange:function(value) {
                this.$emit('setSort', this.currentSort);
            },
            // 子组件中触发父组件方法
            setPage:function (page) {
                this.$emit('pageChange', page) ;
            },
            onSortChange:function (sort,caret) {
                this.$emit('sortChange', sort,caret);
            }
        },
        components: {
            lgTable  , lgSearchBox
        }
    }
</script>

<style scoped>

</style>
