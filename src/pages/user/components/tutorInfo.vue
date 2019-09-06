<template>
    <div class="page_usrinfo table_box">
        <el-row :gutter="12">
            <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!--            个人资料-->
                    <el-tab-pane label="基本信息" name="first">
                        <base-info />
                    </el-tab-pane>
                    <!--            联系资料-->
                    <el-tab-pane label="联络资料" name="second">
                        <contact-info />
                    </el-tab-pane>
                    <!--            履历资料-->
                    <el-tab-pane label="履历资料" name="third">
                        <div>
                            <el-form ref="form" :model="biographicalForm" label-width="130px">
                                <el-form-item label="当前职业：" style="width: 75%">
                                    <el-input v-model="biographicalForm.job" placeholder="请输入当前职业"></el-input>
                                </el-form-item>
                                <el-form-item label="工作经验：" style="width: 75%">
                                    <el-input
                                        type="textarea"
                                        :rows="5"
                                        placeholder="请输入工作经验"
                                        v-model="biographicalForm.experience">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="过去工作资料：" style="width: 75%">
                                    <el-input
                                        type="textarea"
                                        :rows="5"
                                        placeholder="请输入过去工作资料"
                                        v-model="biographicalForm.pastWorkHistory">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="补习经验及年资：" style="width: 75%">
                                    <el-input
                                        type="textarea"
                                        :rows="5"
                                        placeholder="请输入补习经验及年资"
                                        v-model="biographicalForm.tutorialYear">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="教育机构经验：" style="width: 75%">
                                    <el-input
                                        type="textarea"
                                        :rows="5"
                                        placeholder="请输入教育机构相关经验"
                                        v-model="biographicalForm.educationInstitution">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="最高补习年级：" style="width: 75%">
                                    <el-input v-model="biographicalForm.highestTutorialLevel" placeholder="请输入最高补习年级"></el-input>
                                </el-form-item>
                                <!--                            <el-form-item :label="item.name" :label-width="formLabelWidth"-->
                                <!--                                          v-for="(item,index) in TUTOR_TYPE_LIST" :key="item.name">-->
                                <!--                                <image-upload v-on:sendUploadFileList="getUploadFIleList" @change="getList"-->
                                <!--                                              :info="getItemInList(item.value)" :type="item.value"-->
                                <!--                                              :uploadPath="uploadPath"></image-upload>-->
                                <!--                            </el-form-item>-->
                            </el-form>
                            <el-button @click="saveInfo(biographicalForm)">保存</el-button>

                        </div>

                    </el-tab-pane>
                    <!--            学历资料-->
                    <el-tab-pane label="学历资料" name="fourth">
                        <div>
                        <el-form :model="educationForm">
                            <el-form-item label="最高教育程度：">
                                <el-select  v-model="educationForm.degree"  style="width: 70%">
                                    <el-option v-for="(item,index) in educationalList"  :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="大学主修科目：">
                                <el-input v-model="educationForm.subjectUniversity" placeholder="请输入大学主修科目" style="width: 70%"></el-input>
                            </el-form-item>
                            <el-form-item label="其他专业课程：">
                                <el-input v-model="educationForm.subjectOther" placeholder="请输入其他专业课程" style="width: 70%"></el-input>
                            </el-form-item>
                            <el-form-item label="当前就读年级：">
                                <el-input v-model="educationForm.studyLevel" placeholder="请输入现在就读年级" style="width: 70%"></el-input>
                            </el-form-item>
                            <el-form-item label="可上传的证书：">
                                <el-input v-model="educationForm.uploadPapers" placeholder="请输入可以上传的证书" style="width: 70%"></el-input>
                            </el-form-item>
                        </el-form>
                            <el-button @click="saveInfo(educationForm)">保存</el-button>
                        </div>
                    </el-tab-pane>
                    <!--            授课资料-->
                    <el-tab-pane label="授课资料" name="fifth" >
                        <div>
                        <el-form :model="teachingForm">
<!--                            <el-form-item label="授课内容：" >-->
<!--                                <el-input-->
<!--                                    type="textarea"-->
<!--                                    :rows="5"-->
<!--                                    placeholder="请输入授课内容"-->
<!--                                    v-model="teachingForm.teachingContent" style="width: 70%">-->
<!--                                </el-input>-->
<!--                            </el-form-item>-->
                            <el-form-item label="授课时间：">
                            </el-form-item>
                            <el-form-item >
                                <div><gx-lession-time-selete v-model="lessionArr" /></div>
                            </el-form-item>
                            <el-form-item label="课程内容">
                                <el-select v-model="teachSubject" multiple>
                                    <el-option v-for="(item,index) in subjectList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="能教授语言："></el-form-item>
                            <el-form-item >
                                <el-select  v-model="teachingForm.teachLanguage"  style="width: 24%">
                                    <el-option label="English" value="0"></el-option>
                                    <el-option label="普通话" value="1"></el-option>
                                    <el-option label="广东话" value="2"></el-option>
                                </el-select>
                            </el-form-item>
