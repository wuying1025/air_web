<template>
  <div class="app-container law-detail-xf" v-loading="loading">
    <div class="content">
      <div class="control-content">
        <div class="search-form">
          <h3>{{ title }}</h3>
          <span style="color: gray; font-size: 14px">{{ remark }}</span>
        </div>
        <div class="control-bar">
          <el-button
            @click="printTest"
            size="small"
            type="text"
            icon="el-icon-printer"
            >打印</el-button
          >
          <el-button
            @click="closePage"
            size="small"
            type="text"
            icon="el-icon-close"
            >关闭</el-button
          >
        </div>
      </div>
      <div class="app-container">
        <div ref="textContent" class="textContent" v-html="htmlContent"></div>
        <div class="href-link">
          <div class="search-content">
            <el-form @submit.native.prevent :inline="true">
              <el-form-item>
                <el-input
                  size="small"
                  v-model="searchText"
                  clearable
                  @clear="clearInp"
                  @change="enterInp"
                  placeholder="请输入搜索内容"
                  :disabled="contentSearch"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="contentSearch" size="small" type="primary" @click="searchHandle"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
            <span v-if="hrefList.length > 0" class="search-res-info"
              >共有{{ hrefList.length }}条结果</span
            >
          </div>
          <div class="list-content" v-if="hrefList.length > 0">
            <ul @click="testScroll">
              <li v-for="(item, index) in hrefList" :key="index">
                <p v-if="contentSearch">&lt;&lt;{{item.title}}&gt;&gt;</p>
                <span>第{{ index + 1 }}条</span>
                <div v-html="item.val"></div>
              </li>
            </ul>
          </div>

          <div v-else class="empty-list">暂无搜索内容</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let contentTitles = []
