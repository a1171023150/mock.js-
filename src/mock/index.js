var Mock = require('mockjs')

const { tableData, fenxiaoshang, orderData } = Mock.mock({
  'tableData|58': [{
    tuikuan: 'TKD@natural',
    leixing:'@pick(["其他退款", "售后退款"])',
    tuihuokuan:'￥@float(100,900, 2, 2)',
    youfei:'￥@float(1,9, 2, 2)',
    heji:'￥@float(101,909, 2,2)',
    fenxiaoshang:'@pick(["分销A", "分销B", "分销C", "总部", "店铺"])',
    zeren:'@pick(["供应商", "顾客", "快递","其他"])',
    sentence:'@csentence(5,20)',
    shouhou:'SH@natural',
    fenxiao: 'FX@natural',
    time: '@datetime("2021-03-dd  HH:mm:ss")'
  }],
  fenxiaoshang:[
    {label: '分销A', value: '分销A'}, 
    {label: '分销B', value: '分销B'}, 
    {label: '分销C', value: '分销C'},
    {label: '分销', value: '分销'},
    {label: '直营', value: '直营'}
  ],
  'orderData|36': [{
    fenxiao: 'FX@natural',
    zhuangtai:'@pick(["已发货"])',
    youfei:'￥@float(10,20, 2, 2)(￥@natural(0,16).00)',
    time: '@datetime("2021-03-dd  HH:mm:ss")'
  }],
})

// 输出结果
// console.log(data);

// 根据url获取参数 封装getQuery
const getQuery = (url,name)=>{
  const index = url.indexOf('?')
  if(index  !== -1) {
    const queryStrArr = url.substr(index+1).split('&')
    for (let i in queryStrArr) {
      const itemArr = queryStrArr[i].split('=')
      if (itemArr[0] === name) {
        return itemArr[1]
      }
    }
  }
  return null
}


// 定义get请求,  翻页功能
Mock.mock(/\/localhost\/api\/tableData/,'get',(options)=>{
  // 获取到传递的参数pageindex，pagesize
  const pageindex = getQuery(options.url,'pageindex')
  const pagesize = getQuery(options.url,'pagesize')
  // 截取数据的起始、终点位置
  const start = (pageindex-1)*pagesize
  const end = pageindex*pagesize
  // 计算总页数
  const totalPage = Math.ceil(tableData.length/pagesize)

  const list = pageindex>totalPage?[]:tableData.slice(start,end)
  return {
    status: 200,
    msg: '成功tableData',
    list: list,
    total: tableData.length
  }
})


// 定义post请求， 增加功能
Mock.mock(/\/localhost\/api\/tableData/,'post',(options)=>{
  const body = JSON.parse(options.body)
  console.log(body);
  tableData.push(Mock.mock({
    tuikuan: 'TKD@natural',
    leixing:'@pick(["其他退款", "售后退款"])',
    tuihuokuan:body.tuihuokuan,
    youfei:'￥@float(2,9, 2, 2)',
    heji:'￥@float(101,909, 2,2)',
    fenxiaoshang:body.fenxiaoshang,
    zeren:'@pick(["供应商", "顾客", "快递","其他"])',
    sentence:body.sentence,
    shouhou:'SH@natural',
    fenxiao: 'FX@natural',
    time: '@datetime("2021-03-dd  HH:mm:ss")'
  }))
  return{
    status: 200,
    message: '添加成功',
    list:tableData,
    total:tableData.length
  }
})



Mock.mock(/\/localhost\/api\/fenxiaoshang/,'get',()=>{
  return {
    status: 200,
    msg: '成功fenxiaoshang',
    list: fenxiaoshang,
    total: fenxiaoshang.length
  }
})

// 选择订单翻页功能
Mock.mock(/\/localhost\/api\/orderData/,'get',(options)=>{
  const pageindex = getQuery(options.url,'pageindex')
  const pagesize = getQuery(options.url,'pagesize')
  const start = (pageindex-1)*pagesize
  const end = pageindex*pagesize
  const totalPage = Math.ceil(orderData.length/pagesize)
  const list = pageindex>totalPage?[]:orderData.slice(start,end)
  return {
    status: 200,
    msg: '成功orderData',
    list: list,
    total: orderData.length
  }
})


// 主页查询功能
Mock.mock(/\/localhost\/api\/queryData/,'post',(options)=>{
  const pageindex = getQuery(options.url,'pageindex')
  const pagesize = getQuery(options.url,'pagesize')
  const start = (pageindex-1)*pagesize
  const end = pageindex*pagesize
  const totalPage = Math.ceil(tableData.length/pagesize)
  
  const body = JSON.parse(options.body)
  console.log(body);
  const queryData = Mock.mock({
    'tableData|2-9': [{
      tuikuan: 'TKD@natural',
      leixing:'@pick(["其他退款", "售后退款"])',
      tuihuokuan:'￥@float(100,900, 2, 2)',
      youfei:'￥@float(1,9, 2, 2)',
      heji:'￥@float(101,909, 2,2)',
      zeren:'@pick(["供应商", "顾客", "快递","其他"])',
      sentence:'@csentence(5,20)',
      time: body.endtime,
      shouhou:body.shouhou,
      fenxiao:body.fenxiao,
      fenxiaoshang:body.distributor,
    }],
  })
  // const list = pageindex>totalPage?[]:tableData.slice(start,end) 
  return{
    status: 200,
    message: '查询成功',
    list:queryData.tableData,
    total:queryData.tableData.length
  }
})


// 订单查询功能
Mock.mock(/\/localhost\/api\/orderQuery/,'post',(options)=>{
  const pageindex = getQuery(options.url,'pageindex')
  const pagesize = getQuery(options.url,'pagesize')
  const start = (pageindex-1)*pagesize
  const end = pageindex*pagesize
  const totalPage = Math.ceil(tableData.length/pagesize)
  
  const body = JSON.parse(options.body)
  console.log(body);
  const orderQuery = Mock.mock({
    'orderData|2-8': [{
      fenxiao: body.fenxiao,
      zhuangtai:'@pick(["已发货"])',
      youfei:'￥@float(10,20, 2, 2)(￥@natural(0,16).00)',
      time: body.endtime,
    }],
  })
  // const list = pageindex>totalPage?[]:tableData.slice(start,end) 
  return{
    status: 200,
    message: '订单查询成功',
    list:orderQuery.orderData,
    total:orderQuery.orderData.length
  }
})