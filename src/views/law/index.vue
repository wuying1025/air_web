<template>
  <div class="law-container">
    <el-container class="law-main">
      <el-main>
        <div class="main-tabs">
          <!-- 筛选条件 -->
          <ul class="main-tabs-right">
            <li class="export-btn" @click="donwloadAll">导出</li>
            <li>
              <el-cascader
                v-model="cateId"
                clearable
                :props="props"
                @change="change"
                placeholder="请选择分类"
                filterable
              ></el-cascader>
            </li>
            <li>
              <el-select v-model="time" size="medium" @change="change" placeholder="请选择时间">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="月份" :value="1"></el-option>
                <el-option label="季度" :value="2"></el-option>
                <el-option label="年份" :value="3"></el-option>
              </el-select>
            </li>
            <li class="search-box">
              <el-input v-model="content" size="medium" @change="change" placeholder="请输入搜索内容">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <i slot="suffix" class="el-input__icon iconfont icon-Shape"></i>
              </el-input>
            </li>
          </ul>
          <!-- tab切换 -->
          <el-tabs v-model="status" type="card" @tab-click="change()">
            <el-tab-pane label="全部" name="3">
              <div class="main-content">
                <el-table
                  ref="multipleTable"
                  :data="list"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  :header-cell-style="{background:'#fafafa'}"
                  @selection-change="handleSelectionChange"
                  >
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column
                    type="index"
                     width="50"
                    label="序号"
                    :index="(currentPage-1)*pageSize+1"
                  ></el-table-column>
                  <el-table-column prop="title" label="名称" ></el-table-column>
                  <el-table-column prop="categoryName" label="分类"  width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptName" label="发文部门" width="80"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="content" label="内容" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="下载" width="60" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        @click.stop="downHandle(scope.row)"
                      >下载</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="finishTime" label="截止时间" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="isDone" label="相关工作落实" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span v-if="scope.row.isDone == 1" class="isdone finish" @click="goUnFinish(scope.row)">已落实</span>
                      <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                      <span v-else-if="scope.row.isTimeout > 0" class="isdone overtime">超时</span>
                      <span v-else class="isdone unfinish" @click="goFinish(scope.row)">未落实</span>
                      <!-- <span v-else-if="scope.row.isDone == 0" class="isdone unfinish">未落实</span> -->
                      <!-- <span v-else class="isdone finish">已落实</span> -->
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
            </el-tab-pane>
            <el-tab-pane name="1">
              <span slot="label">
                <i class="count">{{doneNum}}</i>
                已落实
              </span>
              <div class="main-content">
                <el-table
                  ref="multipleTable"
                  :data="list"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  :header-cell-style="{background:'#fafafa'}"
                >
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column
                    type="index"
                     width="50"
                    label="序号"
                    :index="(currentPage-1)*pageSize+1"
                  ></el-table-column>
                  <el-table-column prop="title" label="名称" ></el-table-column>
                  <el-table-column prop="categoryName" label="分类"  width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptName" label="发文部门" width="80"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="content" label="内容"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="下载" width="60" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        @click.stop="downHandle(scope.row)"
                      >下载</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="finishTime" label="截止时间" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="isDone" label="相关工作落实" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                      <span v-if="scope.row.isDone == 1" class="isdone finish"  @click="goUnFinish(scope.row)">已落实</span>
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
            </el-tab-pane>
            <el-tab-pane name="0">
              <span slot="label">
                <i class="count">{{unDoneNum}}</i>
                未落实
              </span>
              <div class="main-content">
                <el-table
                  ref="multipleTable"
                  :data="list"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  :header-cell-style="{background:'#fafafa'}"
                >
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column
                    type="index"
                     width="50"
                    label="序号"
                    :index="(currentPage-1)*pageSize+1"
                  ></el-table-column>
                  <el-table-column prop="title" label="名称" ></el-table-column>
                  <el-table-column prop="categoryName" label="分类"  width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptName" label="发文部门" width="80"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="content" label="内容"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="下载" width="60" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        @click.stop="downHandle(scope.row)"
                      >下载</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="finishTime" label="截止时间" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="isDone" label="相关工作落实" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                      <span
                        v-if="scope.row.isDone == 0"
                        class="isdone unfinish"
                        @click="goFinish(scope.row)"
                      >未落实</span>
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
            </el-tab-pane>
            <el-tab-pane name="2">
              <span slot="label">
                <i class="count">{{timeOutNum}}</i>
                超时
              </span>
              <div class="main-content">
                <el-table
                  ref="multipleTable"
                  :data="list"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  :header-cell-style="{background:'#fafafa'}"
                >
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column
                    type="index"
                     width="50"
                    label="序号"
                    :index="(currentPage-1)*pageSize+1"
                  ></el-table-column>
                  <el-table-column prop="title" label="名称"></el-table-column>
                  <el-table-column prop="categoryName" label="分类"  width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptName" label="发文部门" width="80"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="content" label="内容"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="下载" width="60" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        @click.stop="downHandle(scope.row)"
                      >下载</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="finishTime" label="截止时间" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="isDone" label="相关工作落实" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                      <span v-if="scope.row.isTimeout > 0" class="isdone overtime">超时</span>
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
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import {
  getData,
  getCate,
  getSubCate,
  finishLaw,
  unFinishLaw
} from "@/api/law";

