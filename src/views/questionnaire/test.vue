<template>
  <div class="test-container">
    <div class="main-content">
      <h1 class="main-title">XXXX调查问卷</h1>
      <el-form ref="form">
        <h2 class="label">选择题</h2>
        <el-card
          class="card"
          v-for="(choice, choiceIndex) in choiceQuestion"
          :key="choice.id"
        >
          <h4 class="sub-title">
            第{{ choiceIndex + 1 }}题 {{ choice.title }}
          </h4>
          <el-radio-group v-model="userAnswer">
            <el-radio class="radio" :label="'A'"
              >A.{{ choice.choiceA }}</el-radio
            ><br />
            <el-radio class="radio" :label="'B'"
              >B.{{ choice.choiceB }}</el-radio
            ><br />
            <el-radio class="radio" :label="'C'" v-if="choice.choiceC"
              >C.{{ choice.choiceC }}</el-radio
            ><br />
            <el-radio class="radio" :label="'D'" v-if="choice.choiceD"
              >D.{{ choice.choiceD }}</el-radio
            ><br />
          </el-radio-group>
        </el-card>
        <!-- 简答题 -->
        <h2 class="label">简答题</h2>
        <el-card
          class="card"
          v-for="(essay, essayIndex) in essayQuestion"
          :key="essay.id"
        >
          <h4 class="sub-title">第{{ essayIndex + 1 }}题 {{ essay.title }}</h4>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入答案"
            v-model="essayAnswer"
          ></el-input>
        </el-card>

        <el-form-item class="commit-btn">
          <el-button type="primary" @click="centerDialogVisible = true"
            >提交问卷</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
      <h3 class="main-title">
        <i class="el-icon-warning-outline warning"></i>
        请确认调查问卷已全部答完
      </h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">继续答题</el-button>
        <el-button type="primary" @click="commitHandler">确认提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getQueList } from "@/api/question";

export default {
  data() {
    return {
      choiceQuestion: [],
      essayQuestion: [],
      userAnswer: '',
      essayAnswer: '',
      centerDialogVisible: false
    }
  },
  methods: {
    async getData() {
      const res = await getQueList({
        // naireId: this.naireId
        naireId: 11
      })
      this.choiceQuestion = res.data.choiceQuestion;
      this.essayQuestion = res.data.essayQuestion;
    },
    commitHandler() {
      console.log('提交');
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.test-container {
  background: #eaeff3 url(../../assets/image/bg.jpg) 0 0 no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
}
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
  width: 80%;
}
.main-title {
  text-align: center;
}
.label {
  margin: 20px 0;
}
.radio {
  margin: 5px 0;
  font-size: 24px;
}

.sub-title,
.card {
  margin-bottom: 10px;
}

.commit-btn {
  text-align: center;
  margin-top: 30px;
}
.warning {
  color: #ffba00;
  font-size: 18px;
}
</style>