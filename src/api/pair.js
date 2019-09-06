import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export const pairApi = {
    // 查看所有匹配的人
    pairSuitedList : params => $get( api.pairRouter.list, params),
    // 发送请求
    sendPair : params => $post( api.pairRouter.send, params),
    // 接受请求
    acceptPair : params => $patch( api.pairRouter.accept, params),
    // 拒绝请求
    declinePair : params => $patch( api.pairRouter.decline, params),
    // 查看配对成功的人
    getPairList : params => $get( api.pairRouter.getPairList, params),
    // 查询收到未处理请求数量
    getRequestNum : params => $get( api.pairRouter.getRequestNum, params),
}

