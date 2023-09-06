<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用title插槽来自定义标题 -->
        <template #icon>
          <img :src="userObj.photo" alt class="avatar" />
        </template>
        <template #title>
          <span class="username">{{userObj.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userObj.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item" @click="getFollowings">
          <span>{{userObj.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit"></van-cell>
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"></van-cell>
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfoAPI } from "@/api";
import { Dialog } from "vant";
import { removeToken } from "@/utils/token.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      userObj: {}
    };
  },
  async activated() {
    const res = await getUserInfoAPI();
    this.userObj = res.data.data;
    // console.log(this.userObj);

    // 方式1：
    // this.$store.commit('SET_USERPHOTO', this.userObj.photo)

    // 方式2：
    this.SET_USERPHOTO(this.userObj.photo);
  },
  methods: {
    ...mapMutations(["SET_USERPHOTO"]),
    quitFn() {
      Dialog.confirm({
        title: "是否退出登录",
        message: "这就走了？不爱我了吗"
      })
        .then(() => {
          //用户点击“确认选项”--》内部resolve触发then
          // on confirm
          removeToken();
          this.$router.replace("/login");
        })
        .catch(() => {
          //用户点击取消--》内部reject触发catch
          // on cancel
        });
    },
    getFollowings() {
      // const res = await getFollowingsAPI({});
      // console.log(res);
      // console.log(111);
      this.$router.replace("/userfollowings");
    }
  }
};
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 30px;
    .van-cell {
      background-color: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 110px;
        height: 110px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
        margin-left: 20px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>