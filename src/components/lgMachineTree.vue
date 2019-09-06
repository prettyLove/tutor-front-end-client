<template>
    <div class="lg_machine_tree" :style="{ width,}">
        <div class="tool_bar" >
            <el-select value="" placeholder="请选择系统"  @change="addTreeSystem">
                <el-option
                    v-for="item in systemList"
                    :key="item.systemCode"
                    :label="item.systemName"
                    :value="item.systemCode">
                </el-option>
            </el-select>
           <!-- <el-dropdown trigger="click" @command="addTreeSystem" >
              <span class="el-dropdown-link" >
                添加系统<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
              </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="item in systemList" :command="item.systemCode" >{{item.systemName}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>-->
        </div>

        <div class="list_box" :style="{height,}" >
            <el-scrollbar style="height: 100%;">

                <el-tree
                    v-show="initComplete"
                    :data="daList"
                    :expand-on-click-node="false"
                    show-checkbox
                    node-key="id"
                    ref="tree1"
                    empty-text="请添加系统"
                    highlight-current
                    :props="defaultProps">
                    <span class="custom-tree-node"  slot-scope="{ node, data }">
                        <span >{{ node.label }}</span>
                        <span v-if="data.top" @click="() => removeNode(node, data)" style="color: #5a9a70">删除</span>
                    </span>
                </el-tree>
                <div  v-if="! initComplete">
                    <div style="margin: 10px; color: #999; ">loading</div>
                </div>
            </el-scrollbar>
        </div>

    </div>

</template>

<script>
//
// :default-checked-keys="['HC005PE-Api1-asp']"

    let loadHis = {};
    //机器树形菜单
    export default {
        name: "lgMachineTree",
        data(){
            return{
                initComplete:false, // 初始化完成之后才可以操作
                selectKeys: [] ,
                daList :[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        props:{
            width: {
                type: String,
                default: '100%'
            },
            height:{
                type: String,
                default: '600px'
            },
            selectList:Array,
            systemList:Array,
        },
        watch:{
            systemList(val,old){
                console.log('systemList',val)
            },
            selectList(val,old){
                console.log('selectList--------------------');
                console.log(val);
                // 数据改变重新初始化
                this.selectKeys  = val;
                this.daList = [];
                loadHis = {};
                this.initComplete = false;
                this.initSelected();
            }
        },
        mounted() {
            let vm = this;
            this.initSelected();
        },
        updated(){
            let vm = this;
        },
        methods:{
            setCheckedKeys() {
                this.$refs.tree1.setCheckedKeys(['HC005PE-Api1-asp']);
            },
            handleCommand(command) {
                console.log('click on item ' + command);
            },
            initSelected:function () {
                if(!this.selectList || this.selectList.length ==0 ){
                    this.initComplete = true;
                    return;
                }
                // 初始化内容
                this.selectKeys = [];
                this.daList=[];
                if (this.selectList) {
                    for (let k in this.selectList) {
                        let item = this.selectList[k];
                        this.selectKeys.push(item.machineName);
                        this.addTreeSystem(item.systemCode);
                        // 标记加载
                        loadHis[item.systemCode] = false ;
                    }
                }

                console.log("loadHis:",loadHis);
                this.$refs.tree1.setCheckedKeys(this.selectKeys);
            },
            isInitLoadComplete:function(){
                // 保证只执行一次
                if (this.initComplete ){
                    return;
                }
                //此函数解决一个问题， 初始化已选择项时，需要列表已加载完成后才生效，所以这里检查
                let over = true;
                for(let k in loadHis){
                    let fag = loadHis[k];
                    if(!fag){
                        over = fag;
                        return;
                    }
                }
                if(over){
                    console.log("set data ",this.selectKeys);
                    // 数据初始化完成后 展示
                    this.$refs.tree1.setCheckedKeys(this.selectKeys);
                    this.initComplete = true;
                }
            },
            // 取所在的系统
            getSystemCodeByMachineName:function(machineName){
                for (let i = 0; i < this.daList.length; i++) {
                    let top = this.daList[i];
                    for (let k = 0; k < top.children.length; k++) {
                        let item = top.children[k];
                        if (item.id == machineName) {
                            return top.id;
                        }
                    }
                }
                return null;
            },
            // 根据code 取系统名称
            getSystemNameByCode(code) {
                if(!this.systemList){
                    return;
                }
                let systems =  this.systemList;
                for (let i = 0; i <  systems.length; i++) {
                    let item = systems[i];
                    if (item.systemCode == code) {
                        return item.systemName;
                    }
                }
                return null;
            },

            clickTreeItem:function(item){
              this.addTreeSystem(item.systemCode);
            },

            addTreeSystem:function(systemCode){
                //检查重复
                for(let k in this.daList){
                    let item = this.daList[k];
                    if(item.id==systemCode){
                        return;
                    }
                }
                this.daList.push({
                    label:this. getSystemNameByCode(systemCode),
                    id:systemCode,
                    top:1,
                    // disabled: true,
                    isLeaf:true,
                    children:[],
                })
                this.addTreeItem(systemCode);
            },

            addTreeItem:function(systemCode){
                let vm = this;
                this.loadBusinessList(systemCode,(result)=>{
                    for(let h =0 ; h<result.data.length; h++){
                        let item = result.data[h];
                        this.loadMachineList(item,(resMachine)=>{
                            for(let k in resMachine.data) {
                                let machineName = resMachine.data[k];
                                let machine = {label: machineName, id: machineName, children:[],};
                                this.pushChildList(systemCode,machine);
                            }
                            loadHis[systemCode] = true;
                            // 最后一个检查加载完成
                            // if( h == result.data.length-1){
                            //     loadHis[systemCode] = true;
                            //     // 添加机器列表要更新已选择的 --- 初始化时用
                            //     vm.isInitLoadComplete();
                            // }
                            this.checkHisLoadComplete();
                        })
                    }
                });
            },
            checkHisLoadComplete:function(){
                let vm = this;
                let allLoaded = true;
                for(let k in loadHis){
                    console.log("his--",k);
                    if(! loadHis[k]){
                        allLoaded = false;
                        break;
                    }
                }
                if(allLoaded){
                    // 添加机器列表要更新已选择的 --- 初始化时用
                   setTimeout(()=>{
                       vm.isInitLoadComplete();
                   },1000);
                }
            },
            // 添加 二级机器列表
            pushChildList: function(systemCode,child){
                let vm = this;
                for(let k in this.daList){
                    let item = this.daList[k];
                    if(item.id == systemCode){
                        //判断重复
                        for(let m in item.children){
                            let mac = item.children[m];
                            if(mac.id == child.id){
                                return;
                            }
                        }
                        item.children.push(child);
                        return;
                    }
                }
            },
            // checkTree : function(v,k){
            //     console.log(this.selectNodes)
            //     return false;
            // },
            // 删除节点
            removeNode(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                console.log(index);
                children.splice(index, 1);

            },
            // 获取已选择的列表
            getChecked:function(){
                return this.$refs.tree1.getCheckedKeys()  ;
            },
            // 转换格式
            getCheckedSyslteList:function(){
                let sel = this.getChecked();
                let out = [];
                for(let  i=0;i<sel.length;i++){
                    let machineName=sel[i];
                    let syscode = this.getSystemCodeByMachineName(machineName);
                    let systemName = this.getSystemNameByCode(syscode);
                    if(syscode){
                        out.push({
                            systemCode:syscode,
                            systemName:systemName,
                            machineName:machineName,
                        })
                    }
                }
                return out;
            },
            // 加载部门名称
            loadBusinessList: function(code,cb) {
                let vm = this;
                if(this.isEmpty(code)){
                    return;
                }
                let url = this.$api.businessMappingRouter.getBusinessListBySystemCode+"?systemCode="+code+"&type=add";
                this.$http.get(url, {params: vm.reqCond})
                    .then((response) => {
                        if (response.status = vm.$responseSuccess) {
                            let result = response.data;
                            if (result.status == vm.$success) {
                                cb(result)
                                return;
                            }
                        }
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'error',
                            message: "加载错误"
                        });
                    })
            },
            // 加载机器列表
            loadMachineList : function(businessName, cb) {
                var vm = this;
                if ( this.isEmpty(businessName)) {
                    return;
                }
                var url = this.$api.businessMappingRouter.getMachineListByBusinessName + "?business=" + businessName;
                this.$http.get(url, {params: vm.reqCond})
                    .then((response) => {
                        if (response.status = vm.$responseSuccess) {
                            let result = response.data;
                            if (result.status == vm.$success) {
                                cb(result)
                                return;
                            }
                        }
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'error',
                            message: "加载错误"
                        });
                    })
            },
        }
    }
</script>

<style  >
    .lg_machine_tree { border: 1px solid #ccc; }
    .lg_machine_tree .el-dropdown-link {  line-height: 28px; margin-left: 6px; cursor: pointer; display: inline-block; padding: 0 6px; }
    .lg_machine_tree .el-dropdown-link:hover { background: #5a9a70;  }
    .lg_machine_tree .tool_bar   { margin: 5px;  }
    .lg_machine_tree .tool_bar ul   {   }
    .lg_machine_tree .tool_bar ul li { display: inline-block; line-height: 26px; padding: 0 8px; background: #5a9a70; color: #fff; cursor: pointer; }

    .lg_machine_tree .list_box { margin: 5px; border: 1px solid #ccc; min-height: 100px; background: #fff;  }
    .lg_machine_tree .el-scrollbar__wrap { overflow-x: hidden; }
</style>
