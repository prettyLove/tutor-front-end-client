import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

// 用户登录
export const userLogin = params => $post( api.homeRouter.login, params)
// 用户退出
export const userLogout = params => $get( api.homeRouter.logout, params)

