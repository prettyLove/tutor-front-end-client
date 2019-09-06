import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

// 用户登录
export const userRegister = params => $post( api.homeRouter.register, params)
// 检查用户名合法性
export const getCountByName = params => $get( api.userRouter.getCountByName, params)

