// Access token 静默续期（门户侧）
//
// 背景：claude_agent 后端签发的 access token TTL 30 分钟，refresh token TTL 7 天
// 且 POST /auth/refresh 不轮换 refresh_token。此前门户只在登录时拿一次 token，
// 网页静置 30 分钟后任意请求即 401，被迫重新输密码
// （用户反馈 kaysar0801@163.com，2026-10-15；同日 user 393 亦三次被踢）。
//
// 职责：token 剩余 <5min 时（定时 60s / 页面切回前台）调
// POST /api/v1/auth/refresh 换新 access token 并同步 store + localStorage。
//
// 原则：本模块任何失败都【不主动登出】——
//   - RT 失效/网络抖动时旧 access token 可能仍有效；
//   - 真正的登出兜底在 App.vue 的 /me 校验（401/403 才清态跳登录）。

const REFRESH_MARGIN_SECONDS = 300 // token 剩余 <5min 视为即将过期

/** 解析 JWT payload 的 exp（秒级时间戳）。解析失败返回 null */
export function decodeExp(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    // 兜底 UTF-8 payload 乱码/抛错（与 Login.vue 的 exp 解析口径一致）
    const json = decodeURIComponent(
      Array.from(atob(b64), (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    )
    const exp = JSON.parse(json).exp
    return typeof exp === 'number' ? exp : null
  } catch (_) {
    return null
  }
}

export function isTokenExpiringSoon(token, marginSeconds = REFRESH_MARGIN_SECONDS) {
  const exp = decodeExp(token)
  if (!exp) return false
  return exp - Math.floor(Date.now() / 1000) < marginSeconds
}

let _refreshPromise = null

/** 调 /auth/refresh 换新 access token；成功返回新 token，失败/无 RT 返回 null。
 *  同航次锁：并发调用复用同一个 Promise（后端 refresh 不轮换 RT，并发也无斥斥风险）。 */
export async function refreshTokenSilently() {
  if (_refreshPromise) return _refreshPromise
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return null
  _refreshPromise = (async () => {
    try {
      const resp = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      if (!resp.ok) return null
      const data = await resp.json()
      if (!data || !data.access_token) return null
      return data.access_token
    } catch (_) {
      return null
    } finally {
      _refreshPromise = null
    }
  })()
  return _refreshPromise
}

/** 安装自动续期：60s 定时 + visibilitychange 切回前台时检查。
 *  入参解耦 store：getToken 取当前 token，updateToken(token, expiresAt) 写回。 */
export function setupTokenAutoRefresh(getToken, updateToken) {
  if (typeof window === 'undefined') return
  const check = async () => {
    try {
      const token = getToken()
      if (token && isTokenExpiringSoon(token)) {
        const newToken = await refreshTokenSilently()
        if (newToken) {
          const exp = decodeExp(newToken)
          updateToken(newToken, exp ? new Date(exp * 1000).toISOString() : null)
        }
        // 失败静默：不登出，等下一次 tick 或 /me 兜底
      }
    } catch (_) {
      /* 续期流程自身异常不影响页面 */
    }
  }
  window.setInterval(check, 60 * 1000)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })
}
