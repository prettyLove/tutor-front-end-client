<template>
    <div class="lg_upload">
        <div>
            <ul v-if="value.length>0">
                <li v-for="(item,index) in value" class="file_item" :key="index">
                    <el-container>
                        <el-main style="padding: 0;" class="file_link">
<!--                            预览-->
                            <el-button type="text" size="small" @click="$emit('viewFile',item.url)">{{getLang(pageLang.preview)}}</el-button>
<!--                            <el-button type="text" size="small" @click="$emit('viewFile',item.url)">预览</el-button>-->
                            <a :href="item.url" target="_blank">{{getFileName(item)}}</a>
                        </el-main>
                        <el-aside width="60px" class="side">
                            <i class="el-icon-circle-close delete_btn" @click="removeFile(item,index)"></i>
                        </el-aside>
                    </el-container>
                </li>
            </ul>
        </div>

        <el-upload v-if="currentValue.length <= fileLimit"
                   style="text-align: left;"
                   :action="actionUrl"
                   :headers="headers"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :before-remove="beforeRemove"
                   :before-upload="beforeAvatarUpload"
                   :on-success="onUploadSuccess"
                   :on-error="onUploadError"
                   multiple
                   :limit="5"
                   :on-exceed="handleExceed"
                   :show-file-list="false"
                   :accept="acceptFileType"
                   :data="{bucketName:uploadPath}"
                   :file-list="value">
<!--            点击上传-->
            <el-button size="small" type="primary">{{getLang(pageLang.clickUpload)}}</el-button>

        </el-upload>
    </div>

</template>

<script>
    import axios from 'axios'
    import {getToken} from '@/utils/auth'
    import viewBase from '../pages/common/viewBase'
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "lg_upload_";
    // 多语言显示
    export const pageLang= {
        clickUpload:lang_prefix + "clickUpload",
        preview:lang_prefix + "preview",
    }
    addLangItem(pageLang.clickUpload,'点击上传','点击上传','Click Upload');
    addLangItem(pageLang.preview,'预览','预览','Preview');
    export default {
        name: "loUpload",
        extends : viewBase,
        components: {},
        data() {
            return {
                pageLang,
                actionUrl: axios.defaults.baseURL + this.$api.userRouter.getUploadFile,
                headers: {'accessToken': getToken()},
                currentValue: (this.value === undefined || this.value === null) ? [] : this.value,
            }
        },
        props: {
            uploadPath:{
                type:String,
                default: "",
            },
            value: {
                type: Array,
                default: [],
            },
            fileLimit: {
                type: Number,
                default: 5,
            },
            acceptFileType: {
                type: String,
                default: ".*",
            },
            acceptFileSize: {
                type: Number,
                default: 1024 * 1024 * 30 // 30M
            },
            videoVisible: {
                type: Boolean,
                default: false,
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
            console.log("uploadPath",this.uploadPath);
        },
        methods: {
            valueChange: function (value) {
                this.$emit('setValue', this.currentValue);
            },
            setValue: function (value) {
                this.currentValue = value;
            },
            getFileName: function (item) {
                let url = item.url;
                let num = url.lastIndexOf("/");
                if (num != -1) {
                    return url.substr(num + 1);
                }
                return url;
            },
            handleRemove(file, fileList) {
                //更新当前所有文件的list
                this.setValue(fileList);
            },
            handlePreview(file) {
            },
            removeFile: function (file, index) {
                this.currentValue.splice(index, 1);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                // 文件超过10M 也会触发这里  所以这里要判断
                if (this.beforeAvatarUpload(file)) {
                    //更新当前所有文件的list
                    return this.$confirm(`确定移除 ${file.name}？`);
                }
                // else{
                //     return this.$alert(`文件超过大小限制 [ ${ file.name } ]` );
                // }
            },
            onUploadSuccess: function (response, file, fileList) {
                var vm = this;
                console.log("response", response)
                if (response.code === vm.$success) {
                    let result = response.data;
                    file.id = result.id;
                    file.url = result.url;
                    this.setValue(fileList);
                } else {
                    this.$message("上传错误:" + response.message);
                    // 删除上传失败的文件
                    for (let i = 0; i < fileList.length; i++) {
                        let item = fileList[i];
                        console.log(item == file);
                        if (item == file) {
                            fileList.splice(i, 1);
                            break;
                        }
                    }
                    this.setValue(fileList);
                }
            },
            onUploadError: function (err, file, fileList) {
            },
            beforeAvatarUpload(file) {
                if( this.acceptFileType !=".*"){
                    let suffix = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                    let suffixs = this.acceptFileType.split(",");
                    console.log("suffix" + suffix)
                    console.log("suffixs" + JSON.stringify(suffixs))
                    let flag = false;
                    for (let i = 0; i < suffixs.length; i++) {
                        if (suffix === suffixs[i].toLowerCase()) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        //弹出文件类型错误信息
                        this.$alert(`文件类型不匹配 [ ${file.name} ]`);
                        return false;
                    }
                }

                //todo 判断文件大小
                if (file.size > this.acceptFileSize) {
                    this.$alert(`超过文件大小限制 [ ${file.name} ]`);
                    return false;
                }
                return true;
                // const limitSizereturn true; = file.size / 1024 / 1024 < 30;
                // return limitSize;
            },
        }
    }
</script>

<style lang="scss">
    .lg_upload {
        .file_item {

            .delete_btn {
                color: #ff8352;
                font-size: 18px;
                cursor: pointer;
            }

            .delete_btn:hover {
                color: #ff0000;
            }

            .file_link {
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
            }

            a:hover {
                color: #418a5a;
            }
        }
    }
</style>
