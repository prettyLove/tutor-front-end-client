
import {default as HTTP} from '@/utils/http'
import { api } from '@/api/api'

export default{
    state: {
        configMap:{},
        systemConfigMap:{},
        isLoadConfigMap:false,
        isLoadSystemConfigMap:false,
    },
    getters:{
        //
        getConfigMapByKey:(state) => (key)=> {
            if(state.configMap[key]){
                return state.configMap[key]
            }
            return null;
        },
        getSystemConfigMapByKey:(state) => (key)=> {
            if(state.systemConfigMap[key]){
                return state.systemConfigMap[key]
            }
            return null;
        },
        isLoadConfig(state,getters){
            return state.isLoadConfigMap && state.isLoadSystemConfigMap;
        }
    },
    mutations: {
        setConfigMap:function (state,map) {
            state.configMap = map;
            state.isLoadConfigMap = true
        },
        setSystemConfigMap:function (state,map) {
            state.systemConfigMap = map;
            console.log("state.systemConfigMap",state.systemConfigMap)
            state.isLoadSystemConfigMap = true
        },
    },
    actions:{
        // 加载 所有系统列表
        loadConfigMap: ({commit,state}) => {
            HTTP.get( api.siteConfigRouter.config)
                .then((response) => {
                    if (response.status == 200) {
                        commit("setConfigMap",response.data.data);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        // 加载 所有系统列表
        loadSystemConfigMap: ({commit,state}) => {
            HTTP.get( api.siteConfigRouter.systemConfig)
                .then((response) => {
                    if (response.status == 200) {
                        commit("setSystemConfigMap",response.data.data);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    }
}
