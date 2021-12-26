<template>
  <!-- 页面区 -->
  <el-container class="home-container">
    <!-- 主页头部区 -->
    <el-header>
      <div>
        <img src="@/assets/205.jpg" alt="205" class="img-title">
        <span>仓库后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主页内容区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮控制区 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :default-active="activePath" :collapse="isCollapse" :collapse-transition="false" router unique-opened>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [
        {
          id: 145,
          authName: '库存管理',
          path: null,
          children: [
            {
              id: 100,
              authName: '库存列表',
              path: 'inventory',
              children: []
            }
          ]
        },
        {
          id: 101,
          authName: '仓库管理',
          path: null,
          children: [
            {
              id: 104,
              authName: '商品列表',
              path: 'goods',
              children: []
            },
            {
              id: 107,
              authName: '仓库列表',
              path: 'storehouse',
              children: []
            }
          ]
        },
        {
          id: 125,
          authName: '客户管理',
          path: null,
          children: [
            {
              id: 105,
              authName: '客户列表',
              path: 'users',
              children: []
            },
            {
              id: 106,
              authName: '供应商列表',
              path: 'supplier',
              children: []
            }
          ]
        },
        {
          id: 103,
          authName: '出入库管理',
          path: null,
          children: [
            {
              id: 110,
              authName: '入库列表',
              path: 'inputrecord',
              children: []
            },
            {
              id: 111,
              authName: '出库列表',
              path: 'onputrecord',
              children: []
            }
          ]
        }
      ],
      // 一级菜单的字符图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'el-icon-s-home',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠侧边栏
      isCollapse: false,
      // 需高亮显示的链接地址
      activePath: '/goods'
    }
  },
  created () {
    if (window.sessionStorage.getItem('token') === 'lkasd256') {
      this.activePath = window.sessionStorage.getItem('activePath')
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    logout () {
      // window.sessionStorage.clear()
      this.$message('退出登录')
      this.$router.push('/login')
    },
    // 折叠按钮的点击事件 侧边栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接 使其处于高亮状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  // 头部区
  .el-header {
    display: flex;
    background-color: #373d41;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      .img-title {
        width: 6rem;
        height: 4rem;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  // 侧边栏
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  // 主体区
  .el-main {
    background-color: #EAEDF1;
  }
  // 字符图像
  .iconfont {
    margin-right: 10px;
  }
  // 折叠按钮 折叠侧边栏
  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
