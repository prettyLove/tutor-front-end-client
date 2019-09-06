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
<!--            title=教学笔记-->
            <el-dialog :title=this.getLang(pageLang.title) :visible.sync="dialogFormVisible"  :close-on-click-modal="false"  >
                <el-form class="clearfix" >
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            标题-->
                            <el-form-item :label=this.getLang(langCode.title) :label-width="formLabelWidth" >
                                <el-input  v-model="form.title" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            内容-->
                            <el-form-item :label=this.getLang(langCode.content) :label-width="formLabelWidth" >
                                <el-input type="textarea" :rows='5' v-model="form.content" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" v-if="fileList">
<!--                            笔记在线预览-->
<!--                            笔记-->
                            <el-form-item :label=this.getLang(langCode.notes) :label-width="formLabelWidth">
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
<!--                    查看-->
                    <el-button class="collection_notes_see" size="small" @click="get(item)" plain>{{getLang(langCode.see)}}</el-button>
<!--                    删除-->
                    <el-button size="small" @click="del(item.id)" plain type="danger"  >{{getLang(langCode.delete)}}</el-button>
                </td>
            </tr>
        </template>
    </lg-body>
</template>

<script>
    import {notesApi} from '@/api/notes';
    import {collectionApi} from '@/api/collection';
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "collector_notes";
    // 多语言显示
    export const pageLang= {
        title:lang_prefix + "title",
        titlePlaceholder:lang_prefix + "titlePlaceholder",
        contentPlaceholder:lang_prefix + "contentPlaceholder",
        titleVerification:lang_prefix + "titleVerification",
        contentVerification:lang_prefix + "contentVerification",
        enclosureVerification:lang_prefix + "enclosureVerification",
    }
    addLangItem(pageLang.title,'教学笔记','教学笔记','Teaching Notes');
    addLangItem(pageLang.titlePlaceholder,'请输入要修改的标题','请输入要修改的标题','Please enter the content to be modified');
    addLangItem(pageLang.contentPlaceholder,'请输入要修改的内容','请输入要修改的内容','Please enter what you want to modify');
    addLangItem(pageLang.titleVerification,'标题不能为空','标题不能为空','The title should not be blank');
    addLangItem(pageLang.contentVerification,'内容不能为空','内容不能为空','Content cannot be empty');
    addLangItem(pageLang.enclosureVerification,'请上传附件','请上传附件','Please upload the attachment.');
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
                acceptFileType:".pdf,.PDF",
                pdfSrc:'',
                videoVisible:false,
                uploadPath:'note',
            }
        },
        mounted() {
            let vm = this;
            this.reqCond.type="NOTE";
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
                let url = item.url;
                // 笔记预览
                console.log("url",url);
                window.open(url , '_blank');
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
            validate: function () {
                let vm = this;
                if (vm.isEmpty(this.form.title)) {
                    // 提示标题不能为空
                    this.$alert("this.getLang(this.pageLang.titleVerification)");
                    return false;
                }
                if(vm.isEmpty(this.form.content)){
                    // 提示内容 不能为空
                    this.$alert(this.getLang(this.pageLang.contentVerification));
                    return false;
                }
                //
                let ids = this.fileList.map(item=>{
                    return item.id;
                }) || [];
                if(ids.length<1){
                    // 上传附件
                    this.$alert(this.getLang(this.pageLang.enclosureVerification));
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
                width: 140px;text-align: center;
                .collection_notes_see{background-color: rgb(225,243,216)}
                .collection_notes_see:hover{background: rgb(103,194,58);color: #fff;border-color: #2fb21a;}
                /*.collection_notes_del{color: #F56C6C;background: #fef0f0;border-color: #fbc4c4;}*/
                /*.collection_notes_del:hover{color: #fff;background: #F56C6C;border-color: #ff3126}*/
        }
        .file_link {
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
        }

    }

</style>
