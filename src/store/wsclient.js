
import {WS_MSG_TYPE} from '@/utils/const'
import userinfo from "./userinfo";

function  WSClient(wshost,state,getters) {
    let wsuri = wshost;
    let _self = this;
    this.da = this.websocketonmessage;
    this.timerId = null;
    //初始化weosocket
    this.initWebSocket = function () {
        // let wsuri = this.$store.getters.getSystemConfigMapByKey("WEBSOCKET_HOST")  ;
        // wsuri += "/token/"+getToken()
        // let wsuri = wshost;
        try {
            console.log("wsuri:",wsuri);
            //`ws://192.168.18.169:8059/websocket/${localStorage.getItem('userId')}`//这个地址由后端童鞋提供
            if(state.websock){
                state.websock.close();
            }
            state.websock = new WebSocket(wsuri);
            state.websock.onmessage = (e)=>this.websocketonmessage(e);
            state.websock.onopen = (e)=>this.websocketonopen(e);
            state.websock.onerror = (e)=>this.websocketonerror(e);
            state.websock.onclose = (e)=>this.websocketclose(e);
            clearInterval(this.timerId);
            this.timerId = setInterval(() => {
                console.log('websocket ping');
                this.sendMessage({type: "ping"});
            }, 5 * 60 * 1000);
        }catch (e) {
            console.log(e);
        }
    }
    this.websocketonopen = function(){ //连接建立之后执行send方法发送数据
        // this.websocketsend(this.user)
        state.wsReadyState = state.websock.readyState;
        console.log("websocketonopen--------------readyState ", state.websock.readyState);
        this.queryLiveRoom();
    }
    this.websocketonerror = function(){//连接建立失败重连
        /*let tid = setTimeout(()=>{
            clearTimeout(tid)
            this.initWebSocket();
        },3000)*/
    }
    this.websocketclose = function (e){  //关闭
        state.wsReadyState = state.websock.readyState;
        console.log('断开连接', e);
        let tid =  setTimeout(()=>{
            clearTimeout(tid)
            this.initWebSocket();
        },3000)
    }
    this.websocketonmessage = function(e){
        console.log("onmessage",e.data);

        // let _this = this //数据接收
        // if (e.data == '连接成功') {//这个判断是我业务需求才加的
        //     return
        // }
        let dajson = JSON.parse(e.data);
        if(dajson.mid){
            if(state.messCbMap [dajson.mid]){
                state.messCbMap [dajson.mid](dajson)
                state.messCbMap [dajson.mid] = null
            }
        }
        console.log("dajson.type",dajson.type)
        switch (dajson.type) {
            //提醒加入房间
            case WS_MSG_TYPE.CREATE_LIVE_ROOM:
                console.log("create live room",dajson);
                if(dajson.fromUserId!=getters.getUserInfo.id){
                    state.roomInfo = dajson;
                    state.liveJoinVisible = true;
                }else{
                    state.roomInfo = dajson;
                    state.liveJoinVisible = false;
                }
                break;
            // 查询当前直播的房间列表
            case WS_MSG_TYPE.QUERY_LIVE_ROOM:
                console.log("QUERY_LIVE_ROOM",dajson);
                state.liveRoomList = dajson.liveRooms;
                break;
                return dajson;
        }
        console.log('dajson',dajson)
        // //业务需求，将socket接收到的值存进vuex
        // _this.$store.store.dispatch('RESET_ID') //先调用reset方法置空vuex > store里面的scorketId（为什么置空，下面标题3解释）
        // _this.$store.store.dispatch('SAVE_ID', JSON.parse(e.data).areaId) //重新给store中的scorketId赋值（数据格式问题先转了json）
        // console.log(_this.$store.store.state.scorketId);
    }

    this.sendMessage = function (jsonData) {
        if(state.websock.readyState===1){
            state.websock.send(JSON.stringify(jsonData))
        }else{
            console.log("error ws is disconnect ...")
        }
    }
    // function websocketsend(Data){//数据发送
    //     // state.websock.send(Data)
    // }

    // 查询直播间
    this.queryLiveRoom = function() {
        console.log("queryLiveRoom")
        let message = {
            type: WS_MSG_TYPE.QUERY_LIVE_ROOM,
            endTime: new Date()
        };
        this.sendMessage(message);
    }
    this.initWebSocket();

    //拦截以防止开多个直播间
    // this.queryMyActiveLiveRoom = function() {
    //     console.log("queryMyActiveLiveRoom")
    //     let message = {
    //         type: WS_MSG_TYPE.QUERY_MY_ACTIVE_LIVE_ROOM,
    //     };
    //     this.sendMessage(message);
    // }

}

let startWs;
// im
export default{
    state: {
        websock:null,
        wsReadyState:0,
        isStart:false,
        mid : 1,
        messCbMap:{},
        liveJoinVisible:false,
        roomInfo:{},
        liveRoomList:[],
        isCloseLive:false
    },
    getters:{
        getWsClientStatus(state,getters){
            if(state.websock){
                return state.wsReadyState == 1 ;//"OPEN" ;
            }
            return false;
        },
        //直播状态
        isHasLive(state,getters){
            let fag = state.liveRoomList.length > 0;

            if (fag) {//如果当前直播的id跟用户id一致证明已进入直播，则关掉进入弹框
                let room = state.liveRoomList[0];
                if(room && room.host){
                    if(room.host.id == getters.getUserInfo.id && room.host.webLiveStatus ){
                    // if( room.host.webLiveStatus ){
                        fag = false;
                    }
                }
                if(room && room.myself){
                    if(room.myself.id == getters.getUserInfo.id && room.myself.webLiveStatus){
                        fag = false;
                    }
                }
            }
            return !state.isCloseLive && fag ;
        },
        //进入教学直播弹框
        getLiveJoinVisible(state,getters){
            return state.liveJoinVisible;
        },
        getLiveRoomList(state,getters){
            return state.liveRoomList;
        },
        getJoinRoomInfo(state,getters){
            return state.roomInfo;
        },
    },
    mutations: {
        cancelJoinRoom(state){
            state.liveJoinVisible = false
        },
        cancelJoinLive(state){
            state.isCloseLive = true
        },
        setJoinLiveVisible(state,sta){
            state.liveJoinVisible = sta
        }
    },
    actions:{
        // 初始化websocket
        initWebSocketConnect:({commit, state,getters}, wshost)=>{
            console.log("ws connect----------------")
            if(!state.isStart){
                state.isStart = true;
                startWs = new WSClient (wshost,state,getters);
            }
        },
        // websocket 发送数据
        wsSend:({commit, state,getters}, {data,cb})=>{
            if(state.isStart){
                data.mid = state.mid ++;
                console.log("cb",cb)
                state.messCbMap[data.mid ] = cb
                startWs.sendMessage( data)
            }
        },
        // 断开连接
        webSocketdisconnect:({commit, state,getters}, data,cb)=>{
            console.log("ws disconnect----------------")
            if(state.isStart){
                state.websock.close();
                state.isStart = false;
            }
        }
        //
    }
}
