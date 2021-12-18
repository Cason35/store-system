import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Goods from '../components/Goods.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/goods',
    children: [
      { path: '/goods', component: Goods }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
