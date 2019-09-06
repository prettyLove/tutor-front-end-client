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
                                <el-form-item :label=getLang(langCode.title)>
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
            <el-dialog :title=getLang(pageLang.notesPreview) :visible.sync="dialogFormVisible"  :close-on-click-modal="false"  >
                <el-form class="clearfix" >
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            标题-->
                            <el-form-item :label=getLang(langCode.title) :label-width="formLabelWidth" >
                                <el-input  v-model="form.title" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            内容-->
                            <el-form-item :label=getLang(langCode.content) :label-width="formLabelWidth" >
                                <el-input type="textarea" :rows='5' v-model="form.content" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" v-if="fileList">
<!--                            笔记在线预览-->
                            <el-form-item :label=getLang(langCode.notes) :label-width="formLabelWidth">
<!--                                <lg-upload  v-model="fileList" @viewFile="viewFile" :uploadPath="uploadPath" :accept-file-type="acceptFileType"/>-->
                                <div>
                                    <ul class="file_link">
                                        <li v-for="(item,index) in fileList" class="file_item" :key="index" >
                                            <div style="padding: 0;" class="file_link">
<!--                                                预览-->
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
            <!--            用户反馈弹出框-->
            <el-dialog :title=getLang(pageLang.questionFeekback) :visible.sync="notesFeedbackVisible"  :close-on-click-modal="false" style="text-align: center" >
                <gx-resource-feedback :type="feebackType" :resourceId="feebackId"
                                      @close="onFeedbackClose" @finish="onFeedbackFinish" />
            </el-dialog>
        </template>
        <!--  =================== 表格内容 ===================  -->
        <template slot="table" class="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 20%;">{{item.title?item.title.substr(0,20)+(item.title.length>20?'...':''):''}}</td>
                <td style="width: 20%;">{{item.createDate|formatTimeStampMinute}}</td>
                <td style="width: 15%;">{{item.content?item.content.substr(0,50)+(item.content.length>50?'...':''):''}}</td>
                <td style="width: 15%;">{{item.name}}</td>
                <td class="collection_btns">
                    <!-- 收藏按钮 -->
<!--                    问题反馈-->
                    <el-button class="collection_see" size="small" @click="questionFeeback(item)" plain>{{getLang(pageLang.questionFeekback)}}</el-button>
<!--                    查看-->
                    <el-button class="collection_see" size="small" @click="get(item)" plain>{{getLang(langCode.see)}}</el-button>
<!--                    收藏-->
                    <el-button class="collection_col" size="small" @click="collection(item)" plain>{{getLang(pageLang.notesCollect)}}</el-button>
                </td>
            </tr>
        </template>
    </lg-body>
</template>

