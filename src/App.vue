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
import { decodeExp, isTokenExpiringSoon, refreshTokenSilently, setupTokenAutoRefresh } from '@/utils/tokenRefresh'
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

/**
 * 凭证终态失效的统一出口（2026-11-02）
 *
 * 清掉本地登录态 + 残留 refresh_token 后走 SPA 跳登录。
 * 背景：门户原先 401 后「失败静默不登出」，用户停在 /profile 不刷新时
 * 定时续期会每 60s 打一次 401、永不停止（现网实测合计 400~1700 次/天）。
 */
const handleSessionFatal = () => {
  try {
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('currentSessionId')
  } catch (_) {
    /* localStorage 不可用时忽略 */
  }
  userStore.logout()
  if (!route.path.startsWith('/login') && !route.path.startsWith('/register')) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
  }
}

// P2（2026-11-02）：SPA 内长驻兜底。
// 原实现只在 onMounted 打一次 /auth/me，用户停在 /profile 长时间不刷新时永远
// 不会触发兜底，只能靠定时续期“失败静默”—— 结果就是僵尸标签无限重试。
// 这里在路由切换时补一次校验（60s 节流）：access token 已过期先续期，
// 续期终态失败（RT 过期/被撤销）立即登出跳登录。
let lastAuthGuardAt = 0
router.afterEach(async (to) => {
  if (to.path.startsWith('/login') || to.path.startsWith('/register') || to.path.startsWith('/forgot-password')) {
    return
  }
  const token = userStore.getToken()
  if (!token) return
  const nowSec = Date.now() / 1000
  if (lastAuthGuardAt && nowSec - lastAuthGuardAt < 60) return
  lastAuthGuardAt = nowSec
  if (!isTokenExpiringSoon(token, 0)) return // 尚未过期，不打扰
  const result = await refreshTokenSilently()
  if (result.token) {
    const exp = decodeExp(result.token)
    userStore.updateToken(result.token, exp ? new Date(exp * 1000).toISOString() : null)
  } else if (result.terminal) {
    handleSessionFatal()
  }
})

// 进入本站或刷新时，校验本地 token 是否仍有效
onMounted(async () => {
  // token 快过期（<5min）先静默续期，避免下面的 /me 校验因过期 401 而误登出。
  // 续期终态失败（RT 已过期/被撤销）直接登出：不必再打一次必然 401 的 /me。
  if (userStore.getToken() && isTokenExpiringSoon(userStore.getToken())) {
    const result = await refreshTokenSilently()
    if (result.token) {
      const exp = decodeExp(result.token)
      userStore.updateToken(result.token, exp ? new Date(exp * 1000).toISOString() : null)
    } else if (result.terminal) {
      handleSessionFatal()
      return
    }
  }
  // 安装自动续期：60s 定时 + 页面切回前台时，token 快过期则静默换新。
  // 治用户静置后 token 过期被踢出重新输密码（kaysar0801@163.com，2026-10-15）。
  // onFatal：连续 401/403 熔断后停表并登出，堵死“僵尸标签每 60s 打 401”的循环。
  setupTokenAutoRefresh(
    () => userStore.getToken(),
    (t, expiresAt) => userStore.updateToken(t, expiresAt),
    handleSessionFatal
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