<template>
  <div>
    <div class="home-container">
      <div class="header">
        <div class="header-left">空军OA管理系统</div>
      </div>
      <div
        class="banner"
        :style="{
          backgroundImage: `url(${imgBanner})`,
          backgroundSize: 'contain',
        }"
      ></div>
      <div class="swiper">
        <div class="swiper-left">
          <div class="left-item active" v-show="index == 0">
            <iframe
              :src="dutyList.url"
              frameborder="0"
              style="width: 100%; height: 100%"
            ></iframe>
          </div>
          <div class="left-item" v-show="index == 1">
            <iframe
              :src="weekplanList.url"
              frameborder="0"
              style="width: 100%; height: 100%"
            ></iframe>
          </div>
          <div class="left-item" v-show="index == 2">
            <div id="season"></div>
          </div>
          <div class="left-item" v-show="index == 3">
            <div class="main-chart">
              <div id="chart1" class="chart"></div>
              <div id="chart2" class="chart"></div>
              <div id="chart3" class="chart"></div>
            </div>
          </div>
          <div class="left-item" v-show="index == 4">
            <div id="safeBox"></div>
          </div>
        </div>
        <div class="swiper-right">
          <div
            class="item"
            :class="{ selected: index === 0 }"
            @mouseover="change(0)"
          >
            {{ dutyList.showTime }} 周值班表
          </div>
          <div
            class="item"
            :class="{ selected: index === 1 }"
            @mouseover="change(1)"
          >
            {{ weekplanList.showTime }} 周工作安排
          </div>
          <div
            class="item"
            :class="{ selected: index === 2 }"
            @mouseover="change(2)"
          >
            {{ seasonName }} 量化评比综合情况
          </div>
          <div
            class="item"
            :class="{ selected: index === 3 }"
            @mouseover="change(3)"
          >
            {{ nowTime }} 在岗情况
          </div>
          <div
            class="item"
            :class="{ selected: index === 4 }"
            @mouseover="change(4)"
          >
            安全管理责任图
          </div>
        </div>
      </div>
      <!-- @dong -->
      <div
        :style="{
          backgroundImage: `url(${imgBg1})`,
          backgroundSize: 'contain',
        }"
      >
        <div class="list-container">
          <ul
            class="list-item"
            v-for="(item, index) in [1, 2, 3, 5, 6, 7]"
            :key="index"
          >
            <indexList :type="item" />
          </ul>
        </div>

        <div class="links">
          <h2 class="list-title">
            <span class="line"></span>
            <span class="cn-title">友情链接</span>
            <!-- <span class="en-title">/LINKS</span> -->
          </h2>
          <div class="links-list">
            <a href="#" id="">
              <img src="@/assets/image/001.jpg" alt="" />
            </a>
            <a href="#" id="">
              <img src="@/assets/image/002.jpg" alt="" />
            </a>
            <a href="#" id="">
              <img src="@/assets/image/003.jpg" alt="" />
            </a>
            <a href="#" id="">
              <img src="@/assets/image/004.jpg" alt="" />
            </a>
            <a href="#" id="">
              <img src="@/assets/image/005.jpg" alt="" />
            </a>
            <a href="#" id="">
              <img src="@/assets/image/006.jpg" alt="" />
            </a>
          </div>
        </div>
        <div class="footer">
          <div class="footer-content">
            友情链接：
            <a href="#" id="">国防部</a>| <a href="#">教育部</a>|
            <a href="#">中国军网</a>| <a href="#">中国空军网</a>|
            <a href="#"> 新华网</a>| <a href="#">北京大学</a>|
            <a href="#">清华大学</a>| <a href="#">北京航空航天大学 </a>|
            <a href="#">阳光高考</a>
          </div>
          <div class="company">
            <div class="company-name">
              主办：中国人民解放军空军京ICP备19021936号
            </div>
            <div class="company-banquan">
              本网站刊登的所有新闻信息和专题专栏资料，均为空军版权所有，未经协议授权，禁止下载使用
            </div>
          </div>
        </div>
      </div>
      <!-- @dong结束 -->
    </div>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import indexList from '@/views/components/indexList/index2'
import { selectWorkplan } from "@/api/workplan"
// import { getDutyList } from "@/api/duty"
import { selectWorkupload } from "@/api/workupload"
import { selectOutsider } from "@/api/outsider.js";
import { dateFormat } from "@/utils/format"
import echarts from "echarts";
import { selectSafety } from "@/api/safety.js";
import { seasonList, selectTotal } from "@/api/evaluation"
import { selectInfo } from "@/api/goout.js";
import { exposureList } from "@/api/exposure";

