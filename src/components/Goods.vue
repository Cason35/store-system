<!-- 商品列表组件 -->
<template>
  <div class="p-goods">
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">

          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="queryGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="queryGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区 表格 -->
      <el-table :data="goodsList" stripe border style="width: 100%" >
        <el-table-column prop="good_id" label="id"></el-table-column>
        <el-table-column prop="good_name" label="商品名称"></el-table-column>
        <el-table-column prop="good_type" label="类别"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.good_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeGoodsById(scope.row.good_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加商品的对话框 -->
    <el-dialog
    title="添加商品"
    :visible.sync="addDialogVisible"
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="商品名" prop="good_name">
          <el-input v-model="addForm.good_name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="good_type">
          <el-input v-model="addForm.good_type"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改商品的对话框 -->
    <el-dialog
    title="修改商品信息"
    :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.good_id" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="商品名" prop="good_name">
          <el-input v-model="editForm.good_name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="good_type">
          <el-select v-model="addForm.good_type" placeholder="请选择类别" style="width: 100%">
            <el-option
              v-for="(item, i) in typeList"
              :key="i"
              :label="item.typeName"
              :value="item.typeName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      goodsList: [
        {}
      ],
      // 获取列表的参数对象
      getInfo: {
        page: 1
      },
      // 每页显示的数据
      pagesize: 5,
      // 数据总量
      total: 0,
      // 模糊查询对象
      queryInfo: {
        page: 1,
        keyword: ''
      },
      // 显示添加商品对话框
      addDialogVisible: false,
      // 添加商品的表单数据
      addForm: {
        good_name: '',
        good_type: ''
      },
      // 类别列表数据
      typeList: [
        { typeName: '食品' },
        { typeName: '电子产品' },
        { typeName: '饮料' },
        { typeName: '零食' },
        { typeName: '日用品' },
        { typeName: '书籍' },
        { typeName: '服饰' },
        { typeName: '医药' },
        { typeName: '运动' },
        { typeName: '家具' }
      ],
      // 修改商品的对话框的显示与隐藏控制
      editDialogVisible: false,
      // 修改商品的表单数据
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        good_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ],
        good_type: [
          { required: true, message: '请输入类别', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        good_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ],
        good_type: [
          { required: true, message: '请输入类别', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取所有商品信息
    async getGoodsList () {
      const { data: res } = await this.$http.get('good.all', { params: this.getInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.goodsList = res.data.list
      this.total = res.data.total
    },
    // 监听页码值的改变事件
    handleCurrentChange (newPage) {
      this.getInfo.page = newPage
      this.getGoodsList()
    },
    // 模糊查询
    async queryGoodsList () {
      const { data: res } = await this.$http.get('good.search', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.goodsList = res.data.list
      this.total = res.data.total
    },
    // 监听关闭添加商品对话框的事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加商品
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('good.insert', this.addForm)
        if (res.status !== 200) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        // 隐藏添加商品的对话框
        this.addDialogVisible = false
        // 重新获取商品列表
        this.getGoodsList()
      })
    },
    // 删除商品按钮的点击事件
    async removeGoodsById (id) {
      // 弹框询问
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果商品点击了确认 confirmResult 值为 confirm
      // 如果商品点击了取消 confirmResult 值为 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.get('good.delete', { params: { id: id } })
      if (res.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 监听关闭修改商品对话框的事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示编辑商品的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('good.selectById', { params: { id: id } })
      if (res.status !== 200) {
        return this.$message.error('查询商品信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改商品信息并提交
    editGoodsInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('good.update', this.editForm)
        if (res.status !== 200) {
          this.$message.error('更新商品信息失败')
        }
        // 关闭修改商品对话框
        this.editDialogVisible = false
        // 刷新商品列表
        this.getGoodsList()
        // 提示修改成功
        this.$message.success('更新商品信息成功')
      })
    }
  }
}
</script>

<style>

</style>
