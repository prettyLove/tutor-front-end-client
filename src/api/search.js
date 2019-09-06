import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import { api } from './api'

export  const searchApi = {
    get: params => $get(api.searchRouter.get, params),
}
