<template>
  <el-main>
    <div class="main-content">
     <!--  <el-form
        ref="queryForm"
        align="right"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入人员姓名"
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
            @click="onSearch"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form> -->

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="background: rgb(74, 119, 252)"
            size="mini"
            @click="$router.push('/out/leaveApply')"
            >请假外出申请</el-button
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
          prop="userName"
          label="姓名"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="请假事由"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="startTime"
          label="计划离队时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="endTime"
          label="计划离队时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="statusStr"
          label="状态"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="备注"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="update(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
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
        status: 0,
        typeId: 1 // 请假1
      })
      console.log(res);
      if (res && res.data && res.data.records) {
        res.data.records.map(item => {
          switch (item.status) {
            case 1:
              item.statusStr = '待审批'
              break
            case 2:
              item.statusStr = '通过'
              break
            case 3:
              item.statusStr = '不通过'
              break
            default:
              item.statusStr = '待审批'
          }
        })
        this.personData = res.data.records
        this.total = res.data.total
      }
      this.loading = false;
    },
    update(person) {
      this.$router.push(`/out/leaveApply/${person.id}`)
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
.el-form-item{
  margin-bottom: 0!important;
}
</style>
