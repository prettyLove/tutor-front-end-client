import { userMessageApi } from '@/api/userMessage'
// 消息总数
export default{
    state: {
        messageCount:0,
    },
    getters:{
        getMessageRequestNum(state,getters){
            return state.messageCount;
        },
    },
    mutations: {
        setMessageRequestNum(state,num){
            state.messageCount = num ;
        },
    },
    actions:{
        // load
        loadMessageRequestInfo: ({commit,state},params) => {
            userMessageApi.getCount()
                .then((response) => {
                    commit("setMessageRequestNum",response.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    }
}
