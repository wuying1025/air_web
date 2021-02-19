<template>
  <el-main>
    <div class="main-content">
      <el-form
        ref="queryForm"
        align="right"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入人员姓名"
            size="small"
            style="width: 240px"
            @submit.native.prevent
            v-on:keyup.13="onSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            style="background: rgb(74, 119, 252)"
            size="mini"
            @click="onSearch"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="onReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="background: rgb(74, 119, 252)"
            size="mini"
            @click="$router.push('/out/stationApply')"
            >驻地人员外出申请</el-button
          >
        </el-col>
      </el-row>

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
      <!-- <div class="page-box">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div> -->
    </div>
  </el-main>
</template>

<script>
import { selectPersonOut } from "@/api/goout.js";

export default {
  data() {
    return {
      personData: [],
      loading: false,
      currentPage: 0, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      search: {
        name: ''
      }
    };
  },
  methods: {
    async selectPerson() {
      this.loading = true;
      const res = await selectPersonOut({
        current: this.currentPage,
        size: this.pageSize,
        deptId: 0,
        status: 0
      })
      console.log(res);
      if (res && res.data) {
        // res.data.map(item => {
        //   switch (item.jobType) {
        //     case '1':
        //       item.jobTypeName = '主官'
        //       break
        //     case '2':
        //       item.jobTypeName = '干部'
        //       break
        //     case '3':
        //       item.jobTypeName = '义务兵'
        //       break
        //     default:
        //       item.jobTypeName = '义务兵'
        //   }
        // })
        this.personData = res.data
      }
      this.loading = false;
    },
    apply(person) {
      this.$router.push(`/out/stationApply/${person.id}`)
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.selectPerson();
    },
    onSearch() {

    },
    onReset() {

    },
  },
  mounted() {
    this.selectPerson()
  },
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
