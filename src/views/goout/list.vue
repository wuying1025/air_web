<template>
  <div>
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
        <el-table
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          stripe
          border
          v-loading="loading"
          :header-cell-style="{ background: '#4a77fc', color: '#fff' }"
        >
          <el-table-column
            align="center"
            label="序号"
            width="50"
            type="index"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="nameCard"
            label="来访人"
            width="260px"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.nameCard"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="carNum" label="车牌号">
          </el-table-column>
          <!-- <el-table-column align="center" prop="company" label="联系人单位"></el-table-column> -->
          <!-- <el-table-column align="center" prop="contacts" label="联系人"></el-table-column> -->
          <el-table-column
            align="center"
            prop="time"
            label="来访时段"
            width="180px"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.time"></div> </template
          ></el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="来访事由"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="company"
            label="联系单位"
          ></el-table-column>
          <el-table-column align="center" label="操作" width="190">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                v-if="scope.row.in"
                icon="el-icon-right"
                @click="enter(1, scope.row.id)"
                >进入</el-button
              >
              <el-button
                size="mini"
                type="success"
                v-if="!scope.row.in"
                icon="el-icon-back"
                @click="enter(2, scope.row.id)"
                >离开</el-button
              >
              <el-button
                size="mini"
                type="primary"
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
    </el-main>
  </div>
</template>

<script>
import { dateFormat } from "@/utils/format.js";
import { selectIn, getDetailById, saveRecord } from "@/api/goout.js";
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
      },
      clickFlag: true
    };
  },
  methods: {
    async selectIn(
      searchData = {
        ...this.search,
        size: this.pageSize,
        current: this.currentPage,
        status: 2, // ''为全部
      }
    ) {
      this.loading = true;
      const res = await selectIn(searchData);
      if (res && res.code === "200") {
        let promiseArr = []
        res.data.records && res.data.records.map((item, index) => {
          item.time = item.startTime + '<br>至<br>' + item.endTime
          let nameArr = item.name.split(',')
          let idCardArr = item.idCard.split(',')
          item.nameCard = ''
          nameArr.map((n, i) => {
            item.nameCard += n + '：' + idCardArr[i] + '；<br>'
          })
          // 查询进入离开情况
          let p = new Promise((resolve, reject) => {
            getDetailById(item.id).then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          })
          promiseArr.push(p)
        })
        // in = true 表示可以进入
        Promise.all(promiseArr).then(r => {
          r.map((e, i) => {
            if (e.code == 200 && e.data && e.data.records) {
              if (e.data.records.length == 0) {
                res.data.records[i].in = true
              } else if (e.data.records[0] && e.data.records[0].type == 1) {
                res.data.records[i].in = false
              } else if (e.data.records[0] && e.data.records[0].type == 2) {
                res.data.records[i].in = true
              }
            }
          })
          this.list = res.data.records;
          this.total = res.data.total;
        }).catch(err => {
          console.log(err);
        })
      }
      this.loading = false;
    },
    showDetail(data) {
      this.$router.push({ path: "/out/detail", query: { id: data.id } });
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
    },
    enter(type, id) {
      const confirmTitle = (type == 1 ? '进入' : '离开')
      const nowTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      this.$confirm(confirmTitle + '时间为：' + nowTime, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await saveRecord({
          time: nowTime,
          type, //1进入 2 出
          inId: id
        });
        if (res.code === "200") {
          this.$message({
            type: 'success',
            message: confirmTitle + '成功!'
          });
          this.selectIn()
        } else {
          this.$message({
            message: "记录失败",
            type: "error"
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
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