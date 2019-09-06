import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "./api";

// 房间信息
export const roomApi = {
    getTopList : params => $get( api.roomRouter.topList, params ),
    get:params => $get( api.roomRouter.get, params),
    assessRoom:params => $post( api.roomRouter.assessRoom, params),
    getAssessRoomByRoomId:params => $get( api.roomRouter.getAssessRoomByRoomId, params),
    getAssessList:params => $get( api.roomRouter.getAssessList, params),

}

