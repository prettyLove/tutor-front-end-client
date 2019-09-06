<template>
     <div>
         <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="background-color: #ffffff">
<!--             教学笔记-->
             <el-tab-pane :label=getLang(pageLang.teachingNotes) name="first" >
               <teaching-notes-list></teaching-notes-list>
             </el-tab-pane>
<!--             我的笔记-->
             <el-tab-pane :label=getLang(pageLang.myNotes) name="second" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
                 <notes-list></notes-list>
             </el-tab-pane>
         </el-tabs>
     </div>
</template>

<script>
    import {notesApi} from '@/api/notes';
    import tablePageBase from  '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";
    import notesList from "./notesList";
    import teachingNotesList from "./teachingNotesList";
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "notes_manager_";
    // 多语言显示
    export const pageLang= {
        teachingNotes:lang_prefix + "teachingNotes",
        myNotes:lang_prefix + "myNotes",
    }
    addLangItem(pageLang.teachingNotes,'教学笔记','教学笔记','Teaching Notes');
    addLangItem(pageLang.myNotes,'我的笔记','我的笔记','My Notes');
    export default {
        name: "notesManager",
        components: {notesList,teachingNotesList,lgTable,lgBody,lgSearchBox,lgUpload},
        extends : tablePageBase,
        data() {
            return {
                pageLang,
                roles,
                activeName: 'first'
            }
        },
        mounted() {

        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>
