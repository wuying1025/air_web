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
      </div>-->
      <el-steps :space="350" :active="activeStep" align-center finish-status="success">
        <el-step
          v-for="(obj,index) in worklist.steps"
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
      <el-tabs v-model="status" type="card" class="spwork">
        <el-tab-pane :label="item.deptName" v-for="(item, index) in this.detail" :key="index">
          <div class="main-list-box">
            <ul class="specialCheck">
              <li @click="tabTable(0)" :class="{'active':showTableIndex == 0}">普通检查项</li>
              <li
                v-for="(spec, specIndex) in special[index]"
                :class="{'active':showTableIndex == specIndex+1}"
                @click="tabTable(specIndex+1)"
                :key="specIndex"
              >特殊检查项{{specIndex+1}}</li>
            </ul>
            <div class="content-box">
               <div class="download">
                <!-- <span>打印</span>
                <i class="el-icon-printer"></i> -->
                <span @click="downLoad(item.deptId)">下载</span>
                <i class="el-icon-download"></i>
              </div>
              <el-table
                v-if="common && common[index] && showTableIndex == 0"
                :data="common[index].values"
                tooltip-effect="dark"
                style="width: 100%"
                border
                :header-cell-style="{background:'#fafafa'}"
                v-loading="loading"
              >
                <el-table-column type="selection" width="55" label="全选"></el-table-column>
                <el-table-column
                  v-for="(item, columnsIndex) in common[index].columns"
                  :key="columnsIndex"
                  :prop="item.enName"
                  :label="item.cnName"
                  align="center"
                ></el-table-column>
                <el-table-column label="状态" width="180" align="center" fixed="right">
                  <template slot-scope="scope">
                    <span
                      v-if="common[index].commonScore[scope.$index].status == 1"
                      class="isdone qualified"
                    >合格</span>
                    <span v-else-if="common[index].commonScore[scope.$index].status == 2" class="isdone unqualified">不合格</span>
                    <span v-else-if="common[index].commonScore[scope.$index].status == 3"
                      class="isdone qualified"
                    >未评分</span>
                  </template>
                </el-table-column>
                <el-table-column label="备注" width="220" align="center" fixed="right">
                  <template slot-scope="scope">
                    <!-- v-model="commonScore[(index* common[index].values.length + scope.$index)].remark" -->
                    <el-input v-model="common[index].commonScore[scope.$index].remark" disabled></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <div v-for="(spec, specIndex) in special[index]" :key="specIndex">
                <el-table
                  v-if="showTableIndex == specIndex+1"
                  :data="spec.values"
                  style="width: 100%"
                  tooltip-effect="dark"
                  border
                  :header-cell-style="{background:'#fafafa'}"
                  v-loading="loading"
                >
                  <el-table-column
                    v-for="(item, columnsIndex) in spec.columns"
                    :key="columnsIndex"
                    :prop="item.enName"
                    :label="item.cnName"
                    align="center"
                  ></el-table-column>
                  <el-table-column label="状态" width="180" align="center">
                    <template slot-scope="scope">
                      <!-- :active-text="'合格'+ spec.specialScore[scope.$index].status" -->
                      <span
                        v-if="spec.specialScore[scope.$index].status"
                        class="isdone qualified"
                      >合格</span>
                      <span v-else class="isdone unqualified">不合格</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="spec.specialScore[scope.$index].remark" disabled></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- <div class="page-box">
              <el-pagination
                layout="total, prev, pager, next, jumper"
                :total="total"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>-->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-main>
</template>

