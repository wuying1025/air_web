<template>
  <el-main>
    <div class="main-content">
      <div class="app-container">
        <el-form
          ref="outsider"
          :model="outsider"
          :rules="rules"
          label-width="110px"
        >
          <el-form-item label="来访时段" prop="time">
            <el-date-picker
              v-model="outsider.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 400px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="来访事由" prop="title">
            <el-input v-model="outsider.title" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="联系人单位" prop="company">
            <el-input
              v-model="outsider.company"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contacts">
            <el-input
              v-model="outsider.contacts"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <div class="form-item-star">
            <span class="form-item-label">来访人员信息</span>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addPeopleInfo"
              >增加人员信息</el-button
            >
            <div
              v-for="(item, index) in outsider.persons"
              :key="index"
              class="people-info"
            >
              <el-card class="people-card">
                <div class="people">
                  <el-row style="width: 95%">
                    <el-col :span="8">
                      <el-form-item
                        label="姓名"
                        :prop="'persons.' + index + '.name'"
                        :rules="[
                          {
                            required: true,
                            message: '请输入姓名',
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input size="small" v-model="item.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="身份证号"
                        :prop="'persons.' + index + '.idCard'"
                        :rules="[
                          {
                            required: true,
                            message: '请输入身份证号码',
                            trigger: 'blur',
                          },
                          {
                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                            message: '请输入正确的身份证号码',
                            trigger: ['blur', 'change'],
                          },
                        ]"
                      >
                        <el-input size="small" v-model="item.idCard"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="手机号"
                        :prop="'persons.' + index + '.tel'"
                        :rules="[
                          {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur',
                          },
                          {
                            pattern: /^1[3-9]\d{9}$/,
                            message: '请输入正确的手机号码',
                            trigger: ['blur', 'change'],
                          },
                        ]"
                      >
                        <el-input size="small" v-model="item.tel"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-form-item label="附件">
                  <!-- :change="item.file.isChange" -->
                  <!-- :name="item.file.name" -->

                  <Uploader
                    v-on:getFile="getFileUrl(arguments, index)"
                    style="width: 94%"
                  ></Uploader>
                  <el-button
                    @click="openTabWin(item.url, 'view')"
                    v-if="item.url"
                    icon="el-icon-view"
                    size="small"
                    type="primary"
                    >预览文件</el-button
                  >
                </el-form-item>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除该项"
                  placement="top-end"
                >
                  <el-button
                    type="info"
                    icon="el-icon-delete"
                    class="people-del"
                    @click="delPeopleItem(index)"
                  ></el-button>
                </el-tooltip>
              </el-card>
            </div>
          </div>
          <div class="form-item">
            <span class="form-item-label">来访车辆信息</span>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addCarInfo"
              >增加车辆信息</el-button
            >
            <div
              v-for="(item, index) in outsider.cars"
              :key="index"
              class="people-info"
            >
              <el-card class="people-card" style="width: 900px">
                <div class="people">
                  <!-- <span>{{ index + 1 }}</span> -->

                  <el-form-item label="车牌号" prop="carNum">
                    <el-input
                      size="small"
                      v-model="item.carNum"
                      style="width: 160px"
                    ></el-input>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除该项"
                      placement="top-end"
                    >
                      <el-button
                        type="info"
                        icon="el-icon-delete"
                        class="car-del"
                        @click="delCarItem(index)"
                      ></el-button>
                    </el-tooltip>
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </div>
          <el-form-item label="近七天行程报备" prop="journey">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入近七天行程报备"
              v-model="outsider.journey"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入备注"
              v-model="outsider.remark"
              style="width: 400px"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="$route.params.id"
              type="primary"
              @click="updateHandle('outsider')"
              >确定修改</el-button
            >
            <el-button v-else type="primary" @click="submitForm('outsider')"
              >立即创建</el-button
            >
            <el-button @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-main>
</template>

