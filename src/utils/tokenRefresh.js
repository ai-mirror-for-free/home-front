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

// 终态熔断阀值（2026-11-02）：/auth/refresh 返回 401/403 = 凭证已死，
// 连续达到该次数就停表 + 登出，避免每 60s 一次 401 无限循环
// （现网实测：用户停在 /profile 不刷新时，单个标签可持续循环数小时）。
const MAX_TERMINAL_FAILURES = 2

let _terminalFailures = 0

/** 供登录成功后重置熔断计数（可选调用） */
export function resetRefreshFailureStreak() {
  _terminalFailures = 0
}

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

/** 调 /auth/refresh 换新 access token。
 *
 *  返回 `{ token, terminal }`：
 *  - token:   新 access token；失败为 null
 *  - terminal: true = 凭证终态失效（401/403：refresh token 已过期或被撤销），
 *              调用方应当登出，不要再等下一次 tick；
 *              false = 临时失败（网络抖动 / 5xx / 无 RT），保持登录态等下次重试。
 *
 *  同航次锁：并发调用复用同一个 Promise（后端 refresh 不轮换 RT，并发也无斥斥风险）。 */
export async function refreshTokenSilently() {
  if (_refreshPromise) return _refreshPromise
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return { token: null, terminal: false }
  _refreshPromise = (async () => {
    try {
      const resp = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      if (!resp.ok) {
        const terminal = resp.status === 401 || resp.status === 403
        if (terminal) {
          _terminalFailures += 1
        } else {
          _terminalFailures = 0
        }
        return { token: null, terminal }
      }
      const data = await resp.json().catch(() => null)
      if (!data || !data.access_token) {
        _terminalFailures = 0
        return { token: null, terminal: false }
      }
      _terminalFailures = 0
      return { token: data.access_token, terminal: false }
    } catch (_) {
      // 网络异常：不算终态，保留登录态
      _terminalFailures = 0
      return { token: null, terminal: false }
    } finally {
      _refreshPromise = null
    }
  })()
  return _refreshPromise
}

/** 安装自动续期：60s 定时 + visibilitychange 切回前台时检查。
 *  入参解耦 store：getToken 取当前 token，updateToken(token, expiresAt) 写回。
 *  onFatal：连续 MAX_TERMINAL_FAILURES 次 401/403 时回调（调用方应清凭证 + 跳登录），
 *           定时器同时自动停止，不会重启（重新登录后页面重载会重新安装）。 */
export function setupTokenAutoRefresh(getToken, updateToken, onFatal) {
  if (typeof window === 'undefined') return () => {}
  let stopped = false
  let timer = null

  const check = async () => {
    if (stopped) return
    try {
      const token = getToken()
      if (token && isTokenExpiringSoon(token)) {
        const result = await refreshTokenSilently()
        if (result.token) {
          const exp = decodeExp(result.token)
          updateToken(result.token, exp ? new Date(exp * 1000).toISOString() : null)
          return
        }
        // 终态失败（refresh token 已过期/被撤销）：停表 + 交给调用方登出。
        // 背景：原先「失败静默不登出」+ SPA 长驻不触发 /auth/me 兜底
        //       → 每 60s 一次 401 无限循环，实测单标签能持续数小时。
        if (result.terminal && _terminalFailures >= MAX_TERMINAL_FAILURES) {
          stopped = true
          if (timer) clearInterval(timer)
          timer = null
          _terminalFailures = 0
          if (typeof onFatal === 'function') onFatal()
        }
      }
    } catch (_) {
      /* 续期流程自身异常不影响页面 */
    }
  }

  timer = window.setInterval(check, 60 * 1000)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })

  return () => {
    stopped = true
    if (timer) clearInterval(timer)
    timer = null
  }
}
