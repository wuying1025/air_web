<template>
  <div>
    <el-main>
      <div class="main-content">
        <el-form ref="queryForm" align="right" :inline="true" @submit.native.prevent>
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
              style="background:rgb(74, 119, 252)"
              size="mini"
              @click="onSearch"
            >搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          stripe
          border
          v-loading="loading"
          :header-cell-style="{background:'#4a77fc',color:'#fff'}"
        >
          <el-table-column align="center" label="序号" width="120" type="index"></el-table-column>
          <el-table-column align="center" prop="contacts" label="联系人" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="name" label="来访人员" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="title" label="来访事由" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click.stop="showDetail(scope.row)"
              >详情</el-button>
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
  </div>
</template>

<script>
import { selectInLeader } from "@/api/goout.js";
export default {
  data() {
    return {
      list: [],
      loading: false,
      currentPage: 0, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      search: {
        name: ""
      }
    };
  },
  methods: {
    async selectIn(
      searchData = {
        ...this.search,
        size: this.pageSize,
        current: this.currentPage
      }
    ) {
      this.loading = true;
      const res = await selectInLeader(searchData);
      if (res && res.code === "200") {
        this.list = res.data.records;
        this.total = res.data.total
      }
      this.loading = false;
    },
    showDetail(data) {
        this.$router.push({ path: "/out/leaderdetail", query: { id: data.id } });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.selectIn();
    },
    onSearch() {
      this.selectIn();
    },
    onReset() {
      this.search.name = "";
      this.selectIn();
    }
  },
  created() {
    this.selectIn();
  }
};
</script>

<style lang="scss" scoped>
/*表格内容区  */
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
  /* height:calc(100vh-200px); */
}
.main-content .isdone {
  border-radius: 40px;
  color: #fff;
  display: inline-block;
  padding: 0px 12px;
}
.unfinish {
  background: #f6ac1e;
  cursor: pointer;
}
.finish {
  background: #8a8a8a;
}
.overtime {
  background: #f61717;
}
</style>