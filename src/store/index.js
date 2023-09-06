import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userPhoto: 'https://img2.woyaogexing.com/2018/11/21/6e4195825d7370dd!400x400_big.webp' // 头像地址（默认头像）
    },
    mutations: {
        SET_USERPHOTO(state, value) {
            state.userPhoto = value
        }
    },
    actions: {},
    modules: {}
})