import axios from 'axios'

const API_BASE_URL = '/api'

// 获取公告文本
export async function getNoticeText() {
  try {
    const response = await axios.get(`${API_BASE_URL}/text/notice`)
    const data = response.data
    
    // 如果返回的数据 content 字段是 JSON 字符串，则解析它
    if (data && data.content && typeof data.content === 'string') {
      try {
        const parsedContent = JSON.parse(data.content)
        return {
          time: parsedContent.time || '',
          content: parsedContent.content || ''
        }
      } catch (e) {
        // 如果解析失败，可能是普通文本，直接返回
        return {
          time: data.time || '',
          content: data.content || ''
        }
      }
    }
    
    // 如果是标准格式直接返回
    return {
      time: data.time || '',
      content: data.content || ''
    }
  } catch (error) {
    // 如果请求失败或没有公告，返回 null 而不是抛出错误
    if (error.response && error.response.status === 404) {
      return null
    }
    console.warn('获取公告失败:', error.message)
    return null
  }
}

export default {
  getNoticeText
}