import store from '@/store'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    indexList
  },
  data() {
    return {
      loading: false,
      index: 0,
      workplanList: [],
      dutyList: [],
      weekplanList: [],
      outsiderList: [],
      seasonTableData: [],
      seasonXData: [],
      seasonYData: [],
      seasonName: '',
      nowTime: null,
      imgBg1: require('@/assets/image/bg1.jpg'),
      imgBanner: require('@/assets/image/home-banner.jpg'),
    }
  },
  watch: {
    $route(route) {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  },
  methods: {
    async getWorkplan() {
      const res = await selectWorkplan({
        current: 0,
        size: 999,
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
      })
      if (res.code === '200' && res.data) {
        this.workplanList = res.data.records;
      }
    },
    getFirstDayOfWeek(date) {
      return date.getTime() - ((date.getDay() || 7) - 1) * 24 * 60 * 60 * 1000
    },
    openfile(url) {
      window.open(url, "_blank");
    },
    async getDutyList() {
      const res = await selectWorkupload({
        current: 0,
        size: 10,
        startTime: dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(new Date())),
        type: 2,
      })
      //   console.log(res);
      if (res.code === '200' && res.data) {
        res.data.records.map(rec => {
          let startDate = new Date(rec.startTime)
          let endDate = new Date(rec.endTime)
          // rec.showTime = startDate.getFullYear() + '年' + (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日' + ' - ' +
          //   endDate.getFullYear() + '年' + (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
          rec.showTime = (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日' + ' - ' +
            (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
        })
        if (res.data.records && res.data.records[0]) {
          this.dutyList = res.data.records[0];
        }
      }
    },
    async getWeekplan() {
      const res = await selectWorkupload({
        current: 0,
        size: 10,
        startTime: dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(new Date())),
        type: 1,
      })
      //   console.log(res);
      if (res.code === '200' && res.data) {
        res.data.records.map(rec => {
          let startDate = new Date(rec.startTime)
          let endDate = new Date(rec.endTime)
          rec.showTime = (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日' + ' - ' +
            (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
        })
        this.weekplanList = res.data.records;

        if (res.data.records && res.data.records[0]) {
          this.weekplanList = res.data.records[0];
        }
      }
    },
    async getOutsider() {
      const res = await selectOutsider({
        current: 0,
        size: 999,
        // name: this.search.name
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.outsiderList = res.data.records;
        res.data.records && res.data.records.map((item, index) => {
          this.outsiderList[index].time = item.startTime + ' 至 ' + item.endTime
        })
      }
    },
    workplanDetail({ id }) {
      this.$router.push(`/plans/getDetail/${id}`)
    },
    outSiderDetail({ id }) {
      this.$router.push(`/outsiders/getOutsiderDetail/${id}`)
    },
    async getSeasonList() {
      const res = await seasonList({
        current: 0,
        size: 10,
      })
      if (res.code === '200' && res.data) {
        const list = res.data.records;
        if (list && list[0]) {
          const first = list[0]
          const res = await selectTotal({
            id: first.id
          })
          if (res && res.code == 200 && res.data) {
            this.seasonTableData = res.data
            this.seasonName = first.name
            res.data.map(item => {
              this.seasonXData.push(item.deptName)
              this.seasonYData.push(item.total)
            })
          }
        }
      }
    },
    initSeasonCharts() {
      var myChart = echarts.init(document.getElementById("season"));

      var option = {
        title: {
          text: this.seasonName + '量化评比综合情况',
          x: 'center',
          y: 'top',
          textStyle: {
            color: '#333333',
            fontWeight: 'bolder',
            fontSize: 24
          }
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
            // deptsData
            data: this.seasonXData,
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
            name: "分数",
            type: "bar",
            legendHoverLink: true, // 是否启用图列 hover 时的联动高亮
            barWidth: "60%",
            // numData
            data: this.seasonYData,
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
      myChart.setOption(option);
    },
    drawSafe() {
      const myChart = echarts.init(document.getElementById("safeBox"));
      selectSafety({
        size: 100,
        current: 1,
      }).then((res) => {
        if (res.data.records.length > 0) {
          const userData = JSON.parse(res.data.records[0].url);
          const iteration = function (arr) {
            let newArr = [];
            if (arr != undefined && arr.length > 0) {
              newArr = arr.map(item => {
                item.symbolSize = [120, 40]
                item.symbol = 'rectangle'
                if (item.children != undefined && item.children.length > 0) {
                  iteration(item.children);
                }
                return item;
              });
            }
            return newArr;
          };
          const newObj = iteration(userData)
          const data = {
            name: '安全管理责任图',
            value: 0,
            symbolSize: [120, 40],
            symbol: 'rectangle',
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#1890ff'
              }
            },
            children: newObj
          }
          const option = {
            // title: {
            //   text: '安全责任图'
            // },
            // tooltip: {
            //   show: false,
            //   trigger: 'item',
            //   formatter: "{b}: {c}"
            // },
            toolbox: {
              show: false,
              feature: {
                mark: {
                  show: true
                },
                dataView: {
                  show: false,
                  readOnly: false
                },
                restore: {
                  show: false
                },
                saveAsImage: {
                  show: true
                }
              }
            },
            calculable: true,
            series: [{
              name: '安全管理责任图',
              type: 'tree',
              orient: 'horizontal', // vertical horizontal
              rootLocation: {
                x: '50%',
                y: '15%'
              }, // 根节点位置  {x: 'center',y: 10}
              // nodePadding: 30,
              // layerPadding: 40,
              // symbol: 'rectangle',
              // borderColor: '#1890ff',

              itemStyle: {
                normal: {
                  color: '#1890ff', //节点背景色
                  borderWidth: 2,
                  borderColor: '#1890ff',
                  label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bolder'
                    }
                  },
                  lineStyle: {
                    color: '#000',
                    width: 2,
                    type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                  }
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              initialTreeDepth: 4,
              data: [data]
            }]
          };
          myChart.setOption(option);
        }
      });
    },
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
    async selectInfo(jobType = 0) {
      // pos是表格  
      // ps是三个饼  1主官 2干部 3义务兵
      this.nowTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      const res = await selectInfo({
        deptId: 0,
        startTime: this.nowTime,
        jobType
      })
      // todo
      // console.log(res);
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
    getList(type) {
      let _data = {
        current: 0,
        size: 10,
        type: type,
      }
      if (type == 1) {
        _data.time = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      }
      exposureList(_data).then((res) => {
        // console.log(res);
        this.dataList = res.data.records;
        this.loading = false;
        this.total = res.data.total
      });
    },
    change(index) {
      this.index = index;
    }
  },
  async mounted() {
    this.loading = true

    this.getWorkplan()
    this.getDutyList()
    this.getWeekplan()
    this.getOutsider()

    await this.getSeasonList()

    this.drawSafe();
    this.initSeasonCharts();
    this.selectInfo(0)
    this.loading = false

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.box-card {
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
#safeBox {
  width: 800px;
  height: 500px;
  min-height: 500px;
  margin: 30px auto;
}

#season {
  width: 800px;
  height: 500px;
  margin: 30px auto;
}
.main-chart {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-chart .chart {
  flex: 1;
  height: 300px;
  width: 270px;
}
.home-container {
  width: 100%;
  background: #fff;
  // .wrapper {
  //   width: 100%;
  //   padding: 0 60px;
  //   margin: 0 auto;
  .header {
    height: 80px;
    background: #f8f8f9;
    padding: 0 60px;
    line-height: 80px;
    .header-left {
      color: #ed1c1c;
      font-size: 28px;
    }
  }
  // }
  .banner {
    // height: 600px;
    // background: url(banner.jpg);
    // background-size: contain;
    padding-top: 31.25%;
  }

  .swiper {
    width: 100%;
    // height: 780px;
    height: 680px;
    padding: 0 60px;
    margin-top: 20px;
    display: flex;
    .swiper-left {
      flex: 2;
      margin-right: 20px;
      .left-item {
        height: 633px;
        border: 1px solid #dabbbe;
      }
    }
    .swiper-right {
      flex: 1;
      .item {
        width: 100%;
        height: 126px;
        background-color: #fff;
        color: #a11e2b;
        //@dong
        padding: 0 50px;
        line-height: 126px;
        font-size: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #dabbbe;
        cursor: pointer;
      }
      .selected {
        background-color: #a11e2b;
        color: #fff;
      }
    }
  }
}
.list-container {
  display: flex;
  flex-wrap: wrap;
  padding: 0 60px;
  margin-bottom: 10px;
  // background: url(@/assets/image/bg1.jpg) no-repeat;
  .list-item {
    width: 33%;
    height: 260px;
    padding-right: 20px;
  }
  .list {
    flex: 1;
    width: 0;
    margin-right: 50px;
    &:last-child {
      margin-right: 0;
    }

    .sub-list-container {
      .sub-list {
        height: 37px;
        line-height: 37px;
      }
    }
  }
}
.list-title {
  height: 67px;
  line-height: 67px;
  font-weight: 400;
  .line {
    content: "";
    display: inline-block;
    width: 6px;
    height: 24px;
    background: #a6212e;
    vertical-align: middle;
    margin-top: -3px;
  }
  .cn-title {
    font-size: 23px;
    color: #333333;
  }
  .en-title {
    color: #999999;
    font-size: 17px;
  }
  .right {
    float: right;
    a {
      color: #ed1c1c;
      font-size: 13px;
    }
  }
}
.links {
  padding: 0 60px;
  margin: 20px 0 66px 0;
  .links-list {
    display: flex;
    a {
      flex: 1;
      width: 0;
      margin-right: 50px;
      img {
        width: 100%;
      }
    }
  }
}
.footer {
  background: #a11e2b;
  .footer-content {
    width: 1400px;
    margin: 0 auto;
    color: #fff;
    font-size: 18px;
    padding: 44px 60px;
    border-bottom: 1px solid #c14350;
    text-align: center;
    a {
      color: #fff;
      margin: 0 12px;
    }
  }
  .company {
    padding: 52px 0 77px 0;
    text-align: center;
    .company-name,
    .company-banquan {
      height: 31px;
      line-height: 31px;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
