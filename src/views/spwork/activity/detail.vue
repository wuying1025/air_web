<template>
  <el-main>
    <!-- 进度和图标 -->
    <div class="main-content">
      <!-- <div class="down-box">
        <div class="check-icon">
          <img :src="iconImg" class="check-icon-img" alt />
          <span class="check-icon-txt">方案一</span>
        </div>
        <div class="down">查看详细表格下载</div>
      </div> -->
      <el-steps :space="350" :active="active" align-center finish-status="success">
        <el-step
          v-for="(obj,index) in deptActityList"
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
      <div class="main-list-box">
        <!-- 步骤条 -->
        <el-steps direction="vertical" class="step-box" :active="active" space="155px">
          <el-step v-for="(obj,index) in deptActityList" :key="index" :title="obj.stepName"></el-step>
        </el-steps>
        <!-- 步骤列表 -->
        <ul class="step-list-box">
          <li v-for="(obj,index) in deptActityList" :key="index">
            <div class="step-list" v-if="obj.count">
              <img :src="obj.imgUrl" alt />
              <div class="list-content">
                <div v-html="obj.content"></div>
              </div>
            </div>
            <div class="step-list-no" v-else>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="edit(obj.stepId)"
              >填报步骤总结</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      title="填报步骤总结"
      :visible.sync="stepDialogVisible"
      width="1000px"
      :before-close="handleClose"
    >
      <el-form ref="stepContent" :model="stepContent" :rules="rules" label-width="160px">
        <el-form-item label="参加人数" label-width="100px" prop="count">
          <el-input v-model="stepContent.count" style="width: 600px" placeholder="请输入参加人数"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" label-width="100px" prop="img">
          <Uploader v-on:getFile="getFileUrl(arguments)" :change="file.isChange" :name="file.name"></Uploader>
        </el-form-item>
        <el-form-item label="阶段总结" label-width="100px" prop="content">
          <VueUeditorWrap :config="myConfig" v-model="stepContent.content" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stepDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveActivity()">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
import echarts from "echarts";
import iconImg from "@/assets/image/excel-icon.jpg";
import { getActivityByDeptId, saveActivity } from "@/api/worklist.js";
import { dateFormat } from "@/utils/format.js";
import VueUeditorWrap from "vue-ueditor-wrap";
import Uploader from "@/components/Uploader";
export default {
  data() {
    return {
      iconImg: iconImg,
      id: this.$route.query.id,
      steps: [],
      deptMap: {},
      barChart: [],
      deptActityList: [], //部门活动列表
      xAxisList: [], //步骤
      seriesList: [], //数据
      active: 0,
      stepContent: {},
      rules: {
        count: [
          { required: true, message: "请输入参加活动人数", trigger: "blur" }
        ],
        img: [{ required: true, message: "请选择图片", trigger: "blur" }],
        content: [
          { required: true, message: "请输入活动阶段总结", trigger: "blur" }
        ]
      },
      myConfig: {
        elementPathEnabled: false,
        wordCount: false, //是否开启字数统计
        // 初始容器高度
        initialFrameHeight: 380,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "http://www.gxxmglzx.com/tender/ueditor/controller.php",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: process.env.BASE_URL + "UEditor/"
      },
      file: {},
      stepDialogVisible: false, // 添加步骤dialog
      nowStep: 0
    };
  },
  components: {
    VueUeditorWrap,
    Uploader
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
        color: ["#4977fc"],
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
            data: this.xAxisList,
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
            data: this.seriesList,
            barWidth: 25, // 柱形的宽度
            barCategoryGap: "5%", // 柱形的间距
            itemStyle: {
              normal: {
                color: "#4977fc"
              },
              emphasis: {
                color: "#4ad030"
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 获取详情页详情
    async getActivityByDeptId() {
      const res = await getActivityByDeptId(this.id);
      this.deptActityList = res.data;
      // 计算完成进度
      this.active = this.getStep();

      // 生成绘制柱状图的数据
      this.barChart = this.getChart();
      // 绘制柱状图
      this.initCharts();
    },
    getChart() {
      this.xAxisList = []; //步骤
      this.seriesList = []; //数据
      this.deptActityList.forEach(obj => {
        this.xAxisList.push(obj.stepName);
        this.seriesList.push(obj.count);
      });
      // return chartList;
    },
    getStep() {
      let num = 1;
      let nowDate = new Date();
      for (var i = 0; i < this.deptActityList.length; i++) {
        let obj = this.deptActityList[i];
        //finishTime:"2020-12-15 00:00:00"
        let finishDate = new Date(obj.finishTime);
        if (nowDate.getTime() > finishDate.getTime()) {
          num = i + 1;
        }
      }
      return num;
    },
    edit(step) {
      this.stepDialogVisible = true;
      this.nowStep = step;
    },
    // 获取wFid和nFid
    getFileUrl(args) {
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.file.isChange = true;
      this.stepContent.imgUrl = args[1];
    },
    async saveActivity() {
      const res = await saveActivity({
        ...this.stepContent,
        stepId: this.nowStep,
        workId: this.id,
        remark: ""
      });
      this.handleClose();
      this.getActivityByDeptId();
    },
    handleClose() {
      this.stepDialogVisible = false;
      // this.worklist.step = ''
      this.step = {
        count: "",
        content: ""
      };
    }
  },
  created() {
    this.getActivityByDeptId();
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
