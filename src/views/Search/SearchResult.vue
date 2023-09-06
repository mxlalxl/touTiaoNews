<template>
  <div>
    <!-- 搜索结果，头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退结果 -->
      <van-nav-bar class="nav-bar" title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed></van-nav-bar>
    </div>
    <!-- 搜索结果-数据渲染 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <ArticleItem
        v-for="obj in articleList"
        :key="obj.art_id"
        :artObj="obj"
        :isShow="false"
        @click.native="itemClickFn(obj.art_id)"
      ></ArticleItem>
    </van-list>
  </div>
</template>
<script>
import { searchResultAPI } from "@/api";
import ArticleItem from "@/components/ArticleItem.vue";
export default {
  name: "SearchResult",
  data() {
    return {
      page: 1,
      articleList: [],
      // list: [],
      loading: false,
      finished: false
    };
  },
  async created() {
    const res = await searchResultAPI({ q: this.$route.params.kw });
    // console.log(res);
    // console.log(this);
    this.articleList = res.data.data.results;
  },
  methods: {
    async onLoad() {
      if (this.articleList.length > 0) {
        this.page++;
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw
        });
        // console.log(res);
        // console.log(this);
        if (res.data.data.results.length === 0) {
          this.finished = true;
          return;
        }
        this.articleList = [...this.articleList, ...res.data.data.results];
        this.loading = false;
      }
    },
    // 文章-点击事件-跳转到文章详情
    itemClickFn(id) {
      // console.log("123");
      this.$router.push({
        path: `/detail?art_id=${id}`
      });
    }
  },
  components: {
    ArticleItem
  }
};
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
  padding-bottom: 46px;
}
</style>