<!--                            <el-form-item label="可以上传的证书：">-->
<!--                                <el-input v-model="teachingForm.canUploadCertificate" placeholder="请输入授课时间" style="width: 70%"></el-input>-->
<!--                            </el-form-item>-->
                        </el-form>
                            <el-button @click="saveInfo(teachingForm)">保存</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="自我介绍" name="sixth">
                        <div>
                            <el-form :model="selfIntroductionForm">
                                <el-form-item label="简介标题：">
                                   <el-input v-model="selfIntroductionForm.title" placeholder="请输自我简介标题" style="width: 63%"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick2">
                                        <el-tab-pane label="简体版中文自我介绍" name="first">
                                            <el-input
                                                type="textarea"
                                                :rows="10"
                                                placeholder="请输入中文简体版自我介绍内容"
                                                v-model="selfIntroductionForm.introduceMyself['zh-cn']" style="width: 70%">
                                            </el-input>
                                        </el-tab-pane>
                                        <el-tab-pane label="繁体中文版自我介绍" name="second">
                                            <el-input
                                                type="textarea"
                                                :rows="10"
                                                placeholder="请输中文繁体版中文自我介绍内容"
                                                v-model="selfIntroductionForm.introduceMyself['zh-hk']" style="width: 70%">
                                            </el-input>
                                        </el-tab-pane>
                                        <el-tab-pane label="英文版自我介绍" name="third">
                                            <el-input
                                                type="textarea"
                                                :rows="10"
                                                placeholder="请输入英文版自我介绍内容"
                                                v-model="selfIntroductionForm.introduceMyself['en-us']" style="width: 70%">
                                            </el-input>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-form-item>
                            </el-form>
                            <el-button @click="saveInfo(selfIntroductionForm)">保存</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="证件资料" name="seventh">
                        <teacher-information></teacher-information>
                    </el-tab-pane>

                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import teacherInformation from './teacherInformation'
    import viewBase from '../../common/viewBase'
    import {memberRoleList, roles, langSelectList,educationalList} from "@/utils/const";
    import imageUpload from "./imageUpload"
    import baseInfo from "./baseInfo"
    import contactInfo from "./contactInfo"
    import {tutorApi} from "@/api/user";
    import gxLessionTimeSelete from "@/components/gxLessionTimeSelete"
    import {subjectList} from "@/utils/const";


    export default {
        extends: viewBase,
        name: "tutorInfo",
        components: {teacherInformation, imageUpload,baseInfo,contactInfo,gxLessionTimeSelete,subjectList},
        data() {
            return {
                langSelectList,
                roles,
                memberRoleList,
                educationalList,
                subjectList,
                activeName: 'first',
                activeName2: 'first',
                form: {},
                imageUrl: '',
                textarea: '',
                // 授课资料
                value: [],
                educationForm:{},
                teachingForm:{},
                biographicalForm:{},
                selfIntroductionForm:{introduceMyself:{}},
                // introduceMyself:{},
                lessionArr:[],
                teachSubject:[],
                subjectContent:'',
            }
        },
        mounted() {
            console.log("userinfo---", this.$store.getters.getUserInfo);
            this.form = Object.assign({}, this.$store.getters.getUserInfo);
            this.form.sex = this.form.sex || "";
            this.getGraphicalInfo();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            //履历信息展示
            getGraphicalInfo:function(){
                let vm=this;
                tutorApi.getUserTutor().then((result)=>{
                    console.log('result',result);
                    if(result.code==vm.$success){
                        console.log('getUserTutor---result',result);
                        this.biographicalForm=result.data;
                        this.educationForm=result.data;
                        this.teachingForm=result.data;
                        this.teachSubject=result.data.teachSubject.split(",");
                        this.selfIntroductionForm=result.data;
                        try {
                            if(this.teachingForm.teachData){
                                this.lessionArr = JSON.parse(this.teachingForm.teachData)
                            }else {
                                this.lessionArr=[];
                            }

                        }catch (e) {
                            console.log(e)
                        }
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
            //履历信息保存
            saveInfo:function (params) {
                // todo
                // api
                params.teachSubject=this.teachSubject.join(",");
                console.log('params.teachSubject',params.teachSubject);
                params.teachData = JSON.stringify(this.lessionArr);
                console.log("params",params);
                tutorApi.saveUserTutor(params).then((result)=>{
                    console.log('result',result);
                    if(result.code==this.$success){
                        this.$message({
                            type: 'success',
                            message: "更新成功"
                        });
                    } else{
                        this.$message({
                            type: 'error',
                            message: "更新失败"
                        });
                    }
                }).catch((err)=>{
                    console.log("err",err);
                })
            },
            handleClick2(tab, event) {
                console.log(tab, event);
            }
        },


    }
</script>

<style lang="scss" scoped>
    .page_usrinfo {

    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        /*width: 178px;*/
        /*height: 178px;*/
        /*line-height: 178px;*/
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-textarea__inner {
        height: 200px !important;
    }

    .weekday {
        margin-top: 12px;
        float: right;
    }
</style>
