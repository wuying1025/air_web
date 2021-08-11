<template>
  <div class="app-container" v-loading="loading" v-if="!loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span v-if="ExerType == 1">单选题</span>
        <span v-else-if="ExerType == 2">多选题</span>
        <span v-else-if="ExerType == 3">判断题</span>
        <span v-else-if="ExerType == 4">简答题</span>
      </div>
      <!-- 单选和判断模版 索引小于单选题  或者索引大于多选题数量显示 -->
      <el-main class="multiple-box">
        <el-form ref="form">
          <h3 style="height: 50px">{{ exerList[nowIndex].title }}</h3>
          <el-radio-group
            v-model="userAnswer"
            v-if="ExerType == 1 || ExerType == 3"
            style="width: 100%"
          >
            <el-radio :label="'A'" border
              >A.{{ exerList[nowIndex].choiceA }}</el-radio
            >
            <el-radio :label="'B'" border
              >B.{{ exerList[nowIndex].choiceB }}</el-radio
            >
            <el-radio :label="'C'" border v-if="exerList[nowIndex].choiceC"
              >C.{{ exerList[nowIndex].choiceC }}</el-radio
            >
            <el-radio :label="'D'" border v-if="exerList[nowIndex].choiceD"
              >D.{{ exerList[nowIndex].choiceD }}</el-radio
            >
          </el-radio-group>
          <el-checkbox-group v-model="userAnswerArr" v-else-if="ExerType == 2">
            <el-checkbox :label="'A'" border
              >A.{{ exerList[nowIndex].choiceA }}</el-checkbox
            >
            <el-checkbox :label="'B'" border
              >B.{{ exerList[nowIndex].choiceB }}</el-checkbox
            >
            <el-checkbox :label="'C'" border
              >C.{{ exerList[nowIndex].choiceC }}</el-checkbox
            >
            <el-checkbox :label="'D'" border
              >D.{{ exerList[nowIndex].choiceD }}</el-checkbox
            >
          </el-checkbox-group>
          <!-- 简答题 -->
          <el-input
            v-else-if="ExerType == 4"
            type="textarea"
            v-model="userAnswer"
          ></el-input>

          <el-form-item>
            <el-col :span="12" align="left" class="answer-analytic-box">
              &nbsp;
              <el-tag style="font-size: 18px"
                >答题时间剩余：{{ duration }}</el-tag
              >
              <span
                v-show="
                  isAnswer && (ExerType == 1 || ExerType == 2 || ExerType == 3)
                "
              >
                回答
                <span v-if="yesOrNo" style="color: green">正确</span>
                <template v-else>
                  <span style="color: red">错误</span>
                  <span>，正确答案是 {{ exerList[nowIndex].answer }}</span>
                </template>
              </span>
            </el-col>
            <!-- <el-col
              v-else-if="ExerType == 4"
              :span="12"
              align="left"
              class="answer-analytic-box"
            >
              <div>&nbsp;</div>
            </el-col> -->
            <el-col :span="12" align="right">
              <el-button
                type="primary"
                @click="commitHandle()"
                :disabled="isAnswer"
                >确定</el-button
              >
              <el-button
                type="success"
                @click="next()"
                :disabled="!isAnswer"
                v-if="nowIndex < exerList.length - 1"
                >下一题</el-button
              >
              <el-button type="success" @click="handExam()" v-else
                >交卷</el-button
              >
            </el-col>
          </el-form-item>
        </el-form>
      </el-main>
    </el-card>
  </div>
</template>

