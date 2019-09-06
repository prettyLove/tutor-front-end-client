<template>

    <div class="page_user_message table_box">
        <!--消息列表-->
        <h4 class="title">{{getLang(pageLang.title)}}</h4>
        <table class="table">
            <tr>
                <!--标题-->
                <th>{{getLang(langCode.title)}}</th>
<!--                <th>发送者</th>-->
                <th>{{getLang(pageLang.sender)}}</th>
<!--                <th>时间</th>-->
                <th>{{getLang(langCode.createDate)}}</th>
<!--                <th>状态</th>-->
                <th>{{getLang(langCode.status)}}</th>
                <!--操作-->
                <th>{{getLang(langCode.operation)}}</th>
            </tr>
            <tr v-for="item in pageInfo.list" :key= item.id>
                <td>{{item.title}}</td>
                <td>{{item.name}}</td>
                <td style="width: 300px;">{{item.createDate | formatTimeStamp}}</td>
                <!--  已读-->
                <td style="width: 200px;" v-if="item.read">{{getLang(pageLang.haveRead)}}</td>
                <!-- 未读-->
                <td style="width: 200px;" v-else>{{getLang(pageLang.unRead)}}</td>
                <td class="control_btns" style="width: 210px;">
                                 <!-- 编辑按钮 -->
                <!-- 查看-->
                    <el-button size="small" @click="readMessage(item)" plain  >{{getLang(langCode.see)}}</el-button>
                </td>
            </tr>
        </table>

        <!--翻页组件-->
        <el-pagination
            :visible.sync="!pageInfo.loading"
            layout="prev, pager, next"
            :current-page="pageInfo.pageNum"
            :total="pageInfo.total"
            @current-change="setPage">
        </el-pagination>

    </div>
</template>

<script>
    // 用户消息中心
    import tablePageBase from  '../common/tablePageBase'
    import { userMessageApi } from '../../api/userMessage'

    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "user_message_";
    // 多语言显示
    export const pageLang= {
        title:lang_prefix + "title",
        haveRead:lang_prefix + "haveRead", //已读
        unRead:lang_prefix + "haveRead", //未读
        sender:lang_prefix + "sender", //发送者
    }
    addLangItem(pageLang.title,'消息列表','消息列表','User message');
    addLangItem(pageLang.haveRead,'已读','已读','Have read');
    addLangItem(pageLang.unRead,'未读','未读','UnRead');
    addLangItem(pageLang.sender,'发送者','发送者','Sender');


    export default {
        extends:tablePageBase,
        name: "userMessage",
        components:{ },
        data(){
            return {
                pageLang,
            }
        },
        mounted() {
            let vm = this;
            // 增删改查
            vm.api.listPage = this.$api.userMessageRouter.listPage;
            // 加载列表
            vm.getPageList();
        },
        methods:{
            readMessage:function (item) {
                if (!item.read){
                    userMessageApi.read({messageId:item.id,isRead:item.read})
                        .then(()=>{
                        item.read = true;
                        this.$store.dispatch("loadMessageRequestInfo");
                    });
                }
                // this.$alert(item.message||"数据加载失败", {
                this.$alert(item.message||this.getLang(this.langCode.loadFail), {
                    // confirmButtonText: '确定',
                    confirmButtonText: this.getLang(this.langCode.sure),
                });
            }
        }
    }
</script>

<style scoped lang="scss">
.page_user_message {
    .title {
        font-size: 16px;
        line-height: 40px;
        color: #5a9a70;
    }
    .table {
        width: 100%;
        th {
            color: #ffffff;
            background-color: #5a9a70;
        }

        td,th {
            text-align: center;
            border: 1px solid #e3e9e0;
            line-height: 18px;
            padding: 4px 6px;
        }
    }

}
</style>
