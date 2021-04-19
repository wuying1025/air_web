<template>
  <el-main>
    <div class="main-content">
      <el-form
        ref="station"
        :model="station"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="外出人员姓名" prop="name">
          <el-input
            v-model="station.name"
            style="width: 400px"
            @click.native="dialogVisible = true"
            placeholder="点击选择人员"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="station.idCard"
            style="width: 400px"
            disabled
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="身份" prop="jobTypeName">
          <el-input
            v-model="station.jobTypeName"
            style="width: 400px"
            disabled
          ></el-input>
        </el-form-item> -->
        <el-form-item label="部职别" prop="jobName">
          <el-input
            v-model="station.jobName"
            style="width: 400px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="军衔" prop="remark1">
          <el-input
            v-model="station.remark1"
            style="width: 400px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="外出事由" prop="title">
          <el-input v-model="station.title" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="计划离队时间" prop="startTime">
          <el-date-picker
            v-model="station.startTime"
            type="datetime"
            placeholder="请选择计划离队时间"
            style="width: 400px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计划归队时间" prop="endTime">
          <el-date-picker
            v-model="station.endTime"
            type="datetime"
            placeholder="请选择计划归队时间"
            style="width: 400px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="责任人" prop="approvalUser">
          <el-input
            v-model="station.approvalUser"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            style="width: 400px"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入备注"
            v-model="station.remark"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$route.params.id"
            type="primary"
            @click="updateHandle('station')"
            >确定修改</el-button
          >
          <el-button v-else type="primary" @click="addHandle('station')"
            >提交申请</el-button
          >
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        title="选择人员"
        :visible.sync="dialogVisible"
        width="980px"
        :before-close="handleClose"
      >
        <el-table
          ref="multipleTable"
          :data="personData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="idCard"
            label="身份证号"
            width="180"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="jobTypeName"
            label="身份"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="jobName"
            label="部职别"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="remark1"
            label="军衔"
          ></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="apply(scope.row)"
                >申请外出</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
// import { savePersonout, updateOutType, getOutTypeById } from '@/api/goout'
import { savePersonout, getPersonById, selectPersonByDept, getPersonOutById, updateOut } from '@/api/goout'
import { dateFormat } from "@/utils/format";

export default {
  data() {
    return {
      station: {
        name: '',
        userId: '', // 用户Id
        job: '', // 职务
        home: '', // 居住地点
        startTime: '', // 计划离队时间
        endTime: '', // 计划归队时间
        carNum: '', // 车牌号
        remark: '' //  备注
      },
      id: null,
      dialogVisible: false,
      personData: [],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        jobTypeName: [{ required: true, message: '请输入身份', trigger: 'blur' }],
        jobName: [{ required: true, message: '请输入部职别', trigger: 'blur' }],
        remark1: [{ required: true, message: '请输入军衔', trigger: 'blur' }],
        approvalUser: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
        title: [{ required: true, message: '请输入外出事由', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入计划离队时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入计划归队时间', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async selectPerson() {
      this.loading = true;
      const res = await selectPersonByDept()
      console.log(res);
      if (res && res.data) {
        res.data.map(item => {
          switch (item.jobType) {
            case '1':
              item.jobTypeName = '主官'
              break
            case '2':
              item.jobTypeName = '干部'
              break
            case '3':
              item.jobTypeName = '义务兵'
              break
            default:
              item.jobTypeName = '义务兵'
          }
        })
        this.personData = res.data
      }
      this.loading = false;
    },
    async addHandle() {
      // 请假 type = 1
      this.station.typeId = 1
      this.station.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.station.startTime)
      this.station.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.station.endTime)
      this.station.id = ''

      const res = await savePersonout(this.station)
      console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push('/goout/leave')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    async updateHandle() {
      // 请假 type = 1
      this.station.typeId = 1
      this.station.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.station.startTime)
      this.station.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.station.endTime)

      const res = await updateOut(this.station)
      console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/goout/leave')
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    apply(person) {
      this.station = person
      this.station.userId = person.id
      this.dialogVisible = false
    }
  },
  async mounted() {
    this.selectPerson()
    const { id } = this.$route.params
    if (id) {
      const res = await getPersonOutById(id)
      const personRes = await getPersonById(res.data.userId)
      this.station = Object.assign(personRes.data, res.data);

      switch (personRes.data.jobType) {
        case '1':
          this.station.jobTypeName = '主官'
          break
        case '2':
          this.station.jobTypeName = '干部'
          break
        case '3':
          this.station.jobTypeName = '义务兵'
          break
        default:
          this.station.jobTypeName = ''
      }
      console.log(306);
      console.log(this.station);
    }
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
</style>