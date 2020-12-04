<template>
  <div>
    <el-main>
      <div class="main-content">
        <el-table
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          stripe
          border
          :header-cell-style="{background:'#fafafa'}"
        >
          <el-table-column align="center" prop="deptName" label="连队" width="120"></el-table-column>
          <el-table-column align="center" prop="title" label="内容" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="endTime" label="截止时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="finishTime" label="落实时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="isDone" label="落实状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="detail-btn" @click="go(scope.row.id)">查看</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </div>
</template>

<script>
import { getLawDoneById } from "@/api/law.js";
export default {
  data() {
    return {
        list:[],
        id:this.$route.query.id
    };
  },
  methods: {
    getData() {
        console.log(111)
      getLawDoneById({id:this.id}).then(res => {
          console.log(222)
          this.list = res.data;
      });
    }
  },
  created() {
    // /getResDoneById/{id}
    this.getData();
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
</style>