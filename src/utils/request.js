import theAxios from 'axios'
import { Dir } from 'fs';
import router from '@/router'
import Notify from '@/ui/Notify.js'
import { getToken, removeToken, setToken } from '@/utils/token.js'
import { getNewTokenAPI } from '@/api'

const axios = theAxios.create({
    baseURL: 'http://toutiao.itheima.net',
    timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // console.log(config);
    // 在发送请求之前做些什么
    // 目标：统一携带token
    // 判断本地有无token再携带
    if (getToken() && getToken().length > 0 && config.headers.Authorization === undefined) {
        // 如果有token，没有携带Authorization,添加上去，发送请求时就不用再自己配置headers了
        config.headers.Authorization = `Bearer ${getToken()}`
    }

    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, async function(error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.dir(error)
    // console.log(this);
    // console.log(error);


    // 只有401才代表身份过期，需要跳转
    if (error.response.status === 401) {
        // 不能使用this,因为this不是vue组件对象无法调用
        // this.$router.replace('/login')
        // 解决：this.$router是拿router路由对象，这里可以导入进来直接使用

        removeToken() //清除失效token，触发路由守卫，放行到登录页
            // 方式1:强制用户跳转到登录页。用户有感知
            // Notify({ type: 'warning', message: '身份已过期，请重新登录' })

        // 登录未遂地址
        // router.currentRoute为当前路由对象
        // fullPath,路由对象里完整路由路径#后面的一切
        router.replace(`/login?path=${router.currentRoute.fullPath}`)

        //     // 方式2：使用refresh_token换回新的token继续使用，JS代码实现，用户无感知（体验好）
        //     const res = await getNewTokenAPI()
        //         // console.log(res);
        //         // 新的token回来之后，我么们要做的
        //         // 1，在本地更新token
        //     setToken(res.data.data.token)
        //         // 2.在请求头里更新token
        //     error.config.headers.Authorization = `Bearer ${res.data.data.token}`
        //         // 3.未完成的本次请求，再次发起
        //         // error.config就是上一次请求的配置对象
        //     return axios(error.config)


        // } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
        //     // 此时refresh_token也过期了
        //     localStorage.clear() //清除localStorage里的所有值
        //     Notify({ type: 'warning', message: '身份已过期，请重新登录' })
        //     router.replace('/login')

    }
    return Promise.reject(error);
});

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
    return axios({
        url,
        method,
        params,
        data,
        headers
    })
}