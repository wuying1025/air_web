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
      <a href="javascript:;" class="header-icons news">
        <span class="icon" v-if="msgCount">{{msgCount}}</span>
      </a>
      <a href="#" class="header-icons message"></a>
      <a href="#" class="header-icons mine"></a>
      <a href="javascript:;" class="header-icons out" @click="logout"></a>
    </div>
  </div>
</template>

<script>
import { getCount } from "@/api/message";
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  data(){
    return {
      msgCount:0,
      timer:null
    }
  },
  methods:{
    getData(){
      getCount().then(res => {
        this.msgCount = res.data;
      });
    },
     logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          // 清楚token 角色 权限  调到登录页
          this.$store.commit('SET_TOKEN', '')
          this.$store.commit('SET_ROLES', [])
          this.$store.commit('SET_PERMISSIONS', [])
          removeToken();
          this.$router.push('/login')
        // this.$store.dispatch('LogOut').then(() => {
        //   location.reload()
        // })
      })
    }
  },
  created() {
    //获取消息列表
    this.getData();
    this.timer = setInterval(() => {
      this.getData();
    }, 3000);
  },
  beforeDestroy(){
    clearInterval(this.timer);
  }
};
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
  position: relative;
  .icon {
    position: absolute;
    right: 7px;
    width: 14px;
    height: 14px;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    top: 1px;
    background: #f00;
    color: #fff;
    border-radius: 50%;
  }
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