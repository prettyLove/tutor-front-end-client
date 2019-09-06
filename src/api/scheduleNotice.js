import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "./api";


// 日程变化通知
export const scheduleNoticeApi = {
    listPage : params => $get(api.scheduleNoticeRouter.listPage, params ),
    getCount : params => $get(api.scheduleNoticeRouter.getCount, params ),
    confirm:params => $patch(api.scheduleNoticeRouter.confirm, params),
    getOperatingConfirm:params => $get(api.scheduleNoticeRouter.getOperatingConfirm, params),//通知查看
}
