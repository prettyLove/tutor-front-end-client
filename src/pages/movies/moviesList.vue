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
        <!--  =================== 添加按钮 ===================  -->
        <template slot="table_btns" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
            <ul>
                <li>
                    <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="create({})">添加</el-button>
                </li>
            </ul>
        </template>
        <!--        修改弹出框-->
        <template slot="dialog">
            <!--    笔记编辑弹出框-->
            <el-dialog title="影片" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @closed="closeForm">
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
                                <lg-upload v-model="fileList" @viewFile="viewFile" :uploadPath="uploadPath" :accept-file-type="acceptFileType" />
                            </el-form-item>
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
        </template>
        <!--  =================== 表格内容 ===================  -->
        <template slot="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 20%;">{{item.title?item.title.substr(0,20)+(item.title.length>20?'...':''):''}}</td>
                <td>{{item.content?item.content.substr(0,50)+(item.content.length>50?'...':''):''}}</td>
                <td>{{item.tag}}</td>
                <td style="width: 140px;">{{item.createDate|formatTimeStampMinute}}</td>
                <td style="width: 140px;">{{item.name}}</td>
                <td style="width: 140px;">{{item.status==1?'审核':'未审核'}}</td>
                <td class="control_btns" style="width: 140px;">
                    <!-- 编辑按钮 -->
                    <el-button size="small" @click="get(item)" plain v-if="item.status==0">编辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button size="small" @click="del(item.id)" plain type="danger" v-if="item.status==0">删除</el-button>
                </td>
            </tr>
        </template>
    </lg-body>

</template>

<script>
    import {moviesApi} from '@/api/movies';
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";

    export default {
        name: "moviesList",
        components: {lgTable, lgBody, lgSearchBox,lgUpload},
        extends: tablePageBase,
        data() {
            return {
                roles,
                formLabelWidth: '120px',
                myData: {},
                fileList:[],
                videoSrc:"",
                acceptFileType:".mp4,.ogg,.WebM,MP4,OGG,WEBM",
                //acceptFileSize:1024*1024*30,
                videoVisible:false,
                uploadPath:'movie',
            }
        },
        mounted() {
            let vm = this;
            vm.ths = ['标题', '备注', '标签', '创建时间', '创建者','状态',{name: '操作', align: "center"}];
            // 增删改查
            vm.api.listPage = this.$api.moviesRouter.listPage;
            vm.api.insert = this.$api.moviesRouter.add;
            vm.api.delete = this.$api.moviesRouter.delete;
            vm.api.update = this.$api.moviesRouter.save;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            viewFile:function(fileurl){
                // 预览视频
                console.log("fileids",fileurl);
                this.videoSrc = fileurl;
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
            //图片上传前判断
            // beforeUpload:function () {
            //     let allType = ['video/mp4','video/mp3', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'];
            //     const isIMAGE = allType.indexOf(file.type)!=-1
            //     const isLt1M = file.size / 1024 / 1024 < 10;  // 算出文件大小
            //     if (!isIMAGE) {
            //         this.$message.error('视频上传只能是Mp3,Mp4,Ogg,Flv,Avi,Wmv,Rmvb等格式!');
            //     }
            //     if (!isLt1M) {
            //         this.$message.error('上传文件大小不能超过 10MB!');
            //     }
            //     return isIMAGE && isLt1M;
            // }
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
</style>
