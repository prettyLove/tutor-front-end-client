import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export  const collectionApi = {
    //添加收藏
    listPage: params => $get(api.collectionRouter.listPage, params),
    add: params => $post(api.collectionRouter.add, params),
    delete: params => $delete(api.collectionRouter.delete, params),
}
