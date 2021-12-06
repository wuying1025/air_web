<template>
  <el-main>
    <div class="main-content">
      <div class="app-container">
        <el-form ref="queryForm" :inline="true">
          <el-form-item label="审批状态">
            <el-select
              v-model="search.status"
              placeholder="请选择审批状态"
              size="mini"
            >
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来访人姓名">
            <el-input
              placeholder="请输入来访人姓名"
              v-model="search.name"
              clearable
              size="small"
            />
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
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$router.push('/outsiders/addOutsider')"
              >外来人员登记</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column
            align="center"
            type="index"
            label="序号"
          ></el-table-column>
          <!-- <el-table-column align="center" prop="title" label="来访事由"></el-table-column> -->
          <el-table-column align="center" prop="nameCard" label="来访人" width="260px">
            <template slot-scope="scope">
              <div v-html="scope.row.nameCard"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="carNum" label="车牌号">
          </el-table-column>
          <!-- <el-table-column align="center" prop="company" label="联系人单位"></el-table-column> -->
          <!-- <el-table-column align="center" prop="contacts" label="联系人"></el-table-column> -->
          <el-table-column align="center" prop="time" label="来访时段" width="180px">
            <template slot-scope="scope">
              <div v-html="scope.row.time"></div> </template
          ></el-table-column>
          <el-table-column align="center" prop="title" label="来访事由"></el-table-column>
          <el-table-column align="center" prop="company" label="联系单位"></el-table-column>
          <el-table-column prop="score" label="审批情况" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1" type="success"
                >待审批</el-tag
              >
              <el-tag v-if="scope.row.status == 2">通过</el-tag>
              <el-tag v-if="scope.row.status == 3" type="danger">未通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="lookHandle(scope.row)"
                >来访详情</el-button
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
    </div>
  </el-main>
</template>

<script>
import { selectOutsider, delOutsiderById } from "@/api/outsider.js";

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      search: {
        name: '',
        status: 0
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: null,
      statusList: [{
        id: 0,
        name: '全部'
      }, {
        id: 1,
        name: '待审批'
      }, {
        id: 2,
        name: '审批通过'
      }, {
        id: 3,
        name: '审批未通过'
      }],
    };
  },
  methods: {
    async getData() {
      const res = await selectOutsider({
        ...this.search,
        current: this.currentPage,
        size: this.pageSize,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        res.data.records && res.data.records.map((item, index) => {
          item.time = item.startTime + '<br>至<br>' + item.endTime
          let nameArr = item.name.split(',')
          let idCardArr = item.idCard.split(',')
          item.nameCard = ''
          nameArr.map((n, i) => {
            item.nameCard += n + '：' + idCardArr[i] + '；<br>'
          })
        })

        this.total = res.data.total;
        this.loading = false;
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search = {
        name: '',
        status: 0,
      }
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    lookHandle({ id }) {
      this.$router.push(`/outsiders/getOutsiderDetail/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/outsiders/addOutsider/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delOutsiderById(this.id)
      console.log(res);
      if (res.code == 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } else {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }

    },
  },
  mounted() {
    this.getData();
  },

};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.el-tag {
  cursor: pointer;
}
</style>
