import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "./api";


let selfRouter = api.schedulePlanRouter

// 日程安排
export const schedulePlanApi = {
    getList : params => $get( selfRouter.listPage, params ),
    list : params => $get( selfRouter.list, params ),
    get:params => $get( selfRouter.get, params),
    add:params => $post( selfRouter.add, params),
    save:params => $patch( selfRouter.save, params),
    delete:params => $delete( selfRouter.delete, params),
    addAppointment:params => $post( selfRouter.addAppointment, params),
    getAppointment:params => $get( selfRouter.getAppointment, params), //查看约会
    deleteAppointment:params => $delete( selfRouter.deleteAppointment, params), //删除约会
    cancelUpdate:params => $delete( selfRouter.cancelUpdate, params), //取消约会
}
