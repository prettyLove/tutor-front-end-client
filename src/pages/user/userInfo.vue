<template>
    <div >
        <!--<div>
            <gx-week-select style="width: 900px" />
        </div>-->
        <tutor-info  v-if="$store.getters.getUserInfo.role==roles.TUTOR" />
        <student-info v-if="$store.getters.getUserInfo.role==roles.STUDENT" />
<!--        <student-info />-->
<!--        <tutor-info />-->
    </div>
</template>

<script>
    import viewBase from '../common/viewBase'
    import tutorInfo from "./components/tutorInfo"
    import studentInfo from "./components/studentInfo"
    import {memberRoleList, roles, langSelectList} from "@/utils/const";

    import gxWeekSelect from "@/components/gxWeekSelect"

    export default {
        extends: viewBase,
        name: "userInfo",
        components: {tutorInfo,studentInfo,gxWeekSelect},
        data() {
            return {
                roles,
                memberRoleList,
                langSelectList
            }
        },
        mounted() {

        },
        methods: {

        },

    }
</script>

<style lang="scss" scoped>
    .page_usrinfo {

    }
</style>
