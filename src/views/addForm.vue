<template>
  <div>

    <!-- 新增退款单 -->
    <c-dialog
    title="新增退款单"
    :show='show'
    :width='380'
    confirmBtnText='保 存'
    cancelBtnText='取 消'
    @close='show=false'
    @cancel='show=false'
    @confirm='confirm'
    @change="change"
    >
      <div class="newAddDialog">
        <span style="margin:8px">
          <span style="color:red;margin-left:1em">*</span><span>分销商：</span>
          <c-select-input v-model="distributor" :list="distributorTreeList" labelName="label" width=240 :defaultProps="defaultProps" empty ></c-select-input>
        </span>
        <span style="margin:8px">
          <span style="color:red">*</span><span>关联订单：</span>
          <c-input v-model="guanlianOrder" more close width='240' @click="more">
          </c-input>
        </span>
        <span style="margin:8px">
          <span style="color:red">*</span><span>退款金额：</span>
          <el-input style="width:240px" v-model="refundMoney" clearable>
          </el-input> 
        </span>
        <span style="margin:8px">
          <span style="color:red">*</span><span>退款原因：</span>
          <el-input style="width:240px" v-model="refundReason" clearable>
          </el-input>
        </span>
      </div>
    
    </c-dialog>


    <!-- 新增退款单提示弹窗 -->
    <!-- <c-dialog
    title="提示"
    :show='showWarning' 
    :width='380'
    confirmBtnText='确 定'
    cancelBtnText="取 消"
    @close='showWarning=false'
    @confirm='showWarning=false'
    @cancel='showWarning=false'>
    <span>
      <svg style="position: relative;
                   left: 65px;
                   top: 5px;" t="1616149158764" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4756" width="45" height="45"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512-230.4-512-512-512zM448 256h128v128H448V256z m192 512H384v-64h64V512H384V448h192v256h64v64z" fill="#1296db" p-id="4757"></path></svg>
      <span style="position: relative;
                   left: 90px;
                   top: -11px;">带<span style="color:red">*</span>项为必填项</span>
    </span>
    </c-dialog> -->
    

    <!-- 选择更多订单 -->

    <!-- <choose-order :show-order="showOrder" @hejia='refund'/> -->
    <div>
      <c-dialog
      title="选择订单"
      :show='showOrder' 
      :width='800'
      confirmBtnText='确 定'
      cancelBtnText="取 消"
      @close='showOrder=false'
      @cancel='showOrder=false'>
      <div class="query">
        <div>
          <!-- 下单时间 -->
          <span>
            <label class="label-4-width"> 下单时间：</label>
            <el-date-picker class="time-input" size="mini" v-model="startTime" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" default-time="00:00:00" type="datetime" placeholder="开始时间">
            </el-date-picker>
            -
            <el-date-picker class="time-input" size="mini" v-model="endTime" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" default-time="23:59:59" type="datetime" placeholder="结束时间">
            </el-date-picker>
          </span>
          <!-- 分销订单号 -->
          <span>
            <label class="label-5-width"> 分销订单号：</label>
            <el-input class="input-w--100" v-model="distributionOrder" @keyup.enter.native="queryClick" clearable>
            </el-input>
          </span>
        </div>
        

        <div class="queryBox">
        <!-- 查询 -->
          <c-button style="width:44px" type="primary" @click="queryClick">查 询</c-button>
        <!-- 重置 -->
          <c-button style="width:44px" @click="resetClick">重 置</c-button>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="page">
        <c-pagination  :page='pageNo'  :total='total'  :pageSize='pageSize'  @pageChange='pageChange'></c-pagination>
      </div>
      <!-- 表格 -->

      <vxe-table
        border
        ref="xTable1"
        :data="orderData"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        size="mini"
        height="300px"
        stripe
        resizable
        column-key
        show-overflow="title"
        show-header-overflow="title"
        sync-resize
        auto-resize
        :sort-config="{orders:['asc', 'desc'],trigger:'cell'}"
        :checkbox-config="{reserve: true}"
        highlight-current-row
        highlight-hover-row
        row-id="_xid"
        align="center"
        header-align="center">
        <vxe-table-column type="seq" width="40" align="center" fixed="left">
          <template v-slot:header>
            <i class="el-icon-more" style="transform: rotate(90deg)"></i>
          </template>
        </vxe-table-column>
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column field="fenxiao" title="分销订单号"></vxe-table-column>
        <vxe-table-column field="zhuangtai" title="系统单状态"></vxe-table-column>
        <vxe-table-column field="youfei" title="分销实付(分销邮费)"></vxe-table-column>
        <vxe-table-column field="time" title="下单时间" show-overflow></vxe-table-column>
      </vxe-table>
      </c-dialog>
    </div>

  </div>
</template>

<script>
import mock from '@/mock'
import axios from 'axios'

// import chooseOrder from './chooseOrder'

