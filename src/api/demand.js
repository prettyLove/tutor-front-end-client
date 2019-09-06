import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export const demandApi = {
    // 用户需求列表
    listPage : params => $get( api.demandRouter.listPage, params),
    // 添加需求
    insert : params => $post( api.demandRouter.insert, params),
    // 更改需求
    update : params => $patch( api.demandRouter.update, params),
    // 删除需求
    delete : params => $delete( api.demandRouter.delete, params),
    // 获得单个需求
    getDemand : params => $get( api.demandRouter.getDemand, params)
}

