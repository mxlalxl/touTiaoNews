<template>
  <div>
    <!-- 一条文章单元格 -->
    <div class="box">
      <van-cell>
        <!-- 标题区域的插槽 -->
        <template #title>
          <div class="title-box">
            <!-- 标题 -->
            <span>{{artObj.title}}</span>
            <!-- 单图 -->
            <!-- <img v-if="artObj.cover.type === 1" :src="artObj.cover.images[0]" alt class="thumb" /> -->
            <van-image
              v-if="artObj.cover.type === 1"
              :src="artObj.cover.images[0]"
              class="thumb"
              lazy-load
            >
              <template v-slot:error>加载失败</template>
            </van-image>
          </div>
          <!-- 多图 -->
          <div class="thumb-box" v-if="artObj.cover.type > 1">
            <!-- <img
              :src="imgUrl"
              alt
              class="thumb"
              v-for="(imgUrl, index) in artObj.cover.images"
              :key="index"
            />-->
            <van-image
              :src="imgUrl"
              alt
              lazy-load
              class="thumb"
              v-for="(imgUrl, index) in artObj.cover.images"
              :key="index"
            >
              <template v-slot:error>加载失败</template>
            </van-image>
          </div>
        </template>

        <!-- label区域的插槽 -->
        <template #label>
          <div class="label-box">
            <div>
              <span>{{artObj.aut_name}}</span>
              <span>{{artObj.comm_count}}评论</span>
              <span>{{formatTime(artObj.pubdate)}}</span>
            </div>
            <!-- 反馈组件 -->
            <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
          </div>
        </template>
      </van-cell>
    </div>
    <!-- 反馈遮罩层 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      get-container="body"
      :cancel-text="bottomText"
      @select="onSelect"
      @cancel="cancelFn"
      @close="closeFn"
    />
  </div>
</template>

<script>
import { timeAgo } from "@/utils/dayjs.js";
import { firstActions, secondActions } from "@/api/report.js";
export default {
  data() {
    return {
      show: false,
      actions: firstActions,
      bottomText: "取消" //遮罩层底部默认文字
    };
  },
  props: {
    artObj: Object, //文章对象
    isShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatTime: timeAgo,
    onSelect(action, item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false;
      // Toast(item.name);
      // console.log(action);

      // console.log(item);
      if (action.name === "反馈垃圾内容") {
        this.actions = secondActions;
        this.bottomText = "返回";
      } else if (action.name === "不感兴趣") {
        this.$emit("dislikeEV", this.artObj.art_id);
        this.show = false; //无论成功与否让反馈面板隐藏
      } else {
        this.$emit("reportEV", this.artObj.art_id, action.value);
        this.show = false; //关闭反馈面板
      }
    },
    cancelFn() {
      if (this.bottomText === "返回") {
        this.show = true;
        this.actions = firstActions;
        this.bottomText = "取消";
      }
    },
    closeFn() {
      this.actions = firstActions;
      this.bottomText = "取消";
    }
  }
};
</script>

<style scoped lang="less">
// 标题样式
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
// label描述样式
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label-box span {
  margin: 0 0.08rem;
  &:first-child {
    margin-left: 0;
  }
}
.thumb {
  width: 3.013333rem;
  height: 1.866667rem;
  background-color: #f8f8f8;
  object-fit: cover;
}
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
