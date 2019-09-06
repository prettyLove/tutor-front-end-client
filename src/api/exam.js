import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "./api";

export const examApi = {
    listPage: params => $get(api.examRouter.listPage, params), //测验列表获取
    createExam: params => $post(api.examRouter.createExam,params ), //创建测验
    startExam: params => $get(api.examRouter.startExam,params ), //进入测验
    skipQuestion: params => $patch(api.examRouter.skipQuestion, params),//下一题跳转
    submitExam: params => $patch(api.examRouter.submitExam, params), //提交测验
    getExam: params => $get(api.examRouter.getExam, params), //答题后回看题目
}
