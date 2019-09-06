<template>
    <div class="page_dashboard_edit" v-loading="loading" element-loading-text="拼命加载中">
        <div>
            <div class="cont">
                <!--                {{editUrl}}-->
                <!-- 编辑画板 -->
                <div v-if="editUrl!=''" style="border: 1px solid #ccc;">
                    <iframe ref="ifr" :src="editUrl" width="100%" height="600px" frameborder="0"
                            @load="getEditWorkList()"></iframe>
                </div>
                <div style="text-align: center; margin-top: 5px; ">
                    <el-button size="small" @click="close()">取消</el-button>
                    <el-button size="small" type="primary" @click="save()" v-loading.fullscreen.lock="updateLoading">
                        <!--                        {{form.id?'更新':'新增'}}-->
                        保存
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>

    import viewBase from '../common/viewBase';
    import lgCard from '../../components/lgCard'
    import {dashboardApi} from '../../api/dashboard';

    export default {
        extends: viewBase,
        name: "dashboardEdit",
        components: {lgCard},
        props: {
            editUrl: {
                type: String,
                default: null
            },
            dashboardId: {
                type: String,
                default: null
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            editUrl: {
                handler(curVal, oldVal) {
                    this.clearInterval();
                    if (!this.isEmpty(curVal)) {
                        this.intervalId = setInterval(this.autoSave, 5 * 60 * 1000);
                    }
                },
                deep: true, //深度
                immediate: true // 实时
            }
        },
        data() {
            return {
                formLabelWidth: '80px',
                updateLoading: false,
                form: {},
                loading: true,
                intervalId: 0
            }
        },
        created() {
        },
        beforeDestroy() {
            clearInterval(this.intervalId);
        },
        destroyed() {
            clearInterval(this.intervalId);
        },
        mounted() {
        },
        methods: {
            close: function () {
                this.openTip();
            },
            clearInterval() {
                clearInterval(this.intervalId);
            },
            save: function () {
                let _this = this;
                this.loading = true;
                this.$refs.ifr.contentWindow.saveWorkList(function (message) {
                    _this.$message({
                        type: 'success',
                        message: message
                    });
                    _this.loading = false;
                    _this.$emit("change");
                    _this.$emit("close", false, "");
                });
            },

            autoSave: function () {
                let _this = this;
                this.$refs.ifr.contentWindow.saveWorkList(function (message) {
                    _this.$message({
                        type: 'success',
                        message: "auto save " + message
                    });
                    _this.$emit("change");
                }, true);
            },

            getEditWorkList: function () {
                let _this = this;
                this.loading = true;
                console.log("vue -- getEditWorkList --- ");
                this.$refs.ifr.contentWindow.getEditWorkList(function () {
                    _this.loading = false;
                });
            },
            openTip() {
                let _this = this;
                this.$confirm('取消将丢失更改,是否保存', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    this.$refs.ifr.contentWindow.saveWorkList(function (message) {
                        _this.$message({
                            type: 'success',
                            message: message
                        });
                        // _this.editUrl = "";
                        _this.loading = false;
                        _this.$emit("change");
                        _this.$emit("close", false, "");
                    });

                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消保存'
                    });
                    this.$refs.ifr.contentWindow.clearWorkList();
                    // _this.editUrl = "";
                    _this.$emit("close", false, "");
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .page_dashboard_edit {


    }
</style>
