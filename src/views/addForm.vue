<template lang="pug">
div
  c-icon-select(@click='showDialog')
    template
      i.el-icon-circle-plus  
      span  新增退款单
  //- 新增退款单
  c-dialog(title='新增退款单' :show='show' :width='380' confirmbtntext='保 存' cancelbtntext='取 消' @close='show=false' @cancel='show=false' @confirm='saveConfirm')
    .newAddDialog
      span(style='margin:8px')
        span(style='color:red;margin-left:1em') *
        span 分销商：
        c-select(v-model='distributor' :options='distributorTreeList' multiple='' search='' width='240px' idname='value' labelname='label')
      span(style='margin:8px')
        span(style='color:red') *
        span 关联订单：
        c-input(v-model='guanlianOrder' more close width='240' @click='more')
      span(style='margin:8px')
        span(style='color:red') *
        span 退款金额：
        el-input(style='width:240px' v-model='refundMoney' clearable='')
      span(style='margin:8px')
        span(style='color:red') *
        span 退款原因：
        el-input(style='width:240px' v-model='refundReason' clearable='')
  //- 选择更多订单
  div
    c-dialog(title='选择订单' :show='showOrder' :width='800' confirmbtntext='确 定' cancelbtntext='取 消' @close='showOrder=false' @cancel='showOrder=false' @confirm='sureConfirm')
      .query
        div
          //- 下单时间
          span
            label.label-4-width  下单时间：
            el-date-picker.time-input(size='mini' v-model='startTime' value-format='yyyy-MM-ddTHH:mm:ss.000+0800' default-time='00:00:00' type='datetime' placeholder='开始时间')
            |             -
            el-date-picker.time-input(size='mini' v-model='endTime' value-format='yyyy-MM-ddTHH:mm:ss.000+0800' default-time='23:59:59' type='datetime' placeholder='结束时间')
          //- 分销订单号
          span
            label.label-5-width  分销订单号：
            el-input.input-w--100(v-model='distributionOrder' @keyup.enter.native='queryClick' clearable='')
        .queryBox
          //- 查询
          c-button(style='width:44px' type='primary' @click='queryClick') 查 询
          //- 重置
          c-button(style='width:44px' @click='resetClick') 重 置
      //- 分页
      .page
        c-pagination(:page='pageNo' :total='total' :pagesize='pageSize' @pagechange='pageChange')
      //- 表格
      vxe-table(border='' ref='xTable1' :data='orderData' @checkbox-all='selectAllEvent' @checkbox-change='selectChangeEvent'
      size='mini' height='300px' stripe='' resizable='' column-key='' show-overflow='title' show-header-overflow='title' 
      sync-resize='' auto-resize='' :sort-config="{orders:['asc', 'desc'],trigger:'cell'}" :checkbox-config='{reserve: true}' 
      highlight-current-row='' highlight-hover-row='' row-id='_xid' align='center' header-align='center')
        vxe-table-column(type='seq' width='40' align='center' fixed='left')
          template(v-slot:header='')
            i.el-icon-more(style='transform: rotate(90deg)')
        vxe-table-column(type='checkbox' width='60')
        vxe-table-column(field='fenxiao' title='分销订单号')
        vxe-table-column(field='zhuangtai' title='系统单状态')
        vxe-table-column(field='shifu' title='分销实付(分销邮费)')
          template(v-slot:edit='{ row }')
            vxe-input(type='number' v-model='row.shifu')
          template(v-slot='{ row }') ￥{{ row.shifu}} (￥{{row.youfei}})
        vxe-table-column(field='time' title='下单时间' show-overflow='')
</template>

<script>
import mock from '@/mock'
import axios from 'axios'

export default {
  name: 'AddFrom',
  data () {
    return {
      show: false,
      // 关联订单
      guanlianOrder:'',
      showOrder: false,
      // 退款金额
      refundMoney:'',
      // 退款原因
      refundReason: undefined,
      // 分销商
      distributor:[],
      distributorTreeList: [],
      // 更多订单
      showOrder:false,
      // 下单时间
      startTime: undefined,
      endTime: undefined,
      // 分销订单号
      distributionOrder: undefined,
      // 分页
      pageNo: 1,
      total: 0,
      pageSize: 10,
      // 表格
      orderData: [],
      // heji:''
      // 选择row
      aRecords:[],
    }
  },
  
  methods: {
    // 新增退款单
    showDialog () {
      this.show = true;
      // this.distributor = "";
      this.guanlianOrder = '';
      this.refundMoney = '';
      this.refundReason = undefined
    },
    // 退款金额
    refund(data) {
      this.refundMoney = data
    },
    // 保存按钮
    saveConfirm() {
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
        youfei:this.refundMoney,
        sentence:this.refundReason
      }).then(res=>{
        this.$emit("pageTotal",res.data.total)
      }) 
        this.show = false;

        // 表格数据请求 
        axios.post('/localhost/api/queryData',{
        params: {
        pageindex: this.pageNo,
        pagesize: this.pageSize,
        }
      }).then(res=>{
        // 查询表格数据
        this.tableData = res.data.list
        //查询条数 
        this.total = res.data.total
      })

    },

    //关联订单更多按钮
    more() {
      // console.log("更多");
      if (!this.distributor) {
        this.$cMsgBox.show('请先选择分销商')
        return
      }
        this.showOrder = true;

        this.guanlianOrder = '';
        this.refundMoney = '';
        this.refundReason = undefined
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
    // 表格
    selectAllEvent({ checked, records }) {
      console.log(checked ? '所有勾选事件' : '所有取消事件', records)
       this.aRecords = records
    },
    getSelectEvent() {
      let selectRecords = this.$refs.xTable1.getCheckboxRecords()
      this.$XModal.alert(selectRecords.length)
    },
    selectChangeEvent({ records }) {
      this.aRecords = records
    },

    // 确定按钮
    sureConfirm() {

      let amount = 0
      let arr = []
      this.aRecords.forEach((val,i) => {
        arr += (val.fenxiao)+' '
        amount += parseFloat(val.youfei)
      });
        this.refundMoney = amount.toFixed(2)
        this.guanlianOrder = arr
        // this.guanlianOrder = arr.join()
        this.showOrder = false;

        // this.guanlianOrder = this.aRecords.map(item => {
        //   return item.tradeNo
        // }).join()
    }
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
i {
  color: #558364;
}
</style>
