<template>
    <div class="page_system_notice">
        <div>
            <!--提示-->
            <el-dialog
                :title="getLang(langs.tips)"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <span>{{noticeMessage}}</span>
                <span slot="footer" class="dialog-footer">
                    <!--取 消-->
                    <el-button @click="dialogVisible = false">{{getLang(langs.cancel)}}</el-button>
                    <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
                  </span>
            </el-dialog>
        </div>
        <!--系统公告-->
        <h3>{{getLang(pageLang.title)}}</h3>
        <div class="list">
            <ul>
                <li v-for="(item,index) in noticeList" :key="index">
                    <span>{{item.title}}</span>
                    <span>{{item.createDate | formatTimeStampMinute}}</span>
                    <!--查看-->
                    <el-button size="mini" @click="showSystemNotice(item)">{{getLang(langs.see)}}</el-button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import viewBase from  '../../common/viewBase'
    import {getSystemNoticeList} from  '../../../api/systemNotice'
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "system_notice";
    // 多语言显示
    export const pageLang= {
        title:lang_prefix + "title",
    }
    addLangItem(pageLang.title,'系统公告','系统公告','System Notice');

    export default {
        extends:viewBase,
        name: "systemNotice",
        components:{ },
        data(){
            return {
                pageLang,
                langs,
                dialogVisible:false,
                noticeMessage:"",
                noticeList: [

                ]
            }
        },
        mounted() {
            this.loadSystemNotce()
        },
        methods:{
            loadSystemNotce:function () {
                getSystemNoticeList({}).then((result)=>{

                    if(result.code==this.$success){
                        this.noticeList = result.data;
                        return
                    }
                    this.$message({
                        type: 'error',
                        message: 'load error'
                    })
                }).catch((err)=>{
                    console.log(err);
                    this.$message({
                        type: 'error',
                        message: 'load error'
                    })
                })
            }
            ,
            handleClose:function () {
                this.noticeMessage="";
            },
            showSystemNotice:function (item) {
                // set read
                // this.noticeMessage = item.message;
                // this.dialogVisible = true;
                this.$alert(item.message, '系统公告', {
                    confirmButtonText: '确定',
                    // callback: action => {
                    //     this.$message({
                    //         type: 'info',
                    //         message: `action: ${ action }`
                    //     });
                    // }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
.page_system_notice {

    h3 {
        font-size: 16px;
        color: #418a5a;
        line-height: 42px;
        border-bottom: 1px solid #ebeef5;
        padding: 0 10px;
    }

    .list{
        padding: 0 10px;
        min-height: 150px;

        li {
            line-height: 32px;
        }
    }
}
</style>
