<template>
    <div class="page_pair_suited">

        <table>
            <tr>
                <th>标题</th>
                <th>姓名</th>
                <th>学科</th>
                <th>学历</th>
                <th>成绩</th>
                <th>语言</th>
                <th>详细</th>
                <th>工资</th>
                <th>操作</th>
            </tr>
            <tr v-for="item in pageInfo.list" :key= item.id>
                <td style="width: 140px;">{{item.title}}</td>
                <td style="width: 140px;">{{item.name}}</td>
                <td style="width: 140px;">{{item.subject}}</td>
                <td style="width: 140px;">{{item.educational}}</td>
                <td style="width: 140px;">{{item.grade}}</td>
                <td style="width: 140px;">{{item.language}}</td>
                <td style="width: 140px;">{{item.content}}</td>
                <td style="width: 140px;">{{item.salary}}</td>
                <td class="control_btns" style="width: 110px;">
                    <el-button size="small" @click="selectSuited(item.pairSuitedId)" plain  v-if="item.sendStatus == 0">配对</el-button>
                    <el-tag type="info" v-if="item.sendStatus == 1">已发送</el-tag>
                    <el-tag type="info" v-if="item.sendStatus == -1">配对失败</el-tag>
                </td>
            </tr>
        </table>

        <div>
            <!--翻页组件-->
            <el-pagination
                :visible.sync="!pageInfo.loading"
                layout="prev, pager, next"
                :current-page="pageInfo.pageNum"
                :total="pageInfo.total"
                @current-change="setPage">
            </el-pagination>
        </div>
    </div>
    
</template>

<script>
    import TablePageBase from '../../common/tablePageBase'

    export default {
        extends : TablePageBase,
        name: "pairSuited",
        components:{ },
        props:{
            demand:{
                type:String,
                default:"",
            },
            stateNum:{
                type:Number,
                default: 0
            },
        },
        watch:{
            stateNum(val, oldValue) {
                this.reqCond.demandId = this.demand;//demand.id;
                this.getPageList();
            },
        },
        data(){
            return {

            }
        },
        mounted() {
            let vm = this;
            // 增删改查
            vm.api.listPage = this.$api.demandRouter.getDemand;
            this.reqCond.demandId = this.demand;//demand.id;
            // 加载列表
            vm.getPageList();
        },
        methods:{
            selectSuited:function (item) {
                this.$emit("selectSuited",item)
            }
        }
    }
</script>

<style lang="scss" scoped>
.page_pair_suited {
    table {
        width: 100%;
        tr{
            border: 1px solid #5a9a70;
            text-align: center;
        }
        td , th {
            min-height: 42px ;
            padding: 10px 4px;
        }
    }
}
</style>
