<!-- 发布法规 -->
<template>
  <div>
    <el-main>
      <div class="main-content">
        <div v-loading="loading" class="app-container">
          <el-form ref="form" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="申请标题" prop="title">
              <el-input v-model="form.title" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="选择分类" prop="cateId">
              <el-select
                v-model="form.cateId"
                placeholder="请选择分类"
                style="width: 300px"
              >
                <el-option
                  v-for="item in cateData"
                  :key="item.id"
                  :label="item.cateName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="form.deptName" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="form.contact" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="曝光内容" prop="content">
              <tinymce v-model="form.content" :height="300" />
              <!-- <VueUeditorWrap :config="myConfig" v-model="form.content" /> -->
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="isChange"
                type="primary"
                @click="editForm('form')"
                >立即修改</el-button
              >
              <el-button v-else type="primary" @click="submitForm('form')"
                >立即创建</el-button
              >
              <el-button @click="$router.go(-1)">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
// import VueUeditorWrap from "vue-ueditor-wrap";
import { getCate } from "@/api/cate.js";
import { addExposure, exposureDetail, exposureUpdate } from "@/api/exposure";
export default {
  data() {
    return {
      loading: false,
      form: {
        title: "",
        content: "",
        cateId: '',
        deptName: '',
        contact: '',
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        cateId: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
      },
      isChange: false, //false添加 true修改
      cateData: [],
    };
  },
  methods: {
    //   修改内容
    editForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          exposureUpdate({
            title: this.form.title,
            type: 2,
            id: this.$route.query.id,
            ...this.form,
          }).then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/exposure/list");
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    // 提交表单操作
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addExposure({
            title: this.form.title,
            type: 2,
            ...this.form,
          }).then((res) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/exposure/list");
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    //   清除表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 修改曝光问题
    initUpdate(id) {
      this.loading = true;
      this.isChange = true;
      exposureDetail(id).then((res) => {
        let _data = {
          title: res.data.title,
          content: res.data.content,
        };
        this.form = _data;
        this.loading = false;
      });
    },
    // 获取分类列表
    async getCateList() {
      const { code, data } = await getCate({
        size: 1000,
        type: 2, //曝光问题2
      })
      if (code === '200' && data.records) {
        this.cateData = data.records;
      }
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  mounted() {
    let _id = this.$route.query.id;
    if (_id) {
      this.initUpdate(_id);
    }
    this.getCateList()
  },
  components: {
    Tinymce,
    // VueUeditorWrap
  },
};
</script>
<style scoped>
.main-content {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>