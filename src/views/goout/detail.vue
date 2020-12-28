<template>
  <el-main>
    <div class="main-content">
      <div
        class="app-container"
        v-loading.fullscreen.lock="fullscreenLoading"
        v-if="!fullscreenLoading"
      >
        <el-form :rules="rules" ref="form" :model="todaywork" label-width="100px" size="medium">
          <el-form-item label="联系人：">{{ todaywork.contacts }}</el-form-item>
          <el-form-item label="来访事由：">{{ todaywork.title }}</el-form-item>
          <el-form-item label="开始时间：">{{ todaywork.startTime }}</el-form-item>
          <el-form-item label="结束时间：">{{ todaywork.endTime }}</el-form-item>
          <el-form-item label="来访人员：">
            <span
              class="out-item"
              v-for="(obj,index) in todaywork.persons"
              :key="index"
            >{{obj.name}}({{obj.tel}})</span>
          </el-form-item>
          <el-form-item label="来访车辆：">
            <span class="out-item" v-for="(obj,index) in todaywork.cars" :key="index">{{obj.carNum}}</span>
          </el-form-item>
          <el-form-item label="备注:">{{ todaywork.remark }}</el-form-item>
          <el-form-item label="进入时间:" prop="enterTime">
            <el-date-picker
              v-model="todaywork.enterTime"
              :default-value="new Date()"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
            <el-button type="warning" @click="enter(1)">进入</el-button>
          </el-form-item>
          <el-form-item label="离开时间:" prop="leaveTime">
            <el-date-picker
              v-model="todaywork.leaveTime"
              type="datetime"
              placeholder="选择日期时间"
              :default-time="new Date()"
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
import { getDetailById, saveRecord } from "@/api/goout.js";
export default {
  data() {
    return {
      id: this.$route.query.id,
      todaywork: {
        enterTime:new Date() ,
        leaveTime:new Date()
      },
      fullscreenLoading: true,
      // enterTime: "",
      // leaveTime: "",
      rules: {
        enterTime: [
          { required: true, message: "请输入进入时间", trigger: "blur" }
        ],
        leaveTime: [
          { required: true, message: "请输入离开时间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getListDetail() {
      const res = await getDetailById(this.id);
      if (res.code === "200") {
        this.todaywork = res.data;
        console.log(this.todaywork);
        this.fullscreenLoading = false;
      }
    },
    async enter(type) {
      let time =
        type == 1 ? this.todaywork.enterTime : this.todaywork.leaveTime;
      // 调用进入接口
      const res = await saveRecord({
        time,
        type, //1进入 2 出
        inId: this.id
      });
      if (res.code === "200") {
        this.$message({
          message: "进入记录成功",
          type: "success"
        });
      }
    }
  },
  created() {
    this.getListDetail();
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
  margin: 0 10px;
}
</style>