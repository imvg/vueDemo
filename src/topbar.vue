<template>
  <div class="topbar">
    <div class="logo">
      <img src="./assets/static/logo.png" alt="logo" @click="dump('/')"/>
    </div>
    <div class="topbar-main">
      <div class="index" @click="dump('/')">
        <span>首页</span>
      </div>
      <div class="add" @click="dump('/add')">
        <span>添加域名</span>
      </div>
      <div class="ssl" @click="dump('/ssl')">
        <span>申请证书</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    dump (page) {
      if (this.$route.path !== page) {
        this.$router.push({path: page})
      }
    }
  }
}
</script>

<style scoped>

.logo
{
  position: absolute;
  padding: 0;
  margin: 10px 0;
  left: 18vw;
}
.logo img
{
  width: 95px;
  height: 22px;
}
.logo img:hover
{
  cursor: pointer;
}
.topbar
{
  background: #fff;
  position: relative;
  -webkit-box-shadow: 0 3px 6px 0 rgba(50,50,50,.3);
  box-shadow: 0 1px 6px 0 rgba(50,50,50,.3);
  top: 0;
  height: 45px;
  width: 100vw;
}
.topbar-main
{
  position: absolute;
  height: 100%;
  width: 50%;
  left: 25vw;
}
.topbar-main div
{
  height: 100%;
  width: 100px;
  float: left;
}
.topbar-main div span
{
  position: relative;
  align-items: center;
  color: inherit;
  padding: 0 10px;
  font-size: 14px;
  display: block;
  top: 26%;
}
.topbar-main div:hover
{
  cursor: pointer;
  background-color: lightgray;
}
</style>