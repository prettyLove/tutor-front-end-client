<template>
    <div :class="'fade_in main_box ' + ( isOverView()?' overview_page ':'' ) " :style="getMainBoxStyle()">
        <!--  =================== 菜单menus ===================  -->
        <!--v-show="$store.getters.leftMenuSta"-->
        <main-menu  />

        <!--  =================== 顶部栏topBar ===================  -->
        <top-bar >
            <template slot="title" v-if="isOverView()">
                <div class="top_title">
                    <div>顾学科技</div>
                </div>
            </template>
        </top-bar>

        <!--  =================== 主页面main ===================  -->
        <div class="main_body" style="height: 100%;" v-bind:style="{'margin-left': getMenuMagin()}">

            <el-scrollbar :style="{height: '100%'}">

                <div class="topbar_fit" v-show=" ! isOverView()" ></div>

                <div v-if="isOverView()" class="overview_page_bg" ></div>

                <div class="cont"  v-if="isSystemsLoadComplete()" >
                    <router-view></router-view>
                    <div style="height: 10px;"></div>
                </div>

                <div v-else class="loading" >
                    <div>loading...</div>
                </div>

            </el-scrollbar>

        </div>

    </div>
</template>

<script>
    import MainMenu from '@/pages/leftMenu'
    import TopBar from '@/pages/topBar'
    import { getToken } from '@/utils/auth'
    import {langs,langCode} from "@/utils/languageWebMap"
    import viewBase from '@/pages/common/viewBase'

    export default {
        extends: viewBase,
        name: "home",
        created(){
            document.addEventListener("mouseup",(e)=>{
                this.$bus.$emit('document_mouseup',e);
            },true)
        },
        mounted() {
            //加载用户权限
            // let info = this.$local.fetch('loginInfo');
            // 加载store 数据
            this.$store.dispatch("userStoreInit");
            this.$store.dispatch("loadDemandRequestInfo");
            this.$store.dispatch("loadMessageRequestInfo");
            this.$store.dispatch("loadUserPairList");
            window.onresize = () => {
                return (() => {
                    this.$store.commit('windowSizeChange');
                })()
            };
            this.$store.commit('windowSizeChange');
            document.title = this.getLang(langCode.siteName)
        },
        data() {
            return {
                formLabelWidth:'80px',
            }
        },
        methods: {
            // 取 mainbox 样式
            getMainBoxStyle:function(){
                let sty = {};
                if(this.$route.meta && this.$route.meta.bodyColor){
                     sty.backgroundColor=this.$route.meta.bodyColor;
                }
                return sty;
            },
            // 是不是大屏页面
            isOverView:function(){
                if(this.$route.meta){
                    return this.$route.meta.isOverView?true:false;
                }
                return false;
            },
            getMenuMagin : function () {
                return  this.$store.getters.leftMenuWidth ;
            },
            //等待系统列表加载完成 ，否则后面页面有使用系统列表是会出错
            //等待权限列表加载完成
            isSystemsLoadComplete: function () {
                // if (!this.$store.getters.isGetAuthPermUrlsLoadComplete) {
                //     return false;
                // }
                if (!this.$store.getters.isLoadConfig){
                    return false;
                }
                // 题库配置需要加载完成才能展示页面
                if(!this.$store.getters.isLoadQuestionConfigs){
                    return false
                }
                setTimeout(()=>{
                    //WEBSOCKET_HOST
                    let wsuri = this.$store.getters.getSystemConfigMapByKey("WEBSOCKET_HOST")  ;
                    var ishttps = 'https:' == document.location.protocol ? true : false;
                    // 处理 http 和 https
                    if(ishttps) {
                        wsuri = wsuri.replace("ws:", "wss:");
                    }
                    if(wsuri){
                        wsuri += "/chat?token="+getToken()+"&userId="+this.$store.getters.getUserInfo.id;
                        this.$store.dispatch("initWebSocketConnect",wsuri);
                    }
                },200)
                return  true ;
            },
        },
        components: {
            MainMenu,
            TopBar
        }
    }
</script>

<style>
    .main_box.overview_page { min-height: 100%; /*background:radial-gradient(circle,rgba(23,48,120,1),rgba(7,21,68,1));*/ }
    .main_box .overview_page_bg { position: fixed; top:0; left: 0; width: 100%; height: 100%; background:radial-gradient(circle,rgba(23,48,120,1),rgba(7,21,68,1)); z-index: 0; }
    .main_body {
        padding: 5px;
        min-height: 100%;
        /*transition:  margin-left  0.4s;*/
    }
    .main_body > .cont { position: relative;  }
    .main_body > .loading { position: relative; z-index: 2; color: #5a9a70; line-height: 100px; font-size: 18px; text-align: center; letter-spacing: 2px;
        transition: all  0.8s;
    }
    .topbar_fit { height: 40px; }

    .main_box { height: 100%; }
    .main_box .top_title { display: none; }
    .main_box .el-scrollbar__wrap { overflow-x: hidden; }

    /* 大屏模式下的展示内容 */

    .main_box.overview_page  .top_title { display: inline; position: absolute; top:0; width: 100%; left: 0; text-align: center; z-index: -1; }
    .main_box.overview_page  .top_title img {  }
    .main_box.overview_page  .top_title > img.left { position: absolute; top:0; left:0; }
    .main_box.overview_page  .top_title > img.right { position: absolute; top:0; right:0; }
    .main_box.overview_page  .top_title > img.title { position: relative; z-index: 1; }

    /* 大屏模式下的 topbar  */
    .main_box.overview_page .topbar { }
    .main_box.overview_page .topbar > .cont { background-color: transparent; margin-top: 9px; }

    .main_box.overview_page .main_body { padding-top: 89px; color: #fff; }
</style>
