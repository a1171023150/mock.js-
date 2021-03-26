<template lang="pug">
 div
  vxe-table(border='' :data='tableData' size='mini' height='600px' stripe='' resizable='' column-key='' show-overflow='title' show-header-overflow='title' sync-resize='' auto-resize='' :sort-config="{orders:['asc', 'desc'],trigger:'cell'}" :checkbox-config='{reserve: true}' highlight-current-row='' highlight-hover-row='' row-id='_xid' ref='xTable' align='center' header-align='center')
    vxe-table-column(type='seq' width='40' align='center' fixed='left')
      template(v-slot:header='')
        i.el-icon-more(style='transform: rotate(90deg)')
    vxe-table-column(field='tuikuan' title='退款单号' sortable='')
    vxe-table-column(field='leixing' title='退款类型' sortable='')
    vxe-table-column(field='tuihuokuan' title='退货款' sortable='')
      template(v-slot:edit='{ row }')
        vxe-input(type='number' v-model='row.tuihuokuan')
      template(v-slot='{ row }') ￥{{ row.tuihuokuan}}
    vxe-table-column(field='youfei' title='退邮费' sortable='')
      template(v-slot:edit='{ row }')
        vxe-input(type='number' v-model='row.youfei')
      template(v-slot='{ row }') ￥{{ row.youfei}}
    vxe-table-column(field='heji' title='退款合计' sortable='')
      template(v-slot:edit='{ row }')
        vxe-input(type='number' v-model='row.heji')
      template(v-slot='{ row }') ￥{{((parseFloat(row.youfei) + parseFloat(row.tuihuokuan)).toFixed(2))}}
    vxe-table-column(field='fenxiaoshang' title='分销商' sortable='')
    vxe-table-column(field='zeren' title='责任方' sortable='')
    vxe-table-column(field='sentence' title='退款原因' sortable='')
    vxe-table-column(field='shouhou' title='售后单号' sortable='')
    vxe-table-column(field='fenxiao' title='分销订单号' sortable='')
    vxe-table-column(field='time' title='退款时间' sortable='')
</template>

<script>
export default {
  props: {
    tableData:Array
  },
}
</script>