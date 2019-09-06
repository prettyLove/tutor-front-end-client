import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'
export const userMessageApi = {
    read: params => $post( api.userMessageRouter.read, params ),
    getCount: params => $get( api.userMessageRouter.getCount, params ),
}
