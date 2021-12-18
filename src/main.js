import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入全局样式表
import '@/style/css/global.css'
// 导入 axios
import axios from 'axios'

// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:8080/warehousesmanagement/'
// 给请求头加上 token
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
