<template>
    <div class="gx_resource_feedback">
        <el-form class="clearfix" :model="feedbackForm">
            <el-row :gutter="10">
                <el-col :span="18" >
                    <el-form-item :label=getLang(langCode.type) :label-width="formLabelWidth" >
                        <div> {{this.type}} </div>
                        <!--                                <el-select v-model="feedbackForm.type" placeholder="请选择问题类型" style="width: 100%;" disabled>-->
                        <!--                                    <el-option-->
                        <!--                                        v-for="(item,index) in teachingResultType"-->
                        <!--                                        :key="index"-->
                        <!--                                        :label="item.name"-->
                        <!--                                        :value="item.value"-->
                        <!--                                    >-->
                        <!--                                    </el-option>-->
                        <!--                                </el-select>-->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="10">
                <el-col :span="20">
<!--                    问题类型-->
                    <el-form-item :label=getLang(pageLang.questionType) :label-width="formLabelWidth">
                        <el-select v-model="feedbackForm.question" :placeholder=getLang(pageLang.titlePlaceholder) style="width: 100%;">
                            <el-option
                                v-for="item in feedTypeList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="10">
                <el-col :span="20" >
<!--                    反馈内容-->
                    <el-form-item :label="getLang(pageLang.feekbackContent)" :label-width="formLabelWidth" >
                        <el-input type="textarea" :rows='10' v-model="feedbackForm.content" :placeholder=getLang(pageLang.contentPlaceholder) />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="10">
                <el-col :span="20" >
<!--                    文件-->
                    <el-form-item :label=getLang(pageLang.file) :label-width="formLabelWidth" >
<!--                        <el-input  v-model="feedbackForm.fileId" placeholder="请输入"/>-->
                        <lg-upload  v-model="fileList" @viewFile="viewFile" :uploadPath="uploadPath" :fileLimit="0" :accept-file-type="acceptFileType"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
<!--            取消-->
            <el-button @click="onClose">{{getLang(langCode.cancel)}}</el-button>
<!--            反馈-->
            <el-button type="primary" @click="sendFeedback()">{{getLang(pageLang.feedback)}}</el-button>
        </div>
    </div>
</template>

<script>

    import { resourceFeedbackApi }  from '@/api/resourceFeedback';
    import lgUpload from "./lgUpload"
    import viewBase from '../pages/common/viewBase'
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "lg_upload_";
    // 多语言显示
    export const pageLang= {
        questionType:lang_prefix + "questionType",
        feekbackContent:lang_prefix + "feekbackContent",
        file:lang_prefix + "file",
        feekback:lang_prefix + "feekback",
        titlePlaceholder:lang_prefix + "titlePlaceholder",
        contentPlaceholder:lang_prefix + "contentPlaceholder",
    }
    addLangItem(pageLang.questionType,'问题类型','问题类型','Type of problem');
    addLangItem(pageLang.feekbackContent,'反馈内容','反馈内容','Feedback content');
    addLangItem(pageLang.file,'文件类型','文件类型','File');
    addLangItem(pageLang.feekback,'反馈','反馈','feekback');
    addLangItem(pageLang.titlePlaceholder,'请输入要反馈的标题','请输入要反馈的标题','Please enter a title for feedback.');
    addLangItem(pageLang.contentPlaceholder,'请输入要反馈的内容','请输入要反馈的内容','Please enter what you want to feedback.');

    // 提交问题反馈
    export default {
        name: "gxResourceFeedback",
        extends : viewBase,
        components:{lgUpload},
        props: {
            type: String,
            resourceId: String,
        },
        data(){
            return {
                pageLang,
                formLabelWidth: '130px',
                feedbackForm:{},
                feedTypeList:[],
                acceptFileType:".img,.png,.jpg",
                fileList:[],
                uploadPath:'feedback',
                // fileLimit:1,
            }
        },
        mounted(){
            this.feedTypeList = this.$store.getters.getSystemConfigMapByKey("QUESTION_FEEDBACK_TYPE_LIST").split(',');
            console.log("this.feedTypeList ",this.feedTypeList )
        },
        methods:{
            viewFile:function(fileurl){
                // 预览视频
                console.log("fileurl",fileurl);
                // this.pdfSrc = fileurl;
                // this.videoVisible=true;
                window.open(fileurl , '_blank');
            },
            onClose:function () {
                console.log("onClose");
                this.$emit("close");
            },
            sendFeedback:function () {
                console.log('this.fileList',this.fileList);
                // let resourceId=this.fileList[0].id;
                let params = {
                    fileId:this.fileList[0].id,
                    type:this.type,
                    resourceId:this.resourceId,
                }
                params = Object.assign(params,this.feedbackForm);
                console.log(params);
                resourceFeedbackApi.add(params).then(result=>{
                    if(result.code == this.$success){
                        this.code=result.code;
                        this.$message({
                            type: 'success',
                            // message: "操作成功"
                            message:this.getLang(this.langCode.success)
                        });
                        this.$emit("finish");
                        this.feedbackForm={};
                        this.fileList=[];
                    }else{
                        // 多语言处理 按多语言取内容
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||this.getLang(this.langCode.fail)
                        });
                    }
                }).catch(e=>{
                    console.log(e);
                })
            }
            /*save:function () {
                let params = {
                    type:this.type,
                    resourceId:this.resourceId,
                }
                resourceFeedbackApi.add(Object.assign(params,this.feedbackForm)).then(result=>{
                    if(result.code == this.$success){
                        this.$message({
                            type: 'success',
                            message: "操作成功"
                        });
                    }
                }).catch(e=>{
                    console.log(e);
                })
            }*/
        }
    }
</script>

<style lang="scss">
    .gx_resource_feedback {

    }
</style>
