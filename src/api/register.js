import axios from 'axios'

// 使用相对路径，这样请求会通过 Vite 开发服务器的代理转发到后端
const API_BASE_URL = '/api'

// 发送邮箱验证码
export async function sendVerificationCode(email) {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-verification-code`, {
      email
    })
    // 检查返回的 message 是否包含发送失败信息
    if (response.data && response.data.message && response.data.message.includes('发送失败')) {
      const message = response.data.message
      // 提取最后一个冒号后的具体错误信息
      const colonIndex = message.lastIndexOf(':')
      const errorMsg = colonIndex !== -1 ? message.substring(colonIndex + 1).trim() : message
      throw new Error(errorMsg)
    }
    return response.data
  } catch (error) {
    if (error.response) {
      // 服务器返回了错误响应
      const data = error.response.data
      if (data.detail && Array.isArray(data.detail)) {
        // Pydantic 验证错误
        throw new Error(data.detail[0].msg || '邮箱格式无效')
      } else if (data.message) {
        throw new Error(data.message)
      } else {
        throw new Error('发送验证码失败：' + JSON.stringify(data))
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      throw new Error(error.message || '发送验证码失败')
    }
  }
}

// 用户注册
export async function register({ username, password, email, verification_code, aff_code }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      password,
      email,
      verification_code,
      aff_code: aff_code || undefined
    })
    return response.data
  } catch (error) {
    if (error.response) {
      // 服务器返回了错误响应
      const data = error.response.data
      if (data.detail && Array.isArray(data.detail)) {
        // Pydantic 验证错误
        throw new Error(data.detail[0].msg || '注册失败')
      } else if (data.message) {
        throw new Error(data.message)
      } else {
        throw new Error('注册失败：' + JSON.stringify(data))
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      throw new Error(error.message || '注册失败')
    }
  }
}

// 查询用户额度
export async function updateUserQuota({ username, email }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/update-user-quota`, {
      username,
      email
    })
    return response.data
  } catch (error) {
    if (error.response) {
      // 服务器返回了错误响应
      const data = error.response.data
      if (data.detail && Array.isArray(data.detail)) {
        throw new Error(data.detail[0].msg || '查询额度失败')
      } else if (data.message) {
        throw new Error(data.message)
      } else {
        throw new Error('查询额度失败：' + JSON.stringify(data))
      }
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接')
    } else {
      throw new Error(error.message || '查询额度失败')
    }
  }
}

// 提取首选套餐（claude code）
export function pickClaudeCodePlan(quotaResp) {
  if (!quotaResp || !Array.isArray(quotaResp.plans)) return null
  return quotaResp.plans.find(p => p.type === 'claude code') || quotaResp.plans[0] || null
}

// 把新接口返回结构归一为 store.quotaInfo 字段，方便兼容旧 UI 引用
// 同时保留原始 plans 列表
export function normalizeQuotaInfo(quotaResp) {
  const plan = pickClaudeCodePlan(quotaResp)
  return {
    email: quotaResp?.email || '',
    currency: quotaResp?.currency || 'CNY',
    plans: Array.isArray(quotaResp?.plans) ? quotaResp.plans : [],
    remain_quota: plan ? (plan.unlimited ? -1 : (plan.balance || 0)) : 0,
    model_limits: '',
    used_quota: 0,
    expired_time: 0,
plan_level: plan && plan.has_key ? 'claude code' : ''
  }
}

export default {
  sendVerificationCode,
  register,
  updateUserQuota
}