<template>
  <div>
    <!-- Header区域 -->
    <van-nav-bar title="你的关注" left-arrow @click-left="$router.back()"></van-nav-bar>

    <!-- 评论列表 -->
    <div class="cmt-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的item项 -->
        <div class="cmt-item" v-for="obj in followings" :key="obj.id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img class="avatar" :src="obj.photo" />
              <span class="uname">{{obj.name}}</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import { getFollowingsAPI } from "@/api";
import Notify from "@/ui/Notify.js";
export default {
  data() {
    return {
      followings: [],
      loading: false,
      finished: false,
      lastId: ""
    };
  },
  async created() {
    const res = await getFollowingsAPI({});
    // console.log(res);
    if (res.data.data.total_count === 0) {
      Notify({ type: "warning", message: "您当前还未关注用户，快去关注吧！" });
      return;
    }
    this.followings = res.data.data.results;
    // console.log(this.followings);
  },
  methods: {
    onLoad() {}
  }
};
</script>
<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    border-bottom: 1px solid #efefef;
    .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
</style>