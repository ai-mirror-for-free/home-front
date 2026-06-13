import axios from 'axios'

// 使用相对路径，这样请求会通过 Vite 开发服务器的代理转发到后端
const API_BASE_URL = '/api'

/**
 * 重置密码（忘记密码）
 * 校验用户名+邮箱后，从 NewAPI 和 OpenWebUI 数据库中删除用户
 * 用户需要重新注册
 * 
 * @param {Object} params - 请求参数
 * @param {string} params.username - 用户名
 * @param {string} params.email - 注册邮箱地址
 * @returns {Promise<{message: string}>}
 */
export async function resetPassword({ username, email }) {
  const response = await axios.post(`${API_BASE_URL}/reset-password`, {
    username,
    email
  }).catch(error => {
    // 优先检查是否是手动抛出的错误（包含业务逻辑错误消息）
    if (error.message && (error.message.includes('不正确') || error.message.includes('您还有') || error.message.includes('IP已被封禁') || error.message.includes('IP已被限制访问'))) {
      throw error
    }
    
    // 处理 axios 的错误响应
    if (error.response) {
      const data = error.response.data
      if (data.message) {
        throw new Error(data.message)
      } else if (data.detail && Array.isArray(data.detail)) {
        throw new Error(data.detail[0].msg || '请求失败')
      } else {
        throw new Error('重置密码失败：' + JSON.stringify(data))
      }
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接')
    } else {
      throw new Error(error.message || '重置密码失败')
    }
  })
  
  // 检查响应中的 message 是否表示失败
  if (response.data && response.data.message) {
    const msg = response.data.message
    if (msg.includes('不正确') || msg.includes('您还有') || msg.includes('IP已被封禁') || msg.includes('IP已被限制访问')) {
      throw new Error(msg)
    }
  }
  
  return response.data
}

export default {
  resetPassword
}
