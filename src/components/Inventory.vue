<!-- 库存列表组件 -->
<template>
  <div class="p-inventorys">
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">

          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="queryInventoryList">
            <el-button slot="append" icon="el-icon-search" @click="queryInventoryList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 库存列表区 表格 -->
      <el-table :data="inventoryList" stripe border style="width: 100%" >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="good.good_name" label="商品名"></el-table-column>
        <el-table-column prop="warehouse.warehouse_name" label="仓库"></el-table-column>
        <el-table-column prop="good_number" label="货物阈值"></el-table-column>
        <el-table-column prop="safe_number" label="进货提醒"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.good_name, scope.row.warehouse_name)"></el-button>
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

    <!-- 修改库存的对话框 -->
    <el-dialog
    title="修改库存信息"
    :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="商品名" prop="good_name">
          <el-input v-model="editForm.good_name" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="仓库名" prop="warehouse_name">
          <el-input v-model="editForm.warehouse_name" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="当前库存" prop="good_number">
          <el-input v-model="editForm.good_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="阈值" prop="safe_number">
          <el-input v-model="editForm.safe_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInventoryInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 出库数量的自定义校验规则
    var checkNumber = (rule, value, cb) => {
      const regNumber = /^[1-9]\d*$/
      if (regNumber.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入正确的数值，且数值要大于1'))
    }
    return {
      // 库存列表
      inventoryList: [
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
      // 修改库存的对话框的显示与隐藏控制
      editDialogVisible: false,
      // 修改库存的表单数据
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        good_number: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkNumber, message: '请输入正确的数值，且数值要大于1', trigger: 'blur' }
        ],
        safe_number: [
          { required: true, message: '请输入数值', trigger: 'blur' },
          { validator: checkNumber, message: '请输入正确的数值，且数值要大于1', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getInventoryList()
  },
  methods: {
    // 获取所有库存信息
    async getInventoryList () {
      const { data: res } = await this.$http.get('inventory.all', { params: this.getInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.inventoryList = res.data.list
      this.total = res.data.total
    },
    // 监听页码值的改变事件
    handleCurrentChange (newPage) {
      this.getInfo.page = newPage
      this.getInventoryList()
    },
    // 模糊查询
    async queryInventoryList () {
      const { data: res } = await this.$http.get('inventory.search', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.inventoryList = res.data.list
      this.total = res.data.total
    },
    // 监听关闭修改库存对话框的事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示编辑库存的对话框
    async showEditDialog (gName, wName) {
      const { data: res } = await this.$http.get('inventory.return', { params: { goodName: gName, warehouseName: wName } })
      if (res.status !== 200) {
        return this.$message.error('查询库存信息失败！')
      }
      this.editForm.good_name = res.data.good.good_name
      this.editForm.warehouse_name = res.data.warehouse.warehouse_name
      this.editForm.good_number = res.data.good.good_number
      this.editForm.safe_number = res.data.good.safe_number
      this.editDialogVisible = true
    },
    // 修改库存信息并提交
    editInventoryInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('inventory.update', this.editForm)
        if (res.status !== 200) {
          this.$message.error('更新库存信息失败')
        }
        // 关闭修改库存对话框
        this.editDialogVisible = false
        // 刷新库存列表
        this.getInventoryList()
        // 提示修改成功
        this.$message.success('更新库存信息成功')
      })
    }
  }
}
</script>

<style>

</style>
