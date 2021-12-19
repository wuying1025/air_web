<template>
  <div>
    <div class="home-container">
      <div class="header">
        <!-- <img :src="imgLogo" alt=""> -->
        <div
          class="header-left"
          :style="{
            backgroundImage: `url(${imgLogo})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center left',
          }"
        >
          空军牡丹江场站管理系统
        </div>
        <a
          href="javascript:;"
          class="header-icons out"
          @click="logout"
          title="退出"
        ></a>
      </div>
      <div
        class="banner"
        :style="{
          backgroundImage: `url(${imgBanner})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }"
      ></div>
      <ul class="nav">
        <li
          :class="{ 'nav-selected': navIndex === 0 }"
          @mouseover="navMouseover(0)"
          @mouseout="navMouseout(0)"
        >
          首页
        </li>
        <li
          :class="{ 'nav-selected': navIndex === 1 }"
          @mouseover="navMouseover(1)"
          @mouseout="navMouseout(1)"
          @click="$router.push('duty/dutyUpload')"
        >
          周值班表
        </li>
        <li
          :class="{ 'nav-selected': navIndex === 2 }"
          @mouseover="navMouseover(2)"
          @mouseout="navMouseout(2)"
          @click="$router.push('safeUpload/show')"
        >
          安全责任图
        </li>
        <li
          :class="{ 'nav-selected': navIndex === 3 }"
          @mouseover="navMouseover(3)"
          @mouseout="navMouseout(3)"
          @click="$router.push('dragontiger/dragontigerTotal')"
        >
          龙虎榜
        </li>
        <li
          :class="{ 'nav-selected': navIndex === 4 }"
          @mouseover="navMouseover(4)"
          @mouseout="navMouseout(4)"
          @click="$router.push('weekplan/weekplanUpload')"
        >
          周工作安排
        </li>
        <!--  <li
          :class="{ 'nav-selected': navIndex === 5 }"
          @mouseover="navMouseover(5)"
          @mouseout="navMouseout(5)"
          @click="$router.push('duty/dutyUpload')"
        >
          周值班
        </li> -->
        <li
          :class="{ 'nav-selected': navIndex === 6 }"
          @mouseover="navMouseover(6)"
          @mouseout="navMouseout(6)"
          @click="$router.push('evaluation/seasonList')"
        >
          量化评比
        </li>
      </ul>
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
          <div
            class="left-item"
            style="width: 100%; height: 100%"
            v-show="index == 2"
          >
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
          <div class="left-item dragon-tiger" v-show="index == 5">
            <!-- 龙虎榜 -->
            <h2 class="dragon-tiger-title" v-if="activity">
              {{ activity.title }}龙虎榜
            </h2>
            <el-table
              :data="dragonTigerList"
              style="width: 100%"
              v-loading="loading"
            >
              <!-- :row-class-name="tableRowClassName" -->
              <el-table-column
                align="center"
                type="index"
                label="排名"
              ></el-table-column>
              <el-table-column property="avatar" label="照片" align="center">
                <template slot-scope="scope">
                  <el-image
                    v-if="scope.row.avatar"
                    style="width: 60px; height: 60px"
                    :src="scope.row.avatar"
                  >
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="姓名"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="deptName"
                label="所属连队"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="result1"
                label="引体向上/俯卧撑"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="result2"
                label="仰卧起坐"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="result3"
                label="30米×2蛇形跑"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="result4"
                label="3000米跑"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="score"
                label="总成绩"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="resultStr"
                label="级别"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="swiper-right">
          <!-- @click="$router.push('duty/dutyUpload')" -->
          <div
            class="item"
            :class="{ selected: index === 0 }"
            @mouseover="change(0)"
            @click="swiperDetail(0)"
          >
            {{ dutyList.showTime }} 周值班表
            <i class="iconfont icon-anniu-jiantouxiangyou"></i>
          </div>
          <!-- @click="$router.push('weekplan/weekplanUpload')" -->
          <div
            class="item"
            :class="{ selected: index === 1 }"
            @mouseover="change(1)"
            @click="swiperDetail(1)"
          >
            {{ weekplanList.showTime }} 周工作安排
            <i class="iconfont icon-anniu-jiantouxiangyou"></i>
          </div>
          <!-- @click="$router.push('evaluation/seasonList')" -->
          <div
            class="item"
            :class="{ selected: index === 2 }"
            @mouseover="change(2)"
            @click="swiperDetail(2)"
          >
            {{ seasonName }} 量化评比综合情况
            <i class="iconfont icon-anniu-jiantouxiangyou"></i>
          </div>
          <!-- @click="$router.push('goout/innerOut')" -->
          <div
            class="item"
            :class="{ selected: index === 3 }"
            @mouseover="change(3)"
            @click="swiperDetail(3)"
          >
            {{ nowTime }} 在岗情况
            <i class="iconfont icon-anniu-jiantouxiangyou"></i>
          </div>
          <!-- @click="$router.push('safeUpload/show')" -->
          <div
            class="item"
            :class="{ selected: index === 4 }"
            @mouseover="change(4)"
            @click="swiperDetail(4)"
          >
            安全管理责任图
            <i class="iconfont icon-anniu-jiantouxiangyou"></i>
          </div>
          <!-- @click="$router.push('dragontiger/dragontigerTotal')" -->
          <div
            class="item"
            :class="{ selected: index === 5 }"
            @mouseover="change(5)"
            @click="swiperDetail(5)"
            v-if="activity"
          >
            {{ activity.title }} 龙虎榜
            <i class="iconfont icon-anniu-jiantouxiangyou"></i>
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

      <!-- dialog -->
      <el-dialog
        :title="dutyList.showTime + '周值班表'"
        :visible.sync="dialogVisible0"
        :fullscreen="true"
        custom-class="dialog-height"
      >
        <iframe
          :src="dutyList.url"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
      </el-dialog>

      <el-dialog
        :title="weekplanList.showTime + '周工作安排'"
        :visible.sync="dialogVisible1"
        :fullscreen="true"
        custom-class="dialog-height"
      >
        <iframe
          :src="weekplanList.url"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
      </el-dialog>

      <el-dialog
        :title="seasonName + '量化评比综合情况'"
        :visible.sync="dialogVisible2"
        :fullscreen="true"
        custom-class="dialog-height season2"
        @open="openSeason2"
      >
        <div id="season2"></div>
      </el-dialog>

      <el-dialog
        :title="nowTime + '在岗情况'"
        :visible.sync="dialogVisible3"
        :fullscreen="true"
        custom-class="dialog-height"
        @open="openPerson2"
      >
        <div class="main-chart">
          <div id="_chart1" class="chart"></div>
          <div id="_chart2" class="chart"></div>
          <div id="_chart3" class="chart"></div>
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
          </el-table>
        </div>
      </el-dialog>

      <el-dialog
        title="安全管理责任图"
        :visible.sync="dialogVisible4"
        :fullscreen="true"
        custom-class="dialog-height"
        @open="openDrawSafe2"
      >
        <div id="safeBox2"></div>
      </el-dialog>

      <el-dialog
        :title="activity.title + '龙虎榜'"
        :visible.sync="dialogVisible5"
        :fullscreen="true"
        custom-class="dialog-height"
      >
        <div>
          <!-- 龙虎榜 -->
          <h2 class="dragon-tiger-title" v-if="activity">
            {{ activity.title }}龙虎榜
          </h2>
          <el-table
            :data="dragonTigerList"
            style="width: 100%"
            v-loading="loading"
          >
            <!-- :row-class-name="tableRowClassName" -->
            <el-table-column
              align="center"
              type="index"
              label="排名"
            ></el-table-column>
            <el-table-column property="avatar" label="照片" align="center">
              <template slot-scope="scope">
                <el-image
                  v-if="scope.row.avatar"
                  style="width: 60px; height: 60px"
                  :src="scope.row.avatar"
                >
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="姓名"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="deptName"
              label="所属连队"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="result1"
              label="引体向上/俯卧撑"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="result2"
              label="仰卧起坐"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="result3"
              label="30米×2蛇形跑"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="result4"
              label="3000米跑"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="score"
              label="总成绩"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="resultStr"
              label="级别"
            ></el-table-column>
          </el-table>
        </div>
      </el-dialog>
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
import { selectWorkupload } from "@/api/workupload"
import { selectOutsider } from "@/api/outsider.js";
import { dateFormat } from "@/utils/format"
import echarts from "echarts";
import { selectSafety } from "@/api/safety.js";
import { seasonList, selectTotal } from "@/api/evaluation"
import { selectInfo } from "@/api/goout.js";
import { exposureList } from "@/api/exposure";
import { selectActivity, selectScore, getActivityById } from "@/api/activity.js";
import { removeToken } from "@/utils/auth";

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
      imgAvatar: require('@/assets/image/avatar.jpeg'),
      imgLogo: require('@/assets/image/home-logo.png'),
      imgRight: require('@/assets/image/home-right.png'),
      dragonTigerList: [],
      activity: {
        title: ''
      },
      navIndex: 0,
      dialogVisible0: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      personData: [],
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
      if (res.code === '200' && res.data) {
        if (res.data.records && res.data.records[0]) {
          res.data.records.map(rec => {
            let startDate = new Date(rec.startTime)
            let endDate = new Date(rec.endTime)
            // rec.showTime = startDate.getFullYear() + '年' + (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日' + ' - ' +
            //   endDate.getFullYear() + '年' + (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
            rec.showTime = (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日' + ' - ' +
              (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
          })
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
    initSeasonCharts(elemId = 'season') {
      var myChart = echarts.init(document.getElementById(elemId));

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
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                fontSize: 16,
              },
              formatter: function (value) {
                return value.split("").join("\n");
              }
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
                color: "#f00",
                label: {
                  show: true,		//开启显示
                  position: 'top',	//在上方显示
                  textStyle: {	    //数值样式
                    color: 'black',
                    fontSize: 16
                  }
                }
              },
              emphasis: {
                color: "#eee114"
              },

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
          let userData = []
          res.data.records.map(elem => {
            if (elem.type == 1) {
              userData = JSON.parse(elem.url)
              return
            }
          })

          const iteration = function (arr) {
            let newArr = [];
            if (arr != undefined && arr.length > 0) {
              newArr = arr.map(item => {
                item.symbolSize = [50, 30]
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
            symbolSize: [120, 30],
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
              orient: 'vertical', // vertical horizontal
              edgeShape: 'polyline',
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
    drawSafe2() {
      const myChart = echarts.init(document.getElementById("safeBox2"));
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
                item.symbolSize = [80, 40]
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
              orient: 'vertical', // vertical horizontal
              edgeShape: 'polyline',
              rootLocation: {
                x: '50%',
                y: '15%'
              }, // 根节点位置  {x: 'center',y: 10}
              // nodePadding: 130,
              // layerPadding: 140,
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
      // ps是三个饼  1主官 2干部 3战士
      this.nowTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      const res = await selectInfo({
        deptId: 0,
        startTime: this.nowTime,
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
              item.jobTypeName = '战士'
              break
            default:
              item.jobTypeName = '战士'
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
              text: '战士在岗情况',
              percent: elem.totalCount == 0 ? 0 : ((elem.totalCount - elem.outCount) / elem.totalCount * 100).toFixed(0),
              color: elem.pass ? '#2975EC' : '#EF263D',
              outCount: elem.outCount,
              inCount: elem.totalCount - elem.outCount
            })
          }
        });

      }

    },
    async selectInfo2(jobType = 0) {
      // pos是表格  
      // ps是三个饼  1主官 2干部 3战士
      this.nowTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      const res = await selectInfo({
        deptId: 0,
        startTime: this.nowTime,
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
              item.jobTypeName = '战士'
              break
            default:
              item.jobTypeName = '战士'
          }
        })
        this.personData = res.data.pos.records

        res.data.ps.forEach((elem, index) => {
          if (elem.id === 1) {
            this.chartSetOption({
              chartId: '_chart1',
              text: '主官在岗情况',
              percent: elem.totalCount == 0 ? 0 : ((elem.totalCount - elem.outCount) / elem.totalCount * 100).toFixed(0),
              color: elem.pass ? '#2975EC' : '#EF263D',
              outCount: elem.outCount,
              inCount: elem.totalCount - elem.outCount
            })
          } else if (elem.id === 2) {
            this.chartSetOption({
              chartId: '_chart2',
              text: '领导在岗情况',
              percent: elem.totalCount == 0 ? 0 : ((elem.totalCount - elem.outCount) / elem.totalCount * 100).toFixed(0),
              color: elem.pass ? '#2975EC' : '#EF263D',
              outCount: elem.outCount,
              inCount: elem.totalCount - elem.outCount
            })
          } else if (elem.id === 3) {
            this.chartSetOption({
              chartId: '_chart3',
              text: '战士在岗情况',
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
        this.dataList = res.data.records;
        this.loading = false;
        this.total = res.data.total
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex <= 10) {
        return 'success-row';
      }
      return '';
    },
    async getDragonTigerList() {
      const res = await selectActivity({
        current: 0,
        size: 1,
        title: '',
        cateId: 0,
      })
      if (res.code === '200' && res.data && res.data.records && res.data.records.length > 0) {
        const firstData = res.data.records[0]
        const score = await selectScore({
          activityId: firstData.id,
          // typeId: firstData.typeId
        })
        if (score.code === '200' && score.data) {
          score.data.records.map((elem, index) => {
            if (index < 10) {
              if (elem.url) {
                elem.avatar = elem.url
              } else {
                elem.avatar = this.imgAvatar
              }
            } else {
              elem.avatar = ''
            }
            if (elem.item1) {
              elem.result1 = `${elem.score1}（${elem.item1}个）`
            } else {
              elem.result1 = 0
            }
            if (elem.item2) {
              elem.result2 = `${elem.score2}（${elem.item2}个）`
            } else {
              elem.result2 = 0
            }
            if (elem.item3) {
              const item3Arr = elem.item3.split('-')
              elem.result3 = `${elem.score3}（${item3Arr[0]}″${item3Arr[1]}）`
            } else {
              elem.result3 = 0
            }

            if (elem.item4) {
              const item4Arr = elem.item4.split('-')
              elem.result4 = `${elem.score4}（${item4Arr[0]}″${item4Arr[1]}）`
            } else {
              elem.result4 = 0
            }

            if (elem.flag == 0) {
              elem.resultStr = '不及格'
            } else {
              if (elem.score == 0) {
                elem.resultStr = '无成绩'
              } else if (elem.score > 0 && elem.score < 240) {
                elem.resultStr = '不及格'
              } else if (elem.score >= 240 && elem.score < 320) {
                elem.resultStr = '及格'
              } else if (elem.score >= 320 && elem.score < 360) {
                elem.resultStr = '良好'
              } else if (elem.score >= 360 && elem.score < 440) {
                elem.resultStr = '优秀'
              } else if (elem.score >= 440 && elem.score < 480) {
                elem.resultStr = '特3级'
              } else if (elem.score >= 480 && elem.score < 500) {
                elem.resultStr = '特2级'
              } else if (elem.score >= 500) {
                elem.resultStr = '特1级'
              }
            }
          })
          this.dragonTigerList = score.data.records;

          const activity = await getActivityById(firstData.id)
          if (activity && activity.code === '200') {
            this.activity = activity.data
          }
        }
      }
    },
    change(index) {
      this.index = index
    },
    navMouseover(index) {
      this.navIndex = index
    },
    navMouseout(index) {
      this.navIndex = 0
    },
    logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 清楚token 角色 权限  调到登录页
        this.$store.commit("SET_TOKEN", "");
        this.$store.commit("SET_ROLES", []);
        this.$store.commit("SET_PERMISSIONS", []);
        removeToken();
        this.$router.push("/login");
        // this.$store.dispatch('LogOut').then(() => {
        //   location.reload()
        // })
      });
    },
    swiperDetail(index) {
      this['dialogVisible' + index] = true
    },
    openSeason2() {
      this.$nextTick(() => {
        this.initSeasonCharts('season2')
      })
    },
    openPerson2() {
      this.$nextTick(() => {
        this.selectInfo2(0)
      })
    },
    openDrawSafe2() {
      this.$nextTick(() => {
        this.drawSafe2()
      })
    }
  },
  async mounted() {
    this.loading = true

    this.getWorkplan()
    this.getDutyList()
    this.getWeekplan()
    this.getOutsider()
    this.getDragonTigerList()

    await this.getSeasonList()

    this.drawSafe();
    this.initSeasonCharts('season');
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
  width: 1000px;
  height: 600px;
  min-height: 500px;
  margin: 30px auto;
}

#season {
  width: 800px;
  height: 580px;
  margin: 10px auto;
}

#season2 {
  width: 1200px;
  height: 800px;
  margin: 0 auto;
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
    height: 100px;
    background: #f8f8f9;
    padding: 0 60px;
    line-height: 100px;
    position: relative;
    .header-left {
      color: #ed1c1c;
      font-size: 32px;
      font-family: "STKaiti";
      font-weight: 700;
      padding-left: 90px;
    }
  }
  .nav {
    height: 70px;
    background-color: #b42617;
    color: #fff;
    display: flex;
    padding: 0 10%;
    align-items: center;
    margin-top: 2px;
    .nav-selected {
      background-color: #971305;
    }
    li {
      flex: 1;
      text-align: center;
      height: 70px;
      line-height: 70px;
      cursor: pointer;
    }
    li:hover {
      background-color: #971305;
    }
  }
  // }
  .banner {
    // height: 600px;
    // background: url(banner.jpg);
    // background-size: contain;
    padding-top: 15.89%;
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
      .dragon-tiger {
        padding: 20px;
        overflow: scroll;
      }
    }
    .swiper-right {
      flex: 1;
      .item {
        width: 100%;
        height: 106px;
        background-color: #fff;
        color: #a11e2b;
        //@dong
        padding: 0 50px;
        line-height: 106px;
        font-size: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #dabbbe;
        cursor: pointer;
      }
      .selected {
        background-color: #a11e2b;
        color: #fff;
      }
      .icon-anniu-jiantouxiangyou {
        font-size: 20px;
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
.header-icons {
  width: 48px;
  height: 36px;
  background: url(../assets/image/out.png) no-repeat 0 0 / 28px 28px;
  cursor: pointer;
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
}
.dragon-tiger-title {
  text-align: center;
  color: #000;
  margin-bottom: 20px;
}
.dialog-height {
  .main-chart {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .main-chart .chart {
    flex: 1;
    height: 450px;
  }
}

#safeBox2 {
  width: 1600px;
  height: 800px;
  min-height: 500px;
  margin: 0 auto;
}
</style>
