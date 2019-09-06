<template>
    <div class="page_user">
        <div class="list">
            <ul>
                <li v-for="(item,index) in $store.getters.getUserPairList" :key="index">
                    <span>{{item.name}}</span>
                    <span style="float: right">
                        <!--详情-->
                        <el-button style="padding: 6px 10px" @click="userDetails(item)">{{getLang(langCode.see)}}</el-button>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import viewBase from  '../../common/viewBase'
    import {pairApi} from  '../../../api/pair'
    import {langs,addLangItem} from "@/utils/languageWebMap"

    export const lang_prefix = "user_of_pair";
    // 多语言显示
    export const pageLang= {
        title:lang_prefix + "title",
    }
    addLangItem(pageLang.title,'配对列表','配对列表','user of pair');


    export default {
        extends:viewBase,
        name: "userOfPair",
        // components:{pairUser },
        data(){
            return {
                langs,
                pageLang,
                dialogVisible:false,
                role:"",
            }
        },
        props:{
            demand:{
                type:String,
                default:"",
            },
            stateNum:{
                type:Number,
                default: 0
            },
        },
        watch:{
            stateNum(val, oldValue) {
                if (this.demand == 'TUTOR') {
                    this.reqCond.role = 'STUDENT';
                }else {
                    this.reqCond.role = 'TUTOR';
                }
                this.getPageList();
            },
        },

        mounted() {

        },
        methods:{
            userDetails(item){
                console.log('itemee',item);
                this.$emit("userDetails",item);
            }
        }
    }
</script>

<style scoped lang="scss">
.page_user {

    .list{
        padding: 0 10px;

        li {
            line-height: 32px;
        }
    }
}
</style>
