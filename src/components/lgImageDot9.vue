<template>
    <div>
        <div class="dot9_box" ref="dot9Box">
            <div class="cont">
                <slot></slot>
            </div>
            <canvas class="bgCanvas" ref="bgCanvas" :height="height" :width="width"></canvas>
        </div>
    </div>

</template>

<script>
    function drawBgToCanvas(m_canvas,img,rect) {
        if(!m_canvas || !img || !rect){
            return;
        }

        let cw = m_canvas.width  ;
        let ch = m_canvas.height  ;
        let iw = img.width;
        let ih = img.height;
        let ctx = m_canvas.getContext('2d');
        ctx.clearRect(0,0,cw,ch);
        // left top
        ctx.drawImage(img, 0, 0, rect.x, rect.y, 0, 0,rect.x,rect.y);

        // right top
        let tw = iw-rect.x-rect.w;
        let th = ih-rect.y-rect.h;
        let px = cw - tw;
        let py = ch - th;
        ctx.drawImage(img, rect.x + rect.w, 0, tw, rect.y, px, 0, tw, rect.y);
        // right bottom
        ctx.drawImage(img, rect.x + rect.w, rect.y + rect.h, tw, th, px, py, tw, th);
        // left bottom
        ctx.drawImage(img, 0, rect.y + rect.h, rect.x, th, 0, py, rect.x, th);

        let center_w = px -  rect.x;
        let center_h = py -  rect.y;
        // center
        ctx.drawImage(img, rect.x, rect.y , rect.w, rect.h, rect.x, rect.y, center_w, center_h);
        // center left
        ctx.drawImage(img, 0, rect.y , rect.x, rect.h, 0, rect.y, rect.x, center_h);
        // center right
        ctx.drawImage(img, rect.x + rect.w, rect.y  , tw, rect.h, px, rect.y , tw , center_h);
        // center top
        ctx.drawImage(img, rect.x , 0  , tw, rect.y, rect.x, 0 , center_w , rect.y);
        // center bottom
        ctx.drawImage(img, rect.x , rect.y + rect.h  , rect.w,  th,
            rect.x, py , center_w , th);
    }

    export default {
        name: "lgImageDot9",
        data(){
            return {
                bgCanvas:null,
                dot9Box:null,
                imgUrl:this.imgSrc || require("@/assets/images/overview/card_bg_450_300.png"),
                bgImg : new Image(),
                timer:0,
                rectBox :this.rect , //|| {x:240,y:60,w:180,h:200}
            }
        },
        props:{
            imgSrc:{
                type: String,
                default:null,
            },
            rect:{
                type: Object,
                default:()=>{return{x:240,y:60,w:180,h:200}},
            },
            height:{
                type: [Number,String],
                default:'100%',
            },
            width:{
                type: [Number,String],
                default:'100%',
            }
        },
        watch: {
            "$store.getters.getScreenWidth": 'draw',
            "$store.getters.leftMenuSta": 'draw',
            // "dot9Box.clientWidth":"rectChange",
            // "dot9Box.clientHeight":"rectChange",
            // "dot9Box.offsetWidth":"rectChange",
            // "dot9Box.offsetHeight":"rectChange",
        },
        mounted(){
            let vm = this;
            vm.dot9Box =  vm.$refs.dot9Box;
            vm.bgCanvas = vm.$refs.bgCanvas;

            let box = vm.getBoxSize();
            vm.setSize(box.width,box.height);
            this.bgImg.onload = function (e) {
                // 画背景
                drawBgToCanvas(vm.bgCanvas,this,vm.rectBox);
            }
            this. bgImg.src = this.imgUrl;
        },
        // beforeUpdate(){
        //     this.draw();
        // },
        methods:{
            rectChange:function(e){
                // let vm = this;
                // let box = vm.getBoxSize();
                // console.log("kkkkkkkkkkkkkkkkk",box);
                // vm.setSize(box.width,box.height);
                // // 画背景
                // drawBgToCanvas(vm.bgCanvas,vm.bgImg,vm.rectBox);
            },
            draw:function(val){
                let vm = this;
                if (!this.timer) {
                    this.timer = true;
                    setTimeout( ()=> {
                        let box = vm.getBoxSize();
                        vm.setSize(box.width,box.height);
                        vm.timer = false;
                        // 画背景
                        drawBgToCanvas(vm.bgCanvas,vm.bgImg,vm.rectBox);
                    }, 200)
                }
            },
            getBoxSize:function(){
                let w = this.dot9Box.clientWidth||this.dot9Box.offsetWidth;
                let h = this.dot9Box.clientHeight||this.dot9Box.offsetHeight;
                return {width:w,height:h}
            },
            setSize:function (w,h) {

                this.bgCanvas.width = w;
                this.bgCanvas.height = h;
            }
        }
    }
</script>

<style scoped>
    .dot9_box { overflow: hidden; position: relative; z-index: 1; }
    .dot9_box > .cont { }
    .dot9_box > canvas { position: absolute; top:0; left: 0; z-index: -1; }
</style>
