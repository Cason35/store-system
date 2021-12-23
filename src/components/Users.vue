<!-- 商品列表组件 -->
<template>
  <div class="p-goods">
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
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 表格 -->
      <el-table :data="userList" stripe border style="width: 100%" >
        <el-table-column prop="customer_id" label="id"></el-table-column>
        <el-table-column prop="customer_name" label="用户名"></el-table-column>
        <el-table-column prop="customer_phone" label="电话"></el-table-column>
        <el-table-column prop="customer_address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
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

    <!-- 添加用户的对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.customer_phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.customer_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户列表
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
      // 显示添加用户对话框
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        customer_name: '',
        customer_phone: '',
        customer_address: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
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
    // 监听关闭添加用户对话框的事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    async addUser () {
      const { data: res } = await this.$http.post('customer.insert', this.addForm)
      if (res.status !== 200) return this.$message.error('添加用户失败')
      this.$message.success('添加用户成功')
      // 隐藏添加用户的对话框
      this.addDialogVisible = false
      // 重新获取用户列表
      this.getUserList()
    }
  }
}
</script>

<style>

</style>
