<template>
  <el-main>
    <div class="main-content">
      <div
        class="app-container"
        v-loading.fullscreen.lock="fullscreenLoading"
        v-if="!fullscreenLoading"
      >
        <el-form  ref="form" :model="todaywork" label-width="100px" size="medium">
          <el-form-item label="联系人：">{{ todaywork.contacts }}</el-form-item>
          <el-form-item label="来访事由：">{{ todaywork.title }}</el-form-item>
          <el-form-item label="来访时段">{{ todaywork.startTime }} 至 {{ todaywork.endTime }}</el-form-item>
          <el-form-item label="来访人员：">
            <div class="out-item" v-for="(obj, index) in todaywork.persons" :key="index">
              姓名：{{
              obj.name
              }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号：{{
              obj.tel
              }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;身份证号：{{
              obj.idCard
              }}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button
                @click="openTabWin(obj.url, 'view')"
                v-if="obj.url"
                icon="el-icon-view"
                size="small"
                type="primary"
              >查看附件</el-button>
            </div>
          </el-form-item>
          <el-form-item label="来访车辆：">
            <span class="out-item" v-for="(obj,index) in todaywork.cars" :key="index">{{obj.carNum}}</span>
          </el-form-item>
          <el-form-item label="备注:">{{ todaywork.remark }}</el-form-item>
          
          <el-form-item label="进入时间:" v-if="todaywork.records.length == 0 || todaywork.records[0].type == 2 ">
            <el-date-picker
              v-model="enterTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
            <el-button type="warning" @click="enter(1)">进入</el-button>
          </el-form-item>
          <el-form-item label="离开时间:" v-else-if="todaywork.records[0].type == 1">
            <el-date-picker
              v-model="leaveTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
            <el-button type="success" @click="enter(2)">离开</el-button>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" @click="$router.go(-1)">确定</el-button> -->
            <el-button type="primary" @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-main>
</template>

<script>
import { dateFormat } from "@/utils/format.js";
import { getDetailById, saveRecord } from "@/api/goout.js";
export default {
  data() {
    return {
      id: this.$route.query.id,
      enterTime: "",
      leaveTime: "",
      fullscreenLoading: true,
      todaywork:{}
    };
  },
  methods: {
    async getListDetail() {
      const res = await getDetailById(this.id);
      if (res.code === "200") {
        this.todaywork = res.data;
        this.fullscreenLoading = false;
      }
    },
    async enter(type) {
      let time = type == 1 ? this.enterTime : this.leaveTime;
      // 调用进入接口
      const res = await saveRecord({
        time,
        type, //1进入 2 出
        inId: this.id
      });
      if (res.code === "200") {
        this.$message({
          message: "记录成功",
          type: "success"
        });
        
        this.initTime();
        this.getListDetail();
      }
    },
    async openTabWin(url, type) {
      // if (type == "view") {
      //   await readFile({ id: this.file.id })
      // } else if (type = "download") {
      //   await downLoadFile({ id: this.file.id })
      // }
      window.open(url, "_blank");
    },
    async initTime() {
      //获取当前时间
      var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      let strDate = Y + M + D + h + m + s;
      this.enterTime = strDate;
      this.leaveTime = strDate;
    }
  },
  created() {
    this.getListDetail();
    this.initTime();
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
}
.page-box {
  text-align: right;
  margin-top: 20px;
}
.out-item {
  margin-right: 10px;
}
</style>