<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" />
        
        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->
        <!-- <a href="javascript:;" class="header-icons news">
          <span class="icon" v-if="msgCount">{{msgCount}}</span>
        </a>
        <a href="#" class="header-icons message"></a>
        <a href="#" class="header-icons mine"></a> -->
        <div class="user-name">{{ user_name }}</div>
        <a href="javascript:;" class="header-icons out" @click="logout"></a>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getCount } from "@/api/message";

export default {
  data() {
    return {
      msgCount: 0
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "message", "user_name"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    }
  },
  methods: {
    // 跳转消息列表
    goMessageCenter() {
      this.$router.push("/message/messageList");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 清楚token 角色 权限  调到登录页
        this.$store.commit("SET_TOKEN", "");
        this.$store.commit("SET_ROLES", []);
        this.$store.commit("SET_PERMISSIONS", []);
        removeToken();
        this.$router.push("/login");
        // this.$store.dispatch('LogOut').then(() => {
        //   location.reload()
        // })
      });
    },
    getData() {
      getCount().then(res => {
        this.msgCount = res.data;
        // console.log(this.msgCount)
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  padding-right: 20px;
  position: relative;
  .user-name {
    font-size: 14px;
    display: flex;
    justify-content: center;
  }
  i {
    position: absolute;
    right: 2px;
    top: 15px;
  }
}
.msg-remind {
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
  .el-icon-message-solid:before {
    content: "\E799";
    opacity: 0.6;
    font-size: 22px;
  }
}
.navbar {
  height: 108px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  // background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 108px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    // color:#fff;

    &:hover {
      // background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 50px;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.right-menu {
  margin: 32px 30px 0 0;
}
.right-menu .header-icons {
  display: inline-block;
  width: 50px;
  height: 35px;
  background: url(../../assets/image/icons.png) no-repeat;
  cursor: pointer;
}
.right-menu .news {
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
.right-menu .active {
  background-position: 13px -71px;
}
.right-menu .message {
  background-position: -50px -1px;
}
.right-menu .mine {
  background-position: -113px -3px;
}
.right-menu .out {
  background-position: -183px -3px;
}
.user-name {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 100px;
  color: #fff;
  font-weight: bolder;
}
</style>
