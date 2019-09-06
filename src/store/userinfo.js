
import { pairApi } from '@/api/pair'
import { $success } from '@/utils/const'

export default{
    state: {
        userPairList:[] , // 学生和老师列表
    },
    getters:{
        // 取学生和老师列表
        getUserPairList(state,getters){
            return state.userPairList;
        }
    },
    mutations: {
        setUserPairList:function (state,data) {
            state.userPairList = data;
        }
    },
    actions:{
        loadUserPairList:function ({commit,state}) {
            pairApi.getPairList().then((result)=>{
                if(result.code==$success){
                    let pairList = result.data;
                    commit("setUserPairList",pairList);
                    return
                }
                console.log("load faile -- >",result);
            }).catch((err)=>{
                console.log(err);
            })
        },
    }
}