<script>
import { takeExam, commitQuestion, handExam } from "@/api/exam";
export default {
  data() {
    return {
      single: [],
      multiple: [],
      judge: [],
      essay: [],
      userAnswer: "",
      userAnswerArr: [],
      exerList: [],
      nowIndex: 0, //记录当前题索引,
      examId: this.$route.query.id,
      isAnswer: false, //是否答题
      yesOrNo: true, //答案视奏正确
      loading: true,
      duration: this.$route.query.duration
    };
  },
  computed: {
    ExerType() {
      //1 单选  2 多选  3判断 4简答
      let result = 1;
      if (this.nowIndex < this.single.length) {
        result = 1;
      } else if (
        this.nowIndex >= this.single.length &&
        this.nowIndex < this.single.length + this.multiple.length
      ) {
        result = 2;
      } else if (
        this.nowIndex >= this.single.length + this.multiple.length &&
        this.nowIndex < this.single.length + this.multiple.length + this.judge.length
      ) {
        result = 3;
      } else {
        result = 4;
      }
      return result;
    }
  },
  methods: {
    getData() {
      takeExam({
        examId: this.examId,
        userId: this.$route.query.userId
      }).then(res => {
        this.single = [...res.data.singQues];
        this.multiple = [...res.data.multipleQues];
        this.judge = [...res.data.judgmentQues];
        this.essay = [...res.data.essayQues];
        this.getIndex(
          res.data.singQues,
          res.data.multipleQues,
          res.data.judgmentQues,
          res.data.essayQues,
        );
        this.loading = false;
      });
    },
    // 计算开始答题索引
    getIndex(single, multiple, judge, essay) {
      let count = 0;
      this.exerList = [...single, ...multiple, ...judge, ...essay];
      for (let i = 0; i < this.exerList.length; i++) {
        if (this.exerList[i].userAnswer == null) {
          this.nowIndex = i;
          count++;
          break;
        }
      }
      if (count == this.exerList.length) {
        this.$router.push({
          path: "/exams/analytic",
          query: { examId: this.examId, userId: this.$route.query.userId }
        });
      }
    },
    commitHandle() {
      let answer = "";
      if (this.ExerType == 2) {
        answer = this.userAnswerArr.join(",");
      } else {
        answer = this.userAnswer;
      }
      commitQuestion({
        userExamId: this.examId,
        questionId: this.exerList[this.nowIndex].id,
        userAnswer: answer,
        userId: this.$route.query.userId
      }).then(res => {
        this.isAnswer = true;
        if (res.msg == "true") {
          this.yesOrNo = true;
        } else {
          this.yesOrNo = false;
        }
      });
    },
    // 下一题
    next() {
      this.nowIndex++;
      this.userAnswer = "";
      this.isAnswer = false; //未答题
    },
    handExam() {
      handExam({
        examId: this.examId,
        userId: this.$route.query.userId
      }).then(res => {
        // console.log();
        this.$message({
          message: "交卷成功",
          type: "success"
        });
        this.$router.push({
          path: "/analytic",
          query: { examId: this.examId, userId: this.$route.query.userId }
        });
      });
    },
    timeHandler(time) {
      var maxtime = time * 60
      let minutes = 0
      let seconds = 0
      let msg = ''
      let timer = null
      function countDown() {
        if (maxtime >= 0) {
          minutes = Math.floor(maxtime / 60);
          seconds = Math.floor(maxtime % 60);
          msg = minutes + "分" + seconds + "秒";
          this.duration = msg
          if (maxtime == 5 * 60) {
            this.$message({
              message: "还剩5分钟",
              type: "warning"
            });
          }
          --maxtime;
        } else {
          clearInterval(timer);
          this.$message({
            message: "时间结束, 自动交卷",
            type: "warning"
          });
          setTimeout(() => {
            this.handExam()
          }, 2000)
        }
      }
      timer = setInterval(countDown.bind(this), 1000)
    }

  },
  mounted() {
    this.getData()

    this.timeHandler(this.duration)
  }
};
</script>

<style lang="scss" scoped >
.app-container {
  padding: 60px 30px;
}
.line {
  text-align: center;
}
.el-radio {
  /* display: block; */
  width: 98%;
  margin-bottom: 20px;
  white-space: normal;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0px;
  height: auto;
  padding-bottom: 10px;
  line-height: 1.5;
}
.multiple-box {
  .line {
    text-align: center;
  }
  .el-checkbox {
    /* display: block; */
    width: 98%;
    margin-bottom: 20px;
    white-space: normal;
  }
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0px;
    padding-bottom: 10px;
    height: auto;
    /* height: auto;
  padding-bottom: 10px;
  line-height: 1.5; */
  }
  .el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__label {
    white-space: normal;
    display: inline !important;
  }
  .answer-analytic-box {
    font-weight: bold;
  }
}
</style>

