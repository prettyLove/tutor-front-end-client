<template>
    <div class="image_uload">
        <el-container v-if="info">
            <el-main>
                <div class="img" v-if="info.url!=null && info.url!=''">

                    <img v-if="isTestImage(info.url)" :src="info.url"/>
                    <a v-else :href="info.url" >点击下载</a>
                </div>
                <el-upload v-else
                           class="upload-demo"
                           :headers="headers"
                           drag
                           :action="actionUrl"
                           multiple
                           :file-list="fileList"
                           :data="{bucketName:uploadPath}"
                           :on-success="uploadSucess" :before-upload="beforeUpload"
                           accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.doc,docx,DOC,DOCX"
                           :on-remove="uploadRemove">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png/pdf/doc/docx文件，且不超过500kb</div>
                </el-upload>
            </el-main>
            <el-aside width="100px" class="addPadding">
                <div class="check_style">
                    {{info.status==1?'已审核':'未审核'}}
                </div>
                <div v-if="info.url">
                    <el-button type="danger" icon="el-icon-delete" @click="deleteFile"></el-button>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
    // import {api} from '../../../api/api'
    import {getToken} from '@/utils/auth'
    import axios from 'axios'
    import {tutorApi} from "@/api/user"
    import {$success} from "../../../utils/const";

    export default {
        name: "imageUpload",
        props: {
            value: [String, Number],
            info: Object,
            uploadPath:{
                type:String,
                default: "",
            },
        },
        data() {
            return {
                fileList: [],
                currentValue: (this.value === undefined || this.value === null) ? '' : this.value,
                // actionUrl:api.userRouter.getUploadFile+"?token="+getToken(),
                actionUrl: axios.defaults.baseURL + this.$api.userRouter.getUploadFile,
                headers: {'accessToken': getToken()},

            }
        },
        model: {
            prop: 'value',
            event: 'setValue'
        },
        watch: {
            currentValue(val, oldValue) {
                this.valueChange(val);
            },
            value(val, oldValue) {
                this.currentValue = val;
            },
        },
        mounted() {
            console.log("info", this.info);
        },
        methods: {
            valueChange: function (value) {
                this.$emit('setValue', this.currentValue);
            },
            setValue: function (value) {
                this.currentValue = value;
            },
            beforeUpload: function (file) {
                let allType = ['image/jpeg','image/gif','image/png','image/jpg','image/bmp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain']
                const isIMAGE = allType.indexOf(file.type)!=-1
                const isLt1M = file.size / 1024 / 1024 < 10;
                if (!isIMAGE) {
                    this.$message.error('上传文件只能是图片,文档,文本等格式!');
                }
                if (!isLt1M) {
                    this.$message.error('上传文件大小不能超过 10MB!');
                }
                return isIMAGE && isLt1M;
            },
            uploadSucess(response, file, fileList) {
                // fileId为上传图片的id,id为图片的id
                console.log('response',response,'file','file','fileList',fileList);
                this.info.fileId = response.data.id;
                this.info.id = this.info.fileId;
                this.info.url = response.data.url;
                // this.info = Object.assign({},this.info);
                console.log(this.info, response);
                // tutorApi
                //

                tutorApi.tutorAdd(this.info).then((result) => {
                    if (result.code == $success) {
                        this.$message("操作成功");
                    }
                    this.$emit("change", this.info);
                }).catch((err) => {
                    console.log(err);
                })

            },
            //判断图片上传格式
            isTestImage: function (filepath) {
                var extStart = filepath.lastIndexOf(".");
                var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                    // alert("图片限于png,gif,jpeg,jpg格式");
                    return false;
                } else {
                    return true;
                }
            },
            uploadRemove(file, fileList) {

            },
            // 删除图片
            deleteFile: function () {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    tutorApi.tutorDelete({id: this.info.id}).then((result) => {
                        if (result.code == $success) {
                            this.info.url = null;
                            // this.info = Object.assign({},this.info);
                            this.$message("操作成功");
                        }
                        this.$emit("change", this.info);
                    }).catch((err) => {
                        console.log(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        // watch:{
        //     fileList:function (oldVlue,newValue) {
        //         this.$emit("sendUploadFIleList",newValue);
        //     }
        //
        // }

    }
</script>

<style lang="scss">
    .image_uload {
        .img {
            border: 1px solid #ccc;
            width:50%;

            img {
                width: 100%;
            }
            a{ border: 1px solid #ccc; background-color: #ccc; }
        }

        .addPadding {
            padding-top: 20px
        }
    }

</style>
