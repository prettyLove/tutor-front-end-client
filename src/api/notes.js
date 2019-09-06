import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export  const notesApi = {
    //添加笔记
    listPage: params => $get(api.notesRouter.listPage, params),
    listPageCommon: params => $get(api.notesRouter.listPageCommon, params), //笔记列表(全部)
    add: params => $post(api.notesRouter.add, params),
    delete: params => $delete(api.notesRouter.delete, params),
    get: params => $get(api.notesRouter.get, params),
    save: params => $patch(api.notesRouter.save, params),
}
