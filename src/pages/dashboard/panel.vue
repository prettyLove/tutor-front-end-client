<template>
    <div class="page_dashboard_panel">
        <div class="cont">
            page_dashboard_panel --- {{$store.getters.getSystemConfigMapByKey("DASHBOARD_HOST")}}

        </div>
        <div>
            <iframe width="100%" height="500px" :src="$store.getters.getSystemConfigMapByKey('DASHBOARD_HOST')"></iframe>
        </div>
    </div>
</template>

<script>
    import viewBase from  '../common/viewBase'
    import {getDashBoardListPage} from '../../api/dashboard'

    export default {
        extends:viewBase,
        name: "panel",
        data() {
            return {

            }
        },
        mounted() {
        },
        methods:{

        },
        comments:{

        }
    }
</script>

<style scoped>
    .page_dashboard_panel { background-color: #fff; min-height: 550px; }
    .page_dashboard_panel .cont { padding: 10px; }

</style>
