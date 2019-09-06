<template>

    <div  v-loading.fullscreen.lock="loading" class="programme_page">

        <!--<el-button @click="loadPlanList"> 加载eventlist</el-button>-->

        <!-- 添加日程 -->
        <el-dialog title="添加日程" :visible.sync="addFormVisible" width="80%" :close-on-click-modal="false">
            <div>
                <el-form class="clearfix" :model="form">
                    <el-row :gutter="20">
                        <el-col :span="12" >
                            <el-form-item label="时间" :label-width="formLabelWidth" >
                                {{form.start|formatDate}}
                            </el-form-item>
                        </el-col>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-col :span="12">
                                <el-form-item label="时间范围" :label-width="formLabelWidth" >
                                    <el-time-picker
                                        is-range
                                        v-model="form.timeValue"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围" >
                                    </el-time-picker>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="重复" :label-width="formLabelWidth" >
                                <el-select v-model="form.repeat" placeholder="请选择">
                                    <el-option label="不重复" value="none"></el-option>
                                    <el-option label="每周" value="week"></el-option>
                                    <el-option label="每天" value="day"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="结束时间" :label-width="formLabelWidth" >
                                <el-date-picker
                                    v-model="form.term"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" >
                        <el-col :span="12" >
                            <el-form-item label="标题" :label-width="formLabelWidth" >
                                <el-input  v-model="form.title" placeholder="请输入标题" />
                            </el-form-item>
                        </el-col>
<!--                        <el-col :span="6"></el-col>-->
                        <el-col :span="10" >
                            <el-form-item label="科目" :label-width="formLabelWidth" >
                                <el-input  v-model="form.subject" placeholder="请输入科目" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </el-row>
                </el-form>
            </div>

            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns" >
                <el-button @click="addFormVisible=false">关闭</el-button>
                <el-button @click="addSchedulePlan" v-loading.fullscreen.lock="loading">添加</el-button>
            </div>

        </el-dialog>

        <!-- 点击 event -->
        <el-dialog title="日程事件" :visible.sync="eventFormVisible" width="60%" :close-on-click-modal="false"  >
            <div>
                <el-form class="clearfix" :model="eventInfo">
                    <el-row :gutter="12" v-if="eventInfo">
                        <el-col :span="20" >
                            <el-form-item label="标题:" :label-width="formLabelWidth" >
                                {{eventInfo.title}}
                            </el-form-item>
                        </el-col>

                        <el-col :span="8" >
                            <el-form-item label="创建人:" :label-width="formLabelWidth" >
                                {{eventInfo.username}}
                            </el-form-item>

                            <!-- 删除 -->
                            <template  v-if="uid==eventInfo.createBy && eventInfo.end>new Date()">
                                <el-form-item label="删除:" :label-width="formLabelWidth" >
                                    <el-select  v-model="eventInfo.delete" >
                                        <el-option label="当前" value="1" selected ></el-option>
                                        <el-option label="本周" value="2"></el-option>
                                        <el-option label="所有" value="3"></el-option>
                                    </el-select>
