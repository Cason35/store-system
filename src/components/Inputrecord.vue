<!-- 入库列表组件 -->
<template>
  <div class="p-inputrecord">
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">

          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="queryInputrecordList">
            <el-button slot="append" icon="el-icon-search" @click="queryInputrecordList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addInputrecordList()">添加入库</el-button>
        </el-col>
      </el-row>

      <!-- 入库列表区 表格 -->
      <el-table :data="inputrecordList" stripe border style="width: 100%" >
        <el-table-column prop="input_record_id" label="id"></el-table-column>
        <el-table-column prop="good.good_name" label="商品名称"></el-table-column>
        <el-table-column prop="supplier.supplier_name" label="供应商名称"></el-table-column>
        <el-table-column prop="warehouse.warehouse_name" label="仓库名称"></el-table-column>
        <el-table-column prop="input_record_data" label="入库日期"></el-table-column>
        <el-table-column prop="input_record_number" label="入库数量"></el-table-column>
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

    <!-- 添加入库的对话框 -->
    <el-dialog
    title="添加入库"
    :visible.sync="addDialogVisible"
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="商品名" prop="goodName" required>
          <el-select v-model="addForm.goodName" placeholder="请选择需要入库的商品" style="width: 100%">
            <el-option
              v-for="(item, i) in addList.goods"
              :key="i"
              :label="item.good_name"
              :value="item.good_name"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" prop="supplierName" required>
          <el-select v-model="addForm.supplierName" placeholder="请选择需要入库的供应商" style="width: 100%">
            <el-option
              v-for="(item, i) in addList.suppliers"
              :key="i"
              :label="item.supplier_name"
              :value="item.supplier_name"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="仓库" prop="warehouseName" required>
          <el-select v-model="addForm.warehouseName" placeholder="请选择需要入库的仓库" style="width: 100%">
            <el-option
              v-for="(item, i) in addList.wareHouses"
              :key="i"
              :label="item.wareHouse_name"
              :value="item.wareHouse_name"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
            <el-form-item prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="addForm.date" style="width: 100%;"></el-date-picker>
            </el-form-item>
        </el-form-item>

        <el-form-item label="数量" prop="number">
          <el-input v-model="addForm.number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInputrecord">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // 入库数量的自定义校验规则
    var checkNumber = (rule, value, cb) => {
      const regNumber = /^[1-9]\d*$/
      if (regNumber.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入正确的数值，且数值要大于1'))
    }
    return {
      // 入库列表
      inputrecordList: [
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
      // 显示添加入库对话框
      addDialogVisible: false,
      // 添加入库的下拉框数据
      addList: [],
      // 添加入库的表单数据
      addForm: {
        goodName: '',
        supplierName: '',
        warehouseName: '',
        date: '',
        number: 0
      },
      // 添加表单的验证规则对象
      addFormRules: {
        goodName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        warehouseName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: checkNumber, message: '请输入正确的数值，且数值要大于1', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getInputrecordList()
  },
  methods: {
    // 获取所有入库信息
    async getInputrecordList () {
      const { data: res } = await this.$http.get('inputRecord.all', { params: this.getInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.inputrecordList = res.data.list
      this.total = res.data.total
    },
    // 监听页码值的改变事件
    handleCurrentChange (newPage) {
      this.getInfo.page = newPage
      this.getInputrecordList()
    },
    // 模糊查询
    async queryInputrecordList () {
      const { data: res } = await this.$http.get('inputRecord.search', { params: this.queryInfo })
      if (res.status !== 200) return this.$message.error('请求失败')
      this.inputrecordList = res.data.list
      this.total = res.data.total
    },
    // 监听关闭添加入库对话框的事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 获取入库下拉框信息
    async addInputrecordList () {
      this.addDialogVisible = true
      const { data: res } = await this.$http.get('inputRecord.get')
      if (res.status !== 200) return this.$message.error('请求失败')
      this.addList = res.data
    },
    // 添加入库
    addInputrecord () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const { data: res } = await this.$http.post('inputRecord.insert', this.addForm)
        if (res.status !== 200) return this.$message.error('添加入库失败')
        this.$message.success('添加入库成功')
        // 隐藏添加入库的对话框
        this.addDialogVisible = false
        // 重新获取入库列表
        this.getInputrecordList()
      })
    }
  }
}
</script>

<style>

</style>
