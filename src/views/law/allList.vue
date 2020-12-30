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
            <el-tab-pane label="全部法规" name="3">
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
                  <el-table-column type="selection" width="40" ></el-table-column>
                  <el-table-column
                    type="index"
                    width="50"
                    label="序号"
                    :index="(currentPage-1)*pageSize+1"
                  ></el-table-column>
                  <el-table-column prop="title" label="名称" width="160"></el-table-column>
                  <el-table-column prop="categoryName" label="分类"  width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptName" label="发文部门" width="80"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="finishTime" label="截止时间" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="下载" width="50" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <a
                        href="javascript:;"
                        @click.stop="downHandle(scope.row)"
                      >下载</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="content" label="内容" width="270" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="content" label="完成详情" width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{scope.row.doneCount}}/{{scope.row.deptCount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="isDone" label="相关工作落实" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="detail-btn" @click="go(scope.row.id)">查看</span>
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
  allLawList,
  getCate,
  getSubCate,
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
      time: 0, // 0 全部  1月 2季  3 年
      // 级联分类
      props: {}
    };
  },
  methods: {
    // 获取数据
    getData() {
      allLawList({
        current: this.currentPage,
        size: this.pageSize,
        status: parseInt(this.status),
        cateType: this.cateId.length, //  一级 1   二级 2   全部0
        cateId: this.cateId[this.cateId.length - 1],
        content: this.content,
        time: this.time
      })
        .then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
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
    // 表格多选
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      this.checkList = val;
    },
    donwloadAll() {
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
    go(id){
      this.$router.push({
        path:"/laws/detail",
        query:{id}
      })
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
.detail-btn{
  background: #7094fd;
  color:#fff;
  display: inline-block;
  width: 60px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 10px;
  cursor: pointer;
}
</style>