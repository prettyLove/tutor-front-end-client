<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="background-color: #ffffff">
            <el-tab-pane label="教学影片" name="first">
                <teaching-movies-list></teaching-movies-list>
            </el-tab-pane>
            <el-tab-pane label="我的影片" name="second" v-if="$store.getters.getUserInfo.role==roles.TUTOR">
                <movies-list></movies-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {moviesApi} from '@/api/movies';
    import tablePageBase from '../common/tablePageBase';
    import lgBody from "../../components/lgBody";
    import lgTable from "../../components/lgTable";
    import lgSearchBox from "../../components/lgSearchBox"
    import lgUpload from "../../components/lgUpload"
    import {roles} from "@/utils/const";
    import moviesList from './moviesList';
    import teachingMoviesList from './teachingMoviesList';

    export default {
        name: "moviesManager",
        components: {lgTable, lgBody, lgSearchBox,lgUpload,moviesList,teachingMoviesList},
        extends: tablePageBase,
        data() {
            return {
                roles,
                activeName:"first",
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
    .video{
        position:fixed;
        /*right: 1%;*/
        top: 5px;
        width: 80%;
        left: 10%;
        /*height:350px;*/
        /*background-color: darkturquoise;*/
        z-index: 999;
        animation: bouncelnRight 0.5s;
    }
    .video video{
        /*width: 100%!important;*/
        /*height:100%!important;*/
        display: block;
        width: 100%;
    }
    .mask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.9;
        z-index: 30;
    }
</style>
