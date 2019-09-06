<template>
<!--    笔记影片问题反馈弹出框-->
    <el-dialog title="问题反馈" :visible.sync="visible"  :close-on-click-modal="false" style="text-align: center" >
        <el-form class="clearfix" :model="feedbackForm">
            <el-row :gutter="10">
                <el-col :span="18" >
                    <el-form-item label="类型:" :label-width="formLabelWidth" >
                        <div> {{this.feebackObj.type}} </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="18">
                    <el-form-item label="问题类型" :label-width="formLabelWidth">
                        <el-select v-model="feedbackForm.type" placeholder="请选择问题类型" style="width: 100%;">
                            <el-option
                                v-for="item in feedTypeList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24" >
                    <el-form-item label="反馈内容" :label-width="formLabelWidth" >
                        <el-input type="textarea" :rows='10' v-model="feedbackForm.message" placeholder="请输入要反馈的内容"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 取消和保存 -->
        <div slot="footer" class="dialog-footer diglog_btns" style="text-align: center;">
            <el-button @click="cancelModal">取消</el-button>
            <el-button type="primary" @click="submit">反馈</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "gx-feedback-dialog",
        props: {
            feebackObj: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                formLabelWidth:'120px',
                feedbackForm:{},
                feedTypeList:[]
            }
        },
        mounted() {
            this.feedTypeList = this.$store.getters.getSystemConfigMapByKey("QUESTION_FEEDBACK_TYPE_LIST").split(',');
            console.log("this.feedTypeList ",this.feedTypeList )
        },
        methods:{
            submit(){
                this.feedbackForm.feebackId=this.feebackObj.id;
                this.$emit('submit', this.feedbackForm);
            },
            cancelModal(){
                // 关闭弹窗，触发父组件修改visible值
                this.$emit('update:visible', false);
            }
        }
    }
</script>

<style scoped>

</style>
