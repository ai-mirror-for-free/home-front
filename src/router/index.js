import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import UserProfile from '../views/UserProfile.vue'
import Models from '../views/Models.vue'
import Pricing from '../views/Pricing.vue'
import BillingRules from '../views/BillingRules.vue'
import Experience from '../views/Experience.vue'

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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
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
    path: '/billing-rules',
    name: 'BillingRules',
    component: BillingRules
  },
  {
    path: '/experience',
    name: 'Experience',
    component: Experience
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫检查用户权限
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
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