<script>
import { saveOutsider, getOutsiderById, updateOutsider } from "@/api/outsider.js";
import Uploader from "@/components/Uploader";
import { dateFormat } from "@/utils/format";

export default {
  data() {
    return {
      id: null,
      outsider: {
        time: '',
        title: '',
        persons: [],
        cars: [],
        status: 1, // 1待审批  2审批通过 3审批不通过
      },
      rules: {
        time: [{ required: true, message: "请输入来访时段", trigger: "blur" }],
        // title: [{ required: true, message: "请输入来访事由", trigger: "change" }],
        // contacts: [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
        people: [{ required: true, message: "请输入来访人员信息", trigger: "blur" }],
        // company: [{ required: true, message: "请输入联系人单位", trigger: "blur" }],
      },

    };
  },
  components: {
    Uploader
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      //   this.$router.push("/todaywork/alltodaywork");
    },
    async addHandle() {
      if (this.outsider.persons.length == 0 || this.outsider.persons[0].name.trim() == '') {
        this.$message({
          message: '请填写来访人员信息',
          type: 'error'
        })
        return
      }
      this.outsider.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.outsider.time[0])
      this.outsider.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.outsider.time[1])
      console.log(this.outsider);

      const res = await saveOutsider(this.outsider);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/outsiderManage/outsider");
      }
    },
    async updateHandle() {
      console.log(this.outsider);
      this.outsider.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.outsider.time[0])
      this.outsider.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.outsider.time[1])
      const res = await updateOutsider(this.outsider)
      //   console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.go(-1)
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    addPeopleInfo() {
      this.outsider.persons.push({
        name: '',
        idCard: '',
        tel: '',
        file: {
          url: "http://www.rr.cc",
          readUrl: "http://www.rr.cc",
          type: "regulatory_documents",
          name: "",
          // isChange: false,
        },
        url: ''
      })
    },
    addCarInfo() {
      this.outsider.cars.push({
        carNum: ''
      })
    },
    delPeopleItem(index) {
      this.outsider.persons.splice(index, 1)
    },
    delCarItem(index) {
      this.outsider.cars.splice(index, 1)
    },
    // 获取wFid和nFid
    getFileUrl(args, index) {
      this.outsider.persons[index].file = {
        url: args[1],
        readUrl: args[2],
        name: args[0],
        // isChange: true
      }
      this.outsider.persons[index].url = args[1]
    },
    // 下载或预览操作
    async openTabWin(url, type) {
      // if (type == "view") {
      //   await readFile({ id: this.file.id })
      // } else if (type = "download") {
      //   await downLoadFile({ id: this.file.id })
      // }
      window.open(url, "_blank");
    },

  },
  async mounted() {
    this.id = this.$route.params.id
    if (this.id) { // 修改
      const res = await getOutsiderById(this.id)
      console.log(res)
      if (res && res.code === '200') {
        this.outsider = res.data
        this.$set(this.outsider, "time", [this.outsider.startTime, this.outsider.endTime]);
      }
    }
  }
};
</script>
<style lang="scss">
.people-info {
  margin-top: 5px;
  padding-left: 100px;
}

.people-card {
  width: 900px;
  margin-top: 10px;
  position: relative;
}

.people-del {
  margin: 10px;
  padding: 3px;
  width: 36px;
  height: 36px;
  font-size: 16px;
  position: absolute;
  top: 5px;
  right: 3px;
  z-index: 1;
}
.car-del {
  margin: 10px;
  padding: 3px;
  width: 36px;
  height: 36px;
  font-size: 16px;
  position: absolute;
  top: -8px;
  right: -16px;
  z-index: 1;
}

.form-item,
.form-item-star {
  margin-bottom: 20px;
}

.form-item-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 4px;
  box-sizing: border-box;
  font-weight: 700;
}

.form-item-star .form-item-label::before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}

.form-item .form-item-label::before {
  content: "";
  margin-right: 10px;
}
</style>