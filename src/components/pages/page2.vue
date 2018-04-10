<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">博客管理</el-breadcrumb-item>
        <el-breadcrumb-item>博客列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-button type="primary" icon="el-icon-edit" @click="handleEditorBlog">编辑博客</el-button>
      <el-button type="danger" icon="el-icon-delete">删除博客</el-button>
      <!--点击编写新博客路由到编写博客的页面 -->
      <el-button type="info" icon="el-icon-circle-plus-outline" @click="jumpTo">编写新博客</el-button>
    </el-col>
    <el-col :span="24" class="surroud">
      <template>
        <el-table 
          :data="tableData" 
          highlight-current-row 
          @selection-change="handleSelectionChange" 
          style="width: 100%"
          v-loading="loading">
          <el-table-column type="selection" width="55" @click="handleClick">
          </el-table-column>
          <el-table-column label="博客ID"  width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="博客标题"  width="450">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="博客分类" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.cateName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.state }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编写时间" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.publishdate | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" >
            <template slot-scope="scope">
              <span>{{ scope.row.edittime | formatDateTime}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-col>
    <el-col :span="24">
      <div class="block">
        <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-col>

    <!--弹出会话 编辑博客 -->
    <el-dialog title="修改博客" :visible.sync="dialogFormVisible" style="width:100%">
      <el-form :model="form">
        <el-form-item label="选择方式">
          <el-select v-model="form.blogKind" placeholder="请选择">
            <el-option label="原创" value="shanghai"></el-option>
            <el-option label="转载" value="beijing"></el-option>
            <el-option label="翻译" value="guangdong"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="form.title" style="width:90%;"></el-input>
        </el-form-item>
        <el-form-item label="博客分类">
          <el-select v-model="form.cid" placeholder="请选择">
            <el-option label="前端" value="前端"></el-option>
            <el-option label="后端" value="后端"></el-option>
            <el-option label="人工智能" value="人工智能"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="私密文章">
          <el-switch v-model="form.state"></el-switch>
        </el-form-item>

        <el-form-item label="添加标签">
          <el-tag
            :key="tag"
            v-for="tag in form.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
         </el-form-item>
        <!--
          中间有一个富文本编辑器，用来编写博客内容！！！！！！
         -->
         <el-form-item>
            <mavonEditor v-model="form.mdContent"/>
         </el-form-item>
         
         
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发布博客</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script scoped>
import { mavonEditor } from 'mavon-editor'
import { getRequest } from '../../../api/api.js'
import 'mavon-editor/dist/css/index.css'
export default {
  data() {
    return {
      tableData: [],
      form: {
        title: '',
        blogKind: '',
        state: false,
        cid: '',
        mdContent: '',
        tags:[]
      },
      multipleSelection: [],
      dialogFormVisible: false,
      totalCount:-1,
      currentPage: 1,
      pageSize: 6,
      formLabelWidth: '120px',
      loading:false,
      inputVisible: false,
      inputValue: '',
    }
  },
  mounted() {
    //var _this = this;
    this.loading = true;
    this.loadBlogList(1,this.pageSize);
  },
  methods: {
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadBlogList(this.currentPage,this.pageSize);
        console.log(`加载成功！！`);
      },
      handleClick(){

      },
      jumpTo(){
        //this.defaultActiveIndex = url;
        this.$router.push({path:'/pages/page1'}); 
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      onSubmit() {
        console.log('提交成功');
      },
      handleEditorBlog(){
        //判断multipleSelection的长度如果为1则弹出会话，否则提示只能选择一个
        //根据multipleSelection中的博客id向服务端请求数据，返回的数据赋给form
        //最后弹出表单
        if(this.multipleSelection.length === 1) {
          var _this = this;
          const url = '/article/desc/' + this.multipleSelection[0].id;
          //this.form.title = this.multipleSelection[0].title;
          //this.form.title = this.multipleSelection[0].
          //this.getBlogDesc(this.multipleSelection[0].id);
          getRequest(url).then(resp => {
            if(resp.status === 200){
              console.log(resp.data);
              _this.form.mdContent = resp.data.data;
            }
          });
          this.dialogFormVisible = true;
        } else {
          this.$message({
            showClose:true,
            message:'请选定一条博客',
            type:'warning'
          })
        }
      },
      loadBlogList(page,count){
        var _this = this;
        var url = '/article/list?page=' + page + '&count=' + count;
        getRequest(url).then(resp => {
          _this.loading = false;
          console.log('yes');
          console.log(resp.data.data);
          if(resp.status === 200) {
            _this.tableData = resp.data.rows;
            _this.totalCount = resp.data.total;
          }
        },resp => {
            _this.loading = false;
           //console.log(resp.response.status);
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }).catch(resp => {
            console.log(resp);
            _this.loading = false;
            _this.$message({type: 'error', message: '压根没见到服务器,数据加载失败!'});
        })
      },
      handleClose(tag) {
        this.form.tags.splice(this.form.tags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.form.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    },
    components : {  
        mavonEditor,  
    }  
}
</script>

<style scoped>
.surroud{
  margin-top: 10px;
}
.block{
  float: right;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 3px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>