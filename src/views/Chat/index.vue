<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学" class="xiaosi"></van-nav-bar>
    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj,index) in list" :key="index">
        <!-- 左侧-机器人小思 -->
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg"></van-image>
          <div class="chat-pao">{{obj.msg}}</div>
        </div>

        <!-- 右侧-当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{obj.msg}}</div>
          <van-image fit="cover" round :src="$store.state.userPhoto"></van-image>
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="word">
        <template #button>
          <span style="font-size:18px;color:#999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { getToken } from "@/utils/token.js";
export default {
  name: "Chat",
  data() {
    return {
      word: "", //输入框的内容
      list: [
        // 根据name属性，判断消息应该渲染在哪个div
        { name: "xs", msg: "hi,你好！我是小思" },
        { name: "me", msg: "我是编程小王子" }
      ],
      socket: null //客户端和服务器端建立连接的socket对象
    };
  },
  created() {
    this.socket = io("http://toutiao.itheima.net", {
      query: {
        token: getToken()
      },
      transports: ["websocket"]
    });

    // 测试连接是否建立成功
    this.socket.on("connect", () => {
      console.log("连接成功");
    });
    // 接收服务器传回来的消息
    this.socket.on("message", obj => {
      // console.log(obj);
      // 立刻阻止相同字段对象放到数组里--》v-for更新
      this.list.push({
        name: "xs",
        msg: obj.msg
      });

      // 最后一条聊天消息滚动到屏幕范围
      // 数据变化-》DOM更新是异步的，所以获取的是上一条
      this.$nextTick(() => {
        const theDiv = document.querySelector(".chat-list>div:last-child");
        theDiv.scrollIntoView({
          behavior: "smooth"
        });
      });
    });
  },
  methods: {
    // 发送消息-点击事件
    sendFn() {
      if (this.word.trim().length === 0) return;
      // socket链接对象.emit('后端接收消息的事件名'， 值)
      this.socket.emit("message", {
        msg: this.word,
        timestamp: new Date().getTime()
      });
      // 把消息显示到对话框
      this.list.push({
        msg: this.word,
        name: "me"
      });

      // 最后一条聊天消息滚动到屏幕范围
      // 数据变化-》DOM更新是异步的，所以获取的是上一条
      this.$nextTick(() => {
        const theDiv = document.querySelector(".chat-list>div:last-child");
        theDiv.scrollIntoView({
          behavior: "smooth"
        });
      });

      // 清空输入框
      this.word = "";
      // console.log("111");
    }
  },
  destroyed() {
    this.socket.close();
    this.socket = null;
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  // /deep/ .van-nav-bar__content {
  //   margin-bottom: 15px;
  // }
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    padding-top: 35px;
    padding-bottom: 65px;
    .chat-item {
      padding: 10px;
      /deep/ .van-image__img {
        vertical-align: top;
        width: 60px;
        height: 60px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        margin-top: 10px !important;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 45px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  // padding: 0 10px 0 10px;
  // height: 20% !important;
  text-align: center;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>