import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

//
export const getSystemNoticeList = params => $get( api.systemNoticeRouter.list, params)
