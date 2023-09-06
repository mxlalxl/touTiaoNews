<template>
  <div id="app">
    <keep-alive exclude="Search,SearchResult,Detail,UserEdit">
      <!-- 路由的出口 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less"></style>
