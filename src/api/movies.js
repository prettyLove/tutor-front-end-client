import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export  const moviesApi = {
    //添加影片
    listPage: params => $get(api.moviesRouter.listPage, params),
    listPageCommon: params => $get(api.moviesRouter.listPageCommon, params), //电影列表(全部)
    add: params => $post(api.moviesRouter.add, params),
    delete: params => $delete(api.moviesRouter.delete, params),
    get: params => $get(api.moviesRouter.get, params),
    save: params => $patch(api.moviesRouter.save, params),
}
