<!-- 供应商列表组件 -->
<template>
  <div class="p-suppliers">
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">

          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="querySuppliersList">
            <el-button slot="append" icon="el-icon-search" @click="querySuppliersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加供应商</el-button>
        </el-col>
      </el-row>

      <!-- 供应商列表区 表格 -->
      <el-table :data="suppliersList" stripe border style="width: 100%" >
        <el-table-column prop="supplier_id" label="id"></el-table-column>
        <el-table-column prop="supplier_name" label="供应商名称"></el-table-column>
        <el-table-column prop="supplier_phone" label="供应商电话"></el-table-column>
        <el-table-column prop="supplier_address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.supplier_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeSuppliersById(scope.row.supplier_id)"></el-button>
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

    <!-- 添加供应商的对话框 -->
    <el-dialog
    title="添加供应商"
    :visible.sync="addDialogVisible"
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="供应商名" prop="supplier_name">
          <el-input v-model="addForm.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="supplier_phone">
          <el-input v-model="addForm.supplier_phone"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="supplier_address">
          <el-input v-model="addForm.supplier_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSuppliers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改供应商的对话框 -->
    <el-dialog
    title="修改供应商信息"
    :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.supplier_id" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="editForm.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="supplier_phone">
          <el-input v-model="editForm.supplier_phone"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="supplier_address">
          <el-input v-model="editForm.supplier_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSuppliersInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 供应商列表
      suppliersList: [
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
      // 显示添加供应商对话框
      addDialogVisible: false,
      // 添加供应商的表单数据
      addForm: {
        supplier_name: '',
        supplier_phone: '',
        supplier_address: ''
      },
      // 修改供应商的对话框的显示与隐藏控制
      editDialogVisible: false,
      // 修改供应商的表单数据
      editForm: {}
    }
  },
  created () {
    this.getSuppliersList()
  },
  methods: {
    // 获取所有供应商信息
    async getSuppliersList () {
      const { data: res } = await this.$http.get('supplier.all', { params: this.getInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.suppliersList = res.data.list
      this.total = res.data.total
    },
    // 监听页码值的改变事件
    handleCurrentChange (newPage) {
      this.getInfo.page = newPage
      this.getSuppliersList()
    },
    // 模糊查询
    async querySuppliersList () {
      const { data: res } = await this.$http.get('supplier.search', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.suppliersList = res.data.list
      this.total = res.data.total
    },
    // 监听关闭添加供应商对话框的事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加供应商
    async addSuppliers () {
      const { data: res } = await this.$http.post('supplier.insert', this.addForm)
      if (res.status !== 200) return this.$message.error('添加供应商失败')
      this.$message.success('添加供应商成功')
      // 隐藏添加供应商的对话框
      this.addDialogVisible = false
      // 重新获取供应商列表
      this.getSuppliersList()
    },
    // 删除供应商按钮的点击事件
    async removeSuppliersById (id) {
      // 弹框询问
      const confirmResult = await this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果供应商点击了确认 confirmResult 值为 confirm
      // 如果供应商点击了取消 confirmResult 值为 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.get('supplier.delete', { params: { id: id } })
      if (res.status !== 200) return this.$message.error('删除供应商失败')
      this.$message.success('删除供应商成功')
      this.getSuppliersList()
    },
    // 监听关闭修改供应商对话框的事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示编辑供应商的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('supplier.selectById', { params: { id: id } })
      if (res.status !== 200) {
        return this.$message.error('查询供应商信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改供应商信息并提交
    async editSuppliersInfo () {
      const { data: res } = await this.$http.post('supplier.update', this.editForm)
      if (res.status !== 200) {
        this.$message.error('更新供应商信息失败')
      }
      // 关闭修改供应商对话框
      this.editDialogVisible = false
      // 刷新供应商列表
      this.getSuppliersList()
      // 提示修改成功
      this.$message.success('更新供应商信息成功')
    }
  }
}
</script>

<style>

</style>
