<template>

</template>


<script>

    import  viewBase from "./viewBase";
    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "table_page_base_";
    // 多语言显示
    export const pageLang= {
        isDelete:lang_prefix + "isDelete",
        tips:lang_prefix + "tips",
        cancelSignout:lang_prefix + "cancelSignout",
        dataError:lang_prefix + "dataError",
        loadingError:lang_prefix + "loadingError",
    }
    addLangItem(pageLang.isDelete,'是否确定删除？','是否确定删除？','Are you sure to delete');
    addLangItem(pageLang.tips,'提示','提示','Tips');
    addLangItem(pageLang.cancelSignout,'已取消退出','已取消退出','Withdrawal cancelled');
    addLangItem(pageLang.dataError,'数据错误','数据 错误','Data error');
    addLangItem(pageLang.loadingError,'加载错误','加载错误','Loading error');
    // 页面基类
    // 解决 加载页面相同部分
    export default {
        name: "tablePageBase",
        extends:viewBase,
        data() {
            return {
                pageLang,
                updateLoading:false,  // loading
                dialogFormVisible: false,  // 显示弹窗
                ths:[],
                form:{},
                // 增删改查 地址
                api:{
                    listPage:'', // 分页数据加载地址
                    update: null ,   // 更新数据地址
                    insert:'',   // 新增数据地址
                    delete:'',   // 删除数据地址
                },
                pageInfo: {
                    loading:false,
                }, // 分页数据
                reqCond: {    // 请求参数
                    pageNumber: 1, //初始化查询时为第一页
                },

                //配置信息
                conf:{
                    primary:'id', // 主键
                },
                tableSelectd:[], // 已经选择的id
                readyOnly:false,
                isSelectAll:false,
            }
        },
        mounted: function () {
            this.reqCond.systemCode = this.$store.getters.getSystemCode;
        },

        methods:{
            // checkbox 全选处理
            thCheckAllChange:function(val,id,lable){
                if(this.pageInfo.list){
                    if(!val && this.pageInfo.list.length == this.tableSelectd.length){
                        this.tableSelectd = [];
                        this.isSelectAll = false;
                    }else{
                        this.tableSelectd = [];
                        this.tableCheckBoxSelect();
                        if(this.pageInfo.list.length == this.tableSelectd.length){
                            this.isSelectAll = true;
                        }else{
                            this.isSelectAll = false;
                        }
                    }
                }
            },
            // 全选操作
            tableCheckBoxSelect:function(){
                for(let i =0;i<this.pageInfo.list.length;i++){
                    let item = this.pageInfo.list[i];
                    this.tableSelectd.push(item.id);
                }
            },
            // 每条数据的选择事件
            handleCheckChange:function(val,id,lable){
                this.addThSelect(id,val);
                if(this.pageInfo.list){
                    if(this.pageInfo.list.length == this.tableSelectd.length){
                        this.isSelectAll = true;
                    }else{
                        this.isSelectAll = false;
                    }
                }else{
                    this.isSelectAll = false;
                }
            },
            addThSelect:function(id,checked){
                //console.log("addThSelect",id,checked);
                if(checked){
                    if(!this.inArray(id,this.tableSelectd)){
                        this.tableSelectd.push(id);
                    }
                }else{
                    this.arrayRemove(id,this.tableSelectd);
                }

                console.log("this.tableSelectd",this.tableSelectd);
                return true;
            },

            // 根据code 取系统名称
            getSystemNameByCode(code) {
                let systems =  this.$store.getters.getSystems;
                for (let i = 0; i <  systems.length; i++) {
                    let item = systems[i];
                    if (item.systemCode == code) {
                        return item.systemName;
                    }
                }
                return null;
            },
            //加载列表数据
            getPageList: function ( ) {
                let vm = this;
                let url = vm.api.listPage;
                if (! url || url == "") {
                    return;
                }

                this.pageInfo.loading = true;
                //查询时页数据
                this.$http.get( url , {params: vm.reqCond})
                    .then((response) => {
                        vm.pageInfo.loading = false;
                        let result = response.data;
                        if(response.status= vm.$responseSuccess){
                            if(result.code == vm.$success){
                                vm.pageInfo =  result.data;
                                vm.pageInfo.loading = false;
                                return;
                            }
                        }
                        this.$message({
                            type: 'error',
                            message: result.message || "数据出错！"
                        });
                    })
                    .catch((error) => {
                        console.log("get page list error:",error);
                        this.$message({
                            type: 'error',
                            message: "加载数据出错！"
                        });
                    })
            },
            // 切换分页 setPage
            setPage: function(page){
                this.reqCond.pageNumber = page;
                this.getPageList();
            },
            // 取详情
            get:function(id){
                // 取到详情后 再调用 edit 编辑
            },
            // 删除
            del:function(id){
                var vm = this;
                let url = vm.api.delete;
                //待处理
                // this.$confirm('是否确定删除?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                this.$confirm(this.getLang(this.pageLang.isDelete), this.getLang(pageLang.tips), {
                    confirmButtonText: this.getLang(this.langCode.sure),
                    cancelButtonText: this.getLang(this.langCode.cancel),
                    type: 'warning'
                }).then(() => {
                    // 密码验证完成 to del
                    vm.$http.delete(vm.api.delete, {params: {id: id}})
                        .then((response) => {
                            if (response.status = vm.$responseSuccess) {
                                let result = response.data;
                                //删除成功
                                if (result.code == vm.$success) {
                                    this.$message({
                                        type: 'info',
                                        // message: "删除成功"
                                        message: this.getLang(this.langCode.successfulDeletion)
                                    });
                                    //重新加载数据
                                    vm.getPageList();
                                } else {
                                    //删除失败
                                    vm.$alert(result.message||this.getLang(this.langCode.failedDeletion), {
                                        //确定
                                        confirmButtonText: this.getLang(this.langCode.sure),
                                    });
                                }
                                this.deleteAfter(result.code);
                            }
                        })
                        .catch((error) => {
                            this.$message({
                                type: 'error',
                                // message: "操作失败"
                                message: this.getLang(this.langCode.fail)
                            });
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        // message: '已取消退出'
                        message:this.getLang(pageLang.cancelSignout)
                    });
                });

            },
            // 删除
            deleteAfter:function(status){

            },
            // 验证数据
            validate:function(){
                return true;
            },
            // 保存与编辑
            save: function () {
                let vm = this;

                if(!this.validate()){
                    return ;
                }
                let isAdd = ( !this.form.id || this.form.id == '' )? true:false;
                vm.updateLoading = true;
                // 取接口 url
                let url = isAdd ? vm.api.insert : vm.api.update;
                // 好果不指定更新接口，那么更新接也使用 instert 接口
                if (vm.api.update == null ){
                    url = vm.api.insert;
                }

                if(isAdd){
                    this.$http.post(url , vm.form )
                        .then((response) => {
                            vm.updateLoading = false;
                            let res = response.data ;
                            if(response.status === vm.$responseSuccess){
                                if( res.code == vm.$success ){
                                    vm.getPageList();
                                    vm.dialogFormVisible = false;
                                    // this.$message("操作成功");
                                    this.$message(this.getLang(this.langCode.success));
                                } else {
                                    // 多语言处理 按多语言取内容
                                    let mess = this.getLangServerMess(res.messageCode);
                                    this.$message({
                                        type: 'error',
                                        // message: res.message || mess ||"操作失败！"
                                        message: res.message || mess ||this.getLang(this.langCode.fail)
                                    });
                                }

                                this.saveAfter(res.status);
                            }
                        })
                        .catch((error) => {
                            vm.updateLoading = false;
                            // this.$message("操作失败");
                            message: this.getLang(this.langCode.fail);
                        })
                }else {
                    this.$http.patch( url , vm.form )
                        .then((response) => {
                            vm.updateLoading = false;
                            let res = response.data ;
                            if(response.status === vm.$responseSuccess){
                                if( res.code == vm.$success ){
                                    vm.getPageList();
                                    vm.dialogFormVisible = false;
                                    // this.$message("操作成功");
                                    this.$message(this.getLang(this.langCode.success));
                                } else {
                                    // 多语言处理 按多语言取内容
                                    let mess = this.getLangServerMess(res.messageCode);
                                    this.$message({
                                        type: 'error',
                                        // message: res.message || mess ||"操作失败！"
                                        message: res.message || mess ||this.getLang(this.langCode.fail)
                                    });
                                }

                                this.saveAfter(res.status);
                            }
                        })
                        .catch((error) => {
                            vm.updateLoading = false;
                            // this.$message("操作失败");
                            message: this.getLang(this.langCode.fail)
                        })
                }

            },
            //
            editBefore:function(item){

            },
            //
            saveAfter:function(status){

            },
            // 编辑 和 新增
            edit:function(item,readyOnly){
                this.editBefore(item);
                this.readyOnly = readyOnly;
                // item 为空的object 则是添加
                this.form = Object.assign( {},item || {} ) ;
                this.showEditDialog();
            },
            showEditDialog:function(){
                this.dialogFormVisible = true;
            },
            // 取消编辑 和 新增
            cancelEditDialog : function () {
                this.dialogFormVisible = false;
            },

            // 加载get 数据
            getServer:function(url,source,cb,errCb){
                let vm = this;
                this.$http.get(url, { })
                    .then((response) => {
                        if (response.status = vm.$responseSuccess) {
                            let result = response.data;
                            if (result.code == vm.$success) {
                                if(cb){
                                    cb(source,result);
                                }else{
                                    vm[source] = result.data;
                                }
                                return;
                            }
                        }
                        if(errCb){
                            errCb(1,source,result);
                        }else {
                            // 多语言处理 按多语言取内容
                            let mess = this.getLangServerMess(res.messageCode);
                            this.$message({
                                type: 'error',
                                // message:  res.message || mess ||  "数据错误!"
                                message:  res.message || mess ||  this.getLang(pageLang.dataError),
                            });
                        }
                    })
                    .catch((error) => {
                        if(errCb){
                            errCb(-1,source,error);
                        }else{
                            this.$message({
                                type: 'error',
                                // message: "加载错误!"
                                message: this.getLang(pageLang.loadingError),
                            });
                        }
                    })
            },
        },
        components: {

        }
    }
</script>

<style scoped>

</style>
