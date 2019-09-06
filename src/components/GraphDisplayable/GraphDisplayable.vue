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
        width: 1000,
        height: 500,
        showMenuBar: false,
        showAlgebraInput: false,
        showToolBar: false,
        customToolBar: "0,1,2,3,4,5|6,7,8,9,10,62",
        showToolBarHelp: false,
        showResetIcon: true,
        enableLabelDrags: true,
        enableShiftDragZoom: true,
        enableRightClick: true,
        errorDialogsActive: false,
        useBrowserForJS: false,
        allowStyleBar: false,
        preventFocus: false,
        showZoomButtons: true,
        capturingThreshold: 3,
        showFullscreenButton: false,
        scale: 1,
        disableAutoScale: false,
        allowUpscale: false,
        clickToLoad: false,
        appName: "graphing",
        showSuggestionButtons: false,
        buttonRounding: 0.7,
        buttonShadows: false,
        language:  "en",
        enableFileFeatures:  false,
        enableCAS: false
      };

      if (this.value) parameter.ggbBase64 = this.value;

      this.applet = new GGBApplet(parameter, '5.0', this.$refs.applet_container);
    },

    render() {
      this.applet.inject(this.$refs.applet_container);
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
