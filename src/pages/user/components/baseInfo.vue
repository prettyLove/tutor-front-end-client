<template>
    <div class="page_baseinfo">
        <el-form ref="form" :model="basicInformationForm" label-width="100px">
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-form-item label="英文姓：">
                        <el-input v-model="basicInformationForm.lastNameEnglish" placeholder="请输入英文姓" ></el-input>
                    </el-form-item>
                    <el-form-item label="英文名：">
                        <el-input v-model="basicInformationForm.firstNameEnglish" placeholder="请输入英文名" ></el-input>
                    </el-form-item>

                    <el-form-item label="中文姓：">
                        <el-input v-model="basicInformationForm.lastNameChinese" placeholder="请输入中文姓"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名：">
                        <el-input v-model="basicInformationForm.firstNameChinese" placeholder="请输入中文名" ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="出生日期：">
                        <el-date-picker type="date" placeholder="选择日期" v-model="basicInformationForm.birthday" style="width: 100%" ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="语言：">
                        <el-select v-model="basicInformationForm.language" placeholder="请选择语言" style="width: 100%" >
                            <el-option v-for="(item ,index) in langSelectList" :key="index" :label="item.name"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="国籍：">
                        <el-select v-model="basicInformationForm.countries" placeholder="请选择国籍" style="width: 100%">
                            <el-option v-for="(item,index) in nationalityType" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
<!--                        <el-input ></el-input>-->
                    </el-form-item>
                    <el-form-item label="性别：" >
                        <el-select v-model="basicInformationForm.sex" style="width: 100%">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                            <el-option label="保密" value=""></el-option>
                        </el-select>
                    </el-form-item>
<!--                    <el-form-item label="证件类型：">-->
<!--                        <el-select v-model="basicInformationForm.region" style="width: 100%" >-->
<!--                            <el-option label="中国身份证" value="zh_id"></el-option>-->
<!--                            <el-option label="香港身份证" value="香港身份证"></el-option>-->
<!--                            <el-option label="护照" value="passport"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                </el-col>

                <el-col :span="8" >
                    <div class="upload_avatar">
                        <div class="avatar">
                            <img v-if="isEmpty(this.basicInformationForm.avatar)" src="/static/image/default_avatar.jpg" />
                            <img  v-else :src="this.basicInformationForm.avatar" />
                        </div>
                        <lg-upload v-model="fileList" uploadPath="avatar"/>
                    </div>


                </el-col>
            </el-row>
        </el-form>
        <el-button @click="saveInfo(basicInformationForm)">保存</el-button>
    </div>
</template>

<script>
    import viewBase from '../../common/viewBase'
    import {memberRoleList, roles, langSelectList,nationalityType} from "@/utils/const";
    import {basicComentApi,basicComentgetUser} from "@/api/user";
    import lgUpload from "@/components/lgUpload"

    export default {
        extends:viewBase,
        name: "baseInfo",
        components:{lgUpload},
        data() {
            return {
                roles,
                memberRoleList,
                langSelectList,
                nationalityType,
                basicInformationForm:{},
                fileList: [],
            }
        },
        watch:{
            fileList:{
                handler(val,oldVal){
                    if( val && val.length>0){
                        this.basicInformationForm.avatar = this.fileList[0].url;
                        this.fileList = [];
                    }
                }
            }
        },
        mounted() {
           this.basicComentUser();
        },
        methods: {
            basicComentUser:function(){
                let vm=this;
                basicComentApi.basicComentgetUser().then((result)=>{
                    console.log('result',result);
                    if(result.code==vm.$success){
                        console.log('result',result);
                        this.basicInformationForm=result.data;
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })
            },
            saveInfo:function (params) {
                console.log("params",params);
                // todo
                // api
                basicComentApi.basicComentSave(params).then((result)=>{
                    console.log('result',result);
                    if(result.code==this.$success){
                        this.$message({
                            type: 'success',
                            message: "更新成功"
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: "更新失败"
                        });
                    }
                }).catch((err)=>{
                    console.log("err",err);
                })
            }

        },
    }
</script>

<style scoped lang="scss">
.page_baseinfo {
    .upload_avatar{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .avatar {
            width: 120px;
            height: 120px;
            overflow: hidden;
            border-radius: 50%;
            display: inline-block;
            border: 2px solid #418a5a;
            margin-right: 20px;
            img {
                width: 100%;
                height:100%;
            }
        }
        .lg_upload{
            margin-top:20px;
            margin-right:40px;
        }
    }
}


</style>
