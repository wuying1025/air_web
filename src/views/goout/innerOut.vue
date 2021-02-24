<template>
  <div>
    <el-main>
      <div class="main-content">
        <el-form
          ref="search"
          :model="search"
          label-width="120px"
          :inline="true"
        >
          <el-form-item label="连队筛选" prop="deptId">
            <el-select
              v-model="search.deptId"
              placeholder="请选择所属连队"
              style="width: 300px"
            >
              <el-option
                v-for="item in deptList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间筛选">
            <el-date-picker
              v-model="search.time"
              type="date"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <div class="main-chart">
          <div id="chart1" class="chart" @click="clickChart1"></div>
          <div id="chart2" class="chart" @click="clickChart2"></div>
          <div id="chart3" class="chart" @click="clickChart3"></div>
        </div>
      </div>
      <div class="main-list">
        <h4 style="margin-bottom: 5px">不在岗人员列表</h4>
        <el-table
          ref="multipleTable"
          :data="personData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="deptName"
            label="所属连队"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="jobTypeName"
            label="身份"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="startTime"
            label="离队时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="endTime"
            label="归队时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="外出事由"
          ></el-table-column>

          <!-- <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="apply(scope.row)"
                >申请外出</el-button
              >
            </template>
          </el-table-column> -->
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
import echarts from "echarts"
import { lastDept } from "@/api/system/dept";
import { selectInfo } from "@/api/goout.js";

