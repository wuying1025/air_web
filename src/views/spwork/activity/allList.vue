<template>
  <div>
    <el-main>
      <div class="main-content">
        <el-table
          ref="multipleTable"
          :data="workList"
          tooltip-effect="dark"
          style="width: 100%"
          stripe
          border
          v-loading="loading"
          :header-cell-style="{background:'#4a77fc',color:'#fff'}"
        >
          <el-table-column align="center" label="序号" width="120" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="工作名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="remark" label="工作内容" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click.stop="showDetail(scope.row)"
              >详情</el-button>
              <!-- 小兵角色user的可以填报 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-if="scope.row.type && roles == 'user'"
                @click.stop="edit(scope.row)"
              >填报</el-button>
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
import { getLawDoneById } from "@/api/law.js";
import {
  selectAcitvity,
  delWorklistById,
  getStep,
  updateStep
} from "@/api/worklist";
export default {
  data() {
    return {
      workList: [],
      id: this.$route.query.id,
      loading: false,
      total: 0,
      currentPage: 0,
      pageSize: 10,
      roles: this.$store.state.user.roles[0]
    };
  },
  methods: {
    async selectAcitvity(
      data = { current: this.currentPage, size: this.pageSize }
    ) {
      this.loading = true;
      const res = await selectAcitvity(data);
      // console.log(res)
      if (res && res.code === "200") {
        this.workList = res.data.records;
      }
      this.loading = false;
    },
    showDetail(data) {
      // 活动类type 1
      if (data.type == 1) {
        this.$router.push({path:"/work/activity",query:{id:data.id}});
      } else {
        // 检查类 type 0
        this.$router.push({path:"/work/inspect",query:{id:data.id}});
      }
    },
    edit(data){
      this.$router.push({path:'/work/editActivity',query:{id:data.id}})
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    }
  },
  created() {
    this.selectAcitvity();
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