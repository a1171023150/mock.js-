<template>
  <div class="home">
    <div class="queryStyle">
      <div>
        <!-- 售后单号： -->
        <span>
          <label class="label-5-width">售后单号：</label>
          <el-input class="input-w--100" v-model="salesOrder" @keyup.enter.native="queryClick" clearable>
          </el-input>
        </span>
        <!-- 分销订单号： -->
        <span>
          <label class="label-5-width"> 分销订单号：</label>
          <el-input class="input-w--100" v-model="distributionOrder" @keyup.enter.native="queryClick" clearable>
          </el-input>
        </span>
        <!-- 分销商： -->
        <span>
          <label class="label-5-width"> 分销商：</label>
          <!-- <c-select-tree v-model="distributor" :data="distributorTreeList" :defaultProps="defaultProps" search></c-select-tree> -->
					<!-- <c-select  v-model="distributor" :data="distributorTreeList" :defaultProps="defaultProps" multiple search ></c-select> -->
          <c-select v-model="distributor" :options="distributorTreeList" multiple search clearable idName="value" labelName="label"></c-select>
        </span>
      </div>
      

      <div class="queryBox">
      <!-- 查询 -->
        <c-button style="width:44px" type="primary" @click="queryClick">查 询</c-button>
      <!-- 重置 -->
        <c-button style="width:44px" @click="resetClick">重 置</c-button>
      </div>
    </div>
   
    <!-- 退款时间 -->
    <span class="queryTime">
      <label class="label-4-width"> 退款时间：</label>
      <el-date-picker class="time-input" size="mini" v-model="startTime" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" default-time="00:00:00" type="datetime" placeholder="开始时间">
      </el-date-picker>
      -
      <el-date-picker class="time-input" size="mini" v-model="endTime" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" default-time="23:59:59" type="datetime" placeholder="结束时间">
      </el-date-picker>
    </span>

    <div class="newPage">

    <!-- 新增退款单 -->
      <add-form @pageTotal="newTotal"/>
    <!-- 翻页 -->
      <c-pagination  :page='pageNo'  :total='total'  :pageSize='pageSize'  @pageChange='pageChange'/>
    </div>
    
    <!-- 表格 -->
      <refund-form :table-data='tableData'/>
   
  </div>
</template>

<script>

import mock from '@/mock'
import axios from 'axios'
import addForm from './addForm'
import refundForm from './refundForm'

export default {
  name: 'Home',
  components: {
    addForm,
    refundForm
  },
  data() {
    return {
      // 售后单号
      salesOrder:undefined,
      // 分销订单号
      distributionOrder:undefined,
      // 分销商
      distributor: [],
      distributorTreeList: [
      ],
      // 退款时间
      startTime: undefined,
      endTime: undefined,

      // 翻页
      pageNo: 1,
      total: 0,
      pageSize: 10,
      
      // 翻页表格数据
      tableData:[],
     
    
    }
  },
    methods: {
      // 查询请求
    queryClick() {
      
      axios.post('/localhost/api/queryData',{
        shouhou:this.salesOrder,
        fenxiao:this.distributionOrder,
        fenxiaoshang:this.distributor,
        startTime:this.startTime,
        endtime:this.endTime,
        params: {
          pageindex: this.pageNo,
          pagesize: this.pageSize,
        }
      }).then(res=>{
        // 查询表格数据
        this.tableData = res.data.list;
        //查询条数 
        this.total = res.data.total;
        this.pageNo = 1;
        
      })
    },

    // 重置
    resetClick() {
      this.salesOrder = undefined,
      this.distributionOrder = undefined,
      this.distributor = undefined, 
      this.startTime = undefined, 
      this.endTime = undefined
    },
   
    // 翻页
    pageChange ({ size, page }) {
      this.pageSize = size
      this.pageNo = page
      // this.getTable()
      //  请求表格数据
    axios.get('/localhost/api/tableData',{
      params: {
        pageindex: this.pageNo,
        pagesize: this.pageSize,
      }
    }).then(res => {
      this.tableData = res.data.list;
    })
    },
    //total总条数
    newTotal(res){
      this.total = res;
    }
  },
  created() {
    // 请求分销商数据
    axios.get('/localhost/api/fenxiaoshang')
    .then(res => {
      this.distributorTreeList = res.data.list
    }),

      // 请求分页数据 
    // 请求表格数据
    axios.get('/localhost/api/tableData',{
      params: {
        pageindex:1,
        pagesize:10,
      }
    }).then(res => {
      this.total = res.data.total
      this.tableData = res.data.list
    })
  
    
  }
}
</script>

<style lang="scss" scoped>
// 查询样式
.queryStyle {
  display: flex;
  justify-content: flex-start;
  margin: 8px;
}
// 退款时间
.queryTime {
  margin-left: 8px;
}
.time-input {
  width: 130px !important;
}
// 新增+翻页样式
.newPage {
  display: flex;
  margin: 10px;
  justify-content:space-between;
}

</style>