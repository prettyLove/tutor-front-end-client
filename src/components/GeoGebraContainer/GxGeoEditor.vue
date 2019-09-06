<template>
    <div class="gx_geo_editor">
        <div>

        </div>
        <div style="word-break:break-all; ">
            <!--{{testGeo}}-->
        </div>
    </div>
</template>

<script>
    // Base64.encode('潘高')  // 5r2Y6auY
    // Base64.decode('5r2Y6auY')  // 潘高
    import { testGeo } from "@/utils/test_geo.js"
    const Base64 = require('js-base64').Base64
    // 绘图工具
    export default {
        name: "GxGeoEditor",
        components:{},
        data(){
            return {
                testGeo,
                Base64,
            }
        },
        mounted(){
            console.log(Base64.decode(testGeo))
        },
        methods:{

        }
    }
</script>

<style scoped>
    .gx_geo_editor{

    }
</style>
