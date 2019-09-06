/**
*    searchBox组件，页面有搜索条件时使用
*/

<template>
    <div class="search_box">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "lgSearchBox"
    }
</script>

<style scoped>
    .search_box {
        background: #fff;
        border: 1px solid #ecf5ff;
        padding: 20px 30px 20px 20px;
        margin-bottom: 10px;
        border-radius: 6px;
        box-shadow:0px 6px 6px 0px rgba(117,117,117,0.12);
        color: #ecf5ff;
    }
</style>
