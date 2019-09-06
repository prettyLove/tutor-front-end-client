<template>
    <!--    已封裝好的分頁-->
    <lg-body :page-info="pageInfo" :title="$route.name" :ths="ths"  @pageChange="setPage" class="page_notes_list">
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
        <template slot="dialog">
            <!--    笔记编辑弹出框-->
<!--            标题-->
            <el-dialog :title=getLang(pageLang.notesTitle) :visible.sync="dialogFormVisible"  :close-on-click-modal="false"  >
                <el-form class="clearfix" >
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            标题-->
                            <el-form-item :label=getLang(langCode.title) :label-width="formLabelWidth" >
                                <el-input  v-model="form.title" :placeholder=getLang(pageLang.titlePlaceholder) />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="20" >
<!--                            美容-->
                            <el-form-item :label=getLang(langCode.content) :label-width="formLabelWidth" >
                                <el-input type="textarea" :rows='5' v-model="form.content" :placeholder=getLang(pageLang.contentPlaceholder) />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" v-if="fileList">
<!--                            笔记-->
                            <el-form-item :label=getLang(langCode.notes) :label-width="formLabelWidth">
                                <lg-upload  v-model="fileList" @viewFile="viewFile" :uploadPath="uploadPath" :accept-file-type="acceptFileType"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 取消和保存 -->
                <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
<!--                    取消-->
                    <el-button @click="dialogFormVisible=false">{{getLang(langCode.cancel)}}</el-button>
<!--                    <el-button type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">{{form.id?'保存':'新增'}}</el-button>-->
                    <el-button type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">{{form.id?getLang(langCode.save):getLang(langCode.newAdd)}}</el-button>
                </div>
            </el-dialog>
            <!--    笔记预览查看-->
<!--            PDF在线预览-->
            <el-dialog  :title=getLang(pageLang.dialogTitle) :visible.sync="videoVisible" :close-on-click-modal="false">
                <pdf :src="pdfSrc"  style="width: 100%"></pdf>
            </el-dialog>
        </template>

        <!--  =================== 添加按钮 ===================  -->
        <template slot="table_btns" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
            <ul>
                <li>
<!--                    添加-->
                    <el-button type="primary" size="medium"  icon="el-icon-circle-plus"  @click="create">{{getLang(langCode.add)}}</el-button>
                </li>
            </ul>
        </template>

        <!--  =================== 表格内容 ===================  -->
        <template slot="table">
            <tr v-for="item in pageInfo.list" :key="item.id">
                <td style="width: 20%;">{{item.title?item.title.substr(0,20)+(item.title.length>20?'...':''):''}}</td>
                <td>{{item.content?item.content.substr(0,50)+(item.content.length>50?'...':''):''}}</td>
                <td style="width: 140px;">{{item.createDate|formatTimeStampMinute}}</td>
                <td style="width: 140px;">{{item.name}}</td>
<!--                <td style="width: 140px;">{{item.status==1?'审核':'未审核'}}</td>-->
                <td style="width: 140px;">{{item.status==1?getLang(langCode.audited):getLang(langCode.notAudited)}}</td>
                <td class="control_btns" style="width: 160px;text-align: center" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
                    <!-- 编辑按钮 -->
<!--                    <el-button size="small" @click="get(item)" plain   v-if="item.status==0">{{getLang(langCode.edit)}}</el-button>-->
                    <el-button size="small" @click="get(item)" plain   >{{getLang(langCode.edit)}}</el-button>
                    <!-- 删除按钮 -->
                    <el-button size="small" @click="del(item.id)" plain type="danger" >{{getLang(langCode.delete)}}</el-button>
                </td>
                <td class="control_btns" style="width: 80px;text-align: center" v-if="$store.getters.getUserInfo.role==roles.STUDENT">
                    <!-- 收藏按钮 -->
                    <el-button size="small" @click="get(item)" plain   >{{getLang(pageLang.collection)}}</el-button>
                </td>
            </tr>
        </template>
    </lg-body>
</template>

<script>
    import {notesApi} from '@/api/notes';
    import tablePageBase from  '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "notes_list";
    // 多语言显示
    export const pageLang= {
        notesTitle:lang_prefix + "notesTitle",
        dialogTitle:lang_prefix + "dialogTitle",
        collection:lang_prefix + "collection",
        titlePlaceholder:lang_prefix + "titlePlaceholder",
        contentPlaceholder:lang_prefix + "contentPlaceholder",
        titleVerification:lang_prefix + "titleVerification",
        contentVerification:lang_prefix + "contentVerification",
        enclosureVerification:lang_prefix + "enclosureVerification",
    }
    addLangItem(pageLang.notesTitle,'教学笔记','教学笔记','Teaching Notes');
    addLangItem(pageLang.dialogTitle,'PDF在线预览','PDF在线预览','PDF Online Preview');
    addLangItem(pageLang.collection,'收藏','收藏','Collection');
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
                //acceptFileSize:1024*1024*30,   //传入30M
                pdfSrc:'',
                videoVisible:false,
                uploadPath:'note',
            }
        },
        mounted() {
            let vm = this;
            // vm.ths= ['标题','备注','创建时间','创建者','状态', {name:'操作',align:"center"}];
            vm.ths= [vm.getLang(vm.langCode.title),vm.getLang(vm.langCode.remarks),vm.getLang(vm.langCode.createDate),
                vm.getLang(vm.langCode.creator), vm.getLang(vm.langCode.status),{name:vm.getLang(vm.langCode.operation),align:"center"}];
            // 增删改查
            vm.api.listPage = this.$api.notesRouter.listPage;
            vm.api.insert = this.$api.notesRouter.add;
            vm.api.delete = this.$api.notesRouter.delete;
            vm.api.update = this.$api.notesRouter.save;
            // 加载列表
            vm.getPageList();
        },
        methods: {
            viewFile:function(fileurl){
                // 预览视频
                console.log("fileurl",fileurl);
                // this.pdfSrc = fileurl;
                // this.videoVisible=true;
                window.open(fileurl , '_blank');
            },
            create:function(){
                this.fileList = [];
                this.edit({}) ;
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
                    this.$alert(vm.getLang(pageLang.titleVerification));
                    return false;
                }
                if(vm.isEmpty(this.form.content)){
                    // 内容不能为空
                    this.$alert(vm.getLang(pageLang.contentVerification));
                    return false;
                }
                //
                let ids = this.fileList.map(item=>{
                    return item.id;
                }) || [];
                if(ids.length<1){
                    // 请上传附件
                    this.$alert(vm.getLang(pageLang.enclosureVerification));
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

<style scoped>

</style>
