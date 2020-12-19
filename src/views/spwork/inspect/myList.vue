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
          v-loading="loading"
          :header-cell-style="{background:'#4a77fc',color:'#fff'}"
        >
          <el-table-column align="center" label="序号" width="120" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="工作名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="remark" label="工作内容" show-overflow-tooltip></el-table-column>
          <el-table-column align="center"  label="操作" show-overflow-tooltip>
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
      </div>
    </el-main>
  </div>
</template>

<script>
import { getLawDoneById } from "@/api/law.js";
export default {
  data() {
    return {
      list: [{

      }],
      id: this.$route.query.id,
      loading:false
    };
  },
  methods: {
    getData() {
    //   this.loading = true;
    //   getLawDoneById({ id: this.id }).then(res => {
    //     this.list = res.data;
    //     this.loading = false;
    //   });
    },
    showDetail(){
        this.$router.push("/work/inspect");
    }
  },
  created() {
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