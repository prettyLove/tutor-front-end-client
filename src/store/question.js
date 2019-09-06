
import {default as HTTP} from '@/utils/http'
import { api } from '@/api/api'
/* 问题配置信息 */

export default{
    state: {
        questionConfigs:null,
        isLoadQuestionConfigs:false,
        questionOptionsMap:{}
    },
    getters: {
        getQuestionConfigs(state) {
            return state.questionConfigs;
        },
        // 按key 返回内容
        getQuestionConfigsByKey: (state, getters) => (key) => {
            if (state.questionConfigs[key]) {
                return state.questionConfigs[key];
            }
            return null;
        },
        getQuestionConfigsOptions(state, getters)  {
            return getters.getQuestionConfigsByKey("options")
        },
        getQuestionConfigsTools (state, getters)  {
            return getters.getQuestionConfigsByKey("tools")
        },
        getQuestionConfigsTypes (state, getters) {
            return getters.getQuestionConfigsByKey("types")
        },
        getQuestionConfigstuTorialLinks (state, getters) {
            return getters.getQuestionConfigsByKey("tutorialLinks")
        },
        getQuestionOptionsMap(state, getters){
            return state.questionOptionsMap;
        },
        isLoadQuestionConfigs(state){
            return state.isLoadQuestionConfigs;
        }
    },
    mutations: {
        setQuestionConfigs: (state, data) => {
            state.questionConfigs = data;
            state.isLoadQuestionConfigs = true;

            state.questionOptionsMap = {};
            for (let i = 0; i < data.options.length; i++) {
                let option = data.options[i];
                let map = state.questionOptionsMap;
                for (let j = 0; j < data.types.length; j++) {
                    let key = data.types[j].key;
                    let value = option[key] || '';
                    if (!map[value]) {
                        map[value] = {}
                    }
                    map = map[value];
                }
            }
            console.log("optionsMap",state.questionOptionsMap);
        },
    },
    actions:{
        // 加载 所有系统列表
        loadQuestionConfigs: ({commit,state},username) => {
            HTTP.get(  api.questionRouter.getConfig )
                .then((response) => {
                    state.questionConfigs = {};
                    if (response.status == 200) {
                        commit('setQuestionConfigs', response.data );
                    } else {
                        console.log("loadQuestionConfigs error",response);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
    }
}
