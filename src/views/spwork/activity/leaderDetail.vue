<template>
  <el-main>
    <!-- 进度和图标 -->
    <div class="main-content">
      <div class="down-box">
        <div class="check-icon">
          <img :src="iconImg" class="check-icon-img" alt />
          <span class="check-icon-txt">方案一</span>
        </div>
        <!-- <div class="down">查看详细表格下载</div> -->
      </div>
      <el-steps :space="350" :active="3" align-center finish-status="success">
        <!-- <el-step title="准备" description="2020-10-02"></el-step>
        <el-step title="下发" description="2020-10-02"></el-step>
        <el-step title="检查" description="2020-10-02"></el-step>
        <el-step title="完成" description="2020-10-02"></el-step>-->
        <el-step
          v-for="(obj,index) in steps"
          :key="index"
          :title="obj.stepName"
          :description="obj.finishTime"
        ></el-step>
      </el-steps>
      <div id="main"></div>
      <!-- tab切换 -->
    </div>
    <!--列表 -->
    <div class="main-list">
      <el-tabs v-model="status" type="card" class="spwork" @tab-click="getDeptWork()">
        <el-tab-pane
          v-for="(obj,index) in depts"
          :key="index"
          :label="obj.deptName"
          :name="''+index"
        >
          <div class="main-list-box">
            <!-- 步骤条 -->
            <el-steps direction="vertical" class="step-box" :active="3" space="155px">
              <el-step v-for="(obj,index) in deptActityList" :key="index" :title="obj.stepName"></el-step>
            </el-steps>
            <!-- 步骤列表 -->
            <ul class="step-list-box">
              <li v-for="(obj,index) in deptActityList" :key="index">
                <div class="step-list" v-if="obj.imgUrl&&obj.content">
                  <img :src="obj.imgUrl" alt />
                  <div class="list-content">
                    <div v-html="obj.content"></div>
                  </div>
                </div>
                <div class="step-list-no" v-else>该连队暂未上传</div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-main>
</template>

<script>
import echarts from "echarts";
import iconImg from "@/assets/image/excel-icon.jpg";
import { getDeptById, getActivityInfo, getDeptWork } from "@/api/worklist.js";
export default {
  data() {
    return {
      status: "0",
      iconImg: iconImg,
      id: this.$route.query.id,
      depts: [],
      steps: [],
      deptMap: {},
      barChart: [],
      deptActityList: [] //部门活动列表
    };
  },
  methods: {
    initCharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "各连队参加活动人数",
          textStyle: {
            color: "#777c85",
            fontSize: "12px"
          },
          subtext: "（单位个）",
          subtextStyle: {
            color: "#777c85"
          },
          padding: [0, 0, 10, 70] // 位置
        },
        legend: {
          type: "scroll"
        },
        tooltip: {},
        dataset: {
          source: this.barChart
        },
        xAxis: { type: "category", boundaryGap: true },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            barWidth: 25, // 柱形的宽度
            barCategoryGap: "3%", // 柱形的间距
            itemStyle: {
              normal: {
                color: "#4089ff"
              }
            }
          },
          {
            type: "bar",
            barWidth: 25, // 柱形的宽度
            barCategoryGap: "3%", // 柱形的间距
            itemStyle: {
              normal: {
                color: "#fecd5d"
              }
            }
          },
          {
            type: "bar",
            barWidth: 25, // 柱形的宽度
            barCategoryGap: "3%", // 柱形的间距
            itemStyle: {
              normal: {
                color: "#4ad030"
              }
            }
          }
        ],
        dataZoom: [
          {
            type: "slider", //slider表示有滑动块的，
            show: true,
            xAxisIndex: [0], //表示x轴折叠
            start: 1, //数据窗口范围的起始百分比,表示1%
            end: 80 //数据窗口范围的结束百分比,表示35%坐标
            // zoomLock: true
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 获取连队列表
    async getDept() {
      const res = await getDeptById();
      this.depts = res.data;
      // 获取第一个连队的数据
      this.getDeptWork();
    },
    // 获取详情页详情
    async getActivityInfo() {
      const res = await getActivityInfo(this.id);
      this.steps = res.data.step;
      this.deptMap = res.data.deptMap;
      this.scope = res.data.scope;
      // 生成绘制柱状图的数据
      this.barChart = this.getChart();
      // 初始化柱状图
      this.initCharts();
    },
    // 点击连切换内容
    async getDeptWork() {
      let deptId = this.depts[this.status].deptId; // 部门id
      let activityId = this.id; //活动id
      const res = await getDeptWork(deptId, this.id);
      this.deptActityList = res.data;
    },
    getChart() {
      let chartList = [["product"]];
      this.steps.forEach(obj => {
        chartList[0].push(obj.stepName);
      });
      for (let key in this.scope) {
        let elem = this.scope[key];
        let deptName = this.deptMap[key];

        let arr = [deptName];
        elem.forEach((obj, index) => {
          arr.push(obj.count);
        });
        chartList.push(arr);
      }
      return chartList;
    },
  },
  created() {
    // 获取部门
    this.getDept();
    // 获取活动详情
    this.getActivityInfo();
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
  height: 300px;
  margin: 30px auto;
}
.main-list {
  margin-top: 30px;
}
// 步骤介绍
.main-list-box {
  background: #fff;
  padding: 40px 20px;
  display: flex;
  .step-box {
    width: 130px;
    margin-top: 53px;
  }
  .step-list-box {
    flex: 1;
    .step-list {
      display: flex;
      margin-bottom: 40px;
      img {
        // 248*166
        width: 180px;
        height: 120px;
        margin-right: 10px;
      }
      .list-content {
        flex: 0.97;
        height: 120px;
        overflow-y: scroll;
        h2 {
          color: #515254;
          // font-size: 1;
          font-weight: 400;
          font-size: 16px;
          margin-bottom: 10px;
        }
        p {
          color: #515254;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
    .step-list-no {
      height: 150px;
      line-height: 148px;
      color: #888888;
    }
  }
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
// 修改step进度条 样式
.el-step__icon.is-text {
  background: #1890ff;
}
</style>
