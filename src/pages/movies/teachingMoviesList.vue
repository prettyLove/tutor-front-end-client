<template>
    <!--    已封裝好的分頁-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths" @pageChange="setPage" class="page_history_list">
        <!--  =================== 条件搜索框 ===================  -->
        <template slot="head">
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form :model="reqCond" label-width="80px">
                        <el-row :gutter="10">
                            <el-col :span="4">
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
                </lgSearchBox>
                <!--    视频查看-->
                <el-dialog  title="影片预览" :visible.sync="videoVisible" :close-on-click-modal="false" >
                    <video :src="videoSrc" controls autoplay style="width: 100%"></video>
                </el-dialog>
            </div>
        </template>
        <!--        修改弹出框-->
        <template slot="dialog">
            <!--    笔记编辑弹出框-->
            <el-dialog title="影片预览" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @closed="closeForm">
                <el-form class="clearfix">
                    <el-row :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="标题" :label-width="formLabelWidth">
                                <el-input v-model="form.title" placeholder="请输入要修改的标题" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="标签" :label-width="formLabelWidth">
                                <el-input v-model="form.tag" placeholder="请输入要修改的标签" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="内容" :label-width="formLabelWidth">
                                <el-input type="textarea" :rows='5' v-model="form.content" placeholder="请输入要修改的内容"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="22">
                            <el-form-item label="视频" :label-width="formLabelWidth">
<!--                                <lg-upload v-model="fileList" @viewFile="viewFile" :uploadPath="uploadPath" :accept-file-type="acceptFileType" />-->
                                <div>
                                    <ul class="file_link">
                                        <li v-for="(item,index) in fileList" class="file_item" :key="index" >
                                            <div style="padding: 0;" class="file_link">
                                                <el-button type="text" size="small" @click="viewFile(item)">预览</el-button>
                                                <a :href="item.url" target="_blank" >{{getFileName(item)}}</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 取消和保存 -->
<!--                <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">-->
<!--                    <el-button @click="dialogFormVisible=false">取消</el-button>-->
<!--                    <el-button type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">-->
<!--                        {{form.id?'保存':'新增'}}-->
<!--                    </el-button>-->
<!--                </div>-->
            </el-dialog>

            <!--            用户反馈弹出框-->
            <el-dialog title="问题反馈" :visible.sync="moviesFeedbackVisible"  :close-on-click-modal="false" style="text-align: center" >
                <gx-resource-feedback :type="feebackType" :resourceId="feebackId"
                 @close="onFeedbackClose" @finish="onFeedbackFinish" />
                <!-- 取消和保存 -->

            </el-dialog>
        </template>
        <!--  =================== 表格内容 ===================  -->
        <template slot="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 160px;">{{item.title?item.title.substr(0,20)+(item.title.length>20?'...':''):''}}</td>
                <td style="width: 160px;">{{item.content?item.content.substr(0,50)+(item.content.length>50?'...':''):''}}</td>
                <td style="width: 160px;">{{item.tag}}</td>
                <td style="width: 160px;">{{item.createDate|formatTimeStampMinute}}</td>
                <td style="width: 160px;">{{item.name}}</td>
                <td class="control_btns" style="width: 260px;">
                    <!-- 收藏按钮 -->
                    <el-button class="collection_see" size="small" @click="questionFeeback(item)" plain >问题反馈</el-button>
                    <el-button class="collection_see" size="small" @click="get(item)" plain>查看</el-button>
                    <el-button class="collection_col" size="small" @click="collection(item)" plain>收藏</el-button>
                </td>
            </tr>
        </template>
    </lg-body>

</template>

