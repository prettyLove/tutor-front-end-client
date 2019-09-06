<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
              <div>
                  <el-form ref="form" :model="documentTypeForm" label-width="90px">
<!--                      <el-form-item label="证件类型：">-->
<!--                          <el-select v-model="documentTypeForm.region" style="width: 50%" >-->
<!--                              <el-option label="中国身份证" value="zh_id"></el-option>-->
<!--                              <el-option label="香港身份证" value="香港身份证"></el-option>-->
<!--                              <el-option label="护照" value="passport"></el-option>-->
<!--                          </el-select>-->
<!--                      </el-form-item>-->
                      <el-form-item :label="item.name" :label-width="formLabelWidth" v-for="(item,index) in TUTOR_TYPE_LIST"  :key="item.name">
                          <image-upload v-on:sendUploadFileList="getUploadFIleList" @change="getList" :info="getItemInList(item.value)" :type="item.value" :uploadPath="uploadPath" style="width: 60%"></image-upload>
                      </el-form-item>
                  </el-form>
<!--                  <el-button @click="saveInfo(documentTypeForm)">保存</el-button>-->
              </div>
<!--            </el-tab-pane>-->
<!--            <el-tab-pane label="身份证明" name="second">-->
<!--                <el-form ref="form" :model="form"  class="formItem_style">-->

<!--                    &lt;!&ndash;<el-form-item label-width="30px">-->
<!--                        <div>-->
<!--                            <el-button type="success" icon="el-icon-check"></el-button>-->
<!--                        </div>-->
<!--                        <div>-->
<!--                            <el-button  type="info" >无</el-button>-->
<!--                        </div>-->
<!--                        <div>-->
<!--                            <el-button type="primary" icon="el-icon-edit"></el-button>-->
<!--                        </div>-->
<!--                        <div>-->
<!--                            <el-button type="danger" icon="el-icon-delete"></el-button>-->
<!--                        </div>-->
<!--                    </el-form-item>&ndash;&gt;-->
<!--                </el-form>-->
<!--                <el-form ref="form" :model="form"  class="formItem_style">-->
<!--                    <el-form-item label="户口本照片：" :label-width="formLabelWidth">-->
<!--                        <image-upload v-on:sendUploadFileList="getUploadFIleList" :value="fileValue"></image-upload>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </el-tab-pane>-->
<!--            <el-tab-pane label="资格证书" name="third">-->
<!--                <el-form ref="form" :model="form"  class="formItem_style">-->
<!--                    <el-form-item label="学历证书：" :label-width="formLabelWidth">-->
<!--                        <image-upload v-on:sendUploadFileList="getUploadFIleList" :value="fileValue"></image-upload>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--                <el-form ref="form" :model="form"  class="formItem_style">-->
<!--                    <el-form-item label="资格证书：" :label-width="formLabelWidth">-->
<!--                        <image-upload v-on:sendUploadFileList="getUploadFIleList" :value="fileValue"></image-upload>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </el-tab-pane>-->
<!--            <el-tab-pane label="其它证书" name="fourth">-->
<!--                <el-form ref="form" :model="form"  class="formItem_style">-->
<!--                    <el-form-item label="普通话等级证书：" :label-width="formLabelWidth">-->
<!--                        <image-upload v-on:sendUploadFileList="getUploadFIleList" :value="fileValue"></image-upload>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </el-tab-pane>-->
        </el-tabs>
    </div>
</template>

<script>
    import {roles} from '@/utils/const'
    import imageUpload from "./imageUpload"
    import {tutorApi} from "@/api/user"
    import {TUTOR_TYPE_LIST} from "@/utils/const"

    export default {
        name: "teacherInformation",
        components: {imageUpload},
        data() {
            return {
                roles,
                TUTOR_TYPE_LIST,
                formLabelWidth:'120px',
                individual_self: '',
                activeName: 'first',
                textarea: '',
                fileList: [],
                form: {},
                fileValue:'',
                dataList:[],
                uploadPath:'tutor',
                documentTypeForm:{},
            }
        },
        mounted(){
            this.getList();
        },
        methods: {
            getItemInList:function(type){
                let find = {type};
                this.dataList.map((item) => {
                    if (item.type == type) {
                        find = item;
                        return false;
                    }
                });
                return find;
            },
            getList:function(){
                tutorApi.tutorGetListByUser({}).then((result)=>{
                    if(result.code==this.$success){
                        console.log("rrr",result)
                        this.dataList = result.data;
                    }
                }).catch((err)=>{
                    console.log("err",err);
                })
            },

            handleClick(tab, event) {
                console.log(tab, event);
            },

            onSubmit() {
                console.log('submit!');
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            getUploadFIleList(fileList){
                this.fileList=fileList;
            }
        }
    }
</script>

<style scoped>
    .formItem_style {
        margin: 0;
        display: flex;
        justify-content: left
    }

</style>
