<!-- 商品列表组件 -->
<template>
  <div class="p-goods">
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户列表
      userList: [
        // {
        //   customer_id: 1,
        //   customer_name: '张三',
        //   customer_phone: '123456789',
        //   customer_address: '广东省'
        // }
      ]
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.post('customer.all')
      this.userList = res
    }
  }
}
</script>

<style>

</style>
