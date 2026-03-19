import axios from 'axios'

// 使用相对路径，这样请求会通过 Vite 开发服务器的代理转发到后端
const API_BASE_URL = '/api'

// 发送邮箱验证码
export async function sendVerificationCode(email) {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-verification-code`, {
      email
    })
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

export default {
  sendVerificationCode,
  register
}