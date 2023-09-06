<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="黑马头条-登录" />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        required
        name="mobile"
        label="手机号"
        placeholder="请输入11位手机号"
        :rules="[{ required: true, message: '请填写正确的手机号',pattern:/^1[3-9]\d{9}$/ }]"
      />
      <van-field
        v-model="user.code"
        required
        type="password"
        name="code"
        label="密码"
        placeholder="请输入6位密码"
        :rules="[{ required: true, message: '请填写密码',pattern: /^\d{6}$/ }]"
      />
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :loading="isloading"
          loading-text="正在登录中..."
          :disabled="isloading"
        >登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from "@/api";
import Notify from "@/ui/Notify.js";
import { setToken } from "@/utils/token.js";
import { setStorage } from "@/utils/storage.js";
export default {
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "" //密码
      },
      isloading: false
    };
  },
  methods: {
    async onSubmit(values) {
      // console.log("submit", values);
      // console.log(this.user);
      // 把状态设置为true
      this.isloading = true;

      try {
        const res = await loginAPI(this.user);
        // console.log(res);
        // 成功通知
        Notify({ type: "success", message: "登录成功" });
        setToken(res.data.data.token);
        setStorage("refresh_token", res.data.data.refresh_token);

        // 跳转一定要写在最后，尽量最后执行
        // location.href:当前浏览器地址和要跳转的地址一样（不包含锚点#之后的信息），不会刷新网页
        // this.$router.push() 压栈，会产生历史记录，可以回退
        // this.$router.replace() 替换，不会产生历史记录
        this.$router.replace({
          // 登录未遂地址
          path: this.$route.query.path || "/layout/home" //因为我们路由规则里layout没有重定向，所以这里写全
        });
      } catch (error) {
        // console.log(error);

        // 危险通知
        Notify({ type: "danger", message: "账号或密码错误" });
      }
      // 无论网络请求成功还是失败，把按钮状态关了
      this.isloading = false;
    }
  }
};
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #007bff;
}
/deep/ .van-field__label {
  padding-left: 30px !important;
  // text-align: center !important;
}
/deep/ .van-nav-bar__title {
  color: white;
}
</style>
