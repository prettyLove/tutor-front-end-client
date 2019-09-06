import {HTTP, $get, $post, $delete, $patch} from '../utils/http';
import {api} from "./api";

export const questionApi = {
    // 取问题配置
    getQuestionConfig: params => $get(api.questionRouter.getConfig, params),
    // 取问题内容
    getOriginalQuestion: params => $get(api.questionRouter.getOriginalQuestion, params),
    // 取问题信息
    getTotalQuestion: params => $get(api.questionRouter.getTotalQuestion, params),
    // 审核题目
    approveQuestion: params => $patch(api.questionRouter.approveSelfQuestion, params),
    // 预览题目
    getMathjaxPreview: params => $post(api.questionRouter.getMathjaxPreview, params),
    // 更新题目
    editQuestion: params => $post(api.questionRouter.save, params),
    // 创建问题
    createQuestion: params => $post(api.questionRouter.createQuestion, params),
    // 取问题内容
    getQuestionDiagramList : params => $get(api.questionRouter.getQuestionDiagramList,params),
    saveQuestionDiagramXml : params => $post(api.questionRouter.saveQuestionDiagramXml,params),
    getAssessQuestion : params => $get(api.questionRouter.getAssessQuestion,params),
    answerQuestion : params => $post(api.questionRouter.answerQuestion,params),
    getExerciseQuestion : params => $get(api.questionRouter.getExerciseQuestion,params),  //课后练习
    submitExercise : params => $post(api.questionRouter.submitExercise,params),  //课后练习提交
    getAssessQuestionResult : params => $get(api.questionRouter.getAssessQuestionResult,params),  //课后习题(history)结果查看
    getExerciseGrade : params => $get(api.questionRouter.getExerciseGrade,params),  //课后习题(history)结果查看
    exerciseListPage : params => $get(api.questionRouter.exerciseListPage,params),  //课后习题(history)对错题结果查看
    startExam : params => $get(api.questionRouter.startExam,params), //课后测验


}

