import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export  const feedbackApi = {
    //添加用户反馈
    add: params => $post(api.feedbackRouter.add, params),
}
