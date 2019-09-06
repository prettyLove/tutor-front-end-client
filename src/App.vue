<template>
    <div id="app" >
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        mounted() {
            let packages = {
                GGBApplet: 'static/lib/deployggb.js',
                // MathJax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML'
            };

            Object.values(packages).map(resource => {
                let recaptchaScript = document.createElement('script');
                recaptchaScript.setAttribute('src', resource);
                document.head.appendChild(recaptchaScript);
            })
        },
        methods: {

        },
        created: function() {

        },
        beforeDestroy: function() {

        }
    }
</script>

<style>

</style>

