<template>
  <div>
    <!-- 问题1：网页刚打开，created和onload里面的请求同时发送，请求的都是最新数据 -->
    <!-- 在onload中，两次一样的数据合并，数据重复，key重复了 -->
    <!-- 原因：van-list组件，组件挂载时，默认就会判断一次是触底 -->
    <!-- 解决办法1:list组件添加：:immediate-check="false" 上来初始化时不用判定 -->
    <!-- 2：在onload第一行加一个list数组长度判断 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @dislikeEV="dislikeFn"
          @reportEV="reportFn"
          @click.native="itemClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import ArticleItem from "@/components/ArticleItem.vue";
import { getAllArticleAPI, dislikeArticleAPI, reportArticleAPI } from "@/api";
import Notify from "@/ui/Notify.js";

export default {
  components: {
    ArticleItem
  },
  props: {
    // list: Array
    channelId: Number
  },
  data() {
    return {
      list: [], //文章列表数组
      loading: false,
      finished: false,
      theTime: new Date().getTime(),
      isLoading: false
    };
  },
  async created() {
    this.getArticleListFn();
  },
  methods: {
    // 上拉加载更多
    async onLoad() {
      this.getArticleListFn();
    },
    async getArticleListFn() {
      const res = await getAllArticleAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      });

      this.list = [...this.list, ...res.data.data.results];
      this.theTime = res.data.data.pre_timestamp;
      this.loading = false; //如果不关，底部一直是加载状态，不会再触发onload事件

      if (res.data.data.pre_timestamp === null) {
        //本次请求的最后一页数据，没有更多数据了
        this.finished = true;
        return;
      }

      // 顶部加载状态改为false
      this.isLoading = false;
    },

    // 下拉刷新
    async onRefresh() {
      this.list = [];
      this.theTime = new Date().getTime();

      this.getArticleListFn();
    },

    // 反馈-不感兴趣
    async dislikeFn(id) {
      // try+catch捕获同步代码的异常
      try {
        await dislikeArticleAPI({
          artId: id
        });
        // console.log(id);

        // console.log(res);
        Notify({ type: "success", message: "反馈成功" });
        console.log("成功了");
      } catch (error) {
        console.log("失败了");
      }
    },

    // 反馈-举报文章
    async reportFn(id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      });
      Notify({ type: "success", message: "举报成功" });
    },
    // 文章-点击事件-跳转到文章详情
    itemClickFn(id) {
      // console.log("123");
      this.$router.push({
        path: `/detail?art_id=${id}`
      });
    }
  }
};
</script>
<style lang="">
</style>