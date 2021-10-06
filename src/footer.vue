<template>
  <div class="foot-div">
    <div class="content">
      <div class="first-line">
        <ul>
          <li>
            关于我们
          </li>
          <li>
            广告服务
          </li>
          <li>
            工作时间10:00-22:00
          </li>
          <li>
            Email: vgwork001@gmail.com
          </li>
        </ul>
      </div>
      <div class="second-line">
        <ul>
          <li>
            <img src="./assets/static/badge.png" alt="img"/> 公网安备1001052917162
          </li>
          <li>
            京ICP备190082917号
          </li>
          <li>
            <a href="http://www.bjjubao.org" target="_blank">北京互联网违法和不良信息举报中心</a>
          </li>
          <li>
            网络110报警服务
          </li>
          <li>
            家长监护
          </li>
          <li>
            版权与免责声明
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style scoped>
.foot-div
{
  position: relative;
  background: white;
  bottom: 0;
  font-size: 12px;
  padding: 0;
}
.content
{
  position: absolute;
  height: 80%;
  width: 80%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -10%);
}
ul
{
  padding: 0;
  margin: 0;
  display: inline-block;
}
li
{
  color: #8F8F8F;
  list-style: none;
  float: left;
  margin: 0 10px;
  font-size: small;
  text-align: center;
}
li:hover
{
  cursor: pointer;
}
.first-line
{
  width: 100%;
  height: 50%;
  float: left;
}
.second-line
{
  width: 100%;
  height: 50%;
  float: left;
}
.second-line ul li img
{
  display: inline-block;
  height: 14px;
  width: 14px;
  vertical-align: middle;
}
.second-line ul li a
{
  text-decoration: none;
  font-size: small;
  color: #8F8F8F;
}
</style>