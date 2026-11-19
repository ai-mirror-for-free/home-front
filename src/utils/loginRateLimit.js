/**
 * 登录限流（429）的前端文案与倒计时口径（home-front / www 门户）。
 *
 * 与 claude_web/src/utils/loginRateLimit.ts 保持同一套规则（两站共用同一个
 * 后端 429 契约，文案必须一致，否则用户在两站看到两种说法）：
 *   后端 429 body = { detail, message, reason, retry_after }
 *   reason ∈ too_many_attempts | too_frequent | busy
 *
 * 为什么单独抽文件：文案里「不是密码错误」这句很关键（用户历史行为是登不上
 * 就去改密码），放在组件里没法单独验证。
 */

const KNOWN_REASONS = ['too_many_attempts', 'too_frequent', 'busy']

/** 与密码无关的原因，文案要显式澄清 */
const NOT_PASSWORD_REASONS = ['too_frequent', 'busy']

function toPositiveInt(value) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.min(Math.floor(n), 24 * 3600)
}

/** 从 429 响应体 / Retry-After 头解析倒计时与原因 */
export function parseLoginRateLimit(body, headerRetryAfter = null) {
  const data = body && typeof body === 'object' ? body : {}
  const seconds = toPositiveInt(data.retry_after) || toPositiveInt(headerRetryAfter)
  const rawReason = typeof data.reason === 'string' ? data.reason : ''
  const reason = KNOWN_REASONS.includes(rawReason) ? rawReason : null
  const serverMessage = typeof data.message === 'string' ? data.message : ''
  return { seconds, reason, serverMessage }
}

/** 剩余秒数 → 「2 分 35 秒」/「35 秒」 */
export function formatCountdown(seconds) {
  const total = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  if (minutes <= 0) return `${rest} 秒`
  if (rest === 0) return `${minutes} 分钟`
  return `${minutes} 分 ${rest} 秒`
}

/** 生成展示文案（倒计时期间每 tick 重算） */
export function buildRateLimitMessage(reason, remainingSeconds, serverMessage = '') {
  const seconds = Math.max(1, Math.floor(remainingSeconds))
  const minutes = Math.max(1, Math.ceil(seconds / 60))
  let base
  switch (reason) {
    case 'too_many_attempts':
      base = `密码错误次数过多，请在 ${minutes} 分钟后重试`
      break
    case 'too_frequent':
      base = `登录过于频繁，请在 ${minutes} 分钟后重试`
      break
    case 'busy':
      base = `系统繁忙，请 ${seconds} 秒后重试`
      break
    default:
      return serverMessage || '登录失败，请稍后重试'
  }
  if (reason && NOT_PASSWORD_REASONS.includes(reason)) {
    return `${base}（不是密码错误，请稍候再试）`
  }
  return base
}

/** 登录按钮锁定期间文案 */
export function buildLockedButtonLabel(remainingSeconds) {
  return `请稍候 ${formatCountdown(remainingSeconds)}`
}
