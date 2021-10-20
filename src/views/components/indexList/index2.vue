<template>
  <!-- 首页文章列表 -->
  <!-- type 值1:历史今天，2：曝光问题，3：部门要事，4：事故通报，5：司机专栏，6：学习园地，7：部队管理动态 -->
  <div class="container">
    <li class="list">
      <h2 class="list-title">
        <span class="line"></span>
        <span class="cn-title">{{ title }}</span>
        <!-- <span class="en-title">/Incident notification</span> -->
        <!-- <div class="right">
          <a href="#" id="">查看详情</a>
        </div> -->
      </h2>
      <ul class="sub-list-container">
        <li @click.stop="showDetail(item)" class="sub-list" v-for="(item, index) in dataList" :key="index">
          <span> {{ item.title }}</span>
          <span class="createtime">{{ item.createTime }}</span>
        </li>
      </ul>
    </li>
  </div>
</template>
<script>
import { dateFormat } from "../../../utils/format";
import { exposureList } from "@/api/exposure";
import { addAppeal, appealList } from "@/api/appeal";

export default {
  props: ["type"],
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      diaLoading: false,
      appealForm: {},
      dialogFormVisible: false,
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 5,
      total: 0, //总页数
      appealForm: {},
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$refs.form.resetFields();
    },
    // 申诉按钮
    appealBtn(row) {
      this.appealId = row.id;
      this.dialogFormVisible = true;
    },
    // 申诉
    appealHandle() {
      this.diaLoading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          addAppeal({
            username: this.appealForm.title,
            hid: this.appealId,
            complaint: this.appealForm.content,
          }).then((res) => {
            this.$message({
              message: "申诉已发出",
              type: "success",
            });
            this.$refs.form.resetFields();
            this.dialogFormVisible = false;
            this.diaLoading = false;
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    // 获取法规列表数据
    getList() {
      let _data = {
        current: this.currentPage,
        size: this.pageSize,
        type: this.type,
      }
      if (this.type == 1) {
        _data.time = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      }
      this.loading = true;
      exposureList(_data).then((res) => {
        // console.log(res);
        res.data.records.map(item => {
          item.createTime = item.createTime.substring(0, 10)
        })
        this.dataList = res.data.records;
        this.loading = false;
        this.total = res.data.total
      });
    },
    // 初始化数据
    initData() {
      this.currentPage = 1;
      this.getList();
    },

    // 查看详情
    showDetail(_data) {
      console.log(_data);
      this.$router.push({
        path: "/exposure_/detail/" + _data.id,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getList();
    },
    async lookBtn(row) {
      const res = await appealList({
        current: this.currentPage,
        size: this.pageSize,
        hId: row.id
      })
      if (res && res.code == 200 && res.data.records && res.data.records[0]) {
        this.btnShow = false
        this.dialogFormVisible = true
        this.appealForm = {
          title: res.data.records[0].username,
          content: res.data.records[0].complaint,
        }
      }
    },
    closeDialog() {
      this.$refs.form.resetFields();
    },
  },
  mounted() {
    this.getList();
  },
  computed: {
    title() {
      let _title = "";
      let _type = this.type * 1;
      switch (_type) {
        case 1:
          _title = "事故防范与安全提醒";
          break;
        case 2:
          _title = "场站保证申请与反馈";
          break;
        case 3:
          _title = "部门要事";
          break;
        case 4:
          _title = "事故通报";
          break;
        case 5:
          _title = "司机专栏";
          break;
        case 6:
          _title = "学习园地";
          break;
        case 7:
          _title = "部队管理动态";
          break;
        default:
          _title = "无";
      }
      return _title;
    },
  },
};
</script>
<style lang="scss" scoped>
li {
  list-style: none;
}
/* .container {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
} */
.content::after {
  content: "";
  display: block;
  clear: both;
}
.list-container {
  /* display: flex;
  flex-wrap: wrap;
  padding: 0 60px;
  margin-bottom: 10px;
  .list-item{
    width: 33%;
  } */
  .list {
    margin-bottom: 20px;
    .sub-list-container {
      padding: 0 20px 0 10px;
      .sub-list {
        height: 37px;
        line-height: 37px;
        .createtime {
          float: right;
        }
      }
      .sub-list:hover span{
        cursor: pointer;
        color: #a11e2b;
      }
    }
  }
}
.list-title {
  height: 44px;
  // line-height: 67px;
  font-weight: 400;
  padding-right: 20px;
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
</style>