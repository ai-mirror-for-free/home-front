// 工单 / 反馈接口（门户 → lobeai /api/tickets/*）
// 鉴权：门户 access token（userStore 登录时写入 localStorage.token）
// 约定：lobeai 返回 {success, message, data}；非 2xx 或 success=false 一律抛 Error(message)

const API_BASE = '/api'

function authHeaders() {
  const token = localStorage.getItem('token') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parse(resp) {
  let body = null
  try {
    body = await resp.json()
  } catch (e) {
    body = null
  }
  if (!resp.ok) {
    // 401：登录态失效（轮询时静默失败也能被全局 RuntimeGuard 捕获并提示）
    if (resp.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:auth-expired'))
    }
    const msg = body?.message || body?.detail || `请求失败 (${resp.status})`
    const err = new Error(msg)
    err.status = resp.status
    throw err
  }
  if (body && body.success === false) {
    const err = new Error(body.message || '请求失败')
    err.status = resp.status
    throw err
  }
  return body?.data ?? body
}

function jsonRequest(path, payload, method = 'POST') {
  return fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: method === 'GET' ? undefined : JSON.stringify(payload || {})
  }).then(parse)
}

function formRequest(path, formData) {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(), // 不设 Content-Type，交给浏览器带 boundary
    body: formData
  }).then(parse)
}

export async function getTicketEntry() {
  return fetch(`${API_BASE}/tickets/entry`, { headers: authHeaders() }).then(parse)
}

export async function listTickets({ page = 1, size = 20 } = {}) {
  const qs = new URLSearchParams({ page: String(page), size: String(size) })
  return fetch(`${API_BASE}/tickets?${qs}`, { headers: authHeaders() }).then(parse)
}

export async function getTicket(id) {
  return fetch(`${API_BASE}/tickets/${id}`, { headers: authHeaders() }).then(parse)
}

export async function createTicket({
  category,
  subject,
  content,
  contactEmail = '',
  activationCode = '',
  files = []
}) {
  const fd = new FormData()
  fd.append('category', category)
  fd.append('subject', subject)
  fd.append('content', content)
  fd.append('contact_email', contactEmail)
  fd.append('activation_code', activationCode)
  files.forEach((f) => fd.append('files', f, f.name))
  return formRequest('/tickets', fd)
}

export async function addTicketMessage(id, { content, files = [] }) {
  const fd = new FormData()
  fd.append('content', content)
  files.forEach((f) => fd.append('files', f, f.name))
  return formRequest(`/tickets/${id}/messages`, fd)
}

export async function closeTicket(id) {
  return jsonRequest(`/tickets/${id}/close`, {})
}

// 用户撤销并删除：只对用户隐藏，客服后台仍可见
export async function deleteTicket(id) {
  return jsonRequest(`/tickets/${id}/delete`, {})
}

// 状态/分类中文映射（页面展示用，和 lobeai TicketService 保持一致）
export const CATEGORY_OPTIONS = [
  { value: 'cannot_use', label: '无法使用/报错' },
  { value: 'account', label: '账号与登录' },
  { value: 'billing', label: '充值与额度' },
  { value: 'feature', label: '功能建议' },
  { value: 'other', label: '其他' }
]

export const STATUS_META = {
  open: { label: '待处理', className: 'status-open' },
  replied: { label: '已回复', className: 'status-replied' },
  closed: { label: '已关闭', className: 'status-closed' }
}

export default {
  getTicketEntry,
  listTickets,
  getTicket,
  createTicket,
  addTicketMessage,
  closeTicket
}