<script>
    import {notesApi} from '@/api/notes';
    import {collectionApi} from '@/api/collection';
    import tablePageBase from  '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles,teachingResultType} from "@/utils/const";
    import gxResourceFeedback from "@/components/gxResourceFeedback";
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "teaching_notes_list";
    // 多语言显示
    export const pageLang= {
        notesPreview:lang_prefix + "notesPreview",
        questionFeekback:lang_prefix + "questionFeekback",
        notesCollect:lang_prefix + "notesCollect",
        successfulCollection:lang_prefix + "successfulCollection",
        collectionFailure:lang_prefix + "collectionFailure",
        titleVerification:lang_prefix + "titleVerification",
        contentVerification:lang_prefix + "contentVerification",
        enclosureVerification:lang_prefix + "enclosureVerification",
    }
    addLangItem(pageLang.notesPreview,'笔记预览','笔记预览','Note Preview');
    addLangItem(pageLang.questionFeekback,'问题反馈','问题反馈','Question Feedback');
    addLangItem(pageLang.notesCollect,'收藏','收藏','Collection');
    addLangItem(pageLang.successfulCollection,'收藏成功','收藏成功','Successful collection');
    addLangItem(pageLang.collectionFailure,'收藏失败','收藏失败','Collection failure');
    addLangItem(pageLang.titleVerification,'标题不能为空','标题不能为空','The title should not be blank');
    addLangItem(pageLang.contentVerification,'内容不能为空','内容不能为空','Content cannot be empty');
    addLangItem(pageLang.enclosureVerification,'请上传附件','请上传附件','Please upload the attachment.');

    export default {
        name: "notesList",
        components: {lgTable,lgBody,lgSearchBox,lgUpload,gxResourceFeedback},
        extends : tablePageBase,
        data() {
            return {
                pageLang,
                roles,
                teachingResultType,
                formLabelWidth:'120px',
                fileList:[],
                acceptFileType:".pdf,.PDF",
                //acceptFileSize:1024*1024*30,   //传入30M
                pdfSrc:'',
                videoVisible:false,
                feedbackForm:{},
                feedTypeList:'',
                notesFeedbackVisible:false,
                uploadPath:'note',
                feebackId:'',
                feebackType:'',
            }
        },
        mounted() {
            let vm = this;
            // vm.ths= ['标题','备注','创建时间','创建者', {name:'操作',align:"center"}];
            vm.ths= [vm.getLang(vm.langCode.title),vm.getLang(vm.langCode.createDate),vm.getLang(vm.langCode.remarks),
                vm.getLang(vm.langCode.creator), {name:vm.getLang(vm.langCode.operation),align:"center"}];
            // 增删改查
            vm.api.listPage = this.$api.notesRouter.listPageCommon;
            // vm.api.insert = this.$api.notesRouter.add;
            // vm.api.delete = this.$api.notesRouter.delete;
            // vm.api.update = this.$api.notesRouter.save;
            // 加载列表
            vm.getPageList();
            this.feedTypeList = this.$store.getters.getSystemConfigMapByKey("QUESTION_FEEDBACK_TYPE_LIST").split(',');
            console.log("this.feedTypeList ",this.feedTypeList )
        },
        methods: {
            onFeedbackClose:function(){
                this.notesFeedbackVisible=false;
            },
            onFeedbackFinish:function(){
                this.notesFeedbackVisible=false;
            },

            //问题反馈弹出框
            questionFeeback:function(item){
                console.log('item',item);
                this.feebackId=item.id;
                this.feebackType=item.type;
                this.notesFeedbackVisible=true;
            },
            //反馈提交
            notesFeedback:function(){
               console.log('this.feedbackForm',this.feedbackForm);

            },
            viewFile:function(item){
                let url = item.url;
                // 笔记预览
                console.log("url",url);
                window.open(url, '_blank');
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
                            // message: "收藏成功"
                            message:this.getLang(this.pageLang.successfulCollection),
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            // 收藏失败
                            message: this.getLangServerMess(result.messageCode) || this.getLang(this.pageLang.collectionFailure),
                        });
                    }
                }).catch((err)=>{
                    console.log("err",err);
                })
            },
            get:function(item){
                // 取到详情后 再调用 edit 编辑
                this.fileList = [];
                notesApi.get({id:item.id}).then((result)=>{
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
                    // 标题不能为空
                    this.$alert(this.getLang(pageLang.titleVerification));
                    return false;
                }
                if(vm.isEmpty(this.form.content)){
                    // 内容不能为空
                    this.$alert(this.getLang(pageLang.contentVerification));
                    return false;
                }
                //
                let ids = this.fileList.map(item=>{
                    return item.id;
                }) || [];
                if(ids.length<1){
                    // 附件上传
                    this.$alert(this.getLang(pageLang.enclosureVerification));
                    return false;
                }
                //form的属性映射来源于后台的vo对象属性，或者是后台获取参数的名字
                this.form.fileIds = ids.join(",");
                console.log("文件列表清单："+this.form.fileIds)
                return true;
            },
        }
    }
</script>

<style lang="scss">
    .page_teaching_noteslist{
        .collection_btns{
                .collection_see{background-color: rgb(250,236,216);}
                .collection_see:hover{background-color: rgb(247,201,131);color: #fff;border-color:#F7C983 }
                .collection_col{background-color: rgb(225,243,216);}
                .collection_col:hover{background-color:#67C23A;border-color: #67C23A;color: #fff}
        }
        .file_link {
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
        }

    }

</style>
