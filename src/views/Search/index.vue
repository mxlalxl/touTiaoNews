<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      ></van-icon>
      <!-- 搜索组件 -->
      <van-search
        v-fofo
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="inputFn"
        @search="searchFn"
      ></van-search>
    </div>

    <!-- 搜索列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str,kw)"
        @click="suggestClickFn(str)"
      ></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 插槽 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"></van-icon>
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="historyClickFn(str)"
        >{{str}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from "@/api";
import Notify from "@/ui/Notify.js";
import { getStorage, setStorage } from "@/utils/storage.js";
export default {
  name: "Search",
  data() {
    return {
      kw: "", //搜索关键字
      timer: null,
      suggestList: [], //搜索列表
      history: JSON.parse(getStorage("his")) || []
    };
  },
  methods: {
    //   输入框-内容实时改变触发事件方法
    inputFn() {
      clearTimeout(this.timer);
      // 防抖：延时执行逻辑代码，事件再次触发时，清除上一个定时器
      if (this.kw.length === 0) {
        this.suggestList = [];
      } else {
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({
            keywords: this.kw
          });
          // console.log(res);
          this.suggestList = res.data.data.options;
          //   console.log(this.suggestList);
        }, 300);
      }
    },
    // 专门处理字符串高亮关键字
    lightFn(originStr, target) {
      // originStr原始字符串
      // target：关键字
      // 返回替换好的完整字符串
      //   字符串.replace():替换满足条件的第一个字符
      // 字符串.replaceAll():替换所有满足条件的字符
      const reg = new RegExp(target, "ig"); //i忽略大小写，g全局匹配
      //   替换后的值不能用target，会把匹配到的字符都替换为输入框里的值
      try {
        return originStr.replace(reg, match => {
          // console.log(match);
          return `<span style="color: red;">${match}</span>`;
        });
        // ;
        // match就是匹配到的原始的字符串
      } catch (error) {
        // console.log(error);
        Notify({ type: "warning", message: "暂无此数据" });
      }
    },
    // 输入框-搜索事件
    searchFn() {
      // 搜索输入框-保存到历史数组里
      if (this.kw.length > 0) {
        //防止输入框为空，仍然跳转
        this.history.push(this.kw);
        setTimeout(() => {
          this.$router.push({ path: `/search_result/${this.kw}` });
        }, 0);
      }
    },
    // 搜索列表-点击事件
    suggestClickFn(str) {
      // 搜索关键字-保存到历史数组里
      this.history.push(str);
      setTimeout(() => {
        this.$router.push({ path: `/search_result/${str}` });
      }, 0);
    },
    // 历史记录-点击事件
    historyClickFn(str) {
      this.$router.push({ path: `/search_result/${str}` });
    },
    clearFn() {
      this.history = [];
    }
  },
  watch: {
    history: {
      deep: true,
      handler() {
        //   把数组类型转为set类型。set：无序不重复的value集合体
        const theSet = new Set(this.history);
        //   把set类型转为数组类型
        const arr = Array.from(theSet);
        //   立刻覆盖式的保存到本地
        setStorage("his", JSON.stringify(arr));
      }
    }
  }
};
</script>
<style lang="less" scoped>
.search-header {
  height: 86px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /* 后退按钮 */
  .goback {
    padding-left: 14px;
  }
  /* 搜索组件 */
  .van-search {
    flex: 1;
  }
}

// 搜索列表样式
.sugg-list {
  height: 100%;
  font-size: 20px;
  align-content: center;
  .sugg-item {
    padding: 20px 0 0 20px;
  }
}

// 搜索历史样式
.search-icon {
  font-size: 16px;
  line-height: inherit;
}
.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>