<script>
import echarts from "echarts";
import iconImg from "@/assets/image/excel-icon.jpg";
import { getInspectById, queryMyScore, exportCheckScore } from "@/api/worklist";
export default {
  data() {
    return {
      status: 0,
      activeStep: 1,
      worklist: [],
      iconImg: iconImg,
      commonTableData: [],
      commonColumns: [],
      loading: false,
      detail: [],
      common: [],
      special: [],
      numData: [], //记录不合格项
      deptsData: [], //记录连队
      showTableIndex: 0,
      id: this.$route.query.id
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
            // deptsData
            data: this.deptsData,
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
            // numData
            data: this.numData,
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
    async queryScoreHandler() {
      this.common = [];
      this.special = [];
      const res = await queryMyScore({ specialWorkId: this.id });
      if (res && res.code === "200") {
        this.detail = [res.data];
        let item = res.data;
        // res.data.forEach((item, index) => {
        const { columns: commonColumns, values: commonValues } = JSON.parse(
          item.commonJson
        );
        let count = 0; //记录连队不合格数量
        this.deptsData.push(item.deptName); //记录连队

        const commonScore = [];
        // console.log(commonValues,commonColumns);
        commonValues.forEach((cv, index) => {
          // 如果已经打过分，直接读取
          if (item.commonScores && item.commonScores.length > 0) {
            let status =
              item.commonScores[index].colStatusValue == "合格" ? 1 : 2;
            if (status == 2) {
              count++;
            }
            commonScore.push({
              status,
              remark: item.commonScores[index].colRemarkValue
            });
          } else {
            commonScore.push({
              status: 3,
              remark: ""
            });
          }
        });

        this.common.push({
          columns: commonColumns,
          values: commonValues,
          commonScore
        });

        const { specialFiles } = item;
        const s = [];
        specialFiles.forEach(sf => {
          const { columns: specialColumns, values: specialValues } = JSON.parse(
            sf.specialJson
          );
          const specialScore = [];
          specialValues.forEach((sv, index) => {
            if (sf.scores && sf.scores.length > 0) {
              let status =
                sf.scores[index].colStatusValue == "合格" ? true : false;
              if (!status) {
                count++;
              }
              specialScore.push({
                status,
                remark: sf.scores[index].colRemarkValue
              });
            } else {
              specialScore.push({
                status: true,
                remark: ""
              });
            }
          });
          s.push({
            columns: specialColumns,
            values: specialValues,
            specialScore
          });
        });

        this.special.push(s);
        this.numData.push(count);
        // });
      }
    },
    getStep() {
      this.worklist.steps.forEach((obj, index) => {
        if (obj.stepStatus == 1) {
          this.activeStep = index + 1;
        }
      });
    },
    tabTable(index) {
      this.showTableIndex = index;
    },
    async downLoad() {
      const res = await exportCheckScore({
        deptId: this.detail[0].deptId,
        specialWorkId: this.detail[0].common.specialworkId
      });
      const blob = res;

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = e => {
        const a = document.createElement("a");
        a.download = `检查.xlsx`;
        // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  },
  async mounted() {
    this.loading = true;
    this.id = this.$route.query.id;
    if (this.id) {
      const res = await getInspectById(this.id);
      if (res && res.code === "200") {
        this.worklist = res.data;
        // 计算步骤进度
        this.getStep();
      }
      await this.queryScoreHandler();
      this.initCharts();
    } else {
      this.$message({
        message: "读取失败",
        type: "error"
      });
    }

    this.loading = false;
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
     background: #FA8072;
    border-radius: 200px;
    color: #fff;
    font-weight: 600;
    float: left;
    font-size: 12px;
    margin: 0 15px;
    cursor: pointer;
    &.active{
      background: #f00;
    }
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
.isdone {
  border-radius: 40px;
  color: #fff;
  display: inline-block;
  padding: 0px 12px;
  font-size: 12px;
  &.unqualified {
    background: #f61717;
  }
  &.qualified {
    background: #8a8a8a;
  }
}
.el-input.is-disabled .el-input__inner {
  background: #fff !important;
}
.content-box {
  position: relative;
}
.download {
  position: absolute;
  top: -40px;
  right: 0px;
  color:#8a8a8a;
  cursor: pointer;
  .el-icon-printer{
    margin-right: 8px;
  }
}
</style>
