
import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "./api";

// 修改用户密码
export const modifyPassword = params => $patch( api.userRouter.updatePasswordById, params)
// 取用户登陆的信息
export const getUserInfoForLogin = params => $get( api.userRouter.queryUserByToken, params)
// 修改用户信息
export const modifyUserInfo = params => $patch( api.userRouter.updateUserInfo, params)
// 取用户登陆的信息根据id
export const getUserById = params => $get( api.userRouter.getUserById, params)
//用户页面文件上传
// export const getUploadFile = params => $get( api.userRouter.getUploadFile, params)
export const getUploadFile = params => $get( api.userRouter.getUpload, params)   //接口变更
//用户激活
export const getActivated = validateCode => $patch(api.userRouter.getActivated+"?validateCode="+validateCode, {})
//找回密码
export const findPasswordEmail = params => $get(api.userRouter.findPasswordEmail,params)
//重置密码
export const findPasswordUpdate = params => $get(api.userRouter.findPasswordUpdate, params)

export const tutorApi = {
    //导师资质添加修改删除
    tutorAdd: params => $post(api.tutorRouter.tutorAdd, params),
    tutorGetListByUser: params => $get(api.tutorRouter.tutorGetListByUser, params),
    tutorUpdate: params => $patch(api.tutorRouter.tutorUpdate, params),
    tutorDelete: params => $delete(api.tutorRouter.tutorDelete, params),
    saveUserTutor: params => $post(api.tutorRouter.saveUserTutor, params), //导师信息保存
    getUserTutor: params => $get(api.tutorRouter.getUserTutor, params), //导师信息获取
}
//基本信息
export const basicComentApi={
    basicComentSave: params => $patch(api.userRouter.basicComentSave, params),  //基本信息保存
    basicComentgetUser: params => $get(api.userRouter.basicComentgetUser, params),  //基本信息获取
    getCountByEmail: params => $get(api.userRouter.getCountByEmail, params),  //注册邮箱验证(一个邮箱只能注册一个账户)
    getCountByPhone: params => $get(api.userRouter.getCountByPhone, params),  //注册手机号验证
}

//学生信息

export const studentApi={
    saveUserStudent: params => $patch(api.userRouter.saveUserStudent, params),  //学生信息保存
    getUserStudent: params => $get(api.userRouter.getUserStudent, params),  //学生信息获取
}


