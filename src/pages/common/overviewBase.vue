<template>
    
</template>

<script>
    /*
        在beforDestory钩子中用js移除样式
     */
    export default {
        name: "overviewBase",

        beforeCreate: function() {
            document.getElementsByTagName("body")[0].className="overview_page";
        },
        beforeDestroy: function() {
            document.body.removeAttribute("class","overview_page");
        }
    }
</script>

<style scoped>

</style>
