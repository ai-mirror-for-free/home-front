const API_BASE = '/api'

// 兜底链接：后台未配置时使用，保证页面不会出现空 href
export const DEFAULT_TAOBAO_URL = 'https://e.tb.cn/h.8UyAjmuZLZEnWiZ?tk=gkWigxdsfMo'
export const DEFAULT_XIANYU_URL = 'https://m.tb.cn/h.8UBxavO?tk=BrifgxWK8rz'

/**
 * 把后台存的 content 解析成链接。
 * 兼容三种历史写法：
 *   1. 纯字符串            "https://xxx"
 *   2. JSON 字符串         '{"url":"https://xxx"}' / '{"content":"https://xxx"}'
 *   3. 对象                { url: 'https://xxx' } / { content: 'https://xxx' }
 * 只放行 http/https，避免配置成 javascript: 之类的危险协议。
 */
function normalizeUrl(raw) {
  if (!raw) return ''
  if (typeof raw === 'string') {
    const s = raw.trim()
    if (!s) return ''
    if (s.startsWith('{') || s.startsWith('[')) {
      try {
        return normalizeUrl(JSON.parse(s))
      } catch (e) {
        return ''
      }
    }
    return s
  }
  if (typeof raw === 'object') {
    const keys = ['url', 'content', 'href', 'link', 'value']
    for (const k of keys) {
      const v = normalizeUrl(raw[k])
      if (v) return v
    }
  }
  return ''
}

function isSafeUrl(url) {
  if (!url) return false
  return /^https?:\/\//i.test(url)
}

/**
 * 读取后台「配置管理」里的单个链接。
 * @param {string} key      后台配置 key，如 fakaUrl / tbUrl / xianyuUrl
 * @param {string} fallback 取不到时的兜底链接
 */
export async function getSiteLink(key, fallback = '') {
  try {
    const res = await fetch(`${API_BASE}/text/${key}`, {
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) return fallback
    const data = await res.json()
    const url = normalizeUrl(data?.content) || normalizeUrl(data?.url)
    if (isSafeUrl(url)) return url
    return fallback
  } catch (e) {
    return fallback
  }
}

/**
 * 一次性取齐购买相关三个链接。
 * fakaUrl（发卡网址）未配置时回退到淘宝链接，保证「点击购买」始终可点。
 */
export async function getPurchaseLinks() {
  const [faka, taobao, xianyu] = await Promise.all([
    getSiteLink('fakaUrl', ''),
    getSiteLink('tbUrl', DEFAULT_TAOBAO_URL),
    getSiteLink('xianyuUrl', DEFAULT_XIANYU_URL)
  ])
  return {
    fakaUrl: faka || taobao,
    taobaoUrl: taobao,
    xianyuUrl: xianyu
  }
}

export default {
  getSiteLink,
  getPurchaseLinks,
  DEFAULT_TAOBAO_URL,
  DEFAULT_XIANYU_URL
}
