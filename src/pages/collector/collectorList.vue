<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="background-color: #ffffff">
<!--            笔记收藏夹-->
            <el-tab-pane :label=this.getLang(pageLang.notesCollector) name="first">
                <notes-collector></notes-collector>
            </el-tab-pane>
<!--            影片收藏夹-->
            <el-tab-pane :label="this.getLang(pageLang.moviesCollector)" name="second">
                <movies-collector></movies-collector>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox";
    import notesCollector from './notesCollector'
    import moviesCollector from './moviesCollector'
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "collector_list";
    // 多语言显示
    export const pageLang= {
        notesCollector:lang_prefix + "notesCollector",
        moviesCollector:lang_prefix + "moviesCollector",
    }
    addLangItem(pageLang.notesCollector,'笔记收藏夹','笔记收藏夹','Notes collector');
    addLangItem(pageLang.moviesCollector,'影片收藏夹','影片收藏夹','Movies collector');
    export default {
        components: {lgTable, lgBody, lgSearchBox,notesCollector,moviesCollector},
        extends: tablePageBase,
        name: "collector",
        data(){
            return{
                pageLang,
                activeName: 'first'
            }
        },
        created() {
        },
        mounted() {

        },
        methods:{
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>
