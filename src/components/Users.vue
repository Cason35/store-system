<!-- 客户列表组件 -->
<template>
  <div class="p-users">
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">

          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="queryUserList">
            <el-button slot="append" icon="el-icon-search" @click="queryUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加客户</el-button>
        </el-col>
      </el-row>

      <!-- 客户列表区 表格 -->
      <el-table :data="userList" stripe border style="width: 100%" >
        <el-table-column prop="customer_id" label="id"></el-table-column>
        <el-table-column prop="customer_name" label="客户名"></el-table-column>
        <el-table-column prop="customer_phone" label="电话"></el-table-column>
        <el-table-column prop="customer_address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.customer_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.customer_id)"></el-button>
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

    <!-- 添加客户的对话框 -->
    <el-dialog
    title="添加客户"
    :visible.sync="addDialogVisible"
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="客户名" prop="customer_name">
          <el-input v-model="addForm.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="customer_phone">
          <el-input v-model.number="addForm.customer_phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="customer_address">
          <el-input v-model="addForm.customer_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改客户的对话框 -->
    <el-dialog
    title="修改客户信息"
    :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.customer_id" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="客户名" prop="customer_name">
          <el-input v-model="editForm.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="customer_phone">
          <el-input v-model.number="editForm.customer_phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="customer_address">
          <el-input v-model="editForm.customer_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 手机号码的自定义校验规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 客户列表
      userList: [
        {
          // customer_id: 1,
          // customer_name: '张三',
          // customer_phone: '123456789',
          // customer_address: '广东省'
        }
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
      // 显示添加客户对话框
      addDialogVisible: false,
      // 添加客户的表单数据
      addForm: {
        customer_name: '',
        customer_phone: '',
        customer_address: ''
      },
      // 修改客户的对话框的显示与隐藏控制
      editDialogVisible: false,
      // 修改客户的表单数据
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        customer_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        customer_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ],
        customer_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        customer_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        customer_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ],
        customer_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取所有客户信息
    async getUserList () {
      const { data: res } = await this.$http.get('customer.all', { params: this.getInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.userList = res.data.list
      this.total = res.data.total
    },
    // 监听页码值的改变事件
    handleCurrentChange (newPage) {
      this.getInfo.page = newPage
      this.getUserList()
    },
    // 模糊查询
    async queryUserList () {
      const { data: res } = await this.$http.get('customer.search', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.userList = res.data.list
      this.total = res.data.total
    },
    // 监听关闭添加客户对话框的事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加客户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('customer.insert', this.addForm)
        if (res.status !== 200) return this.$message.error('添加客户失败')
        this.$message.success('添加客户成功')
        // 隐藏添加客户的对话框
        this.addDialogVisible = false
        // 重新获取客户列表
        this.getUserList()
      })
    },
    // 删除客户按钮的点击事件
    async removeUserById (id) {
      // 弹框询问
      const confirmResult = await this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果客户点击了确认 confirmResult 值为 confirm
      // 如果客户点击了取消 confirmResult 值为 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.get('customer.delete', { params: { id: id } })
      if (res.status !== 200) return this.$message.error('删除客户失败')
      this.$message.success('删除客户成功')
      this.getUserList()
    },
    // 监听关闭修改客户对话框的事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示编辑客户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('customer.selectById', { params: { id: id } })
      if (res.status !== 200) {
        return this.$message.error('查询客户信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改客户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('customer.update', this.editForm)
        if (res.status !== 200) {
          this.$message.error('更新客户信息失败')
        }
        // 关闭修改客户对话框
        this.editDialogVisible = false
        // 刷新客户列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新客户信息成功')
      })
    }
  }
}
</script>

<style>

</style>
