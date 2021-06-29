<template>
  <div class="app-container">
    <div class="content">
      <el-table :data="dataList" style="width: 100%" v-loading="loading">
        <el-table-column type="index" width="150" label="序号">
        </el-table-column>
        <el-table-column prop="title" label="名称"></el-table-column>
        <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click.stop="showDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-flag"
              @click.stop="appealBtn(scope.row)"
              >申诉</el-button
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
    <!-- 弹框 -->
    <el-dialog v-loading="diaLoading" @closed="closeDialog" title="问题申诉" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="appealForm" :rules="rules">
        <el-form-item label="申诉人" label-width="120px" prop="title">
          <el-input v-model="appealForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="申诉内容" label-width="120px" prop="content">
          <el-input
            type="textarea"
            v-model="appealForm.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appealHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { exposureList } from "@/api/exposure";
import { addAppeal } from "@/api/appeal"
export default {
  data() {
    return {
      diaLoading:false,
      appealForm: {},
      dialogFormVisible: false,
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog(){
      this.$refs.form.resetFields();
    },
    // 申诉按钮
    appealBtn(row) {
      this.appealId = row.id;
      this.dialogFormVisible = true;
    },
    // 申诉
    appealHandle() {
      this.diaLoading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          addAppeal({
            username: this.appealForm.title,
            hid: this.appealId,
            complaint: this.appealForm.content,
          }).then((res) => {
            console.log(res);
            this.$refs.form.resetFields();
            this.dialogFormVisible = false;
            this.diaLoading = false;
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    // 获取法规列表数据
    getList() {
      this.loading = true;
      exposureList({
        current: this.currentPage,
        size: this.pageSize,
        type: 2,
      }).then((res) => {
        console.log(res);
        this.dataList = res.data.records;
        this.loading = false;
      });
    },
    // 初始化数据
    initData() {
      this.currentPage = 1;
      this.getList();
    },

    // 查看详情
    showDetail(_data) {
      this.$router.push({
        path: "/exposure_/detail/" + _data.id,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped>
li {
  list-style: none;
}
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