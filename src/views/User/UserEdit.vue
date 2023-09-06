<template>
  <div class="user-edit-container">
    <!-- Header区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()"></van-nav-bar>

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profileObj.photo" @click="imageClickFn"></van-image>
          <!-- file选择框 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.name" @click="nameClickFn"></van-cell>

      <!-- 修改名称确认弹出框 -->
      <van-dialog v-model="show" title="标题" show-cancel-button :before-close="beforeCloseFn">
        <input type="text" v-model="inputUserName" v-fofo />
      </van-dialog>
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayClickFn"></van-cell>

      <!-- 时间选择器 -->
      <van-popup v-model="dateTimePickerShow" round position="bottom" :style="{ height: '50%'}">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="dateCancelFn"
          @confirm="confirmFn"
        />
      </van-popup>
    </van-cell-group>
  </div>
</template>
<script>
import {
  userProfileAPI,
  updateUserPhotoAPI,
  updateUserProfileAPI
} from "@/api";
import Notify from "@/ui/Notify.js";
import { formateDate } from "@/utils/dayjs.js";
export default {
  name: "UserEdit",
  data() {
    return {
      profileObj: {}, //用户基本资料对象
      show: false, //控制姓名修改弹出框的显示与隐藏
      inputUserName: "", //修改姓名输入框的绑定值
      minDate: new Date(1920, 0, 1), //最小范围
      maxDate: new Date(), //最大范围
      currentDate: new Date(), //当前时间
      dateTimePickerShow: false
    };
  },
  async created() {
    const res = await userProfileAPI();
    // console.log(res);
    this.profileObj = res.data.data;
  },
  methods: {
    // 文件选择改变-事件
    async onFileChange(e) {
      // console.log(e.target.files[0]);
      // 用户没有选择图片，阻止代码往下运行
      if (e.target.files.length === 0) {
        return;
      }
      const theFd = new FormData();
      theFd.append("photo", e.target.files[0]); //请求体里加入获取到的图片

      const res = await updateUserPhotoAPI(theFd);
      // console.log(res);
      this.profileObj.photo = res.data.data.photo;
    },
    // 修改头像
    imageClickFn() {
      // 模拟标签的点击事件
      this.$refs.iptFile.click();
    },
    // 修改名称
    nameClickFn() {
      this.show = true;
      this.inputUserName = this.profileObj.name;
    },
    // 关闭弹框前的操作
    async beforeCloseFn(action, done) {
      if (action === "confirm") {
        // 点了确定
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/;
        if (reg.test(this.inputUserName) === true) {
          // 通过校验
          await updateUserProfileAPI({
            name: this.inputUserName
          });
          this.profileObj.name = this.inputUserName; //更新成功--数据回显页面上
          done();
        } else {
          // 没通过校验
          Notify({ type: "warning", message: "请输入1-7位的中英数字" });
          done(false);
        }
      } else {
        // 点取消
        done(); //让弹窗关闭
      }
    },
    // 显示用户生日-生日单元格
    birthdayClickFn() {
      this.dateTimePickerShow = true;
      this.currentDate = new Date(this.profileObj.birthday);
    },
    // 日期选择器-取消事件
    dateCancelFn() {
      this.dateTimePickerShow = false;
    },
    async confirmFn() {
      // 日期选择器组件里是日期对象，而后台要的是年-月-日字符串
      await updateUserProfileAPI({
        birthday: formateDate(this.currentDate)
      });
      this.dateTimePickerShow = false;
      this.profileObj.birthday = formateDate(this.currentDate); //数据回显到页面
    }
  }
};
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/ .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    border: none;
    outline: none;
    text-align: center;
  }
}
</style>