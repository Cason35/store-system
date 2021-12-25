<!-- 仓库列表组件 -->
<template>
  <div class="p-storehouse">
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">

          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="queryStorehouseList">
            <el-button slot="append" icon="el-icon-search" @click="queryStorehouseList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加仓库</el-button>
        </el-col>
      </el-row>

      <!-- 仓库列表区 表格 -->
      <el-table :data="storehouseList" stripe border style="width: 100%" >
        <el-table-column prop="warehouse_id" label="id"></el-table-column>
        <el-table-column prop="warehouse_name" label="仓库名称"></el-table-column>
        <el-table-column prop="warehouse_address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.warehouse_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeStorehouseById(scope.row.warehouse_id)"></el-button>
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

    <!-- 添加仓库的对话框 -->
    <el-dialog
    title="添加仓库"
    :visible.sync="addDialogVisible"
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="仓库名" prop="warehouse_name">
          <el-input v-model="addForm.warehouse_name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="warehouse_address">
          <el-input v-model="addForm.warehouse_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStorehouse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改仓库的对话框 -->
    <el-dialog
    title="修改仓库信息"
    :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.warehouse_id" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouse_name">
          <el-input v-model="editForm.warehouse_name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="warehouse_address">
          <el-input v-model="editForm.warehouse_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStorehouseInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 仓库列表
      storehouseList: [
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
      // 显示添加仓库对话框
      addDialogVisible: false,
      // 添加仓库的表单数据
      addForm: {
        warehouse_name: '',
        warehouse_address: ''
      },
      // 修改仓库的对话框的显示与隐藏控制
      editDialogVisible: false,
      // 修改仓库的表单数据
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        warehouse_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        warehouse_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        warehouse_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        warehouse_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getStorehouseList()
  },
  methods: {
    // 获取所有仓库信息
    async getStorehouseList () {
      const { data: res } = await this.$http.get('warehouse.all', { params: this.getInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.storehouseList = res.data.list
      this.total = res.data.total
    },
    // 监听页码值的改变事件
    handleCurrentChange (newPage) {
      this.getInfo.page = newPage
      this.getStorehouseList()
    },
    // 模糊查询
    async queryStorehouseList () {
      const { data: res } = await this.$http.get('warehouse.search', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.storehouseList = res.data.list
      this.total = res.data.total
    },
    // 监听关闭添加仓库对话框的事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加仓库
    addStorehouse () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('warehouse.insert', this.addForm)
        if (res.status !== 200) return this.$message.error('添加仓库失败')
        this.$message.success('添加仓库成功')
        // 隐藏添加仓库的对话框
        this.addDialogVisible = false
        // 重新获取仓库列表
        this.getStorehouseList()
      })
    },
    // 删除仓库按钮的点击事件
    async removeStorehouseById (id) {
      // 弹框询问
      const confirmResult = await this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果仓库点击了确认 confirmResult 值为 confirm
      // 如果仓库点击了取消 confirmResult 值为 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.get('warehouse.delete', { params: { id: id } })
      if (res.status !== 200) return this.$message.error('删除仓库失败')
      this.$message.success('删除仓库成功')
      this.getStorehouseList()
    },
    // 监听关闭修改仓库对话框的事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示编辑仓库的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('warehouse.selectById', { params: { id: id } })
      if (res.status !== 200) {
        return this.$message.error('查询仓库信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改仓库信息并提交
    editStorehouseInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('warehouse.update', this.editForm)
        if (res.status !== 200) {
          this.$message.error('更新仓库信息失败')
        }
        // 关闭修改仓库对话框
        this.editDialogVisible = false
        // 刷新仓库列表
        this.getStorehouseList()
        // 提示修改成功
        this.$message.success('更新仓库信息成功')
      })
    }
  }
}
</script>

<style>

</style>
