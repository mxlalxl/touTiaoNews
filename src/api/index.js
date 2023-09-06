import request from '@/utils/request.js'
import { getToken } from '@/utils/token.js'
import { id } from 'postcss-selector-parser'
import { getStorage } from '@/utils/storage.js'

// 登录
// axios内部，会把参数对象转换成json字符串格式发后台，会自动在请求头里添加 content-Type: 'application/json'

export const loginAPI = ({ mobile, code }) => request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
        mobile,
        code
    }
})

// 用户-刷新token
export const getNewTokenAPI = () => request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
        // 请求拦截器携带的是token,而这次请求的是refresh_token
        //所以在axios请求拦截器里判断，就是为了这种情况
        Authorization: 'Bearer ' + getStorage('refresh_token')
    }
})

// 用户-关注用户
export const userFollowedAPI = ({ userId }) => request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
        target: userId
    }

})

// 用户-取消关注用户
export const userUnFollowedAPI = ({ userId }) => request({
    url: `/v1_0/user/followings/${userId}`,
    method: 'DELETE'
})

// 个人中心

// 获取用户基本信息
export const getUserInfoAPI = () => request({
    url: '/v1_0/user'
})

// 用户-获取个人·资料
export const userProfileAPI = () => request({
    url: '/v1_0/user/profile'
})

// 用户-获取自己关注列表
export const getFollowingsAPI = ({ page = 1, per_page = 10 }) => request({
    url: '/v1_0/user/followings',
    method: 'GET',
    params: {
        page,
        per_page
    }
})

// 用户-更新个人资料
export const updateUserProfileAPI = (dataObj) => {
    // 写法1： 解构赋值，4个判断，以前写过
    // 写法2：直接接收个对象，外面传什么，我接受什么
    // 写法3：上面写法不够语义化，看不出obj里有什么
    const obj = {
        name: '',
        gender: 0,
        birthday: '',
        intro: ''
    }
    for (const prop in obj) { //遍历参数对象的每个key
        if (dataObj[prop] === undefined) { //用key与外面传入的参数对象进行匹配，如果不匹配，证明外面没传这对key,value
            delete obj[prop] //从obj身上移除这对键值对
        } else {
            obj[prop] = dataObj[prop] //否则，就将外面传入的值，保存到obj对象上
        }
    }
    return request({
        url: '/v1_0/user/profile',
        method: 'PATCH', //局部更新，put: 全局更新
        data: obj
    })

}

// 用户-更新头像
export const updateUserPhotoAPI = (fd) => request({
        url: '/v1_0/user/photo',
        method: 'PATCH',
        // Content-type: application/json; axios会自动携带，发给后台，前提：data请求体是对象-》json字符串-》发给后台
        // Content-type: multipart/form-data; 浏览器会自动携带，发给后台，前提：data请求体必须是FormData类型对象
        data: fd //fd是外面一会传过来的 new FormData() 表单对象，此时data不能用{}表示
    })
    // 频道-获取所有的频道
export const getAllChannelListAPI = () => request({
        url: '/v1_0/channels'
    })
    // 获取用户选择的频道
    // 没登陆的，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
    url: '/v1_0/user/channels'
        // headers: {
        //     Authorization: `Bearer ${getToken()}`
        // }
})

// 频道-更新频道列表
export const updateChannelsAPI = ({ channels }) => request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
        channels //用户选择的所有频道数组
    }
})

// 频道-用户删除指定的频道
export const removeTheChannelAPI = ({ channelId }) => request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
})

// 文章-获取文章列表
export const getAllArticleAPI = ({ channel_id, timestamp }) => request({
    url: '/v1_0/articles',
    method: 'GET',
    // headers: {
    //     Authorization: `Bearer ${getToken()}`
    // },
    params: { //这里的参数，axios会自动帮拼接在url？后面 (查询字符串请求；query)
        channel_id,
        timestamp
    }

})

// 文章-反馈不感兴趣
export const dislikeArticleAPI = ({ artId }) => request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    // headers: {
    //     Authorization: `Bearer ${getToken()}`
    // },
    data: {
        target: artId
    }
})

// 文章-举报文章
export const reportArticleAPI = ({ artId, type }) => request({
    url: '/v1_0/article/reports',
    method: 'POST',
    // headers: {
    //     Authorization: `Bearer ${getToken()}`
    // },
    data: {
        target: artId,
        type: type,
        remart: '其他问题的反馈'
    }
})

// 文章-点赞
export const likeArticleAPI = ({ artId }) => request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
        target: artId
    }

})

// 文章-取消点赞
export const UnlikeArticleAPI = ({ artrId }) => request({
    url: `/v1_0/article/likings/${artId}`,
    method: 'DELETE'
})

// 文章-获取评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) => request({
    url: '/v1_0/comments',
    method: 'GET',
    params: {
        // axios针对params参数，如果发现键值对，值为null,会忽略此参数不将其携带在url?后面
        type: 'a', //什么时候需要外面传：此值会变化。此时type的值不变，故写死为a
        source: id,
        offset,
        limit
    }
})

// 文章-评论-喜欢
export const commentLikingAPI = ({ comId }) => {
    return request({
        url: '/v1_0/comment/likings',
        method: 'POST',
        data: {
            target: comId
        }
    })
}

// 文章-评论-不喜欢
export const commentDisLikingAPI = ({ comId }) => {
    return request({
        url: `/v1_0/comment/likings/${comId}`,
        method: 'DELETE'
    })
}

// 文章-评论-发布评论
export const commentSendAPI = ({ id, content, art_id = null }) => {
    // 1.axios中，data请求体传参，如果值为null是不会忽略这个参数的，也会把参数名和值携带给后台
    // 2.形参art_id可选参数，如果逻辑页面是的文章评论，则不需要传递art_id
    // 所以，内部art_id值为null，就证明此时调用，是针对文章评论
    // data请求体对象需要自己处理
    const obj = {
        target: id,
        content
    }
    if (art_id !== null) { //如果本次有第三个参数，证明是对评论进行回复
        obj.art_id = art_id
    }
    return request({
        url: '/v1_0/comments',
        method: 'POST',
        data: obj
    })
}

// 搜索-搜索到的数据列表
export const suggestListAPI = ({ keywords }) => request({
    url: '/v1_0/suggestion',
    params: {
        q: keywords
    }
})

// 搜索结果
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
        url: '/v1_0/search',
        params: {
            page,
            per_page,
            q
        }
    })
    // 文章-文章详情
export const detailAPI = ({ artId }) => request({
    url: `/v1_0/articles/${artId}`
})