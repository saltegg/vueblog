<template>
  <el-row class="warp" v-loading="loading">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">博客管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加博客</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24">
      <el-form ref="form" :model="form" label-width="82px">
        <el-form-item label="请选择">
          <el-select v-model="form.blogKind" placeholder="请选择">
            <el-option label="原创" value="原创"></el-option>
            <el-option label="转载" value="转载"></el-option>
            <el-option label="翻译" value="翻译"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="博客分类">
          <el-select v-model="form.cid" placeholder="请选择">
            <el-option 
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
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
        
        <el-form-item label="私密文章">
          <el-switch v-model="form.state"></el-switch>
        </el-form-item>

        <!--
          中间有一个富文本编辑器，用来编写博客内容！！！！！！
         -->
         <el-form-item label="文章内容">
            <mavonEditor v-model="form.mdContent" ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"></mavonEditor>
         </el-form-item>
         
         
        <el-form-item>
          <el-button type="primary" @click="saveBlog">发布博客</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getRequest } from '../../../api/api';
import { postRequest } from '../../../api/api';
import { uploadRequest } from '../../../api/api';
export default {
  data() {
      return {
        option:[],
        form: {
          title: '',
          blogKind: '',
          state: false,
          cid: '',
          mdContent: '',
          tags:[]
        },
        inputVisible: false,
        inputValue: '',
        loading:false
      }
    },
    mounted(){
      this.getOption();
    },
    methods: {
      saveBlog() {
        var _this = this;
        _this.loading = true;
        postRequest('/article/save',{
          title:_this.form.title,
          state:_this.form.state == false? 0 : 1,
          blogKind:_this.form.blogKind,
          cid:_this.form.cid,
          mdcontent:_this.form.mdContent,
          htmlcontent: _this.$refs.md.d_render,
          tags:_this.form.tags
        }).then( resp => {
          _this.loading = false;
          if(resp.status === 200 && resp.data.status === 200){
            _this.$message({type: 'success', message:'发布成功!'});
            //扩张逻辑
            this.resetForm('form');
          }
        },resp=> {
          _this.loading = false;
          _this.$message({type: 'error', message:'博客发布失败!'});
        });
        //console.log('发表成功');
      },
      getOption() {
        var _this = this;
        getRequest('/category/option/list').then( resp => {
          if(resp.status === 200){
            this.option = resp.data;
          }
        });
      },
      $imgAdd(pos, $file) {
        var _this = this;
        var formdata = new FormData();
        formdata.append('image',$file);
        uploadRequest('/article/uploading',formdata).then( resp => {
          var json = resp.data;
          console.log(json);
          if (json.error == 1) {
//            _this.$refs.md.$imgUpdateByUrl(pos, json.msg)
            _this.$refs.md.$imglst2Url([[pos, json.url]])
          } else {
            _this.$message({type: json.status, message: json.message});
          }
        });
      },
      $imgDel(pos) {

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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