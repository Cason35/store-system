import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Goods from '../components/Goods.vue'
import Users from '../components/Users.vue'
import Supplier from '../components/Supplier.vue'
import Storehouse from '../components/Storehouse.vue'
import Inputrecord from '../components/Inputrecord.vue'
import Onputrecord from '../components/Outputrecord.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/goods',
    children: [
      { path: '/goods', component: Goods },
      { path: '/users', component: Users },
      { path: '/supplier', component: Supplier },
      { path: '/storehouse', component: Storehouse },
      { path: '/inputrecord', component: Inputrecord },
      { path: '/onputrecord', component: Onputrecord }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
