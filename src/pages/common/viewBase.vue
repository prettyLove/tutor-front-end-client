
<script>
    import {langCode,langs} from '@/utils/languageWebMap';

    export default {
        name: "viewBase",
        data() {
            return {
                langCode,
                langs,
            }
        },
        methods:{
            // 取message 内容 根据语言取
            getLang:function (k,lang) {
                return this.$store.getters.getLanguageWebMessage(k,lang)
            },

            getLangServerMess:function (k) {
                return this.$store.getters.getLanguageMessageByCode(k)
            },
            // 用户id
            getUserId:function () {
                return this.$store.getters.getUserInfo.id;
            },
            // 用户角色
            getUserRole:function () {
                return this.$store.getters.getUserInfo.role;
            },
            // 多语言显示
            showLang:function (item) {
                let userLang =  langs.zh_cn;
                let userInfo = this.$store.getters.getUserInfo;
                if(userInfo && userInfo.language){
                    userLang = userInfo.language;
                }
                return item[userLang];
            }
        }
    }

</script>


