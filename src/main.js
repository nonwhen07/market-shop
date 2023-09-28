import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import App from './App.vue'
import router from './router'
import { currency, date } from './methods/filters.js'
import $httpMessageState from './methods/pushMessageState';

// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.config.globalProperties.$filters = {
  currency, date
};
// 此函式的用途是整合 Ajax 的錯誤事件，統一整理發送給予 Toast 處理
app.config.globalProperties.$httpMessageState = $httpMessageState;

app.use(VueAxios, axios)
app.use(router)
app.component('isLoading', Loading)
app.mount('#app')