<!--                                    <el-select  v-model="eventInfo.delete" >-->
<!--                                        <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
<!--                                    </el-select>-->
                                </el-form-item>
                            </template>

                        </el-col>
                        <el-col :span="16" >
                            <el-form-item label="时间:" :label-width="formLabelWidth" >
                                {{eventInfo.start|formatTimeStampMinute}} -- {{eventInfo.end|formatTimeStampMinute}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div v-if="myDateEvent.appointmentCount>0">
                <h3 style="line-height: 32px">预约列表</h3>
                <el-main >
                    <el-row :gutter="12" v-for="item in appointmentList" :key="item.id">
                        <el-col :span="4"><div style="line-height: 32px">{{item.name}}</div></el-col>
<!--                        <el-col :span="14"><div style="line-height: 32px">{{item.start|formatTimeStamp}} &#45;&#45; {{item.end|formatTimeStamp}}</div></el-col>-->
                        <el-col :span="2">
                            <div v-if="item.status==1"><el-button size="small" type="danger" @click="cancelAppointment(item)">取消</el-button></div>
                            <div v-if="item.status==-1"><el-tag type="danger">已取消</el-tag></div>
                        </el-col>
                    </el-row>
                </el-main>
            </div>

            <!-- 确认修改信息 -->
            <div v-if="eventInfo.operatingInform">
                <h3>待确认修改</h3>
                <el-main>
                    <el-row :gutter="12"  >
                        <el-col :span="16">
                            <div style="line-height: 32px">{{eventInfo.operatingInform.username}}
                                <span style="margin-left: 50px;">请求时间修改为: </span> {{eventInfo.operatingInform.newStart|formatTimeStamp}} --
                                {{eventInfo.operatingInform.newEnd|formatTimeStamp}}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div v-if="eventInfo.end>new Date()">
                                <el-button v-if="uid==eventInfo.operatingInform.createBy" @click="cancelEditOperate(eventInfo.id)" size="small" type="danger" >取消</el-button>
                                <template  v-else >
                                    <el-button size="small" @click="agreeMessigeChange(eventInfo,-1)" type="danger"  >不同意</el-button>
                                    <el-button size="small" @click="agreeMessigeChange(eventInfo,1)" type="success"  >同意</el-button>
                                </template>
                            </div>
                        </el-col>
                    </el-row>
<!--                    {{eventInfo.operatingInform}}-->
                </el-main>

            </div>
            <!-- 取消和保存 -->
<!--            <div slot="footer" class="dialog-footer diglog_btns"  >-->
<!--                <el-button @click="eventFormVisible=false">关闭</el-button>-->
<!--                <el-button    @click="editSchedulePlan(eventInfo)" v-loading.fullscreen.lock="loading" v-if="uid==eventInfo.createBy">编辑</el-button>-->
<!--                <el-button   v-if="uid==eventInfo.createBy" @click="deleteSchedulePlan(eventInfo)" v-loading.fullscreen.lock="loading">删除</el-button>-->
<!--                <el-button   v-else @click="addAppointment(eventInfo)" v-loading.fullscreen.lock="loading">约他</el-button>-->
<!--            </div>-->
            <div slot="footer" class="dialog-footer diglog_btns"  v-if="uid==eventInfo.createBy||eventInfo.end<new Date()" >
                <el-button    @click="eventFormVisible=false">关闭</el-button>
                <template v-if=" eventInfo.end>new Date() && (  appointmentListItem.status==-1 || getHasAppointment(appointmentList) )">
                    <el-button    @click="editSchedulePlan(eventInfo)" v-loading.fullscreen.lock="loading" >编辑</el-button>
                    <el-button    @click="deleteSchedulePlan(eventInfo)" v-loading.fullscreen.lock="loading" >删除</el-button>
                </template>
            </div>

            <div slot="footer" class="dialog-footer diglog_btns"  v-if="uid!=eventInfo.createBy && eventInfo.end>=new Date()">
                <el-button @click="eventFormVisible=false">关闭</el-button>
                <el-button    @click="addAppointment(eventInfo)" v-loading.fullscreen.lock="loading" v-if="hasMyAppointment(appointmentList) && eventInfo.start > new Date()">约他</el-button>
            </div>

        </el-dialog>
        <!-- 日程编辑弹出框-->
        <el-dialog title="编辑日程" :visible.sync="eventEditFormVisible" width="40%" :close-on-click-modal="false">
            <div>
                <el-form class="clearfix" :model="eventInfo">
                    <el-row :gutter="12" v-if="eventInfo">
                        <el-col :span="12" >
                            <el-form-item label="时间:" :label-width="formLabelWidth" >
<!--                                {{eventInfo.start|formatTimeStampMinute}} &#45;&#45; {{eventInfo.end|formatTimeStampMinute}}-->
                                <el-time-picker
                                    is-range
                                    v-model="eventInfo.timeValue"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    placeholder="选择时间范围" >
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="12">
                        <el-col :span="12">
                            <el-form-item label="标题:" :label-width="formLabelWidth" >
                                <!--                                {{eventInfo.title}}-->
                                <el-input v-model="eventInfo.title" placeholder="请输入要修改的标题" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div>

                </div>
            </div>
            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns"  >
                <el-button @click="eventEditFormVisible=false">关闭</el-button>
                <el-button    @click="editSaveSchedulePlan(eventInfo)" v-loading.fullscreen.lock="loading">保存</el-button>
            </div>
        </el-dialog>

        <!-- 日程删除弹出框-->
        <el-dialog title="删除日程" :visible.sync="eventDeletFormVisible" width="40%" :close-on-click-modal="false"  class="diglog_btns">
            <div>
                <el-form class="clearfix" :model="eventInfo">
                    <el-row :gutter="12" v-if="eventInfo">
                        <el-col :span="24" style="" class="diglog_del">
                                <div>日程时间：{{eventInfo.start|formatTimeStamp}} --至--{{eventInfo.end|formatTimeStamp}}</div>
                                <div style="margin-top: 30px">是否确定删除日程</div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 取消和保存 -->
            <div slot="footer" class="dialog-footer diglog_btns" >
                <el-button @click="eventDeletFormVisible=false">取消</el-button>
                <el-button    @click="deleteSaveSchedulePlan(eventInfo)" v-loading.fullscreen.lock="loading">确定</el-button>
            </div>
        </el-dialog>

        <FullCalendar
            defaultView="dayGridMonth"
            :plugins="calendarPlugins"
            :weekends="true"
            :selectable="selectable"
            :selectHelper="false"
            :events="myDateEvent"
            :header="{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }"
            :editable="true"
            :droppable="true"
            :selectMirror="true"
            :drop="drop"
            :highlighted="highlightedFn"
            @dateClick="onDateClick"
            @select="onSelect"
            @eventDragStart="onDragStart"
            @eventDragStop="onDragStop"
            @eventDrop="onDrop"

            @eventLeave="onLeave"
            @eventReceive="onReceive"

            @eventResizeStart="onResizeStart"
            @eventResizeStop="onResizeStop"
            @eventResize="onResize"

            @eventClick="onEventClick"

            @eventRender="onEventRender"
            eventBackgroundColor="#f00"
            eventBorderColor="#fff"
            eventTextColor="#fff"
            :displayEventTime="true"
            :eventTimeFormat="{ hour: 'numeric',minute: '2-digit',meridiem: false }"
            :height="fullCalendarHeight"

        />

        <!--getScreenHeight:{{$store.getters.getScreenHeight}}-->

        <!-- 颜色使用说明 -->
        <div style="height: 10px;"></div>
        <div style="width: 800px;">
            <el-row :gutter="10">
                <el-col :span="2"><div class="color_prop me"></div></el-col>
                <el-col :span="2">我创建</el-col>
                <el-col :span="2"><div class="color_prop friend"></div></el-col>
                <el-col :span="2">对方创建</el-col>
                <el-col :span="2"><div class="color_prop change"></div></el-col>
                <el-col :span="2">修改中</el-col>
                <el-col :span="2"><div class="color_prop appointment"></div></el-col>
                <el-col :span="2">预约成功</el-col>
                <el-col :span="2"><div class="color_prop expire"></div></el-col>
                <el-col :span="2">过时</el-col>
            </el-row>
        </div>
        <div style="height: 10px;"></div>

    </div>

</template>

<script>
    // eventClick  用户单击事件时触发
    // eventMouseEnter 当用户将鼠标悬停在事件上时触发
    // eventMouseLeave 当用户将鼠标移出事件时触发

    // 日程管理
    import viewBase from '@/pages/common/viewBase'
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import timegrid from '@fullcalendar/timegrid'
    import interaction from '@fullcalendar/interaction'
    import listPlugin from '@fullcalendar/list';
    import {roles} from '@/utils/const'

    import {schedulePlanApi} from "../../api/schedulePlan";
    import {scheduleNoticeApi} from "../../api/scheduleNotice";

    import {langs,addLangItem} from "@/utils/languageWebMap"
    // 多语言前缀 所有页面不可重复 为避免冲突
    export const lang_prefix = "programme_";
    // 多语言显示
    export const pageLang= {
        title:lang_prefix + "title",
        title:lang_prefix + "title",
    }
    addLangItem(pageLang.title,'日程管理','日程管理','programme');

    export default {
        extends: viewBase,
        name: "programme",
        components: { FullCalendar },
        data() {
            return {
                roles,
                formLabelWidth: '120px',
                calendarPlugins: [dayGridPlugin, interaction, timegrid, listPlugin],
                myDateEvent: [
                    // { id:'001',title: 'event 1', date: '2019-07-09' },
                    // { id:'002',title: 'event 2', date: '2019-07-10' },
                    // { id:'002',title: 'event 99', start: '2019-07-09',end:'2019-07-09' },
                    // {start: '2019-07-20',end: '2019-07-28', overlap: false, rendering: 'background', color: '#ff9f89'},
                ],
                //高亮当前日期
                highlightedFn: {
                    customPredictor(date) {
                        if (date.getDate() === (new Date()).getDate()) {
                            return true;
                            }
                        }
                    },
                    //设置当前日期之后不能选中
                addFormVisible: false,
                form: {},
                dateInfo: {},
                selectable: true,
                eventFormVisible: false,
                eventEditFormVisible: false,
                eventDeletFormVisible: false,
                cancalSchedulePlanVisible:false,
                loading: false,
                uid: '',
                // eventEditTitle:'',
                eventEdit: {},
                editId: '',
                appointmentList: [], //length>0有预约
                appointmentListItem:{},
                now:'',
                eventInfo: {},
                // options: [{value: '1', label: '不重复'}, {value: '2', label: '本周'},{value:'3',label:'所有'}],
                }
        },
        mounted(){
            this.uid = this.$store.getters.getUserInfo.id;
            console.log('this.uid',this.uid);
            this.loadPlanList();
        },
        computed:{
            fullCalendarHeight:function(){
                let h = this.$store.getters.getScreenHeight-160;
                return h<550? 550:h;
            }
        },
        methods:{
            hasMyAppointment:function(list){
                if(list.length==0){
                    return true;
                }
                let has = true;
                list.map(item=>{
                    if(item.status==1){
                        has = false;
                        return false;
                    }
                })
                return has;
            },
            getHasAppointment:function(list){
                if(list.length==0){
                    return true;
                }
                let has = true;
                list.map(item=>{
                    if(item.status==1){
                        has = false;
                        return false;
                    }
                })
                return has;
            },

            onEventRender:function(info){
                let event = info.event;
                // console.log(event.backgroundColor = "#0f0")
                /*var tooltip = new Tooltip(info.el, {
                    title: info.event.extendedProps.description,
                    placement: 'top',
                    trigger: 'hover',
                    container: 'body'
                });*/
            },
            getColor:function(item){
                if(item.end<new Date()){
                    return '#bbb';
                }
                if (item.operatingInform) { //改变中
                    return '#3998F4';
                }

                if (item.appointmentList) {
                    for(let i=0;i<item.appointmentList.length;i++){
                        let one = item.appointmentList[i];
                        // console.log("item",item)
                         if (one.status==1 ) {
                             return '#ffcb7a'
                         }
                    }
                }
                if(this.getUserId()==item.createBy){
                    return '#687d56';
                }


                return '#f66';
            },
            getTitle:function(item){
                let out = item.title
                if(item.appointmentCount>0){
                    out += `\nappointment : ${item.appointmentCount} 位\n`;
                    let users = [];
                    item.appointmentList.map(one=>{
                        users.push(one.name);
                    })
                    if(this.getUserRole()=="TUTOR"){
                        out += "students: "+users.join(",")+""
                    }else{
                        out += "tutor: "+users.join(",")+""
                    }
                }

                if (item.operatingInform) { //改变中
                    console.log("operatingInform",item.operatingInform);
                    out += "\n修改->";
                    out += item.operatingInform.username+" 发起修改";
                    out += "\n" + this.$options.filters['formatTimeStampMinute'](item.operatingInform.newStart) ;
                    out += "\n--" + this.$options.filters['formatTimeStampMinute'](item.operatingInform.newEnd);
                }
                return out;
            },
            getEditable:function(item){
                // 控制表格能不能托运
                let now = new Date();//获取当前时间
                now.setDate(now.getDate()-1);//设置天数 -1 天
                if (item.end < now) {
                    return false;
                }
                if(item.appointmentList && item.appointmentList.length>0){
                    return true;
                }
                if(this.getUserId()!=item.createBy){
                    // 不是自己创建的不可以操作
                    return false;
                }

                return true;
            },
            // 加载日程列表
            loadPlanList:function(){
                // this.loading = true;
                console.log("loadPlanList");
                schedulePlanApi.list({startDate:'',endDate:''}).then(result=>{
                    this.loading = false;
                    if(result.code==this.$success){
                        console.log('loadPlanList==result',result);
                        let dalist = result.data;

                        this.myDateEvent = dalist.map(item=>{
                            return {
                                id:item.id,
                                backgroundColor:this.getColor(item),
                                editable: this.getEditable(item), // 不能手动别人创建的
                                title: this.getTitle(item) ,
                                // start: '2019-07-09 13:02:20',
                                // end:'2019-07-09 14:02:20'
                                start: item.start, //this.$options.filters['formatTimeStamp'](item.start),
                                end: item.end,// this.$options.filters['formatTimeStamp'](item.end),
                                createBy:item.createBy,
                                username:item.username,
                                changeStatus:item.changeStatus,
                                newStart:item.newStart,
                                newEnd:item.newEnd,
                                appointmentCount:item.appointmentCount,
                            }
                        })
                        console.log('changeStatus',result.data.changeStatus);

                        /*this.myDateEvent = [
                            { id:'001',title: 'event 1', date: '2019-07-09' },
                            { id:'002',title: 'event 2', date: '2019-07-10' },
                            { id:'002',title: 'event 99', start: '2019-07-09',end:'2019-07-11' },
                        ],*/
                        console.log("re",this.myDateEvent);
                    }else {
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'error',
                            message: res.message || mess ||"加载失败！"
                        });
                    }
                }).catch(err=>{
                    this.loading = false;
                    console.log(err);
                })
            },
            addSchedulePlan:function(){
                // 添加日程
                // this.form.start = this.dateInfo.date || this.dateInfo.start;
                // this.form.end= this.dateInfo.date || this.dateInfo.end;
                console.log("addSchedulePlan",this.dateInfo.date);
                // let starTime=this.dateInfo.dateStr;
                let starTime=this.dateInfo.dateStr;

                if(this.isEmpty(this.form.timeValue)){
                    this.$alert("请选择时间范围");
                    return false;
                }

                let starHours=this.form.timeValue[0].getHours();
                let starMinutes=this.form.timeValue[0].getMinutes();
                let starSeconds=this.form.timeValue[0].getSeconds();
                let endHours=this.form.timeValue[1].getHours();
                let endMinutes=this.form.timeValue[1].getMinutes();
                let endSeconds=this.form.timeValue[1].getSeconds();
                // let endYear=this.form.term.getFullYear();
                // let endMonth=this.form.term.getMonth()+1;
                // let endDate=this.form.term.getDate();
                let start=starTime+' '+starHours+':'+starMinutes+':'+starSeconds+'';
                let end=starTime+' '+endHours+':'+endMinutes+':'+endSeconds+'';
                console.log("开始HH:MM:SS",starHours,':'+starMinutes+':'+starSeconds);
                console.log("结束HH:MM:SS",endHours,':'+endMinutes+':'+endSeconds);
                console.log('开始年：日：月',starTime);
                // console.log('结束年：日：月',endYear+':'+endMonth+':'+endDate);
                console.log('开始：结束',new Date(start),new Date(end));
                this.form.start=new Date(start);
                this.form.end=new Date(end);
                this.loading = true;
                schedulePlanApi.add(this.form).then((result=>{
                    console.log('schedulePlanApi  result',result);
                    if(result.code==-1){
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||"已过期,不能再添加！"
                        });
                        this.loading = false;
                        this.addFormVisible = false;
                        return false;
                    }
                    if(result.code==this.$success){
                    this.addFormVisible = false;
                    this.loading = false;
                    console.log('添加日程schedulePlanApi==result',result);
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                        type: 'success',
                        message: result.message || mess ||'日程添加成功'
                    });
                        this.loadPlanList();
                    }else {
                        this.loading = false;
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||"操作失败！"
                        });
                    }
                    // if()
                })).catch(err=>{
                    console.log(err);
                })
            },
            //取消约会
            cancelAppointment:function(item){
                this.$confirm('此操作将取消预约, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    schedulePlanApi.deleteAppointment({id: item.id}).then((result) => {
                        let mess = this.getLangServerMess(result.messageCode);
                        if (result.code == this.$success) {
                            console.log('deleteAppointment==result', result);
                            this.eventFormVisible = false;
                            this.loadPlanList();
                            this.$message({
                                type: 'success',
                                message: result.message || mess || '预约取消成功'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: result.message || mess || '预约取消失败,请检查！'
                            });
                        }
                    }).catch((err) => {
                        console.log('err', err);
                    })
                }).catch(() => {
                    this.eventFormVisible = false;
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            // 约他
            addAppointment:function(info){
                let params = Object.assign({},info);
                params.planId = info.id;
                schedulePlanApi.addAppointment(params).then((result=>{
                    let mess = this.getLangServerMess(result.messageCode);
                    if(result.code==this.$success){
                        console.log('约他schedulePlanApi==result',result);
                        this.eventFormVisible = false;
                        this.loadPlanList();
                        this.$message({
                            type: 'success',
                            message: result.message || mess ||'预约成功'
                        });
                    }else {
                        // let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||"操作失败,请检查！"
                        });
                        this.loading = false;
                        this.eventFormVisible = false;
                    }
                })).catch(err=>{
                    console.log(err);
                })
            },
            //日程编辑保存
            editSaveSchedulePlan:function(eventInfo){
                // params={
                //     title:this.eventEditTitle,
                //
                // }
                schedulePlanApi.save(eventInfo).then((result)=>{
                    let mess = this.getLangServerMess(result.messageCode);
                    if(result.code==this.$success){
                        console.log('save===>result',result);
                        this.eventEditFormVisible=false;
                        this.loadPlanList();
                        this.$message({
                            type: 'success',
                            message: result.message || mess ||'更改成功'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||'更改失败'
                        });
                    }
                }).catch((err)=>{
                    console.log('err',err);
                })

            },
            //编辑日程确认框
            editSchedulePlan:function(info){
                console.log('info',info);
                this.editId=info.id;
                this.eventFormVisible=false;
                this.eventEditFormVisible=true;

            },
            //删除日程确认框
            deleteSaveSchedulePlan:function(info){
                let event = info;
                console.log("deleteSchedulePlan",event);
                this.loading = true;
                if(event.delete==''){
                    this.$message({
                        type: 'error',
                        message: "请选择要删除的时间段！"
                    });
                    return;
                }
                schedulePlanApi.delete({id:event.id,delete:event.delete}).then((result=>{
                    console.log('删除日程deleteSchedulePlan==result',result);
                    let mess = this.getLangServerMess(result.messageCode);
                    if(result.code==this.$success){
                        this.eventFormVisible = false;
                        this.eventDeletFormVisible=false;
                        this.loading = false;
                        this.loadPlanList();
                        this.$message({
                            type: 'success',
                            message:  result.message || mess||'操作成功'
                        });
                    }else {
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||"操作失败！"
                        });
                        this.loading = false;
                        this.eventDeletFormVisible=false;
                    }
                })).catch(err=>{
                    console.log(err);
                })
            },
            // 删除日程
            deleteSchedulePlan:function(){
                this.eventDeletFormVisible=true;
                this.eventFormVisible = false;

            },
            // 点击事件
            onEventClick:function(info){
                console.log("onEventClick:",info);
                var eventObj = info.event;
                this.eventInfo = {};
                // this.appointmentList = [];
                schedulePlanApi.get({id:eventObj.id}).then(result=>{
                    if(result.code==this.$success){
                        console.log("点击事件schedulePlanApi==result",result)
                        this.eventInfo = result.data;
                        // this.eventInfo.delete = '1';
                        this.appointmentList = this.eventInfo.appointmentList;
                        this.eventFormVisible = true;
                        this.appointmentListItem={};
                        for(let i=0;i<this.appointmentList.length;i++){
                            this.appointmentListItem=this.appointmentList[i];
                        }
                        console.log('this.appointmentListItem',this.appointmentListItem);
                    }else{
                        this.$message({
                            type: 'error',
                            message: "加载信息失败！"
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                })
                info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
            },
            drop:function (info){
                console.log("drop",info);
                // is the "remove after drop" checkbox checked?
                if (checkbox.checked) {
                    // if so, remove the element from the "Draggable Events" list
                    info.draggedEl.parentNode.removeChild(info.draggedEl);
                }
            },
            // 点击时间
            onDateClick: function(info) {
                console.log('Clicked on: ' , info);
                console.log('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                console.log('Current view: ' + info.view.type);
                let end=info.date;
                this.form = {};
                this.dateInfo = info;
                let now = new Date();//获取当前时间
                now.setDate(now.getDate()-1);//设置天数 -1 天
                if (end > now) {
                    this.addFormVisible = true; // 显示弹窗
                    this.form = {
                        start: info.date,
                        term: new Date(info.date).getTime() + ( 24 * 60 * 60 * 1000),
                        repeat: 'none',
                    };
                    this.dateInfo = info;
                    // info.dayEl.style.backgroundColor = 'red';
                } else {
                    this.$message({
                        type: 'warning',
                        message: "日程已过期,不能再添加！"
                    });
                    info.jsEvent.stopPropagation();
                    info.jsEvent.preventDefault();
                }
            },
            onSelect:function (info) {
                // 时间大于一天旰执行  区分 onEventClick 事件 为避免两都触发
                if(info.end - info.start > 24*60*60*1000){
                    console.log("select",info);
                    if (info.start < new　Date() ){
                        this.$message({
                            type: 'warning ',
                            message: "日程已过期,不能再添加！"
                        });
                        return;
                    }
                    // term
                    // console.log("tt",info.end - info.start);
                    this.form = {
                        start:info.start,
                        term:info.end,
                        repeat:'none',
                    };
                    this.dateInfo = info;
                    this.addFormVisible = true; // 显示弹窗
                }
            },

            // 开始托动
            onDragStart:function (info) {
                console.log("onDragStart",info)
            },
            // 结束托动
            onDragStop:function (info) {
                console.log("onDragStop",info)
            },

            // 拖动停止并且时间已移至不同的日期时间时触发
            onDrop:function (info) {
                //oldEvent
                console.log("onDrop",info)
                // this.onDragVisible=true;
                    let event = info.event;
                    let startDate = info.event.start;
                    let endDate = info.event.end;
                    console.log("start:",startDate," end:",endDate)
                    console.log("myDateEvent",this.myDateEvent);
                    let params = {
                        id:event.id,
                        start:event.start,
                        end:event.end,
                    }
                    if(event.extendedProps.appointmentCount == 0 ){
                        // 没有预约的直接保存 不需要确认
                        this.savePlanEvent(params,(status)=>{
                            // load
                            schedulePlanApi.get({id:params.id}).then(result=>{
                                if(result.code==this.$success){
                                    console.log("ppppp",result)
                                    //
                                    for(let i=0;i<this.myDateEvent.length;i++){
                                        let item = this.myDateEvent[i];
                                        if(item.id==params.id){
                                            item.appointmentList = result.data.appointmentList;
                                            item.operatingInform = result.data.operatingInform;
                                            break
                                        }
                                    }
                                    this.loadPlanList();
                                }else{
                                    this.loadPlanList();
                                }
                            }).catch(err=>{
                                console.log(err);
                            })

                        });
                        return;
                    }
                    this.$confirm('此操作正在移动日程, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.savePlanEvent(params,(status)=>{
                            info.revert();
                            // load
                            schedulePlanApi.get({id:params.id}).then(result=>{
                                if(result.code==this.$success){
                                    console.log("ppppp",result)
                                    //
                                    for(let i=0;i<this.myDateEvent.length;i++){
                                        let item = this.myDateEvent[i];
                                        if(item.id==params.id){
                                            item.appointmentList = result.data.appointmentList;
                                            item.operatingInform = result.data.operatingInform;
                                            break
                                        }
                                    }
                                    this.loadPlanList();
                                }else{
                                    this.loadPlanList();
                                }
                            }).catch(err=>{
                                console.log(err);
                            })

                        });
                    }).catch(() => {
                        info.revert();
                        this.$message({
                            type: 'info',
                            message: '已取消移动'
                        });
                    });
            },

            onLeave:function (info) {
                console.log("onLeave",info)
            },
            onReceive:function (info) {
                console.log("onReceive",info)
            },
            // 开始改变大小
            onResizeStart:function (info) {
                // console.log("onResizeStart",info)
            },
            // 结束改变大小
            onResizeStop:function (info) {
                // console.log("onResizeStop",info);
                // console.log("myDateEvent",this.myDateEvent);
            },
            // 大小改变
            onResize:function (info) {
                let event = info.event
                console.log("onResize",info)
                let params = {
                    id:event.id,
                    start:event.start,
                    end:event.end,
                }
                this.savePlanEvent(params); // 保存
            },
            // 保存
            savePlanEvent:function (params,cb) {
                schedulePlanApi.save(params).then((result=>{
                    if(result.code==this.$success){
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'success',
                            message: result.message || mess||'操作成功'
                        });
                        if(cb)cb(1);
                    }else {
                        let mess = this.getLangServerMess(result.messageCode);
                        this.$message({
                            type: 'error',
                            message: result.message || mess ||"操作失败！"
                        });
                        if(cb)cb(0);
                    }
                })).catch(err=>{
                    console.log(err);
                })
            },
            // 同意或者不同意
            agreeMessigeChange:function(item,status){
                console.log('item.id',item.id);
                console.log('status',status);
                if(this.isEmpty(item.id)){
                    this.$message({
                        type: 'error',
                        message: "ID 为空"
                    });
                    return;
                }
                let prams={
                    planId:item.id,
                    status:status
                }
                scheduleNoticeApi.confirm(prams).then((result)=>{
                    if(result.code==this.$success){
                        console.log('listPage==result',result);
                        this.$message({
                            type: 'success',
                            message: this.getLangServerMess(result.messageCode) || "操作成功"
                        });
                        this.loadPlanList();
                    }else{
                        this.$message({
                            type: 'error',
                            message: this.getLangServerMess(result.messageCode) || "操作失败,请检查！"
                        });
                    }
                    this.loadPlanList();
                }).catch((err)=>{
                    console.log('err',err);
                })


            },

            //取消修改约会
            cancelEditOperate:function (id) {
                // todo 处理
                this.$confirm('此操作将取消日程改变, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    schedulePlanApi.cancelUpdate({id:id}).then((result)=>{
                        console.log('cancelUpdate===result',result);
                        if(result.code==this.$success){
                            this.eventFormVisible=false;
                                    this.$message({
                                        type: 'success',
                                        message: '取消成功!'
                                    });
                                    this.loadPlanList();
                        }else{
                            this.$message({
                                type: 'error',
                                message: '取消失败!'
                            });
                        }
                    }).catch((err)=>{
                        console.log('err',err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        }
    }
</script>


<style lang="scss">
    @import '@fullcalendar/core/main.css';
    @import '@fullcalendar/daygrid/main.css';
    @import '@fullcalendar/daygrid/main.css';
    @import '@fullcalendar/timegrid/main.css';

    .programme_page{
        .color_prop {
            height: 20px;
            border-radius: 4px;
            margin-bottom: 10px;

            &.me { background:#687d56 ;}
            &.friend { background: #f66; }
            &.appointment { background: #ffcb7a; }
            &.change { background:#3998F4 ; }
            &.expire { background: #bbb }
        }

        .diglog_btns {
            text-align: center;

            .diglog_del {
                text-align: center;
                color: #f00;
                font-size: 22px;
                font-weight: bold
            }
        }

    }

</style>
