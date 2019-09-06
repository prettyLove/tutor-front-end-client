import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "@/api/api";
import {languageWebMap,getLanguseWebMessage} from "@/utils/languageWebMap";

export default{
    state: {
        languageMessageMap:{},
        languageWebMap:languageWebMap
    },

    getters:{
        // 取语言map
        getLanguageMessageMap(state){
            return state.languageMessageMap;
        },
        // 按code 返回消息内容
        getLanguageMessageByCode: (state, getters) => (code) => {
            if (state.languageMessageMap[code]) {
                let item = state.languageMessageMap[code];
                let userInfo = getters.getUserInfo;
                let userLang =  "zh-cn";
                if(userInfo && userInfo.language){
                    userLang = userInfo.language;
                }
                if (item[userLang]) {
                    return item[userLang];
                }
            }
            return null;
        },
        getLanguageWebMessage:(state, getters) =>(k,lang)=>{
            let userLang =  lang || getters.getUserInfo.language;
            userLang =   userLang ||   "zh-cn";
            return getLanguseWebMessage(k,userLang)
        }
    },
    mutations: {
        setLanguageMessageMap: (state, value) => {
            state.languageMessageMap = value;
        },
    },
    actions:{
        loadLanguageMessageMap: ({commit, state}) => {
            $get( api.siteConfigRouter.getLanguageMessage )
                .then((res) => {
                    let result = res.data;
                    commit('setLanguageMessageMap', result );
                })
                .catch((error) => {
                    console.log(error,"loadLanguageMessageMap error ----");
                })
        },

    }
}

