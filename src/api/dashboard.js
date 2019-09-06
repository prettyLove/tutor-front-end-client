import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

// 取画板列表
export const dashboardApi = {
    // listpage
    listPage:params => $patch( api.dashboardRouter.listPage, params),
    get:params => $get( api.dashboardRouter.get, params),
}


