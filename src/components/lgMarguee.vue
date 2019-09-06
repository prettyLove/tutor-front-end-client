<template>
    <!--外框，固定宽度-->
    <div class="lg_marguee wrap">
        <!--内部滚动框-->
        <span :class="'item'+(msgType==0?'':' error') " >总数：{{lists.length}}</span>
        <div class="marg_box" ref="marg_box">
            <!--展示的文字-->
            <div class="marquee" >
                <div class="cont" ref="marquee_cont" >
                    <span :class="'item'+(msgType==0?'':' error') " v-for="(item,index) in lists" :key="index" @click="clickItem(item)" @mouseover="itemHover" @mouseout="itemOut">
                        <span class="dot"></span>{{text}}
                        <span>{{item}}&nbsp;&nbsp;</span>
                    </span>
                </div>
            </div>
            <!--文字副本，为了实现无缝滚动-->
            <div class="copy"></div>
        </div>
        <!--为了获取text实际宽度-->
        <div class="node">{{text}}</div>
    </div>
</template>
<script>
    // 文字 跑马灯效果
    export default {
        name: "lgMarguee",
        props: {
            msgType:{
                type:Number,
                defalut:0,
            },
            lists:{
                type:Array,
                defalut:[],
                boxw :0,
                viewWidth:0,
                isHover:false,
            }
        }, // 父组件传入数据， 数组形式 [ "连雨不知春去"，"一晴方觉夏深"]
        data () {
            return {
                text: '', // 数组文字转化后的字符串
                distance: 0 // 位移距离
            }
        },
        watch:{
            '$store.getters.getWindowHeight':'winResize',
            lists:{
                handler(val, oldName) {
                    setTimeout(()=>{
                        this.winResize()
                    },500);
                },
                immediate: true,  //实时
                deep:true,        //深度
            }
        },
        methods: {
            winResize:function () {
                if(this.$refs.marquee_cont){
                    this.boxw = this.$refs.marquee_cont.getBoundingClientRect().width;
                    console.log("resize b:",this.boxw )
                    let box = this.$refs.marg_box;
                    this.viewWidth = box.clientWidth||box.offsetWidth;
                    if (-this. distance >= this.boxw) {
                        this. distance =  this.viewWidth ;
                    }
                }
            },
            clickItem:function(systemName){
                this.$emit("clickItem",systemName);
            },
            itemHover:function(){
                this.isHover = true;
            },
            itemOut:function(){
                this.isHover = false;
            },
            move:function () {
                this.winResize();
                setInterval(()=> {
                    if(this.isHover){
                        return;
                    }
                    this. distance -= 1
                    // 如果位移超过文字宽度，则回到起点
                    if (-this. distance >= this.boxw) {
                        this. distance =  this.viewWidth ;
                        this.winResize();
                        console.log("this.viewWidth",this.viewWidth);
                        console.log("this.boxw",this.boxw);
                    }
                    if(this.$refs.marg_box && this.$refs.marg_box.style){
                        this.$refs.marg_box.style.transform = 'translateX(' + this.distance + 'px)'
                    }
                }, 20)
            }
        },
        // 把父组件传入的arr转化成字符串
        mounted: function () {
            setTimeout(()=>{
                this.move()
            },500);
        },
        // 更新的时候运动
        updated: function () {
            // this.move()
        }
    }
</script>
<style scoped>
     /*限制外框宽度，隐藏多余的部分*/
     .lg_marguee.wrap { overflow: hidden;  line-height: 26px; }
     /*移动框宽度设置*/
     .lg_marguee.wrap .marg_box { }
     /*文字一行显示*/
     .lg_marguee.wrap .marg_box div { float: left;}
     /*设置前后间隔*/
     .lg_marguee.wrap .marquee {margin: 0 16px 0 0; width: 80000%; }
     .lg_marguee.wrap .marquee .item { cursor: pointer; }
     .lg_marguee.wrap .marquee .item:hover { background-color: #ffffff22; border-radius: 4px;}
     .lg_marguee.wrap .marquee .item span { color: #2fb21a; }
     .lg_marguee.wrap .item.error { color: #f00; }
     .lg_marguee.wrap .item { color: #2fb21a; }
     .lg_marguee.wrap .marquee .item.error span { color: #f00; }
     .lg_marguee.wrap .marquee .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #2fb21a; vertical-align: middle; margin: 0 2px 0 10px; }
     .lg_marguee.wrap .marquee .item.error .dot { background: #f00; }

     /*获取宽度的节点，隐藏掉*/
     .lg_marguee.wrap .node {position: absolute;z-index: -999;top: -999999px;}
</style>

