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
        <el-form-item label="身份" prop="jobTypeName">
          <el-input
            v-model="station.jobTypeName"
            style="width: 400px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="职级" prop="jobName">
          <el-input
            v-model="station.jobName"
            style="width: 400px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="居住地点" prop="home">
          <el-input
            v-model="station.home"
            style="width: 400px"
            placeholder="请输入居住地点"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划离队时间" prop="leaveTime">
          <el-date-picker
            v-model="station.leaveTime"
            type="datetime"
            placeholder="请选择计划离队时间"
            style="width: 400px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计划归队时间" prop="backTime">
          <el-date-picker
            v-model="station.backTime"
            type="datetime"
            placeholder="请选择计划归队时间"
            style="width: 400px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNum">
          <el-input v-model="station.carNum" style="width: 400px"></el-input>
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
          <el-button type="primary" @click="addHandle('station')"
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
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="idCard"
            label="身份证号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="jobTypeName"
            label="身份"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="jobName"
            label="职级"
          ></el-table-column>
          <el-table-column label="操作" width="220" align="center">
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
import { savePersonout, getPersonById, selectPersonByDept } from '@/api/goout'
export default {
  data() {
    return {
      station: {
        name: '',
        userId: '', // 用户Id
        job: '', // 职务
        home: '', // 居住地点
        leaveTime: '', // 计划离队时间
        backTime: '', // 计划归队时间
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
        jobName: [{ required: true, message: '请输入职级', trigger: 'blur' }],
        home: [{ required: true, message: '请输入居住地点', trigger: 'blur' }],
        leaveTime: [{ required: true, message: '请输入计划离队时间', trigger: 'blur' }],
        backTime: [{ required: true, message: '请输入计划归队时间', trigger: 'blur' }],
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
      // 驻地外出 type = 2
      this.station.typeId = 2
      const res = await savePersonout(this.station)
      console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // this.$router.push('/insiderManage/type')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    async updateHandle() {
      //   const res = await updateOutType(this.station)
      //   // console.log(res);
      //   if (res && res.code === '200') {
      //     this.$message({
      //       message: '修改成功',
      //       type: 'success'
      //     })
      //     this.$router.go(-1)
      //   } else {
      //     this.$message({
      //       message: '修改失败',
      //       type: 'error'
      //     })
      //     console.error(res)
      //   }
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
      this.dialogVisible = false
    }
  },
  mounted() {
    this.selectPerson()
    /* const { id } = this.$route.params
    if (id) {
      const res = await getPersonById(id)
      console.log(res)
      if (res && res.code === '200') {
        switch (res.data.jobType) {
          case '1':
            res.data.jobTypeName = '主官'
            break
          case '2':
            res.data.jobTypeName = '干部'
            break
          case '3':
            res.data.jobTypeName = '义务兵'
            break
          default:
            res.data.jobTypeName = '义务兵'
        }
        this.station = res.data
      }
    } */
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