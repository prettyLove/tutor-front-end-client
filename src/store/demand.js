// import {$get,$post} from '@/utils/http'
// import { api } from '@/api/api'
import { pairApi } from '@/api/pair'
// 需求
export default{
    state: {
        demandRequestNum:0,
    },
    getters:{
        getDemandRequestNum(state,getters){
            return state.demandRequestNum;
        },
    },
    mutations: {
        setDemandRequestNum(state,num){
            state.demandRequestNum = num ;
        },
    },
    actions:{
        // load
        loadDemandRequestInfo: ({commit,state},params) => {
            pairApi.getRequestNum()
                .then((response) => {
                    // if (response.code == this.$success) {
                    //     commit("setDemandRequestNum",response.data);
                    // }
                    commit("setDemandRequestNum",response.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    }
}
