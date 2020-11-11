<template>
  <div>
    <div class="header-left">
      <span class="iconfont icon-santiaoxian list"></span>
      <span class="list position-txt">位置：</span>
      <el-breadcrumb class="list" separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>法规查询提醒</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <a href="#" class="header-icons news active"></a>
      <a href="#" class="header-icons message"></a>
      <a href="#" class="header-icons mine"></a>
      <a href="#" class="header-icons out"></a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.el-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
}
.header-left {
  float: left;
  color: #fff;
}
.list {
  float: left;
  font-size: 20px;
  line-height: 108px;
  height: 108px;
}
.position-txt {
  margin-left: 20px;
}

.icon-santiaoxian {
  color: #fff;
}
.header-right {
  float: right;
  margin: 32px 30px 0 0;
}
.header-right .header-icons {
  display: inline-block;
  width: 50px;
  height: 35px;
  background: url(../assets/images/icons.png) no-repeat;
  cursor: pointer;
}
.header-right .news {
  background-position: 13px -3px;
}
.header-right .active {
  background-position: 13px -71px;
}
.header-right .message {
  background-position: -50px -1px;
}
.header-right .mine {
  background-position: -113px -3px;
}
.header-right .out {
  background-position: -183px -3px;
}
</style>