<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 数据展示区域 -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border class="treeTable">
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
              <i class="el-icon-error" v-else style="color:red"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="opt" slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
      </tree-table>
       <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="parentCateChanged"
            :props="cascaderProps"
            clearable>
        </el-cascader>
        </el-form-item>
        </el-form>
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      // 商品分类的数据列表，默认为空
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total:0,
      //为table指定列
      columns:[
          { label:'分类名称',prop:'cat_name'},
          { label:'是否有效', type:'template', template:'isok'},
          { label:'排序', type:'template', template:'order'},
          { label:'操作', type:'template', template:'opt'}

      ],
      //添加分类
      addCateDialogVisible:false,
      addCateForm:{
          //父id 分类名 分类等级
          cat_pid:0,
          cat_name:'',
          cat_level:0
      },
      addCateFormRules:{
          cat_name:[ { required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //1 2级分类列表
      parentCateList:[],
      //级联分类框规则
      cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          checkStrictly:true
      },
      //选中父级分类id数组
      selectedKeys:[]
    };
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }

      console.log(res.data);
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //添加分类
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取1 2 级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    }, 
    //选择项发生变化
    parentCateChanged(){
        console.log(this.selectedKeys);
        //当级联发生更改时判断数组中的长度是否大于0，大于=有数据
        if(this.selectedKeys.length > 0){
            //父级分类id
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
            //当前分类等级
            this.addCateForm.cat_level = this.selectedKeys.length
            return
        }else{
            //父级分类id
            this.addCateForm.cat_pid = 0
            //当前分类等级
            this.addCateForm.cat_level = 0
        }
    },
    addCate(){
        this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0

    }
  },
};
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
