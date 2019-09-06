import axios from'axios'
import router from '@/router/index'
import {Message, MessageBox} from 'element-ui'
import { removeToken,getToken } from '@/utils/auth'

if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = '/api';
}else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = '/api';
}else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = '/api';
}
//全局设置超时时间
axios.defaults.timeout = 10 * 1000;
// axios.defaults.baseURL = '/api'
export const HTTP = axios.create({

})

//request拦截
HTTP.interceptors.request.use(config => {
    //在发送请求之前做某事
    config.headers = {
        'accessToken': getToken(),
    }
    return config;
}, error => {
    //请求错误时做某事
    return Promise.reject(error);
});

//response拦截
HTTP.interceptors.response.use(function(response){
        // 处理响应数据
        if (response.status === 200) {
            return Promise.resolve(response);
        } else if (response.status === 401 || response.status === 403 || response.status === 203) {
            removeToken();
            router.replace({
                path:'/login',
                query:{redirect: router.currentRoute.fullPath,random:Math.random()}//登录成功后跳入浏览的页面
            });
            // 重定向到首页
            // this.$router.push('/login');
            Message({
                showClose: true,
                message: res.message||"error",
                type: 'error',
                duration: 1000,
                onClose: () => {

                }
            });
        } else {
            return Promise.reject(response);
        }
    },
    function (error){
        // 处理响应失败
        return Promise.reject(error);
    }
)


// get请求
export function $get(url, params) {
    return new Promise((resolve, reject) => {
            HTTP.get(url, {
                params: params
            }).then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(err.data)
            })
        }
    )
}

// post请求
export function $post(url, params) {
    return new Promise((resolve, reject) => {
        //qs.stringify(params)
        HTTP.post(url,  params )
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

// delete请求
export function $delete(url, params) {
    return new Promise((resolve, reject) => {
        HTTP.delete(url,  {params})
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

// patch 请求
export function $patch(url, params) {
    return new Promise((resolve, reject) => {
        //qs.stringify(
        HTTP.patch(url, params)
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

// HTTP.interceptors.response.use(function(data){
//     let res=data.data;
//     if (data.status ==203 || data.status == 401 || data.status == 403 ) {
//         removeToken();
//         router.replace({
//             path:'/login',
//             query:{redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的页面
//         });
//         // 重定向到首页
//         // this.$router.push('/login');
//         Message({
//             showClose: true,
//             message: res.message||"error",
//             type: 'error',
//             duration: 1000,
//             onClose: () => {
//
//             }
//         });
//
//     }
//     return data;
// })



export default HTTP
