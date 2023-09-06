<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{'art-cmt-container-1': isShowCmtBox, 'art-cmt-container-2': !isShowCmtBox}"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的item项 -->
        <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt class="avatar" />
              <span class="uname">{{obj.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking === true"
                @click="likeFn(true, obj)"
              ></van-icon>
              <van-icon name="like-o" size="16" color="gray" v-else @click="likeFn(false)"></van-icon>
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{obj.content}}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{timeAgo(obj.pubdate)}}</div>
        </div>
      </van-list>
    </div>

    <!-- 发表评论容器 -->
    <div>
      <!-- 底部评论区域--短 --1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox === true">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()"></van-icon>
        <div class="ipt-cmt-div" @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0? '':totalCount" max="99">
            <van-icon name="comment-o" size="0.533333334rem" @click="commentClickFn"></van-icon>
          </van-badge>
          <van-icon name="star-o" size="0.533333334rem"></van-icon>
          <van-icon name="share-o" size="0.533333334rem"></van-icon>
        </div>
      </div>
      <!-- 底部评论区域--长 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="blurFn" v-model="comText"></textarea>
        <van-button type="default" :disabled="comText.length === 0" @click="sendFn">发布</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  commentsListAPI,
  commentDisLikingAPI,
  commentLikingAPI,
  commentSendAPI
} from "@/api";
import { timeAgo } from "@/utils/dayjs.js";
export default {
  data() {
    return {
      offset: null,
      commentArr: [],
      isShowCmtBox: true,
      totalCount: 0, //评论条数
      comText: "",
      loading: false,
      finished: false,
      lastId: ""
    };
  },
  async created() {
    const res = await commentsListAPI({
      id: this.$route.query.art_id
    });
    // console.log(res);
    this.commentArr = res.data.data.results;
    this.totalCount = res.data.data.total_count;
    this.lastId = res.data.data.last_id; //用于分页

    // 网页打开--没有评论，让其显示没有更多了
    if (res.data.data.results.length === 0) {
      this.finished = true;
    }
  },
  methods: {
    timeAgo,
    async likeFn(bool, commentObj) {
      if (bool === true) {
        // 用户点在红心，取消点赞
        commentObj.is_liking = false;
        await commentDisLikingAPI({
          comId: commentObj.com_id
        });
      } else {
        //   用户点在了灰心上--点赞
        commentObj.is_liking = true;
        await commentLikingAPI({
          comId: commentObj.com_id
        });
      }
    },
    toggleShowFn() {
      this.isShowCmtBox = false;
    },
    // 评论滚动到顶部
    commentClickFn() {
      // js做动画：计时器间隔时间，修改目标状态。动画实现的JS原生代码，在配置资料txt文件
      // 比较方便的动画：原生标签.scrollIntoView(),让原生的标签滚到屏幕的最上面
      // 为何选择like-box，不选第一条评论，因为会被头部导航挡住
      document.querySelector(".like-box").scrollIntoView({
        behavior: "smooth"
      });
    },
    // 输入框--失去焦点
    blurFn() {
      //问题：点击发布按钮，发现点击事件不执行
      // 原因：高的评论容器-在点击发布的一瞬间，输入框失去了焦点，被v-if和v-else移除了整个标签
      // 解决：失去焦点时，变量值，在最后执行
      setTimeout(() => {
        this.isShowCmtBox = true;
      }, 0);
    },

    // 发布按钮-点击事件
    async sendFn() {
      //   console.log(this.comText);
      const res = await commentSendAPI({
        id: this.$route.query.art_id,
        content: this.comText
      });
      console.log(res);
      this.commentArr.unshift(res.data.data.new_obj);
      this.totalCount++;
      this.comText = "";
      this.commentClickFn(); //滚到到第一条评论处
    },
    // 加载更多评论
    async onLoad() {
      if (this.commentArr.length > 0) {
        const res = await commentsListAPI({
          id: this.$route.query.art_id, //文章id
          offset: this.lastId
        });
        // console.log(res);
        this.commentArr = [...this.commentArr, ...res.data.data.results];
        this.totalCount = res.data.data.total_count;
        this.lastId = res.data.data.last_id; //用于分页
        if (this.lastId === null) {
          //   没有下一页了
          this.finished = true;
        }
        this.loading = false;
      } else {
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
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

// 评论区域样式
.art-cmt-container-1 {
  padding-bottom: 76px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论盒子--1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 76px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 50%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}
.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发表评论的盒子---2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>