<template>
    <div class="page_pair_user">
        <el-row v-if="!loading">
            <el-col :span="12"><gx-info-row label="姓名:" :label-w="infoRowLabelWidth" :content="user.name" /></el-col>
            <el-col :span="12">
                <gx-info-row label="性别:" v-if="user.sex == null" :label-w="infoRowLabelWidth" content="" />
                <gx-info-row label="性别:" v-if="user.sex == 0" :label-w="infoRowLabelWidth" content="*" />
                <gx-info-row label="性别:" v-if="user.sex == 1" :label-w="infoRowLabelWidth" content="男" />
                <gx-info-row label="性别:" v-if="user.sex == 2" :label-w="infoRowLabelWidth" content="女" />
            </el-col>
            <el-col :span="12"><gx-info-row label="电话号码:" :label-w="infoRowLabelWidth" :content="user.phone" /></el-col>
            <el-col :span="12"><gx-info-row label="电子邮箱:" :label-w="infoRowLabelWidth" :content="user.email" /></el-col>
            <el-col :span="12"><gx-info-row label="创建时间:" :label-w="infoRowLabelWidth" :content="user.createTime | formatTimeStampMinute" /></el-col>
            <el-col :span="12">
                <gx-info-row label="用户状态:" v-if="user.status == 1" :label-w="infoRowLabelWidth" content="正常" />
                <gx-info-row label="用户状态:" v-if="user.status == 0" :label-w="infoRowLabelWidth" content="禁用" />
            </el-col>
            <el-col :span="12"><gx-info-row label="用户语言:" :label-w="infoRowLabelWidth" :content="user.language" /></el-col>

        </el-row>

        <el-row v-else >
            <el-col :span="24">
                <div style="padding: 20px; text-align: center;">loading</div>
            </el-col>
        </el-row>
    </div>
    
</template>

<script>
    import TablePageBase from '../../common/tablePageBase';
    import  {getUserById} from "@/api/user";
    import  gxInfoRow from "../../../components/gxInfoRow";
    export default {
        extends : TablePageBase,
        name: "pairUser",
        components:{ gxInfoRow },
        props:{
            userId:{
                type:String,
                default:"",
                loading:true,
            },
        },
        watch:{
            userId(val, oldValue) {
                this.getUser();
            },
        },
        data(){
            return {
                infoRowLabelWidth:80,
                user:{},
                loading:''
            }
        },
        mounted() {
            let vm = this;
            // 加载列表
            vm.getUser();
        },
        methods:{
            getUser:function (){
                let vm = this;
                this.loading = true;
                getUserById({id:this.userId})
                .then((result) => {
                    this.loading = false;
                    //发送成功
                    if (result.code == vm.$success) {
                        vm.user =  result.data;
                    } else {
                        //发送失败
                        vm.$alert(result.message||"数据加载失败", {
                            confirmButtonText: '确定',
                        });
                    }
                })
                    .catch((error) => {
                        this.loading = false;
                        this.$message({
                            type: 'error',
                            message: "操作失败"
                        });
                    })
            },
            selectSuited:function (item) {
                this.$emit("selectSuited",item)
            }
        }
    }
</script>

<style lang="scss" scoped>
.page_pair_user {
    table {
        width: 100%;
        tr{
            border: 1px solid #1690ed;
            text-align: center;
        }
        td , th {
            min-height: 42px ;
            padding: 10px 4px;
        }
    }
}
</style>
