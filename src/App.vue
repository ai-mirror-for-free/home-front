<template>
  <div id="app">
    <!-- 公告卡片 -->
    <NoticeCard />
    <!-- 非管理员页面显示顶部导航栏 -->
    <template v-if="!isAdminRoute">
      <AppNav />
    </template>
    <RouterView />
    <AppFooter />
    <!-- 固定悬浮图标 -->
    <FloatingIcons />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'
import FloatingIcons from './components/FloatingIcons.vue'
import NoticeCard from './components/NoticeCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 判断是否为管理员相关路由
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

// 进入本站或刷新时，校验本地 token 是否仍有效
onMounted(async () => {
  const token = userStore.getToken()
  if (!token) return

  try {
    const resp = await fetch('/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (resp.ok) {
      const data = await resp.json().catch(() => ({}))
      // 用 /me 的最新信息刷新 store（昵称、头像等可能变了）
      if (data && (data.id || data.username || data.email)) {
        userStore.login(
          {
            id: data.id,
            name: data.username || data.name,
            email: data.email,
            role: data.role || 'user',
            profile_image_url: data.avatar_url || data.profile_image_url,
            initials: (data.display_name || data.username || data.email || '').charAt(0).toUpperCase(),
            avatar: data.avatar_url || data.profile_image_url
          },
          { token, token_type: 'bearer', expires_at: userStore.state.authInfo.expires_at },
          {}
        )
      }
    } else if (resp.status === 401 || resp.status === 403) {
      // token 失效或被吊销，清掉本地态并跳登录页
      userStore.logout()
      if (!route.path.startsWith('/login') && !route.path.startsWith('/register')) {
        router.push({ path: '/login', query: { redirect: route.fullPath } })
      }
    }
    // 其他 5xx 等异常静默：不强制退出，避免网络抖动把用户踢下线
  } catch (e) {
    console.warn('[auth/me] 校验失败，保持本地登录态:', e.message)
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
}
#app > main { flex: 1; }
</style>