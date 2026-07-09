import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 导入pinia状态管理器
import * as Pinia from 'pinia';
// pinia持久化插件
import persist from 'pinia-plugin-persistedstate'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()
  pinia.use(persist)
  app.use(pinia);
  return {
    app,
	Pinia
  }
}
// #endif