export default {
  name: 'AddFrom',
  props: {
    show: {
      type:Boolean,
      default:true,
    }
  },
  components: {
    // chooseOrder,
  },
  data () {
    return {
      // 保存show的值
      IsShow: this.show,
      // 关联订单
      guanlianOrder:undefined,
      showOrder:false,
      // 退款金额
      refundMoney:undefined,
      // 退款原因
      refundReason:"",
      // 分销商
      distributor: undefined,
      distributorTreeList: [
        {label: '1', value: 1,}
      ],
      defaultProps: {
        label: 'label',
        value: 'value',
      },
    // 更多订单
      showOrder:false,
    // 下单时间
      startTime: undefined,
      endTime: undefined,
    // 分销订单号
      distributionOrder:undefined,
    // 分页
      pageNo: 1,
      total: 0,
      pageSize: 10,
    // 表格
      orderData: [],
      heji:''
    }
  },
  computed: {
    
  },
  // 监听show的状态
  watch: {
    show(val){
      this.IsShow=val
    }
  },
  
  methods: {
    // 退款金额
    refund(data) {
      this.refundMoney = data
    },
    // 保存按钮
    confirm() {
      if (!this.distributor) {
        this.$cMsgBox.show('请选择分销商')
        return
      }
      if (!this.guanlianOrder) {
        this.$cMsgBox.show('请选择关联订单')
        return
      }
      if (!this.refundMoney) {
        this.$cMsgBox.show('请填写退款金额')
        return
      }
      if (!this.refundReason) {
        this.$cMsgBox.show('请填写退款原因')
        return
      }
    // 保存数据 post请求
       axios.post('/localhost/api/tableData',{
        fenxiaoshang:this.distributor,
        tuihuokuan:this.refundMoney,
        sentence:this.refundReason
      }).then(res=>{
        console.log(res);
        console.log(res.data.total);
        this.$emit("pageTotal",res.data.total)
        // this.$bus.$emit("tableData",tabledata)
      }) 
    },

    //关联订单更多按钮
    more() {
      console.log("更多");
      if (!this.distributor) {
        this.$cMsgBox.show('请先选择分销商')
        return
      }
        this.showOrder = true;
    },
    
    // 通知父组件关闭弹窗
    cancel () {
      this.$emit('close',this.show)
    },
    close () {
      this.$emit('close',this.show)
    },

    change(e) {
      this.$emit('change', e)
    },


    // 更多订单

     // 查询
    queryClick() {
       axios.post('/localhost/api/orderQuery',{
        fenxiao:this.distributionOrder,
        endtime:this.endTime,
        params: {
        pageindex: this.pageNo,
        pagesize: this.pageSize,
      }
      }).then(res=>{
        // 查询表格数据
        console.log(res);
        this.orderData = res.data.list
        //查询条数 
        this.total = res.data.total
      })
    },

    // 重置
    resetClick() {
      // 重置
      this.distributionOrder = undefined,
      this.startTime = undefined, 
      this.endTime = undefined
 
    },

    // 分页
    pageChange ({ size, page }) {
      this.pageSize = size
      this.pageNo = page
      // this.getTable()
         // 请求表格数据
      axios.get('/localhost/api/orderData',{
      params: {
        pageindex:this.pageNo,
        pagesize:this.pageSize,
      }
      }).then(res => {
        console.log(res);
        this.orderData = res.data.list
      })
    },
    // getTable(){},
    // 表格
    selectAllEvent ({ checked, records }) {
      console.log(checked ? '所有勾选事件' : '所有取消事件', records)
    },
    selectChangeEvent ({ records }) {
      for( let i in records){
          this.heji+=parseFloat (records[i].youfei.slice(1,5))
        }
        console.log(this.heji);
        console.log( parseFloat( records[0].youfei.slice(1,5) )+ parseFloat(records[1].youfei.slice(1,5)));
 
      
    },
    getSelectEvent () {
      let selectRecords = this.$refs.xTable1.getCheckboxRecords()
      this.$XModal.alert(selectRecords.length)
    },
  },

  created () {
    // 获取分销商
    axios.get('/localhost/api/fenxiaoshang')
    .then(res => {
      this.distributorTreeList = res.data.list
    })
    // 请求更多订单表格数据
    axios.get('/localhost/api/orderData',{
      params: {
        pageindex:1,
        pagesize:10,
      }
    }).then(res => {
      this.orderData = res.data.list
      this.total = res.data.total
    })
  },
}
</script>

<style lang="scss" scoped>

.newAddDialog {
  display: flex;
  flex-direction :column;
}


// 更多订单样式
/* 顶部查询样式 */
.query {
  display: flex;
  justify-content: flex-start;
  margin: 8px;
}
/* 时间input样式 */
.time-input {
  width: 110px !important;
}
/* 分页 */
.page {
  margin: 8px;
}
</style>
