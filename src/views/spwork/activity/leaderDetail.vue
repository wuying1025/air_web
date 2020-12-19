<template>
  <el-main>
    <!-- 进度和图标 -->
    <div class="main-content">
      <div class="down-box">
        <div class="check-icon">
          <img :src="iconImg" class="check-icon-img" alt />
          <span class="check-icon-txt">方案一</span>
        </div>
        <div class="down">查看详细表格下载</div>
      </div>
      <el-steps :space="350" :active="3" align-center finish-status="success">
        <el-step title="准备" description="2020-10-02"></el-step>
        <el-step title="下发" description="2020-10-02"></el-step>
        <el-step title="检查" description="2020-10-02"></el-step>
        <el-step title="完成" description="2020-10-02"></el-step>
      </el-steps>
      <div id="main"></div>
      <!-- tab切换 -->
    </div>
    <!--列表 -->
    <div class="main-list">
      <el-tabs v-model="status" type="card" class="spwork" @tab-click="change()">
        <el-tab-pane label="一连" name="1">
          <div class="main-list-box">
            <ul class="specialCheck">
              <li>特殊检查项一</li>
              <li>特殊检查项二</li>
              <li>特殊检查项三</li>
            </ul>
            <div>
              <el-table
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                style="width: 100%"
                border
                :header-cell-style="{background:'#fafafa'}"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  type="index"
                  width="80"
                  label="序号"
                  :index="(currentPage-1)*pageSize+1"
                ></el-table-column>
                <el-table-column prop="title" label="项目" width="120"></el-table-column>
                <el-table-column prop="categoryName" label="内容" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deptName" label="标准检查" show-overflow-tooltip></el-table-column>
                <el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <a href="javascript:;" @click.stop="downHandle(scope.row)">{{ scope.row.name }}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="备注" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>

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
        <el-tab-pane label="二连" name="2">
          <div class="main-list-box">
            <ul class="specialCheck">
              <li>特殊检查项一</li>
              <li>特殊检查项二</li>
              <li>特殊检查项三</li>
            </ul>
            <div>
              <el-table
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                style="width: 100%"
                border
                :header-cell-style="{background:'#fafafa'}"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  type="index"
                  width="80"
                  label="序号"
                  :index="(currentPage-1)*pageSize+1"
                ></el-table-column>
                <el-table-column prop="title" label="项目" width="120"></el-table-column>
                <el-table-column prop="categoryName" label="内容" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deptName" label="标准检查" show-overflow-tooltip></el-table-column>
                <el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <a href="javascript:;" @click.stop="downHandle(scope.row)">{{ scope.row.name }}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="备注" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
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
</template>

<script>
import echarts from "echarts";
import iconImg from "@/assets/image/excel-icon.jpg";
export default {
  data() {
    return {
      status: "1",
      iconImg: iconImg
    };
  },
  methods: {
    initCharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        // ----  标题 -----
        title: {
          text: "各连队检查情况",
          textStyle: {
            color: "#777c85",
            fontSize: "12px"
          },
          subtext: "（单位个）",
          subtextStyle: {
            color: "#777c85"
          },
          padding: [0, 0, 10, 10] // 位置
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              "一连",
              "二连",
              "三连",
              "四连",
              "五连",
              "六连",
              "七连",
              "八连",
              "九连",
              "十连",
              "十一连",
              "十二连",
              "十三连",
              "十四连"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            nameGap: 15, // 坐标轴名称与轴线之间的距离
            nameTextStyle: {
              // 坐标轴名称样式
              color: "#fff",
              padding: [5, 0, 0, 5] // 坐标轴名称相对位置
            }
          }
        ],
        series: [
          {
            name: "不合格数量：",
            type: "bar",
            legendHoverLink: true, // 是否启用图列 hover 时的联动高亮
            barWidth: "60%",
            data: [30, 20, 40, 60, 80, 50, 40, 20, 40, 60, 80, 50, 20, 40],
            barWidth: 25, // 柱形的宽度
            barCategoryGap: "5%", // 柱形的间距
            itemStyle: {
              normal: {
                color: "#f00"
              },
              emphasis: {
                color: "#eee114"
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    change() {}
  },
  mounted() {
    this.initCharts();
  }
};
</script>

<style lang="scss" scoped>
/*表格内容区  */
.main-content {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}
#main {
  width: 1000px;
  height: 280px;
  margin: 30px auto;
}
.main-list {
  margin-top: 30px;
}
.main-list-box {
  background: #fff;
  padding: 20px;
  // padding:
}
.specialCheck {
  overflow: hidden;
  padding-bottom: 15px;
  li {
    padding: 5px 10px;
    background: #f00;
    border-radius: 200px;
    color: #fff;
    font-weight: 600;
    float: left;
    font-size: 12px;
    margin: 0 15px;
    cursor: pointer;
  }
}
.down-box {
  margin-bottom: 40px;
  .check-icon {
    display: inline-block;
    padding: 10px 20px;
    border: 1px solid #d6d7dc;
    margin: 0 0 20px 30px;
    .check-icon-img {
      vertical-align: middle;
      width: 30px;
    }
    .check-icon-txt {
      color: #4977fc;
    }
  }
  .down {
    display: inline-block;
    width: 70px;
    line-height: 25px;
    color: #001d6f;
    vertical-align: top;
    margin-left: 20px;
    cursor: pointer;
  }
}
</style>
