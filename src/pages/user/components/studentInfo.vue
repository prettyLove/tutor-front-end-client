<template>
    <div class="page_usrinfo table_box">
        <el-row :gutter="12">
            <el-col :span="24">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!--            个人资料-->
                    <el-tab-pane label="个人资料" name="first">
                        <base-info />
                    </el-tab-pane>
                    <!--            联系资料-->
                    <el-tab-pane label="联络资料" name="second">
                        <contact-info />
                    </el-tab-pane>

                    <el-tab-pane label="学生资料" name="three">
                        <div>
                            <el-form ref="form" :model="studentInformationForm" label-width="90px">
<!--                                <el-form-item label="学生证：" label-width="120px">-->
<!--                                    &lt;!&ndash;                                <image-upload></image-upload>&ndash;&gt;-->
<!--                                    <el-upload-->
<!--                                        class="upload-demo"-->
<!--                                        drag-->
<!--                                        action="https://jsonplaceholder.typicode.com/posts/"-->
<!--                                        multiple>-->
<!--                                        <i class="el-icon-upload"></i>-->
<!--                                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--                                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--                                    </el-upload>-->
<!--                                </el-form-item>-->
                                <el-form-item label="补习时间：" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.tutorialDate" placeholder="请输入补习时间" ></el-input>
                                </el-form-item>
                                <el-form-item label="级别：" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.level" placeholder="请输入级别" ></el-input>
                                </el-form-item>
                                <el-form-item label="哪一个考试：" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.exam" placeholder="请输入级别" ></el-input>
                                </el-form-item>
                                <el-form-item label="补习年级：" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.studyLevel" placeholder="请输入补习年级"></el-input>
                                </el-form-item>
                                <el-form-item label="上课时间：" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.studyDate" placeholder="请输入上课时间"></el-input>
                                </el-form-item>
                                <el-form-item label="补习课题：" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.subject" placeholder="请输入补习课题"></el-input>
                                </el-form-item>
                                <el-form-item label="其他要求" label-width="120px" class="userinfo_formitem">
                                    <el-input v-model="studentInformationForm.moreExplain" placeholder="请输入补习学费(时薪)"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <el-button @click="saveInfo(studentInformationForm)" style="margin-left: 40px">保存</el-button>
                    </el-tab-pane>
<!--                    <el-tab-pane label="补习资料" name="fourth">-->
<!--                        <el-form :model="tutorialForm" label-width="120px">-->

<!--                            <el-form-item label="补习年级：" >-->
<!--                                <el-input v-model="tutorialForm.tutorialGrade" placeholder="请输入补习年级"></el-input>-->
<!--                            </el-form-item>-->

<!--                            <el-form-item label="学费(时薪)：" >-->
<!--                                <el-input v-model="tutorialForm.tuition" placeholder="请输入补习学费(时薪)"></el-input>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="尊师性别：">-->
<!--                                <el-select v-model="tutorialForm.techerSex" style="width: 100%">-->
<!--                                    <el-option label="男" :value="1"></el-option>-->
<!--                                    <el-option label="女" :value="2"></el-option>-->
<!--                                    <el-option label="保密" value=""></el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="尊师语言：">-->
<!--                                <el-select v-model="tutorialForm.language" placeholder="请选择语言" style="width: 100%" >-->
<!--                                    <el-option v-for="(item ,index) in langSelectList" :key="index" :label="item.name" :value="item.value"></el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="尊师最低学历：">-->
<!--                                <el-select  v-model="tutorialForm.mixEducation" style="width: 100%">-->
<!--                                    <el-option label="博士" value="0"></el-option>-->
<!--                                    <el-option label="硕士" value="1"></el-option>-->
<!--                                    <el-option label="研究生" value="2"></el-option>-->
<!--                                    <el-option label="本科" value="3"></el-option>-->
<!--                                    <el-option label="专科" value="4"></el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->

<!--                    </el-form>-->
<!--                    </el-tab-pane>-->


                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import teacherInformation from './teacherInformation'
    import viewBase from '../../common/viewBase'
    import {memberRoleList, roles, langSelectList} from "@/utils/const";
    import imageUpload from "./imageUpload"
    import baseInfo from "./baseInfo"
    import contactInfo from "./contactInfo"
    import {studentApi} from "@/api/user";

    export default {
        extends: viewBase,
        name: "studentInfo",
        components: {teacherInformation, imageUpload, baseInfo, contactInfo},
        data() {
            return {
                langSelectList,
                roles,
                memberRoleList,
                activeName: 'first',
                form: {},
                imageUrl: '',
                textarea: '',
                // 授课资料
                value: [],
                studentInformationForm: {},
                tutorialForm: {},
            }
        },
        mounted() {
            console.log("userinfo---", this.$store.getters.getUserInfo);
            this.form = Object.assign({}, this.$store.getters.getUserInfo);
            this.form.sex = this.form.sex || "";
            this.getStudentInfo();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            //学生信息展示
            getStudentInfo: function () {
                let vm = this;
                studentApi.getUserStudent().then((result) => {
                    console.log('result', result);
                    if (result.code == vm.$success) {
                        console.log('result', result);
                        this.studentInformationForm = result.data;
                        this.tutorialForm = result.data;
                    }
                }).catch((err) => {
                    console.log('err', err);
                })
            },
            //学生信息保存
            saveInfo: function (params) {
                console.log("params", params);
                // todo
                // api
                studentApi.saveUserStudent(params).then((result) => {
                    console.log('result', result);
                    if (result.code == this.$success) {
                        this.$message({
                            type: 'success',
                            message: "更新成功"
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: "更新失败"
                        });
                    }
                }).catch((err) => {
                    console.log("err", err);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page_usrinfo {
        .userinfo_formitem{width: 70%;}

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
