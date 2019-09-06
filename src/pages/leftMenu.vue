<template>
    <el-scrollbar class="left-menu"  :style="{height: '100%', width: $store.getters.leftMenuWidth}">
        <div  :style="{height: '100%', width: $store.getters.leftMenuWidth}"  >
            <div class="title" v-show="$store.getters.leftMenuSta">
                <h5 v-if="$store.getters.isWebSiteConfigLoadComplete">{{$store.getters.getWebNameInWebSiteConfigs && this.menus[i].name=="题库"}}</h5>
            </div>

            <div style="margin-top: 10px;">
                <ul class="menu_box">
                    <li class="item" v-for="(item,index) in menus" v-if="!item.roles || (  item.roles.indexOf($store.getters.getUserInfo.role)!=-1)" v-bind:class="(activeMenu==item.name)?'active':''" :key="index">
                        <router-link class="sub_link" :to="item.to" :alt="item.name" :title="item.name" @click.native="onClickMenu(item)"><font-awesome-icon :icon="item.icon" /></router-link>
                    </li>
                </ul>
            </div>

        </div>
    </el-scrollbar>
</template>

<script>
    import {roles} from "@/utils/const";
    const menus = [
        {
            name:"wellcome",
            icon:"home",
            to:"/wellcome",
        },
        {
            name:"dashboardList",
            icon:"desktop",
            to:"/dashboard/dashboardList",
        },
        {
            name:"课程历史",
            icon:"history",
            to:"/history/historyList",
        },
        // {
        //     name:"教学材料",
        //     icon:"address-book",
        //     to:"/teachingMaterials/materialsList",
        // },
        {
            name:"教学笔记",
            icon:"address-book",
            to:"/notes/notesList",
        },
        {
            name:"教学影片",
            icon:"video",
            to:"/movies/moviesList",
        },
        {
            name:"题库",
            icon:"paper-plane",
            roles:[roles.TUTOR],
            to:"/question/questionList",
        },
        {
            name:"配对",
            icon:"handshake",
            to:"/demand/demandList",
        },
        // {
        //     name:"菜单4",
        //     icon:"cog",
        //     to:"/setting/setting",
        // },
        {
            name:"me",
            icon:"info",
            to:"/user/userInfo",
        },
        // {
        //     name:"菜单6",
        //     icon:"bars",
        //     to:"/user/info",
        // },
        {
            name:"收藏夹",
            icon:"cube",
            to:"/collector/collectorList",
        },
        {
            name:"消息",
            icon:"envelope",
            to:"/userMessage/list",
        },
        {
            name:"测验",
            icon:"book",
            roles:[roles.STUDENT],
            to:"/testmode/testmodeList",
        },
        {
            name:"练习",
            icon:"clipboard",
            roles:[roles.STUDENT],
            to:"/exerciseMode/exerciseMode",
        },
    ]


    export default {
        name: "leftMenu",
        data() {
            return {
                roles,
                menus,
                menuActive:'',
                menuOpens: [],
                activeMenu:"wellcome"
            }
        },
        mounted: function() {
            // for (let i = menus.length-1; i>=0; i--)
            //     if ($store.getters.getUserInfo.role==roles.TUTOR && menus[i].name=="题库"){
            //         menus.splice(i,1);
            //     }
        },

        methods: {
            onClickMenu:function(item){
                console.log(item)
                this.activeMenu = item.name;
            },
            selectMenu:function(menuIndex,menuPath){
                this.menuActive = "";
                this.menuOpens = [];
                if(menuIndex){
                    this.menuActive = menuPath[0];
                    this.menuOpens = [ menuPath[0]];
                }
            },
            // 激活当前菜单
            activeCurrent:function(){
                this.menuOpens = [];
                let menus = this.$store.getters.getSystemLeftMenuList;
                if (menus && menus.length > 0) {
                    for (let i = 0; i < menus.length; i++) {
                        let item = menus[i];
                        if (item.moduleUrl == this.$route.path) {
                            this.menuActive = i + "";
                            return;
                        }
                        for (let k in item.childModules) {
                            let sub = item.childModules[k];
                            if (sub.moduleUrl == this.$route.path) {
                                this.menuActive = i + "-" + k;
                                this.menuOpens.push(i + "");
                                return;
                            }
                        }
                    }
                }
            },

            // 允许一个菜单展开
            hideSubMenu : function () {
                // console.log(this);
                // console.log(this.$children["0"].close())
            }
        },
    }
</script>

<style lang="scss">
    @import "@/theme/theme-variables.scss";

    .left-menu {
        background-color: map-get($theme-colors, primary);
        color: #fff;
        font-size: 14px;
        text-align: left;
        float: left;
        position: fixed;
        z-index: 10;
        width: 100%;
        height: 100%;
        h5 {
            color: #ffffff;
            font-size: 19px;
            text-align: center;
            font-weight: normal;
            line-height: 40px;
            margin-right: 20px;
        }
        span {
            color: #ffffff;
            font-size: 16px;
            text-align: left;
            margin-left: 4px;
        }
        .icon {
            color: #ffffff;
            font-size: 18px;
            width: 18px;
        }
        .menu_box {
            color: #ffffff;
            font-size: 18px;
            text-align: center;
            display: block;
            padding: 0 10px;
            .item {
                .sub_link {
                    display: block;
                    background-color: #ffffff22;
                    padding: 5px 0px;
                    cursor: pointer;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    &:hover {
                        background-color: #ffffff55;
                    }
                    &.active {
                        background-color: #ffc270;
                    }
                }
                a {
                    color: #ffffff;
                    font-size: 30px;
                }
            }

        }
    }


</style>
