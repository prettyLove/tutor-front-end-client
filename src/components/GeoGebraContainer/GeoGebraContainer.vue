<template>
  <div id="geo-gebra-container">
    <div id="applet-container" ref="applet_container"></div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data: function() {
    return {
      applet: null
    }
  },
  created () {
    this.init();
  },
  mounted(){
    this.render();
  },
  methods: {
    init() {
      let parameter = {
        id: "ggbApplet",
        appName: "geometry",
        width: 800,
        height: 600,
        showToolBar: true,
        borderColor: null,
        showMenuBar: false,
        allowStyleBar: true,
        showAlgebraInput: true,
        enableLabelDrags: false,
        enableShiftDragZoom: true,
        capturingThreshold: 4,
        showToolBarHelp: false,
        errorDialogsActive: true,
        showTutorialLink: true,
        language: "zh-CN",
        ggbBase64: "",
        showFullscreenButton: true,
        showZoomButtons: true,
        useBrowserForJS: false
      };

      if (this.value) parameter.ggbBase64 = this.value;
      if (GGBApplet){
          this.applet = new GGBApplet(parameter, '5.0', this.$refs.applet_container);
      }else{
          console.log("GGBApplet is null",GGBApplet);
      }
    },

    render() {
        if(this.applet && this.applet.inject){
            this.applet.inject(this.$refs.applet_container);
        }else {
            console.log("this.applet.inject is null",this.applet)
        }
    },

    loadBase64(value) {
      // setTimeout(()=>{
      //   ggbApplet.setBase64(value);
      // }, 5000)
    },

    getBase64() {
      return new Promise((resolve) => {
        ggbApplet.getBase64(function(value){
          resolve(value);
        });
      })
    }
  }
}
</script>

<style lang="scss">
  #geo-gebra-container {
    #applet-container {

    }
  }
</style>
