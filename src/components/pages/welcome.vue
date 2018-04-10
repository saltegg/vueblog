<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">博客管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24">
      <el-input v-model="input" placeholder="请输入" style="width:200px"></el-input>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handeleAdd">添加分类</el-button>
    </el-col>
    <el-col :span="24" class="surroud">
      <template>
        <el-table :data="tableData" highlight-current-row v-loading="loading" style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="分类ID"  width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类别"  width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.catename }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-col>
    <!--编辑分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="dialogVisible" center>
      <el-input placeholder="请输入内容" v-model="newCateName" clearable>
      </el-input>
      <!-- 加一个按虐提交新的-->
    </el-dialog>
    <el-col :span="24">
      <div class="block">
        <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalRow" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getRequest } from '../../../api/api.js'
export default {
  data() {
    return {
      input: '',
      newCateName:'',
      tableData:[],
      multipleSelection:[],
      pageSize: 6,
      totalRow: -1,
      currentPage: 1,
      loading:false,
      dialogVisible:false
    }
  },
  mounted() {
    this.loading = true;
    this.loadCategory(1,this.pageSize);
  },
  methods: {
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadCategory(this.currentPage,this.pageSize);
        console.log(`加载成功`);
      },
      handleEdit(index,row) {
        this.newCateName = row.catename;
        this.dialogVisible = true;
        /*var _this = this;
        var url = '/category/update/' + row.id;
        getRequest(url).then(resp => {
          if(resp.status === 200){
            this.$message({type:'success',message:'修改成功'});
            this.loadCategory(this.currentPage,this.pageSize);
          }
        })*/
      },
      handleDelete(index,row) {
        var _this = this;
        var url = '/category/delete/' + row.id;
        getRequest(url).then( resp => {
          if(resp.status === 200){
            this.$message({type:'success',message:'删除成功'});
            this.loadCategory(this.currentPage,this.pageSize);
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      handeleAdd() {
        if(this.input.length == 0){
          this.$message({type:'warning',message:'请输入分类名称'});
          return;
        }
        var _this = this;
        var url = '/category/add?cateName=' + this.input;
        getRequest(url).then( resp => {
          if(resp.status === 200){
            this.loading = true;
            this.loadCategory(1,this.pageSize);
            this.$message({type: 'success',message:'添加成功'});
          } 
        })
      },
      loadCategory(page,count) {
        var _this = this;
        var url = '/category/list?page=' + page + '&count=' + count;
        getRequest(url).then(resp => {
          _this.loading = false;
          if(resp.status === 200){
            _this.tableData = resp.data.rows;
            _this.totalRow = resp.data.total;
          } else {
            console.log('来了吗？')
             _this.$message({type: 'error', message: '数据加载失败!'});
          }
        })
      },
   }
}
</script>

<style scoped>
.block{
  float: right;
}
</style>