<script>
    import {moviesApi} from '@/api/movies';
    import {collectionApi} from '@/api/collection';
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles,teachingResultType} from "@/utils/const";
    import gxResourceFeedback from "@/components/gxResourceFeedback";

    export default {
        name: "moviesList",
        components: {lgTable, lgBody, lgSearchBox,lgUpload,gxResourceFeedback},
        extends: tablePageBase,
        data() {
            return {
                roles,
                teachingResultType,
                formLabelWidth: '120px',
                myData: {},
                fileList:[],
                videoSrc:"",
                acceptFileType:".mp4,.ogg,.WebM,MP4,OGG,WEBM",
                //acceptFileSize:1024*1024*30,
                videoVisible:false,
                uploadPath:'movie',
                moviesFeedbackVisible:false,
                feebackId:'',
                feebackType:'',
                moviesSrc:''

            }
        },
        mounted() {
            let vm = this;
            vm.ths = ['标题', '备注', '标签', '创建时间', '创建者',{name: '操作', align: "center"}];
            // 增删改查
            vm.api.listPage = this.$api.moviesRouter.listPageCommon;
            // vm.api.insert = this.$api.moviesRouter.add;
            // vm.api.delete = this.$api.moviesRouter.delete;
            // vm.api.update = this.$api.moviesRouter.save;
            // 加载列表
            vm.getPageList();

        },
        methods: {
            onFeedbackClose:function(){
                this.moviesFeedbackVisible=false;
            },
            onFeedbackFinish:function(){
                this.moviesFeedbackVisible=false;
            },
            //问题反馈弹出框
            questionFeeback:function(item){
                console.log('item',item);
                this.feebackId=item.id;
                this.feebackType=item.type;
                this.moviesFeedbackVisible=true;
            },
            //影片反馈提交
            moviesFeedback:function(){

            },
            viewFile:function(item){
                // 预览视频
                console.log("fileids",item);
                this.videoSrc = item.url;
                this.videoVisible=true;
            },
            closeForm:function(){
                this.fileList = [];
                return true;
            },
            create:function(){
                this.fileList = [];
                this.edit({}) ;
            },
            getFileName: function (item) {
                let url = item.url;
                let num = url.lastIndexOf("/");
                if (num != -1) {
                    return url.substr(num + 1);
                }
                return url;
            },
            collection:function(item){
                collectionApi.add({id:item.id}).then((result)=>{
                    console.log('result',result);
                    if(result.code==this.$success){
                        this.$message({
                            type: 'success',
                            message: "收藏成功"
                        });
                    }else{

                        this.$message({
                            type: 'error',
                            message: this.getLangServerMess(result.messageCode) || "收藏失败",
                        });
                    }
                }).catch((err)=>{
                    console.log("err",err);
                })
            },
            get:function(item){
                // 取到详情后 再调用 edit 编辑
                this.fileList = [];
                moviesApi.get({id:item.id}).then((result)=>{
                    console.log(result);
                    if(result.code==this.$success){
                        let fileList = result.data.fileList||[];
                        if(fileList.length>0){
                            this.fileList = fileList ;
                            console.log("fileList",this.fileList);
                            this.edit(item);
                        }
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            },
            validate: function () {
                let vm = this;
                if (vm.isEmpty(this.form.title)) {
                    this.$alert("标题不能为空");
                    return false;
                } else if (vm.isEmpty(this.form.content)) {
                    this.$alert("内容不能为空");
                    return false;
                }
                //
                let ids = this.fileList.map(item=>{
                    return item.id;
                }) || [];
                if(ids.length<1){
                    this.$alert("请上传附件");
                    return false;
                }
                this.form.fileIds = ids.join(",");
                return true;
            },
        }
    }
</script>

<style scoped>
    .video{
        position:fixed;
        /*right: 1%;*/
        top: 5px;
        width: 80%;
        left: 10%;
        /*height:350px;*/
        /*background-color: darkturquoise;*/
        z-index: 999;
        animation: bouncelnRight 0.5s;
    }
    .video video{
        /*width: 100%!important;*/
        /*height:100%!important;*/
        display: block;
        width: 100%;
    }
    .mask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.9;
        z-index: 30;
    }
    .collection_btns{width: 140px;text-align: center;}
    .collection_see{background-color: rgb(250,236,216)}
    .collection_see:hover{background-color: rgb(247,201,131);color: #fff;border-color:#F7C983 }
    .collection_col{background-color: rgb(225,243,216)}
    .collection_col:hover{background-color:#67C23A;border-color: #67C23A;color: #fff}
    .file_link {
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
</style>