import { getRawList, getLawDetail,getByContent } from "@/api/law";
import { encode, decode } from "js-base64";
import Tinymce from "@/components/Tinymce/index";
let selectTextId = "";
export default {
  data() {
    return {
      loading: false,
      content: "",
      title: "",
      remark: "",
      hrefList: [],
      htmlContent: "",
      searchText: "",
      contentSearch:false //当前是否为根据内容搜索
    };
  },
  methods: {
    //根据内容搜索
    getDataByContent() {
      this.loading = true;
      getByContent({ keyWords:this.contentSearchText }).then((res) => {
        this.getAllContent(res.data)
      });
    },
    // 根据内容搜索-获取所有内容
    getAllContent(arr) {
      let promiseArr = arr.map((val) => {
        return (
          new Promise((resolve, reject) => {
            getLawDetail({
              id:val.id,
            }).then((res) => {
              resolve({
                id:val.id,
                title:val.name,
                data:res.data
              })
            });
          })
        );
      });
      Promise.all(promiseArr).then((res)=>{
        let thisContent = "";
        this.title = `搜索内容“${this.contentSearchText}”`;
        this.remark = `共有${res.length}个文章`;
        res.map((item) => {
          contentTitles.push({
            id:item.id,
            title:item.title
          })
          let str = '<div style="display:none" class="title-base-line">'+item.title+' </div>';
          thisContent += encode(str)
          item.data.map((item2)=>{
            thisContent += item2.content
          })
        });
        this.content = decode(thisContent);
        this.htmlContent = this.content;

        this.heightLight(this.contentSearchText)
        this.loading = false
      })
    },
    //打印功能
    printTest() {
      var newWindow = window.open("", "_blank");
      var docStr = this.htmlContent;
      newWindow.document.write(docStr);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    },
    // 回车搜索
    enterInp(val) {
      this.heightLight(val);
    },
    // 清空搜索框
    clearInp() {
      this.htmlContent = this.content;
      this.hrefList = [];
      this.$refs.textContent.scrollTo(0, 0);
    },
    // 搜索事件
    searchHandle() {
      this.heightLight(this.searchText);
    },
    // 格式化搜索内容
    selectDiv(regExp, str) {
      let matchStr = "";
      let arr = this.htmlContent.split("");
      let indexArr = [];
      matchStr = str.replace(regExp, (all, first) => {
        indexArr.push(first);
        return `<span style="background-color:yellow" id="a${first}">${all}</span>`;
      });
      this.htmlContent = matchStr;
      let non_html = this.htmlContent
        .replace(/<[^<>]+>/g, "")
        .replace(/&nbsp;/gi, "");
      let nh_arr = [];
      let i = 0;
      let res = "";
      non_html.replace(regExp, (all, first) => {
        let start = 0;
        let end = 0;
        start = first - 20 > 0 ? first - 20 : first;
        end = first + 20 < non_html.length ? first + 20 : first + all.length;
        res = `<span style="display:block" data-ref="a${
          indexArr[i++]
        }">${non_html.substring(start, end)}</span>`;
        let reg2 = new RegExp(all, "g");
        res = res.replace(
          reg2,
          `<span style="background-color:yellow">${all}</span>`
        );
        
        // 记录文章名称
        let thisTitle = ""
        for(var j=contentTitles.length-1;j>=0;j--){
          if(indexArr[i-1] >= contentTitles[j].baseNum){
            thisTitle = contentTitles[j].title;
            break;
          }
        }
        nh_arr.push({
          val:res,
          title:thisTitle
        });
      });
      this.hrefList = nh_arr;
    },
    // 根据内容高亮
    heightLight(val) {
      this.htmlContent = this.content;
      var str = this.htmlContent;
      var queryTitle = val;
      var reg = new RegExp(queryTitle, "g");

      //记录每个文章的位置
      let i = 0;
      str.replace(/title-base-line/g, (all, first) => {
        contentTitles[i].baseNum = first;
        i++;
      })

      this.selectDiv(reg, str);
    },
    // 测试滚动
    testScroll(event) {
      if (event.target.dataset.ref) {
        if(selectTextId)document.getElementById(selectTextId).style.backgroundColor = "yellow"
        let thisRef = event.target.dataset.ref;
        let thisTop = document.getElementById(thisRef).offsetTop;
        selectTextId = thisRef;
        document.getElementById(thisRef).style.backgroundColor = "red"
        this.$refs.textContent.scrollTo(0, thisTop - 230);
      }
    },
    //关闭页面
    closePage() {
      this.$router.push("/law/lawlist");
    },
    // 获取法规列表数据
    getList() {
      getRawList().then((res) => {
        this.getDetail(res.data[0].id);
      });
    },
    // 获取法规详情
    getDetail(id) {
      this.loading = true;
      getLawDetail({
        id,
      }).then((res) => {
        let thisContent = "";
        this.title = res.data[0].name;
        this.remark = res.data[0].remark;
        res.data.map((item) => {
          thisContent += item.content;
        });
        this.content = decode(thisContent);
        this.htmlContent = this.content;
        this.loading = false;
      });
    },
  },
  mounted() {
    // if (this.$route.params.id == ":id") {
    //   this.getList();
    // } else {
    //   this.getDetail(this.$route.params.id);
    // }

    if (this.$route.params.id != "0" && !this.$route.query.search) {
      this.getDetail(this.$route.params.id);
    } else if (this.$route.query.search) {
      this.contentSearch = true;
      this.contentSearchText = this.$route.query.search;
      this.getDataByContent();
    }
    console.log(this.$route)
  },
  components: { Tinymce },
};
</script>
<style lang="scss">
.law-detail-xf {
  .textContent > div {
    width: unset !important;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  h3 {
    font-size: 30px;
    margin: 20px 0;
  }
  .control-content {
    position: relative;
    background-color: #fff;
    text-align: center;
  }
  .container {
    min-height: calc(100vh - 84px);
    background-color: #f3f4fa;
  }
  .search-inp {
    position: relative;
    right: -20px;
  }
  .table-content {
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
  .textContent {
    width: calc(100% - 400px);
    height: calc(100vh - 320px);
    padding: 20px;
    box-sizing: border-box;
    background-color: #f3f4fa;
    position: absolute;
    top: 160px;
    overflow: scroll;
  }
  .href-link {
    width: 280px;
    padding: 30px;
    position: fixed;
    right: 30px;
    top: 220px;
    height: calc(100vh - 270px);
    overflow-y: scroll;
    background-color: #fff;
    box-shadow: -3px 0 3 rgba(0, 0, 0, 0.3);
  }
  .href-link ul {
    padding: 0;
  }
  .href-link li {
    list-style: none;
    padding: 20px 0;
    border-bottom: 1px solid #f3f4fa;
    cursor: pointer;
  }
  .search-content {
    height: 80px;
    padding-top: 20px;
    background-color: #fff;
    position: fixed;
    z-index: 1000;
    top: 210px;
    right: 25px;
  }
  .control-content {
    height: 140px;
    overflow: hidden;
  }
  .empty-list {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
  }
  .search-res-info {
    position: relative;
    top: -20px;
    left: 16px;
    color: #999;
    font-size: 14px;
  }
  .list-content {
    margin-top: 20px;
    overflow: hidden;
    margin-left: -3px;
  }
  .list-content span {
    font-size: 13px;
    color: #999;
    display: inline-block;
    margin-bottom: 5px;
  }
  .table-content {
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }
  .content {
    padding: 20px;
    background-color: #fff;
    /* position: absolute;
  width: 100%;
  top:120px;
  bottom: 10px; */
    min-height: calc(100vh - 160px);
    border-radius: 5px;
  }
  .control-bar {
    position: absolute;
    top: 10px;
    right: 20px;
    color: #999;
  }
  .control-bar span {
    cursor: pointer;
  }
}
</style>