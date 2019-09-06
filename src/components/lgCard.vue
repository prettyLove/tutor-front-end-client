<template>
    <div class="lg_crad">
        <div class="header">
            <slot name="header"></slot>
        </div>
        <div class="cont" >
            <slot></slot>
        </div>
    </div>
</template>

<script>

    export default {
        name: "lgCard",
    }
</script>

<style lang="scss" >
    .lg_crad{
        border: 1px solid #ebeef5;

        .header {
            line-height: 42px;
            height: 42px;
            padding: 0 10px;
            border-bottom: 1px solid #ebeef5;
            font-size: 16px;
            color: #418a5a;
        }

        & > .cont {
            padding: 10px;
            color: #666;
        }
    }
</style>
