<template>
    <!--    已封裝好的分頁-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths"  @pageChange="setPage" class="page_teaching_noteslist">
        <!--  =================== 条件搜索框 ===================  -->
        <template slot="head">
            <div class="search_box">
                <lgSearchBox style="padding: 16px 16px;">
                    <el-form  :model="reqCond" label-width="80px" >
                        <el-row :gutter="10">
                            <el-col :span="4">
<!--                                标题-->
                                <el-form-item :label=this.getLang(langCode.title)>
                                    <el-input size="small" v-model="reqCond.title"
                                              @keyup.enter.native="enterSearch"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" >
                                <div style="line-height: 42px;">
<!--                                    搜索-->
                                    <el-button class="search_box_serarch_button" type="primary" size="small" icon="el-icon-search" @click="getPageList()">{{getLang(langCode.search)}}</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </lgSearchBox>
            </div>
        </template>
        <template slot="dialog" class="dialoa_see">
            <!--    笔记编辑弹出框-->
            <el-dialog :title=getLang(pageLang.title) :visible.sync="dialogFormVisible"  :close-on-click-modal="false"  >
                <el-form class="clearfix" >
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            标题-->
                            <el-form-item :label=this.getLang(langCode.title) :label-width="formLabelWidth" >
                                <el-input  v-model="form.title" disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            内容-->
                            <el-form-item :label=this.getLang(langCode.content) :label-width="formLabelWidth" >
                                <el-input type="textarea" :rows='5' v-model="form.content"  disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" v-if="fileList">
<!--                            影片在线预览-->
<!--                            影片-->
                            <el-form-item :label=this.getLang(langCode.movies) :label-width="formLabelWidth">
<!--                                <lg-upload  v-model="fileList" @viewFile="viewFile" :uploadPath="uploadPath" :accept-file-type="acceptFileType"/>-->
                                <div>
                                    <ul class="file_link">
                                        <li v-for="(item,index) in fileList" class="file_item" :key="index" >
                                            <div style="padding: 0;" class="file_link">
<!--                                            <el-button type="text" size="small" @click="viewFile(item)">预览</el-button>-->
                                            <el-button type="text" size="small" @click="viewFile(item)">{{getLang(langCode.preview)}}</el-button>
                                            <a :href="item.url" target="_blank" >{{getFileName(item)}}</a>
                                        </div>
                                        </li>
                                    </ul>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
            <!--    视频查看-->
            <el-dialog  :title=getLang(pageLang.dialogTitle) :visible.sync="videoVisible" :close-on-click-modal="false" >
                <video :src="videoSrc" controls autoplay style="width: 100%"></video>
            </el-dialog>
        </template>
        <!--  =================== 表格内容 ===================  -->
        <template slot="table" class="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 20%;">{{item.title?item.title.substr(0,20)+(item.title.length>20?'...':''):''}}</td>
                <td>{{item.content?item.content.substr(0,50)+(item.content.length>50?'...':''):''}}</td>
                <td style="width: 140px;">{{item.createDate|formatTimeStampMinute}}</td>
                <td style="width: 140px;"></td>
                <td class="collection_btns">
                    <!-- 收藏按钮 -->
<!--                    <el-button class="collection_movies_see" size="small" @click="get(item)" plain>查看</el-button>-->
                    <el-button class="collection_movies_see" size="small" @click="get(item)" plain>{{getLang(langCode.see)}}</el-button>
<!--                    <el-button size="small" @click="del(item.id)" plain type="danger"  >删除</el-button>-->
                    <el-button size="small" @click="del(item.id)" plain type="danger"  >{{getLang(langCode.delete)}}</el-button>
                </td>
            </tr>
        </template>
    </lg-body>
</template>

<script>
    import {notesApi} from '@/api/notes';
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "collector_movies";
    // 多语言显示
    export const pageLang= {
        title:lang_prefix + "title",
        dialogTitle:lang_prefix + "dialogTitle",
    }
    addLangItem(pageLang.title,'教学影片','教学影片','Teaching Film');
    addLangItem(pageLang.dialogTitle,'影片预览','影片预览','Film Preview');
    export default {
        name: "notesList",
        components: {lgTable,lgBody,lgSearchBox,lgUpload},
        extends : tablePageBase,
        data() {
            return {
                pageLang,
                roles,
                formLabelWidth:'120px',
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
            this.reqCond.type="MOVIE";
            // vm.ths= ['标题','备注','创建时间','创建者', {name:'操作',align:"center"}];
            vm.ths= [this.getLang(this.langCode.title),this.getLang(this.langCode.remarks),this.getLang(this.langCode.createDate),
                this.getLang(this.langCode.creator), {name:this.getLang(this.langCode.operation),align:"center"}];
            // 增删改查
            vm.api.listPage = this.$api.collectionRouter.listPage;
            vm.api.delete = this.$api.collectionRouter.delete;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            viewFile:function(item){
                // 预览视频
                console.log("fileids",item);
                this.videoSrc = item.url;
                this.videoVisible=true;
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
            get:function(item){
                // 取到详情后 再调用 edit 编辑
                this.fileList = [];
                notesApi.get({id:item.notesId}).then((result)=>{
                    console.log(result);
                    if(result.code==this.$success){
                        if(result.data && result.data.fileList){
                            let fileList = result.data.fileList ;
                            if( fileList && fileList.length>0){
                                this.fileList = fileList ;
                                console.log("fileList",this.fileList);
                            }
                        }
                        this.edit(item);
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            },
            // validate: function () {
            //     let vm = this;
            //     if (vm.isEmpty(this.form.title)) {
            //         this.$alert("标题不能为空");
            //         return false;
            //     }
            //     if(vm.isEmpty(this.form.content)){
            //         this.$alert("内容不能为空");
            //         return false;
            //     }
            //     //
            //     let ids = this.fileList.map(item=>{
            //         return item.id;
            //     }) || [];
            //     if(ids.length<1){
            //         this.$alert("请上传附件");
            //         return false;
            //     }
            //     //form的属性映射来源于后台的vo对象属性，或者是后台获取参数的名字
            //     this.form.fileIds = ids.join(",");
            //     console.log("文件列表清单："+this.form.fileIds)
            //     return true;
            // },
        }
    }
</script>

<style lang="scss">
    .page_teaching_noteslist{
        .collection_btns{
                width: 140px;text-align: center;
                .collection_movies_see{background-color: rgb(225,243,216);}
                .collection_movies_see:hover{background: rgb(103,194,58);color: #fff;border-color: #2fb21a;}
        }
        .file_link {
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
        }

    }

</style>
