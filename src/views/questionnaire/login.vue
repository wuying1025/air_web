<template>
  <div class="login-container">
    <el-form :model="loginForm" class="login-form" label-width="60px">
      <h3 class="title">问卷调查</h3>
      <el-form-item label="部门" prop="deptId">
        <el-select
          v-model="loginForm.deptId"
          placeholder="请选择部门"
          style="width: 260px"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="userId">
        <el-select
          v-model="loginForm.userId"
          placeholder="请选择姓名"
          style="width: 260px"
        >
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问卷" prop="questionId">
        <el-select
          v-model="loginForm.questionId"
          placeholder="请选择问卷"
          style="width: 260px"
        >
          <el-option
            v-for="item in questionList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 230px"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">开始</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { lastDept } from "@/api/system/dept"
import { selectPerson } from "@/api/insider"
import { getAddList } from "@/api/question"

export default {
  data() {
    return {
      loginForm: {
        deptId: '',
        userId: '',
        questionId: ''
      },
      loading: false,
      deptList: [],
      personList: [],
      questionList: []
    }
  },
  computed: {
    changeDeptId() { return this.loginForm.deptId }
  },
  watch: {
    changeDeptId(val) {
      if (val != 0) {
        this.personList = []
        this.loginForm.userId = ''
        this.getPersonInfoByDeptId(val)
      }
    }
  },
  methods: {
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
      }
    },
    async getPersonInfoByDeptId(deptId) {
      const res = await selectPerson({
        deptId,
        current: 0,
        size: 999,
      })
      if (res.code === '200' && res.data) {
        this.personList = res.data.records
      }
    },
    async getData() {
      const res = await getAddList({
        pageNum: 0,
        pageSize: 99999
      })
      console.log(res);
      this.questionList = res.data.records;
    },
    handleLogin() {
      this.$router.push('/questionnaireTest')
    }
  },
  mounted() {
    this.getDeptList();
    // this.getData();
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background: #eaeff3 url(../../assets/image/bg.jpg) 0 0 no-repeat;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
</style>