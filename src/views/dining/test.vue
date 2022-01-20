<template>
  <div class="test-container">
    <div class="main-content">
      <h1 class="main-title">{{ title }}</h1>

      <el-form
        ref="unitForm"
        :model="unitForm"
        :rules="unitRule"
        label-width="80px"
      >
        <el-form-item label="调查单位" prop="unitId">
          <el-select
            v-model="unitForm.unitId"
            placeholder="请选择被调查单位"
            style="width: 240px"
          >
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="本人单位" prop="userName">
          <el-input v-model="unitForm.userName" style="width: 240px"></el-input>
        </el-form-item>
      </el-form>

      <el-form ref="form" :model="form">
        <h2 class="label">评分题</h2>
        <div class="biaozhun">
          评分标准：优(20-18) 良(17-15) 中(14-12) 差(11及以下)
        </div>
        <el-card
          class="card"
          v-for="(choice, choiceIndex) in form.choice"
          :key="choice.id"
        >
          <h4 class="sub-title">
            第{{ choiceIndex + 1 }}题 {{ choice.title }}
          </h4>
          <el-input-number
            v-model="form.choice[choiceIndex].answer"
            :min="0"
            :max="20"
            size="mini"
            class="score"
          ></el-input-number
          >分
        </el-card>
        <!-- 简答题 -->
        <h2 class="label">简答题</h2>
        <el-card
          class="card"
          v-for="(essay, essayIndex) in form.essay"
          :key="essay.id"
        >
          <h4 class="sub-title">第{{ essayIndex + 1 }}题 {{ essay.title }}</h4>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入答案"
            v-model="form.essay[essayIndex].answer"
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
import { takeDiningNaire, answer, getUnitList } from "@/api/dining";

export default {
  data() {
    return {
      title: '',
      centerDialogVisible: false,
      form: {
        choice: [],
        essay: []
      },
      unitList: [],
      unitForm: {
        unitId: '',
        userName: ''
      },
      unitRule: {
        unitId: [{ required: true, message: "请选择被调查部门", trigger: "change" }],
        userName: [{ required: true, message: "请输入本人单位名称", trigger: "blur" }],
      },
    }
  },
  methods: {
    async getData() {
      const unitList = await getUnitList({
        ...this.search,
        current: this.currentPage,
        size: this.pageSize,
      })
      // console.log(res);
      this.unitList = unitList.data.records;

      const res = await takeDiningNaire(this.$route.query.questionId)
      // console.log(res);
      if (res && res.code === '200' && res.data) {
        this.title = res.data.title

        res.data.choiceQuestion.forEach((data, index) => {
          this.$set(this.form.choice, index, data)
          this.$set(this.form.choice[index], 'answer', '20')
        })

        res.data.essayQuestion.forEach((data, index) => {
          this.$set(this.form.essay, index, data)
          this.$set(this.form.essay[index], 'answer', '')
        })
      }
    },
    commitHandler() {
      this.$refs['unitForm'].validate(async valid => {
        if (valid) {
          const result = []
          this.form.choice.forEach(data => {
            result.push({
              questionId: data.id,
              naireId: this.$route.query.questionId,
              userAnswer: data.answer,
              userId: this.$route.query.userId,
              diningId: this.unitForm.unitId,
              userName: this.unitForm.userName
            })
          })
          this.form.essay.forEach(data => {
            result.push({
              questionId: data.id,
              naireId: this.$route.query.questionId,
              userAnswer: data.answer,
              userId: this.$route.query.userId,
              diningId: this.unitForm.unitId,
              userName: this.unitForm.userName,
            })
          })
          // console.log(result);
          const res = await answer(result)
          // console.log(res);
          if (res && res.code === '200') {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.centerDialogVisible = false
            setTimeout(() => {
              this.$router.push('/login')
            }, 2000)
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.test-container {
  height: 100%;
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
.biaozhun {
  font-size: 16px;
  margin-bottom: 20px;
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
.score {
  margin-right: 10px;
}
</style>