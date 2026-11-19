/**
 * 轮询调度器（门户）
 *
 * 目标：A 端服务器较弱，轮询必须「人在看才发请求」。
 *   1) 页面不可见（切到别的标签/最小化）→ 不发请求
 *   2) 连续 backoffAfter 轮数据没变化 → 间隔翻倍，封顶 maxInterval
 *   3) 超过 idleSeconds 没有鼠标/键盘/滚动 → 停表，纯内存空转
 *   4) 用户有任何操作 / 切回标签页 → 立刻刷一次并回到基准间隔
 *
 * task 返回 true 表示本轮检测到变化（会重置退避）。
 * 间隔参数来自后端 /api/tickets 响应的 poll_seconds，改 config.yaml 即可调速。
 */
export function createPoller(options = {}) {
  const {
    task,
    primary = 20000,
    maxInterval = 60000,
    idleSeconds = 600,
    backoffAfter = 2,
    idleCheckInterval = 30000
  } = options

  const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'input', 'wheel']

  let timer = null
  let stopped = true
  let busy = false
  let base = Math.max(5000, primary)
  let max = Math.max(base, maxInterval)
  let interval = base
  let idleMs = Math.max(60000, idleSeconds * 1000)
  let quiet = 0
  let lastActive = Date.now()

  function isIdle() {
    return Date.now() - lastActive > idleMs
  }

  function schedule(delay) {
    clearTimeout(timer)
    timer = setTimeout(tick, delay)
  }

  function wake(force = false) {
    if (stopped) return
    quiet = 0
    interval = base
    if (force && !busy) schedule(0)
  }

  async function tick() {
    timer = null
    if (stopped) return
    // 挂起态：不发请求，隔一会儿再判断（纯内存检查，几乎零成本）
    if (document.hidden || isIdle()) {
      schedule(idleCheckInterval)
      return
    }
    if (busy) {
      schedule(interval)
      return
    }
    busy = true
    let changed = false
    try {
      changed = (await task()) === true
    } catch (e) {
      changed = false // 轮询失败静默，下个周期再试
    } finally {
      busy = false
    }
    if (stopped) return
    if (changed) {
      quiet = 0
      interval = base
    } else {
      quiet += 1
      if (quiet >= backoffAfter) interval = Math.min(interval * 2, max)
    }
    schedule(interval)
  }

  function onActivity() {
    const wasIdle = isIdle()
    lastActive = Date.now()
    if (stopped || busy) return
    if (!timer || wasIdle) {
      quiet = 0
      interval = base
      schedule(0)
    }
  }

  function onVisibility() {
    if (document.hidden) return
    lastActive = Date.now()
    if (stopped) return
    quiet = 0
    interval = base
    schedule(0)
  }

  return {
    start() {
      if (!stopped) return
      stopped = false
      lastActive = Date.now()
      ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }))
      document.addEventListener('visibilitychange', onVisibility)
      schedule(0)
    },
    stop() {
      stopped = true
      clearTimeout(timer)
      timer = null
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity))
      document.removeEventListener('visibilitychange', onVisibility)
    },
    /** 主动操作（发送消息 / 改状态）后立即刷一轮 */
    poke() {
      wake(true)
    },
    /** 后端下发的基准间隔（毫秒）。值没变就什么都不做，避免把已退避的间隔冲回去。 */
    setBase(ms) {
      const next = Number(ms)
      if (!next || next < 5000 || next === base) return
      base = next
      max = Math.max(base, max)
      interval = base
      quiet = 0
    },
    setMax(ms) {
      const next = Number(ms)
      if (!next || next === max) return
      max = Math.max(base, next)
    },
    setIdle(ms) {
      const next = Number(ms)
      if (!next) return
      const value = Math.max(60000, next)
      if (value === idleMs) return
      idleMs = value
    }
  }
}
