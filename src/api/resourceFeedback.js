import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export  const resourceFeedbackApi = {
    //添加资源反馈
    add: params => $post(api.resourceFeedbacRouter.add, params),
}
