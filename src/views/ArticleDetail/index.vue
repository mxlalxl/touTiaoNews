<template>
  <div>
    <van-loading size="24px" color="#0094ff" v-if="Object.keys(artObj).length === 0">加载中...</van-loading>
    <div v-else>
      <!-- header区域 -->
      <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()"></van-nav-bar>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <div class="article-title">{{artObj.title}}</div>
        <!-- 用户信息 -->
        <van-cell center :title="artObj.aut_name" :label="formatDate(artObj.pubdate)">
          <template #icon>
            <img :src="artObj.aut_photo" alt class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="artObj.is_followed"
                @click="followedFn(true)"
              >已关注</van-button>
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                v-else
                @click="followedFn(false)"
              >关注</van-button>
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>
        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>
        <!-- 分割线 -->
        <van-divider>End</van-divider>
        <!-- 点赞 -->
        <div class="like-box">
          <!-- 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 -->
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="artObj.attitude === 1"
            @click="loveFn(true)"
          >已点赞</van-button>
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="loveFn(false)"
          >点赞</van-button>
        </div>
      </div>

      <!-- 评论区域 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>
<script>
import CommentList from "@/views/ArticleDetail/CommentList.vue";
import {
  detailAPI,
  userFollowedAPI,
  userUnFollowedAPI,
  UnlikeArticleAPI,
  likeArticleAPI
} from "@/api";
import { timeAgo } from "@/utils/dayjs.js";
export default {
  name: "Detail",
  data() {
    return {
      artObj: {}
    };
  },
  components: {
    CommentList
  },
  async created() {
    const res = await detailAPI({
      artId: this.$route.query.art_id
    });
    // console.log(res);
    this.artObj = res.data.data;
    // console.log(this.artObj);
  },
  methods: {
    formatDate: timeAgo,
    // 关注/取关-》对作者
    // 注意！！ 用自己的手机号登录。若用同一个账号登录别人的操作会影响你
    async followedFn(bool) {
      if (bool === true) {
        // 用户点在已关注按钮上
        // 页面需要显示“关注”按钮
        this.artObj.is_followed = false;
        // 向后台调接口--取关用户
        const res = await userUnFollowedAPI({
          userId: this.artObj.aut_id
        });
        // console.log(res);
      } else {
        // 用户点在关注按钮上
        // 页面需要显示“已关注”按钮
        this.artObj.is_followed = true;
        // 向后台调接口--关注用户
        const res = await userFollowedAPI({
          userId: this.artObj.aut_id
        });
        // console.log(res);
      }
    },
    // 点赞/取消点赞-》对文章
    async loveFn(bool) {
      if (bool === true) {
        this.artObj.attitude = 0;
        const res = await UnlikeArticleAPI({
          artId: this.artObj.art_id
        });
      } else {
        this.artObj.attitude = 1;
        const res = await likeArticleAPI({
          artId: this.artObj.art_id
        });
      }
    }
  }
};
</script>
<style lang="less">
.article-container {
  padding: 10px;
  margin-top: 86px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
  height: 100%;
}
.art-content {
  font-size: 25px;
  line-height: 35px;
  width: 100%;
  // height: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  h2 {
    margin-block-start: 0px;
    font-size: 40px !important;
    line-height: 45px !important;
  }
}
.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}
.like-box {
  display: flex;
  justify-content: center;
}
.van-loading {
  text-align: center;
  padding-top: 86px;
}
</style>