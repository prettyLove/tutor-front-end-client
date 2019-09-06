import Cookies from 'js-cookie'
import store from '@/store'
import {local} from '@/utils/utils'

var oneMinutes=1/48;

const LoginKey = 'hasLogin';

export function getToken() {
    //return Cookies.get(LoginKey);
    return local.getString("token")
}

export function setToken(token) {
    // return Cookies.set(LoginKey, "1",{ expires: oneMinutes })
    local.saveString("token",token)
}

export function removeToken() {
  return Cookies.remove(LoginKey)
}
// 权限验证
export function isAuth(auth) {
    if(auth.indexOf("/api")==0){
        auth = auth.replace("/api","");
    }
    if (store.state.user.permUrls != null) {
        if (store.state.user.permUrls.indexOf(auth) != -1) {
            return true;
        } else {
            return false;
        }
    }
    return null;
}
