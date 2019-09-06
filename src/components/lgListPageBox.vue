<template>
    <div>

        <lgTable :ths="ths" :dalist="pageInfo.list">
            <!-- 表格内容 -->
            <tr v-for=" (item,index) in pageInfo.current" v-on:click="clickItem(item)">

                <template v-for="k in fields">
                    <td v-if="typeof(k) == 'string'" >{{item[k]}}</td>
                    <td v-else-if="typeof(k) == 'object'" >
                        <router-link  :to="k.getLink(item,index)" v-if="k.type=='link'"  >{{renderField(index,k,item)}}</router-link>
                        <span  @click="k.click(item)" v-if="k.type=='span'"  >{{renderField(index,k,item)}}</span>
                    </td>
                </template>




                <!--<td><div  style="width:700px" class="text_overflow fontColor":title=item.url>{{item.url}}</div></td>-->
                <!--<td  style="width:180px">{{item.visitors}}</td>-->
                <!--<td  style="width:280px">{{item.avgPage}}</td>-->
                <!--<td  style="width:200px">{{item.avgTime}}</td>-->
                <!--<td  style="width:100px">{{item.newVisitPct}}</td>-->
                <!--<td  style="width:100px">{{item.bouncePct}}</td>-->
            </tr>
        </lgTable>
        <!--翻页组件-->
        <div style="margin-left: 10px;">
            <el-pagination v-if="pageInfo"
                           layout="prev, pager, next"
                           :current-page="pageInfo.pageNum"
                           :page-size="pageInfo.pageSize"
                           :page-count="pageInfo.pages"
                           @current-change="setPage" />
        </div>

    </div>
</template>

<script>
    import lgTable from "@/components/lgTable" ;
    export default {
        name: "lgListPageBox",
        data(){
            return {
                pageInfo:{
                    list: this.daList || [],
                    current:[],
                    pageSize:10,
                    pageNum:1,
                    pages:0,
                    summary: this.summary || [],
                },
            }
        },
        props:{
            ths:{
                type: Array,
                default: [],
            },
            summary:Array,
            daList:Array,
            fields:{
                type: Array,
                default: [],
            },
        },
        watch:{
            'daList':"listChange",
            'summary':"summaryChange",
        },
        methods:{
            listChange:function(val,oldVal){
                // console.log('listChange',val);
                let vm = this;
                vm.pageInfo.list = val;
                vm.pageInfo.pages =  parseInt( vm.pageInfo.list.length / vm.pageInfo.pageSize)+1 ;
                this.setPage(1);
            },
            summaryChange:function(val,oldVal){
                // console.log('summaryChange',val);
                this.pageInfo.summary = val;
                this.setPage(this.pageInfo.pageNum);
            },
            // 翻页操作
            setPage :function(page){
                let vm = this;
                vm.pageInfo.pageNum = page;
                let start = (vm.pageInfo.pageNum - 1) * vm.pageInfo.pageSize;
                let end = (vm.pageInfo.pageNum - 1) * vm.pageInfo.pageSize + vm.pageInfo.pageSize;
                if (end > vm.pageInfo.list.length) {
                    end = vm.pageInfo.list.length;
                }
                vm.pageInfo.current = vm.pageInfo.list.slice(start, end).concat(vm.pageInfo.summary);
            },
            // 取当前备份
            getPageNum:function () {
                return this.pageInfo.pageNum;
            },
            // 点击item
            clickItem:function (item) {
                this.$emit('clickItem', item);
            },
            // 输出字段
            renderField:function (index,k,item) {
                if(!k.render){
                    return item[k.fieldName];
                }
                if(typeof(k) == 'object'){
                    return k.render(item[k.fieldName],item,index);
                }
                return "hell";
            }
        },
        components:{
            lgTable
        }
    }
</script>

<style scoped>

</style>
