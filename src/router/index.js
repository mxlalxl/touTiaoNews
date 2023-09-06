import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat'


// 原因：webpack分析入口时，发现router里上来就import所有的页面，所有直接打包进app.js-》很大
// 解决：当路由路径匹配规则时，才现去import对应的组件js文件
// 总结：路由懒加载
// 路由懒加载：为了让第一个页面，加载的app.js更小一点，打开网页更快一点
// 思路：把组件对应的js，拆分成若干个js,路由切换到哪个页面，才加载对应的.js文件

Vue.use(VueRouter)

// 路由表
const routes = [{
        path: '/',
        redirect: '/layout/home'
    },
    {
        path: '/login',
        component: () =>
            import ( /* webpackChunkName: "Login" */ '@/views/Login')
    },
    {
        path: '/layout',
        component: () =>
            import ( /* webpackChunkName: "Layout" */ '@/views/Layout'),
        children: [{
                path: 'home',
                component: () =>
                    import ( /* webpackChunkName: "Home" */ '@/views/Home'),
                meta: {
                    scrollT: 0 //保存首页离开时，滚动条的位置
                }
            },
            {
                path: 'user',
                component: () =>
                    import ( /* webpackChunkName: "User" */ '@/views/User')
            }
        ]
    },
    {
        path: '/search',
        component: () =>
            import ( /* webpackChunkName: "Search" */ '@/views/Search')
    },
    {
        path: '/search_result/:kw',
        component: () =>
            import ( /* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
    },
    { //文章详情页面
        path: '/detail',
        component: () =>
            import ( /* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
    },
    { //用户编辑页面
        path: '/user_edit',
        component: () =>
            import ( /* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
    },
    { //小思同学对话页面
        path: '/chat',
        component: () =>
            import ( /* webpackChunkName: "Chat" */ '@/views/Chat')
    },
    {
        // 用户关注列表页面
        path: '/userfollowings',
        component: () =>
            import ( /* webpackChunkName: "UserFollowings" */ '@/views/User/UserFollowings.vue')
    }

]

const router = new VueRouter({
    routes
})

// 路由-全局前置守卫(在路由发送跳转之前。执行此函数)
router.beforeEach((to, from, next) => {
    // 需求，如果你已经登录了，不要切换到登录页
    if (getToken() && getToken().length > 0 && to.path === '/login') {
        // next(false) //留在原地
        next('/layout/home')
    } else {
        next() //其他情况，通通放行
    }
})

export default router