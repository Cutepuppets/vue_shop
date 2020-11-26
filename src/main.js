import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
//引入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
//导入并挂载axios
Vue.prototype.$http = axios
Vue.config.productionTip = false
//程序启动的入口JS
//挂载导入的路由和渲染导入的App跟组件页面
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
