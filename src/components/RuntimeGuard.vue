<template>
  <transition name="rg-fade">
    <div v-if="notice" class="rg-toast" :class="`rg-${notice.type}`">
      <span class="rg-text">{{ notice.text }}</span>
      <button v-if="notice.btn" class="rg-action" type="button" @click="notice.action">
        {{ notice.btn }}
      </button>
      <button class="rg-dismiss" type="button" aria-label="关闭" @click="notice = null">✕</button>
    </div>
  </transition>
</template>

<script setup>
/**
 * 全局运行时守卫（挂在 App.vue，所有页面生效）
 *
 * 1) 版本检测：静态站部署新版本后，用户停留在旧页面上不会自己更新。
 *    这里比对「服务端 index.html 引用的入口 JS」与「当前页面实际加载的入口 JS」，
 *    不一致就自动刷新；如果用户正在输入（草稿没发出去），改为底部提示条，由用户点。
 * 2) 登录失效提示：API 层收到 401 时派发 app:auth-expired，
 *    这里延迟确认（避免 token 静默续期造成的误报）后给出「去登录」入口。
 */
import { onMounted, onUnmounted, ref } from 'vue'

const CHECK_INTERVAL = 3 * 60 * 1000 // 3 分钟
const FIRST_CHECK_DELAY = 20 * 1000 // 进页面 20s 后才开始查，不干扰首屏

const notice = ref(null)
let reloading = false
let checkTimer = null
let firstTimer = null
let authTimer = null

// 当前页面实际加载的入口 JS（生产构建形如 /assets/index-xxxx.js）
const CURRENT_ENTRY = detectEntry()

function detectEntry() {
  const el = document.querySelector('script[type="module"][src*="assets/"]')
  const src = el?.getAttribute('src') || ''
  const m = src.match(/assets\/index-[A-Za-z0-9_-]+\.js/)
  return m ? m[0] : null
}

async function fetchLatestEntry() {
  try {
    const resp = await fetch(`/?_v=${Date.now()}`, { cache: 'no-store' })
    if (!resp.ok) return null
    const html = await resp.text()
    const m = html.match(/assets\/index-[A-Za-z0-9_-]+\.js/)
    return m ? m[0] : null
  } catch (e) {
    return null // 网络抖动忽略，下个周期再查
  }
}

// 用户正在输入（输入框/文本域/可编辑区有内容）→ 不自动刷新，避免丢草稿
function isUserTyping() {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName
  const editable = tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
  if (!editable) return false
  const val = el.value ?? el.textContent ?? ''
  return String(val).trim().length > 0
}

async function checkVersion() {
  if (reloading || !CURRENT_ENTRY) return
  const latest = await fetchLatestEntry()
  if (!latest || latest === CURRENT_ENTRY) return
  if (isUserTyping()) {
    notice.value = {
      type: 'info',
      text: '站点已更新（你正在输入，暂未自动刷新）',
      btn: '立即刷新',
      action: () => {
        reloading = true
        window.location.reload()
      }
    }
    return
  }
  reloading = true
  window.location.reload()
}

function onAuthExpired() {
  if (location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) return
  // token 可能在毫秒内被静默续期：延迟确认，token 换了就忽略
  const snapshot = localStorage.getItem('token') || ''
  clearTimeout(authTimer)
  authTimer = setTimeout(() => {
    const now = localStorage.getItem('token') || ''
    if (now !== snapshot) return
    if (location.pathname.startsWith('/login')) return
    notice.value = {
      type: 'warn',
      text: '登录状态已失效，请重新登录',
      btn: '去登录',
      action: () => {
        const back = encodeURIComponent(location.pathname + location.search)
        window.location.href = `/login?redirect=${back}`
      }
    }
  }, 5000)
}

function onVisible() {
  if (document.hidden) return
  checkVersion() // 切回前台立即查一次版本
}

onMounted(() => {
  window.addEventListener('app:auth-expired', onAuthExpired)
  document.addEventListener('visibilitychange', onVisible)
  // dev 环境（vite）没有 assets/index-*.js，CURRENT_ENTRY 为 null，不启动版本检测
  if (CURRENT_ENTRY) {
    firstTimer = setTimeout(() => {
      checkVersion()
      checkTimer = setInterval(checkVersion, CHECK_INTERVAL)
    }, FIRST_CHECK_DELAY)
  }
  // 便于手动验证
  window.__rgCheckVersion = checkVersion
})

onUnmounted(() => {
  window.removeEventListener('app:auth-expired', onAuthExpired)
  document.removeEventListener('visibilitychange', onVisible)
  if (checkTimer) clearInterval(checkTimer)
  if (firstTimer) clearTimeout(firstTimer)
  if (authTimer) clearTimeout(authTimer)
})
</script>

<style scoped>
.rg-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 4000;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(92vw, 560px);
  padding: 12px 14px 12px 18px;
  border-radius: var(--radius-lg, 12px);
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e8e4dd);
  box-shadow: 0 10px 30px rgba(26, 26, 26, 0.14);
  font-size: 0.9rem;
  color: var(--color-text-primary, #1a1a1a);
  font-family: var(--font-body, inherit);
}

.rg-warn {
  border-color: #f0c9a8;
  background: #fdf6ee;
}

.rg-info {
  border-color: #cfe0d8;
  background: #f2f8f5;
}

.rg-text {
  line-height: 1.5;
}

.rg-action {
  flex: none;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e8e4dd);
  background: var(--color-text-primary, #1a1a1a);
  color: #fff;
  font-size: 0.82rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.rg-action:hover {
  opacity: 0.86;
}

.rg-dismiss {
  flex: none;
  border: none;
  background: transparent;
  color: var(--color-text-muted, #8a8a8a);
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  padding: 2px 4px;
}

.rg-fade-enter-active,
.rg-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.rg-fade-enter-from,
.rg-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>
