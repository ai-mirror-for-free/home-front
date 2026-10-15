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
import { isTokenExpiringSoon, refreshTokenSilently, setupTokenAutoRefresh } from '@/utils/tokenRefresh'
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
  // token 快过期（<5min）先静默续期，避免下面的 /me 校验因过期 401 而误登出。
  // 续期失败静默：可能旧 token 仍有效，由 /me 兜底；RT 失效由 /me 401 兜底。
  if (userStore.getToken() && isTokenExpiringSoon(userStore.getToken())) {
    const newToken = await refreshTokenSilently()
    if (newToken) {
      try {
        const exp = JSON.parse(atob(newToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp
        userStore.updateToken(newToken, typeof exp === 'number' ? new Date(exp * 1000).toISOString() : null)
      } catch (_) {
        userStore.updateToken(newToken, null)
      }
    }
  }
  // 安装自动续期：60s 定时 + 页面切回前台时，token 快过期则静默换新。
  // 治用户静置后 token 过期被踢出重新输密码（kaysar0801@163.com，2026-10-15）。
  setupTokenAutoRefresh(
    () => userStore.getToken(),
    (t, expiresAt) => userStore.updateToken(t, expiresAt)
  )

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