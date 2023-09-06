import '@/utils/console.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'highlight.js/styles/default.css'
import directiveObj from '@/utils/directive.js'
import '@/VueComponent.js'

// 加载 Vant 全局样式
// import 'vant/lib/index.css'

// 加载全局样式
// import './styles/index.less'
// console.log(process.env);

// 加载动态设置 REM 基准值
import 'amfe-flexible'

Vue.config.productionTip = false



Vue.use(directiveObj)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')