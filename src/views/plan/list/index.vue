<template>
  <div>
    <el-main>
      <div class="main-content">
        <!-- <el-form ref="queryForm" :inline="true">
      <el-form-item label="工作名称">
        <el-input
          placeholder="请输入工作名称"
          v-model="search.title"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="工作分类">
        <el-select v-model="search.cateId" placeholder="请选择工作分类">
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.cateName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchHandle()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
          >重置</el-button
        >
      </el-form-item>
    </el-form> -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$router.push('/plans/addWork')"
              >创建工作</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column
            type="index"
            label="序号"
            :index="(currentPage - 1) * pageSize + 1"
          ></el-table-column>
          <el-table-column prop="title" label="工作名称"></el-table-column>
          <el-table-column prop="content" label="工作内容"></el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="lookHandle(scope.row)"
                >查看详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="editHandle(scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="delHandle(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 删除提示 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="
            () => {
              dialogVisible = false;
            }
          "
        >
          <span>确认删除吗</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doDelHandle">确 定</el-button>
          </span>
        </el-dialog>
        <div class="page-box">
          <el-pagination
            style="width: 100%"
            background
            layout="total, prev, pager, next"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { selectWorkplan, delWorkplanById } from "@/api/workplan"

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        cateId: 0,
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: null,
    };
  },
  methods: {
    async getData() {
      const res = await selectWorkplan({
        current: this.currentPage,
        size: this.pageSize,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.cateId = 0;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    lookHandle({ id }) {
      this.$router.push(`/plans/getDetail/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/plans/addWork/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delWorkplanById(this.id)
      if (res && res.code === '200') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      }
    },
  },
  created() {
    this.getData();
  },

};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
  /* height:calc(100vh-200px); */
}
.el-tag {
  cursor: pointer;
}
</style>
