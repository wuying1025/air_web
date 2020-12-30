<template>
  <el-main>
    <div class="main-content">
      <!-- <el-tabs tab-position="left" v-model="stepId">
        <el-tab-pane
          v-for="(obj,index) in steps"
          :key="index"
          :label="obj.stepName"
          :name="obj.id"
      >-->
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
        <el-form-item>
          <el-button type="primary" @click="saveActivity()">确定</el-button>
        </el-form-item>
      </el-form>
      <!-- </el-tab-pane>
      </el-tabs>-->
    </div>
  </el-main>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import { saveActivity } from "@/api/worklist.js";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
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
        // serverUrl: "http://www.gxxmglzx.com/tender/ueditor/controller.php",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: process.env.BASE_URL + "UEditor/"
      },
      file: {},
      id: this.$route.query.id
    };
  },
  components: {
    VueUeditorWrap,
    Uploader
  },
  methods: {
    // 获取wFid和nFid
    getFileUrl(args) {
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.file.isChange = true;
      this.stepContent.imgUrl = args.url;
    },
    async saveActivity() {
      const res = await saveActivity({
        ...this.stepContent,
        stepId: this.stepId,
        workId: this.id,
        remark: ""
      });
    }
  }
};
</script>

<style>
/*表格内容区  */
.main-content {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>