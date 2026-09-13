import axios from 'axios'

const API_BASE_URL = '/api'

// 一站式邀请信息查询 — POST /api/invite/info
// 入参 email, 返回 { success, data: { email, aff_code, invite_count, total_reward_rmb, total_reward_quota, rewards: [...] } }
export async function getInviteInfo(email) {
  try {
    const response = await axios.post(`${API_BASE_URL}/invite/info`, {
      email
    })
    const data = response.data

    if (data && data.success === false) {
      throw new Error(data.message || '查询邀请信息失败')
    }

    return data
  } catch (error) {
    if (error.response) {
      const respData = error.response.data
      if (respData && respData.detail && Array.isArray(respData.detail)) {
        throw new Error(respData.detail[0].msg || '查询邀请信息失败')
      } else if (respData && respData.message) {
        throw new Error(respData.message)
      } else {
        throw new Error('查询邀请信息失败：' + JSON.stringify(respData))
      }
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接')
    } else {
      throw new Error(error.message || '查询邀请信息失败')
    }
  }
}

export default {
  getInviteInfo
}