<template>
  <div>
    <!-- 头部导航 -->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img src="@/assets/logo.png" alt class="logo" />
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#fff" @click="moveSearchPageFn" />
        </template>
      </van-nav-bar>
    </div>
    <!--标签栏 -->
    <div class="main">
      <van-tabs
        v-model="channelId"
        sticky
        offset-top="1.22667rem"
        animated
        @change="channelChangeFn"
      >
        <van-tab :title="obj.name" :key="obj.id" v-for="obj in userChannelList" :name="obj.id">
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>

      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="plusClickFn" />
    </div>

    <!-- 频道管理弹出层 -->
    <van-popup v-model="show" get-container="body" class="channel_popup">
      <!-- ref属性可以拿到当前绑定的组件对象，就可以拿到此组件对象身上的所有属性和方法 -->
      <channel-edit
        :userChannelList="userChannelList"
        :unCheckList="unCheckChannelList"
        @addChannelEV="addChannelFn"
        @removeChannelEV="removeChannelFn"
        @closeEV="closeFn"
        ref="editRef"
        v-model="channelId"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannelsAPI,
  getAllChannelListAPI,
  updateChannelsAPI,
  removeTheChannelAPI
} from "@/api";
import ArticleList from "./components/ArticleList.vue";
import channelEdit from "./channelEdit.vue";
import Notify from "@/ui/Notify.js";
export default {
  data() {
    return {
      channelId: 0,
      userChannelList: [],
      allChannelList: [],
      show: false, //控制频道弹出层显示或隐藏
      // articleList: []
      channelScrollTObj: {} //保存每个频道的滚动高度
    };
  },
  async created() {
    const res = await getUserChannelsAPI();
    // console.log(res);
    this.userChannelList = res.data.data.channels;

    const res2 = await getAllChannelListAPI();
    // console.log(res2);
    this.allChannelList = res2.data.data.channels;
    // console.log(this.allChannelList);

    // 请求文章列表
    // this.channelChangeFn();
  },
  methods: {
    async channelChangeFn() {
      // const res2 = await getAllArticleAPI({
      //   channel_id: this.channelId,
      //   timestamp: new Date().getTime()
      // });
      // // console.log(res2);
      // this.articleList = res2.data.data.results;

      //监听频道改变事件
      // tab切换后，设置滚动条的位置
      // tab切换时，组件内部会把切走的容器高度设置为0，切回来的一瞬间页面高度为0，滚动事件被触发，
      // 滚动条滚回到顶部，把滚动条的数据变为0，设置滚动位置也没用。
      // 解决：先让dom更新，再存
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTObj[
          this.channelId
        ];
      });
    },
    plusClickFn() {
      this.show = true;
    },
    // 添加频道
    async addChannelFn(channelObj) {
      this.userChannelList.push(channelObj);

      const newArr = this.userChannelList.filter(obj => obj.id !== 0);
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }; //拷贝
        delete newObj.name;
        newObj.seq = index;
        return newObj; //让map把新对象收集起来
      });
      const res = await updateChannelsAPI({
        channels: theNewArr
      });
    },
    //用户移除已选频道
    async removeChannelFn(channelObj) {
      const index = this.userChannelList.findIndex(
        obj => obj.id === channelObj.id
      );
      this.userChannelList.splice(index, 1);
      const res = await removeTheChannelAPI({ channelId: channelObj.id });
      Notify({ type: "success", message: "删除成功" });
    },
    // 关闭弹出层
    closeFn() {
      this.show = false;
      this.$refs.editRef.isEdit = false;
    },
    // 首页-右上角放大镜点击事件--> 跳转至搜索页面
    moveSearchPageFn() {
      this.$router.push("/search");
    },
    // 获取滚动条位置
    scrollFn() {
      // 谷歌浏览器和安卓手机内置的浏览器内核不是同一个，获取scrollTop的方式不同
      // 谷歌浏览器用的html的scrollTop,安卓用的body的scrollTop
      this.$route.meta.scrollT =
        document.documentElement.scrollTop || document.body.scrollTop;
      // 保存当前频道的滚动距离
      this.channelScrollTObj[this.channelId] =
        document.documentElement.scrollTop || document.body.scrollTop;
    }
  },
  components: {
    ArticleList,
    channelEdit
  },
  computed: {
    unCheckChannelList() {
      // 把所有频道列表数组对象挨个取出，去用户已选频道数组里查找，如果查不到，让filter方法将其收集到一个新的数组中
      const newArr = this.allChannelList.filter(bigObj => {
        const index = this.userChannelList.findIndex(smallObj => {
          return smallObj.id === bigObj.id;
        });

        // 如果找到了
        if (index > -1) {
          return false;
        } else {
          return true;
        }
      });
      return newArr;
    }
  },

  // 有组件缓存，组件切回来时执行activated,组件切走时执行deactivated
  activated() {
    // console.log(this.$route);
    window.addEventListener("scroll", this.scrollFn);
    // window和document，监听网页滚动事件
    // html标签获取scrollTop,滚动的距离和设置滚动的位置
    // 立刻设置滚动条的位置
    document.documentElement.scrollTop = this.$route.meta.scrollT;
    document.body.scrollTop = this.$route.meta.scrollT;
  },
  deactivated() {
    window.removeEventListener("scroll", this.scrollFn);
  }
};
</script>

<style scoped>
.logo {
  width: 2.67rem;
  height: 0.8rem;
}
.main {
  padding-top: 1.22rem;
}

/* 设置tabs容器样式 */
/deep/ .van-tabs_wrap {
  padding-right: 30px;
  background-color: #fff;
}

/* 设置小图标的样式 */
.moreChannels {
  position: fixed;
  top: 1.65333333rem;
  right: 0.08rem;
  z-index: 999;
}

/* 频道弹出层样式 */
.channel_popup {
  width: 100vw;
  height: 100vh;
}
</style>