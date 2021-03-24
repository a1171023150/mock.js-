import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 万里牛组件
import calfElementDorado from 'calf-element-dorado';
Vue.use(calfElementDorado)

// 饿了么组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// vxe-table组件
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(VXETable)


Vue.config.productionTip = false
Vue.prototype.$bus=new Vue()
// Vue.prototype.$EventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