export default {
  data() {
    return {
      deptList: [],
      search: {
        deptId: 0,
        time: new Date()
      },
      personData: [],
      loading: false,
      currentPage: 0, //分页当前页
      pageSize: 10,
      total: 0, //总页数
    }
  },
  methods: {
    chartSetOption({ chartId, text = '在岗情况', percent = 100, color = '#EF263D', outCount, inCount }) {
      const myChart = echarts.init(document.getElementById(chartId));

      const option = {
        color: ['#D3D3D3', color],　　　　//环形图两部分的颜色
        title: {
          show: true,
          text: text,
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
          },
        },
        tooltip: {
          trigger: 'item'
        },
        graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '30%',
          style: {
            text: percent + '%',
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 24,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '38%',
          style: {
            text: "———",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 20,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {
          type: 'text',
          left: 'center',
          top: '46%',
          style: {
            text: inCount + '人',
            textAlign: 'center',
            fill: '#333739',
            width: 30,
            height: 30,
            fontSize: 20,
          }
        }],
        series: [　　　　　　　　　　　　　　//配置数据啥的
          {
            // name: '达标率',
            type: 'pie',　　　　　　　　//设为饼图
            radius: ['60%', '70%'],　　//设置内半径和外半径，形成环状
            // minAngle: 15,　　　　　　　　　//设置最小角度
            startAngle: 270,　　　　　　　//设置起始角度
            // clockWise: false,　　　　　　　　//默认逆时针
            // avoidLabelOverlap: false,　　　//避免标注重叠
            // hoverAnimation: true,　　　　//移入放大
            // silent: true,
            center: ['50%', '40%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: outCount, name: '不在岗' },
              { value: inCount, name: '在岗' },
            ]
          }
        ]
      };
      myChart.setOption(option)
    },
    initCharts1() {
      const myChart = echarts.init(document.getElementById("chart1"));

      const option = {
        color: ["#D3D3D3", "#EF263D"],　　　　//环形图两部分的颜色
        title: {
          show: true,
          text: '主官在岗情况',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
          },
        },
        tooltip: {
          trigger: 'item'
        },
        graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '30%',
          style: {
            text: "80%",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 24,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '38%',
          style: {
            text: "———",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 20,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {
          type: 'text',
          left: 'center',
          top: '46%',
          style: {
            text: '5人',
            textAlign: 'center',
            fill: '#333739',
            width: 30,
            height: 30,
            fontSize: 20,
          }
        }],
        series: [　　　　　　　　　　　　　　//配置数据啥的
          {
            // name: '达标率',
            type: 'pie',　　　　　　　　//设为饼图
            radius: ['60%', '70%'],　　//设置内半径和外半径，形成环状
            minAngle: 15,　　　　　　　　　//设置最小角度
            startAngle: 270,　　　　　　　//设置起始角度
            // clockWise: false,　　　　　　　　//默认逆时针
            // avoidLabelOverlap: false,　　　//避免标注重叠
            // hoverAnimation: true,　　　　//移入放大
            // silent: true,
            center: ['50%', '40%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.pieData1.outCount, name: '不在岗' },
              { value: this.pieData1.totalCount - this.pieData1.outCount, name: '在岗' },
            ]
          }
        ]
      };
      myChart.setOption(option)
    },
    initCharts2() {
      const myChart = echarts.init(document.getElementById("chart2"));

      const option = {
        color: ["#D3D3D3", "#F5A44D"],　　　　//环形图两部分的颜色
        title: {
          show: true,
          text: '干部在岗情况',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
          },
        },
        tooltip: {
          trigger: 'item'
        },
        graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '30%',
          style: {
            text: "80%",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 24,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '38%',
          style: {
            text: "———",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 20,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {
          type: 'text',
          left: 'center',
          top: '46%',
          style: {
            text: '5人',
            textAlign: 'center',
            fill: '#333739',
            width: 30,
            height: 30,
            fontSize: 20,
          }
        }],
        series: [　　　　　　　　　　　　　　//配置数据啥的
          {
            // name: '达标率',
            type: 'pie',　　　　　　　　//设为饼图
            radius: ['60%', '70%'],　　//设置内半径和外半径，形成环状
            minAngle: 15,　　　　　　　　　//设置最小角度
            startAngle: 270,　　　　　　　//设置起始角度
            // clockWise: false,　　　　　　　　//默认逆时针
            // avoidLabelOverlap: false,　　　//避免标注重叠
            // hoverAnimation: true,　　　　//移入放大
            // silent: true,
            center: ['50%', '40%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 4, name: '不在岗' },
              { value: 20, name: '在岗' },
            ]
          }
        ]
      };
      myChart.setOption(option)
    },
    initCharts3() {
      const myChart = echarts.init(document.getElementById("chart3"));

      const option = {
        color: ["#D3D3D3", "#2975EC"],　　　　//环形图两部分的颜色
        title: {
          show: true,
          text: '战士在岗情况',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
          },
        },
        tooltip: {
          trigger: 'item'
        },
        graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '30%',
          style: {
            text: "80%",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 24,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {　　　　　　　　　　　　　　　　//环形图中间添加文字
          type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
          left: 'center',
          top: '38%',
          style: {
            text: "———",
            textAlign: 'center',
            fill: '#000',　　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: 20,
            color: "#333739",
            fontFamily: "Microsoft YaHei"
          }
        }, {
          type: 'text',
          left: 'center',
          top: '46%',
          style: {
            text: '5人',
            textAlign: 'center',
            fill: '#333739',
            width: 30,
            height: 30,
            fontSize: 20,
          }
        }],
        series: [　　　　　　　　　　　　　　//配置数据啥的
          {
            // name: '达标率',
            type: 'pie',　　　　　　　　//设为饼图
            radius: ['60%', '70%'],　　//设置内半径和外半径，形成环状
            minAngle: 15,　　　　　　　　　//设置最小角度
            startAngle: 270,　　　　　　　//设置起始角度
            // clockWise: false,　　　　　　　　//默认逆时针
            // avoidLabelOverlap: false,　　　//避免标注重叠
            // hoverAnimation: true,　　　　//移入放大
            // silent: true,
            center: ['50%', '40%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 4, name: '不在岗' },
              { value: 20, name: '在岗' },
            ]
          }
        ]
      };
      myChart.setOption(option)
    },
    async clickChart1() {
      this.setPersonData(1)
    },
    async clickChart2() {
      this.setPersonData(2)
    },
    async clickChart3() {
      this.setPersonData(3)
    },
    async setPersonData(jobType) {
      const res = await selectInfo({
        ...this.search,
        jobType
      })
      if (res && res.code === '200') {
        res.data.pos.records.map(item => {
          switch (item.jobType) {
            case 1:
              item.jobTypeName = '主官'
              break
            case 2:
              item.jobTypeName = '干部'
              break
            case 3:
              item.jobTypeName = '义务兵'
              break
            default:
              item.jobTypeName = '义务兵'
          }
        })
        this.personData = res.data.pos.records
      }
    },
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.deptList.unshift({ deptId: 0, deptName: "全部连队" });
      }
    },
    async selectInfo(jobType = 0) {
      // pos是表格  
      // ps是三个饼  1主官 2干部 3义务兵

      // const res = await selectInfo({
      //   deptId: 0,
      //   // startTime: '', 
      //   // endTime: '',
      //   jobType: 0, // 1\2\3
      // })
      const res = await selectInfo({
        ...this.search,
        jobType
      })
      // todo
      console.log(res);
      if (res && res.code === '200') {
        res.data.pos.records.map(item => {
          switch (item.jobType) {
            case 1:
              item.jobTypeName = '主官'
              break
            case 2:
              item.jobTypeName = '干部'
              break
            case 3:
              item.jobTypeName = '义务兵'
              break
            default:
              item.jobTypeName = '义务兵'
          }
        })
        this.personData = res.data.pos.records

        res.data.ps.forEach((elem, index) => {
          if (elem.id === 1) {
            this.chartSetOption({
              chartId: 'chart1',
              text: '主官在岗情况',
              percent: elem.totalCount == 0 ? 0 : ((elem.totalCount - elem.outCount) / elem.totalCount * 100).toFixed(0),
              color: elem.pass ? '#2975EC' : '#EF263D',
              outCount: elem.outCount,
              inCount: elem.totalCount - elem.outCount
            })
          } else if (elem.id === 2) {
            this.chartSetOption({
              chartId: 'chart2',
              text: '领导在岗情况',
              percent: elem.totalCount == 0 ? 0 : ((elem.totalCount - elem.outCount) / elem.totalCount * 100).toFixed(0),
              color: elem.pass ? '#2975EC' : '#EF263D',
              outCount: elem.outCount,
              inCount: elem.totalCount - elem.outCount
            })
          } else if (elem.id === 3) {
            this.chartSetOption({
              chartId: 'chart3',
              text: '义务兵在岗情况',
              percent: elem.totalCount == 0 ? 0 : ((elem.totalCount - elem.outCount) / elem.totalCount * 100).toFixed(0),
              color: elem.pass ? '#2975EC' : '#EF263D',
              outCount: elem.outCount,
              inCount: elem.totalCount - elem.outCount
            })
          }
        });

      }

    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.selectInfo();
    },
    handleQuery() {
      this.selectInfo(0)
    },
    resetQuery() {
      this.search = {
        deptId: 0,
        time: new Date()
      }
      // 重新查询数据
      this.selectInfo(0)
    },
  },
  mounted() {
    // this.initCharts1()
    // this.initCharts2()
    // this.initCharts3()
    this.getDeptList();
    this.selectInfo(0)
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}

.main-chart {
  display: flex;
}

.main-chart .chart {
  flex: 1;
  height: 300px;
}

.main-list {
  margin-top: 30px;
}
</style>