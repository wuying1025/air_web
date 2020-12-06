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
          :header-cell-style="{background:'#4a77fc',color:'#fff'}"
        >
          <el-table-column align="center" prop="deptName" label="连队" width="120"></el-table-column>
          <el-table-column align="center" prop="title" label="内容" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="finishTime" label="截止时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="落实时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="isDone" label="落实状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.createTime" class="isdone finish">已落实</span>
              <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
              <span v-else-if="scope.row.isTimeout > 0" class="isdone overtime">超时</span>
              <span v-else class="isdone unfinish" @click="goFinish(scope.row)">未落实</span>
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
      list: [],
      id: this.$route.query.id
    };
  },
  methods: {
    getData() {
      getLawDoneById({ id: this.id }).then(res => {
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