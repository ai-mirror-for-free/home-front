const API_BASE = '/api'

export function getStoredKey() {
  try {
    const raw = localStorage.getItem('experience_center_key')
    if (!raw) return ''
    const data = JSON.parse(raw)
    if (!data || !data.key || !data.expiresAt) return ''
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem('experience_center_key')
      return ''
    }
    return data.key
  } catch (e) {
    return ''
  }
}

export function setStoredKey(key, ttlMs) {
  const data = { key, expiresAt: Date.now() + ttlMs }
  localStorage.setItem('experience_center_key', JSON.stringify(data))
}

export function clearStoredKey() {
  localStorage.removeItem('experience_center_key')
}

export async function checkQuota(token) {
  const response = await fetch(`${API_BASE}/quota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message || `查询失败 (${response.status})`)
  }
  const data = await response.json()
  if (data && data.status === false) {
    throw new Error(data.message || '查询失败')
  }
  return data
}

export async function sendExperience({ key, model, text, signal }) {
  const response = await fetch(`${API_BASE}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, model, text }),
    signal
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message || `请求失败 (${response.status})`)
  }
  const data = await response.json()
  if (data && data.status === false) {
    throw new Error(data.message || '请求失败')
  }
  return data
}

export async function fetchExperienceModels() {
  try {
    const response = await fetch(`${API_BASE}/pricing`)
    if (!response.ok) return []
    const data = await response.json()
    if (data && data.status === false) return []
    const list = data?.data || data?.models || []
    return list
      .map((m) => ({ id: m.model_name, name: m.model_name }))
      .filter((m) => m.id)
  } catch (e) {
    return []
  }
}
