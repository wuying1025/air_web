<template>
  <div class="law-container">
    <el-container>
      <!-- 左侧侧栏 -->
      <el-aside width="17%">
        <!-- logo -->
        <div class="law-logo">
          <img src="@/assets/images/logo.png" alt />
          <div class="law-title">法规查询提醒系统</div>
        </div>
        <!-- 菜单 -->
        <el-menu class="el-menu-vertical-demo" text-color="#001d6f" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="iconfont icon-zuzhijiagou"></i>
              <span>发文部门</span>
            </template>
            <!-- 递归菜单 -->
            <ComMenu :menuList="menuList"></ComMenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container class="law-main">
        <!-- 右侧头部 -->
        <el-header height="108px">
          <com-header></com-header>
        </el-header>
        <!-- 右侧内容 -->
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
                    >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column
                      type="index"
                      width="80"
                      label="序号"
                      :index="(currentPage-1)*pageSize+1"
                    ></el-table-column>
                    <el-table-column prop="title" label="法规名称" width="120"></el-table-column>
                    <el-table-column prop="categoryName" label="法规分类" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="下载" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a
                          href="javascript:;"
                          @click.stop="downHandle(scope.row)"
                        >{{ scope.row.name }}</a>
                      </template>
                    </el-table-column>
                    <el-table-column prop="content" label="条令内容" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="isDone" label="相关工作落实" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                        <span v-if="scope.row.isTimeout == 1" class="isdone overtime">超时</span>
                        <span v-else-if="scope.row.isDone == 0" class="isdone unfinish">未落实</span>
                        <span v-else class="isdone finish">已落实</span>
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
              <el-tab-pane label="已落实" name="1">
                <div class="main-content">
                  <el-table
                    ref="multipleTable"
                    :data="list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    :header-cell-style="{background:'#fafafa'}"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column
                      type="index"
                      width="80"
                      label="序号"
                      :index="(currentPage-1)*pageSize+1"
                    ></el-table-column>
                    <el-table-column prop="title" label="法规名称" width="120"></el-table-column>
                    <el-table-column prop="categoryName" label="法规分类" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="下载" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a
                          href="javasvript:;"
                          @click.stop="downHandle(scope.row)"
                        >{{ scope.row.name }}</a>
                      </template>
                    </el-table-column>
                    <el-table-column prop="content" label="条令内容" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="isDone" label="相关工作落实" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                        <span v-if="scope.row.isDone == 1" class="isdone finish">已落实</span>
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
              <el-tab-pane label="未落实" name="0">
                <div class="main-content">
                  <el-table
                    ref="multipleTable"
                    :data="list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    :header-cell-style="{background:'#fafafa'}"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column
                      type="index"
                      width="80"
                      label="序号"
                      :index="(currentPage-1)*pageSize+1"
                    ></el-table-column>
                    <el-table-column prop="title" label="法规名称" width="120"></el-table-column>
                    <el-table-column prop="categoryName" label="法规分类" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="下载" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a
                          href="javascript:;"
                          @click.stop="downHandle(scope.row)"
                        >{{ scope.row.name }}</a>
                      </template>
                    </el-table-column>
                    <el-table-column prop="content" label="条令内容" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="isDone" label="相关工作落实" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                        <span v-if="scope.row.isDone == 0" class="isdone unfinish">未落实</span>
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
              <el-tab-pane label="超时" name="2">
                <div class="main-content">
                  <el-table
                    ref="multipleTable"
                    :data="list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    :header-cell-style="{background:'#fafafa'}"
                  >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column
                      type="index"
                      width="80"
                      label="序号"
                      :index="(currentPage-1)*pageSize+1"
                    ></el-table-column>
                    <el-table-column prop="title" label="法规名称" width="120"></el-table-column>
                    <el-table-column prop="categoryName" label="法规分类" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="下载" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a
                          href="javascript:;"
                          @click.stop="downHandle(scope.row)"
                        >{{ scope.row.name }}</a>
                      </template>
                    </el-table-column>
                    <el-table-column prop="content" label="条令内容" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="isDone" label="相关工作落实" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <!-- isTimeout  1|0 是否超时 不超时判断是否落实 -->
                        <span v-if="scope.row.isTimeout == 1" class="isdone overtime">超时</span>
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
    </el-container>
  </div>
</template>

<script>
import ComHeader from "../../components/ComHeader";
import ComMenu from "../../components/ComMenu";
import axios from "axios";
import { getTreeUser, getData, getCate, getSubCate } from "@/api/law";

export default {
  data() {
    return {
      editableTabsValue: "全部",
      // 人员树型结构
      menuList: [],
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
      props: {}
    };
  },
  components: {
    ComMenu,
    ComHeader
  },
  methods: {
    // 获取组织架构
    getDept() {
      getTreeUser().then(res => {
        this.menuList = res.data;
      });
    },
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
          this.list = res.data.records;
          this.total = res.data.total;
          // console.log(list);
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
      // 循环选中列表下载
      this.checkList.forEach(item => {
        // console.log(item)
        this.downHandle(item);
      });
    }
  },
  created() {
    //请求左侧列表
    this.getDept();
    // this.getCate();
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
/* menu菜单样式重置 */
.icon-zuzhijiagou {
  color: #001d6f;
  font-size: 17px;
  margin-right: 10px;
}
.el-submenu__title {
  outline: 0px;
  border-left: 5px solid #fff;
  background-color: #fff;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0px;
  border-left: 5px solid #001d6f;
  background-color: #e9eafc;
}
.el-submenu__title {
  font-size: 17px;
}
.el-submenu__title i {
  color: #001d6f;
  font-size: 17px;
}
.el-menu-item {
  font-size: 17px;
}

/* menu菜单样式重置结束 */
.law-logo {
  text-align: center;
}
.law-logo img {
  margin-top: 2px;
}
.law-logo .law-title {
  color: #001d6f;
  font-size: 19px;
  margin-top: -3px;
  margin-bottom: 10px;
}
.law-main {
  background: #eaeff3 url(../../assets/images/bg.jpg) right 0 no-repeat;
  background-size: contain;
  min-height: 100vh;
}

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
  height: calc(100vh - 210px);
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
  background: #f61717;
}
.finish {
  background: #8a8a8a;
}
.overtime {
  background: #f6ac1e;
}
.el-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
}
</style>