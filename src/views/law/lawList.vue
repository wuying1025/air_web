<template>
  <div class="app-container">
    <div class="main-tabs">
      <ul class="main-tabs-right">
        <li class="search-box">
          <el-input
            v-model="searchText"
            size="medium"
            clearable
            @clear="clearInp"
            placeholder="可根据名称和简介搜索"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </li>
        <li class="export-btn" @click="searchTitle">搜索</li>
        <li class="export-btn" @click="getList">重置</li>
      </ul>
    </div>

    <div class="content">
      <el-table
        @row-click="checkLine"
        :data="dataList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="法规简介"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click.stop="showDetail(scope.row)"
              >详情</el-button
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
  </div>
</template>
<script>
import { getRawList, delLaw, getByTitle } from "@/api/law";
export default {
  data() {
    return {
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
    };
  },
  methods: {
    // 清空搜索框
    clearInp() {
      this.searchText = '';
      this.getList();
    },
    // 按标题搜索内容
    searchTitle() {
      // this.loading = true;
      // getByTitle(this.searchText).then((res) => {
      //   let thisData = [];
      //   this.loading = false;
      //   thisData = res.data.map((item) => {
      //     item.createTime = item.createTime.split(" ")[0];
      //     return item;
      //   });
      //   this.dataList = thisData;
      // })

      this.$router.push({
        path: "/release/lawdetail/0",
        query: {
          search: this.searchText
        }
      });

    },
    //单行选中
    checkLine(row) {
      this.$router.push({
        path: "/release/lawdetail/" + row.id,
      });
    },
    // 获取法规列表数据
    getList() {
      this.loading = true;
      getRawList({
        current: this.currentPage,
        size: this.pageSize,
      }).then((res) => {
        let thisData = [];
        this.loading = false;
        this.total = res.data.total
        thisData = res.data.records.map((item) => {
          item.createTime = item.createTime.split(" ")[0];
          return item;
        });
        this.dataList = thisData;
      });
    },
    /** 删除按钮操作 */
    delHandle(_data) {
      this.$confirm("此操作将永久删除且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delLaw({
            id: _data.id,
          }).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 查看详情
    showDetail(_data) {
      this.$router.push({
        path: "/release/lawdetail/" + _data.id,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped>
.content {
  padding: 20px;
  background-color: #fff;
  min-height: 500px;
  border-radius: 5px;
}
.main-tabs {
  height: 50px;
  position: relative;
}
.main-tabs-right {
  position: absolute;
  right: -10px;
  z-index: 3;
}
.main-tabs-right li.export-btn {
  width: 85px;
  background: #fcc349;
  cursor: pointer;
  color: #001d6f;
  text-align: center;
  line-height: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 16px;
}
.main-tabs-right li {
  width: 150px;
  float: left;
  margin-right: 10px;
}
.main-tabs-right li.search-box {
  width: 280px;
}
.search-box .el-input__suffix {
  right: 10px;
}
</style>