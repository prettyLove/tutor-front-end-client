

// 比对id 查找答案
export const findAnswerInList = function (anList,questionId) {
    let find  = null;
    anList.map(item=>{
        if(item.id == questionId){
            find = item;
            return false
        }
    })
    return find;
}

export const parseQuestions = function(questons){
    questons.map(item=>{
        // console.log("item",item);
        let answerStr = item.answer;
        let answerList = []
        try {
            let anjson = JSON.parse(answerStr);
            answerList = anjson.answers;
        }catch (e) {
            console.log(e)
        }

        let subQuestionList = item.displaySubQuestions || item.subQuestions ;
        if(subQuestionList){
            subQuestionList.map(sub=>{
                let one = findAnswerInList(answerList,sub.id || sub.uuid )
                if(one){
                    if(sub.type == "MC"){
                        //选择题
                        if(one.input!=undefined){
                            sub.answer.input = one.input;
                        }
                    }else if(sub.type == "TF"){
                        //是非题
                        sub.answer.value = one.input||{};
                    }else if(sub.type == "FILL_IN_THE_BLANKS"){
                        // 填充题
                        sub.answer.input = one.input||[];
                    }else if(sub.type == "DIRECT_QUESTION"){
                        // 直接答题
                        if(one.input!=undefined){
                            sub.answer.input = one.input;
                        }
                        // sub.answer.input = one.input||'';
                    }
                }
            })
        }

    })
}
