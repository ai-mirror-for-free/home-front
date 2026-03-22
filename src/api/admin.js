// 管理员相关API接口

const API_BASE = '/api'

/**
 * 管理员登录
 */
export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

/**
 * 获取兑换码列表
 */
export const getRedemptionCodes = async (params = {}) => {
  // 构建查询参数字符串
  const queryParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key])
    }
  })

  const queryString = queryParams.toString()
  const url = `${API_BASE}/admin/redemption-codes${queryString ? '?' + queryString : ''}`

  const token = localStorage.getItem('adminToken')
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

/**
 * 生成兑换码
 */
export const generateRedemptionCodes = async (data) => {
  const token = localStorage.getItem('adminToken')
  const response = await fetch(`${API_BASE}/admin/generate-redemption-codes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

/**
 * 删除兑换码
 */
export const deleteRedemptionCodes = async (ids) => {
  const token = localStorage.getItem('adminToken')
  const response = await fetch(`${API_BASE}/admin/delete-redemption-codes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

/**
 * 用户兑换兑换码
 */
export const redeemCode = async (data) => {
  const response = await fetch(`${API_BASE}/redeem-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

/**
 * 管理员登出
 */
export const adminLogout = () => {
  localStorage.removeItem('adminToken')
}