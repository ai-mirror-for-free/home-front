import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UserProfile from '../views/UserProfile.vue'
import Models from '../views/Models.vue'
import Pricing from '../views/Pricing.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminRedemptionCodes from '../views/AdminRedemptionCodes.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/models',
    name: 'Models',
    component: Models
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'AdminRedemptionCodes',
    component: AdminRedemptionCodes,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/redemption-codes',
    name: 'AdminRedemptionCodesAlias',
    component: AdminRedemptionCodes,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫检查管理员权限
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    // 检查是否有管理员 token
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      // 如果没有管理员 token，重定向到管理员登录页
      next('/admin/login')
    } else {
      // 如果有 token，继续
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查普通用户认证
    const token = localStorage.getItem('token')
    if (!token || token === undefined) {
      // 如果没有 token 或 token 不存在，重定向到登录页
      next('/login')
    } else {
      // 如果有 token，继续
      next()
    }
  } else {
    next()
  }
})

export default router