export default {
  data() {
    return {
      editableTabsValue: "全部",
      list: [],
      checkList: [], //选中列表
      // cateList: [], //一级分类别表
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      status: "3", //0 未落实   1已落实   2超时finishTime   3  全部
      cateType: 1, //1一级  2二级,
      cateId: [], //收集分类id
      content: "", //搜索框内容
      deptId: 0, //部门id全部
      time: 0, // 0 全部  1月 2季  3 年
      // 级联分类
      props: {},
      unDoneNum:0,
      doneNum:0,
      timeOutNum:0
    };
  },
  methods: {
    // 获取数据
    getData() {
      // POST /resources/selectMyResources
      // status  0 未落实   1已落实   2超时    3  全部
      // cateType  分类 一级分类 1  二级分类 2
      // cateId  分类id
      // content  搜索内推
      // deptId 0 全部部门  |部门id
      // time  月1 季2 年3
      // currentPage当前页
      // size 分页每页条数
      getData({
        current: this.currentPage,
        size: this.pageSize,
        status: parseInt(this.status),
        cateType: this.cateId.length, //  一级 1   二级 2   全部0
        cateId: this.cateId[this.cateId.length - 1],
        content: this.content,
        deptId: this.deptId,
        time: this.time
      })
        .then(res => {
          this.list = res.data.result.records;
          this.total = res.data.result.total;
          this.unDoneNum = res.data.countNum;
          this.doneNum = res.data.doneNum;
          this.timeOutNum = res.data.timeOutNum;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查看一级分类列表
    getCate() {
      getCate().then(res => {
        this.cateList = res.data;
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    //下载
    downHandle(obj) {
      // 修改下载状态
      window.open(obj.url);
    },
    // 条件变化重新获取数据
    change() {
      this.getData();
    },
    // 部门选中回调
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      this.deptId = key;
      this.getData();
    },
    // 表格多选
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      this.checkList = val;
    },
    donwloadAll() {
      if(this.checkList.length == 0){
        this.$message({
          message: "请勾选需要下载的法规文件",
          type: "warning"
        });
      }
      // 循环选中列表下载
      this.checkList.forEach(item => {
        this.downHandle(item);
      });
    },
    // 获取所有部门数据
    getAllDept() {
      this.deptId = 0;
      this.getData();
    },
    // 去落实
    goFinish(obj) {
      // 是否确定落实
      this.$confirm("确认落实此法规， 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        finishLaw({ id: obj.id }).then(res => {
          this.getData();
        });
      });
    },
    // 落实变未落实
    goUnFinish(obj) {
      // 是否确定落实
      this.$confirm("确认落实变成未落实法规, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        unFinishLaw({ id: obj.id }).then(res => {
          this.getData();
        });
      });
    }
  },
  created() {
    this.getData();
    this.props = {
      checkStrictly: true,
      lazy: true,
      lazyLoad(node, resolve) {
        const { level } = node;
        if (level == 0) {
          getCate().then(res => {
            const nodes = res.data.map(item => ({
              value: item.id,
              label: item.name,
              leaf: level >= 1
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        } else if (level == 1) {
          console.log(1, level);

          getSubCate({ id: node.value }).then(res => {
            const nodes = res.data.map(item => ({
              value: item.id,
              label: item.name,
              // leaf: true
              leaf: level >= 1
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        } else if (level == 2) {
          // console.log(2,level);
          resolve([]);
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>

/* 右侧筛选 */
.main-tabs {
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
.isdone{
  cursor: pointer;
}
.overtime {
  background: #f61717;
}
.el-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
}

.page-box {
  margin-top: 20px;
}
.count{
  position: absolute;
  right: 13px;
  width: 14px;
  height: 14px;
  font-size: 12px;
  text-align: center;
  line-height: 12px;
  top: 3px;
  background: #f00;
  color: #fff;
  border-radius: 50%;
  font-style: normal;
}
</style>