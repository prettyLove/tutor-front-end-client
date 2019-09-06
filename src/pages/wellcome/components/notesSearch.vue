<template>
    <div class="page_notes_search">

        <!-- 笔记编辑弹出框 -->
        <el-dialog title="影片" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @closed="closeForm">
            <el-form class="clearfix">
                <el-row :gutter="10">
                    <el-col :span="20">
                        <el-form-item label="标题" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.title" placeholder="请输入要修改的标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="标签" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.tag" placeholder="请输入要修改的标签" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="20">
                        <el-form-item label="内容" :label-width="formLabelWidth">
                            <el-input disabled type="textarea" :rows='5' v-model="form.content" placeholder="请输入要修改的内容"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="22">
                        <div>
                            <ul v-if="fileList.length>0">
                                <li v-for="(item,index) in fileList" class="file_item" :key="index">
                                    <el-container>
                                        <el-main style="padding: 0;" class="file_link">
                                            <!--<el-button type="text" size="small" @click="$emit('viewFile',item.url)">预览</el-button>-->
                                            <a :href="item.url" target="_blank">{{getFileName(item)}}</a>
                                        </el-main>

                                    </el-container>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
                <el-button @click="dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">
                    {{form.id?'保存':'新增'}}
                </el-button>
            </div>
        </el-dialog>

        <h3 style="font-size: 18px; line-height: 50px;">教学资料查找</h3>
        <div class="search_box">
            <el-form :model="reqCond" label-width="80px">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="标题:">
                            <el-input size="small" v-model="reqCond.title"
                                      @keyup.enter.native="enterSearch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <div style="line-height: 42px;">
                            <el-button class="search_box_serarch_button" type="primary" size="small"
                                       icon="el-icon-search" @click="getPageList()">搜索
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <lgTable :ths="ths" :dalist="pageInfo.list" :loading="pageInfo.loading"  >
            <!-- 表格内容 -->
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 20%;">{{item.title?item.title.substr(0,20)+(item.title.length>20?'...':''):''}}</td>
                <td>{{item.content?item.content.substr(0,50)+(item.content.length>50?'...':''):''}}</td>
                <td>{{item.tag}}</td>
                <td style="width: 140px;">{{item.createDate|formatTimeStampMinute}}</td>
                <td class="control_btns" style="width: 80px;">
                    <!-- 编辑按钮 -->
                    <el-button size="small" @click="get(item)" plain>查看</el-button>
                </td>
            </tr>
        </lgTable>

        <!--翻页组件-->
        <el-pagination
            :visible.sync="!pageInfo.loading"
            layout="prev, pager, next"
            :current-page="pageInfo.pageNum"
            :total="pageInfo.total"
            @current-change="setPage">
        </el-pagination>
    </div>
</template>

<script>
    import tablePageBase from '@/pages/common/tablePageBase';
    import {searchApi} from "@/api/search"
    import lgBody from "@/components/lgBody";
    import lgTable from "@/components/lgTable";
    import lgSearchBox from "@/components/lgSearchBox"

    export default {
        extends: tablePageBase,
        components:{lgTable, lgBody, lgSearchBox},
        name: "notesSearch",
        data() {
            return {
                formLabelWidth: '120px',
                fileList:[],
            };
        },
        mounted() {
            let vm = this;
            vm.ths = ['标题', '内容', '标签', '创建时间', {name: '操作', align: "center"}];
            // 增删改查
            vm.api.listPage = this.$api.searchRouter.listPage;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            get:function(item){
                // 取到详情后 再调用 edit 编辑
                this.fileList = [];
                searchApi.get({id:item.id}).then((result)=>{
                    console.log(result);
                    this.fileList = result.data.fileList;
                    this.edit(item);
                }).catch((err)=>{
                    console.log(err)
                })
            },
            closeForm:function(){
                this.fileList = [];
                return true;
            },
            getFileName: function (item) {
                let url = item.url;
                let num = url.lastIndexOf("/");
                if (num != -1) {
                    return url.substr(num + 1);
                }
                return url;
            },
        }
    }
</script>

<style scoped lang="scss">
    .page_notes_search {

    }
</style>
