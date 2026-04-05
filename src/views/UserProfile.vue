<template>
  <div class="profile-container">
    <!-- 背景装饰 -->
    <div class="orb orb-blue" style="top: 10%; left: 10%;"></div>
    <div class="orb orb-purple" style="top: 30%; right: 10%;"></div>
    
    <div class="container">
      <div class="profile-header">
        <h1 class="page-title">个人中心</h1>
        <p class="page-subtitle">管理您的账户和订阅服务</p>
      </div>

      <div class="profile-grid">

        <!-- 套餐信息卡片 -->
        <div class="card subscription-card">
          <div class="card-header">
            <h2 class="card-title">当前套餐</h2>
          </div>
          <div class="card-body">
            <div class="subscription-badge">
              <span :class="['tag', 'tag-' + mapPlanLevelToTag(quotaInfo.plan_level)]">
                {{ formatPlanLevel(quotaInfo.plan_level) }}
              </span>
            </div>
            
            <div class="subscription-details">
              <div class="detail-item">
                <span class="detail-label">到期时间</span>
                <span class="detail-value">{{ formatExpiredTime(quotaInfo.expired_time) }}</span>
              </div>
              
              <div class="countdown-section">
                <div class="countdown-title">剩余时间</div>
                <div 
                  :class="[
                    'countdown-value', 
                    daysUntilExpiration <= 7 ? 'countdown-warning' : ''
                  ]"
                >
                  {{ daysUntilExpiration }} 天
                </div>
              </div>
            </div>
            
            <div class="subscription-status" v-if="daysUntilExpiration <= 0">
              <span class="status-message">您的套餐已过期，请及时续费</span>
            </div>
            
            <div class="subscription-actions">
              <button @click="goToOpenWebUI" class="btn btn-primary">
                访问 OpenWebUI
              </button>
              <RouterLink to="/renewal" class="btn btn-outline">
                续费套餐
              </RouterLink>
              <RouterLink to="/buy-new" class="btn btn-outline">
                购买新套餐
              </RouterLink>
            </div>
            
            <!-- 兑换码兑换区域 -->
            <div class="redemption-section">
              <h3 class="redemption-title">兑换码兑换</h3>
              <div class="redemption-description">
                <p>如果您有兑换码，可以在此兑换套餐或额度。</p>
              </div>
              
              <div class="redemption-form">
                <div class="form-group">
                  <label for="redemption-code" class="form-label">兑换码</label>
                  <input
                    id="redemption-code"
                    v-model="redemptionCode"
                    type="text"
                    placeholder="请输入16位兑换码"
                    class="form-input"
                    :disabled="redemptionLoading"
                  />
                </div>
                
                <button 
                  @click="handleRedeemCode" 
                  class="btn btn-primary btn-full"
                  :disabled="redemptionLoading || !redemptionCode"
                >
                  <span v-if="redemptionLoading">兑换中...</span>
                  <span v-else>兑换</span>
                </button>
                
                <div v-if="redemptionMessage" class="redemption-message" :class="redemptionMessageType">
                  {{ redemptionMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 额度信息卡片 -->
        <div class="card quota-card">
          <div class="card-header">
            <h2 class="card-title">使用额度</h2>
          </div>
          <div class="card-body">
            <div class="quota-stats">
              <div class="quota-item">
                <span class="quota-label">剩余额度</span>
                <span class="quota-value quota-remain">{{ quotaInfo.remain_quota.toLocaleString() }}</span>
                <span class="quota-unit">tokens</span>
              </div>
              <div class="quota-item">
                <span class="quota-label">已使用额度</span>
                <span class="quota-value">{{ quotaInfo.used_quota.toLocaleString() }}</span>
                <span class="quota-unit">tokens</span>
              </div>
              <div class="quota-item">
                <span class="quota-label">套餐级别</span>
                <span class="quota-value quota-plan">{{ formatPlanLevel(quotaInfo.plan_level) }}</span>
              </div>
              <div class="quota-item" v-if="quotaInfo.expired_time">
                <span class="quota-label">额度过期时间</span>
                <span class="quota-value">{{ formatExpiredTime(quotaInfo.expired_time) }}</span>
              </div>
            </div>
            
            <div class="model-limits" v-if="quotaInfo.model_limits">
              <div class="model-limits-header">
                <span class="model-limits-title">可用模型列表</span>
                <button 
                  @click="toggleModelList" 
                  class="model-toggle-btn"
                  :class="{ 'expanded': isModelListExpanded }"
                >
                  {{ isModelListExpanded ? '收起' : '展开' }} 
                  <span class="toggle-icon" :class="{ 'rotated': isModelListExpanded }">▼</span>
                </button>
              </div>
              <div 
                class="model-list-wrapper" 
                :class="{ 'expanded': isModelListExpanded, 'collapsed': !isModelListExpanded }"
              >
                <div class="model-list">
                  <div 
                    v-for="(model, index) in modelLimitsArray" 
                    :key="index" 
                    class="model-item"
                  >
                    {{ model }}
                  </div>
                </div>
              </div>
              <div 
                v-show="!isModelListExpanded && modelLimitsArray.length > 6" 
                class="model-count-indicator"
              >
                +{{ modelLimitsArray.length - 6 }} 个模型
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <!-- 悬浮客服按钮 -->
    <div class="floating-support">
      <div class="support-dropdown" :class="{ 'active': isSupportDropdownVisible }">
        <a :href="supportOptions[0].link" target="_blank" class="dropdown-item">
          <div class="dropdown-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="var(--accent-green)"/>
              <path d="M12 6C11.45 6 11 6.45 11 7C11 7.55 11.45 8 12 8C12.55 8 13 7.55 13 7C13 6.45 12.55 6 12 6ZM15 8C14.45 8 14 8.45 14 9C14 9.55 14.45 10 15 10C15.55 10 16 9.55 16 9C16 8.45 15.55 8 15 8ZM9 8C8.45 8 8 8.45 8 9C8 9.55 8.45 10 9 10C9.55 10 10 9.55 10 9C10 8.45 9.55 8 9 8Z" fill="var(--accent-green)"/>
            </svg>
          </div>
          <span>{{ supportOptions[0].title }}</span>
        </a>
        <a :href="supportOptions[1].link" target="_blank" class="dropdown-item">
          <div class="dropdown-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="var(--accent-blue)"/>
            </svg>
          </div>
          <span>{{ supportOptions[1].title }}</span>
        </a>
      </div>
      <button class="support-toggle" @click="toggleSupportDropdown">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="var(--accent-cyan)"/>
          <path d="M11 17V11H13V17H11ZM11 9V7H13V9H11Z" fill="white"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUserQuota } from '@/api/register'
import { redeemCode } from '@/api/admin' // 假设redeemCode函数在admin.js中

const userStore = useUserStore()
const isSupportDropdownVisible = ref(false)
const loadingQuota = ref(false)
const isModelListExpanded = ref(false)

// 新增兑换码相关变量
const redemptionCode = ref('')
const redemptionLoading = ref(false)
const redemptionMessage = ref('')
const redemptionMessageType = ref('') // 'success' or 'error'

// 使用计算属性来响应式地获取用户信息
const userInfo = computed(() => userStore.state.userInfo)
const subscriptionInfo = computed(() => userStore.state.subscriptionInfo)
const quotaInfo = computed(() => userStore.state.quotaInfo)

// 计算距离套餐过期的天数
const daysUntilExpiration = computed(() => {
  if (!quotaInfo.value.expired_time) {
    // 如果没有过期时间，则认为是永久有效的
    return Infinity
  }
  
  const now = Date.now()
  const expirationTime = quotaInfo.value.expired_time * 1000 // 转换为毫秒
  const diffMs = expirationTime - now
  
  if (diffMs <= 0) {
    return 0 // 已过期
  }
  
  // 转换为天数
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
})

// 客服支持选项
const supportOptions = [
  {
    title: '在线客服',
    desc: '工作日 9:00-18:00 提供服务',
    link: '#contact' // 替换为实际链接
  },
  {
    title: 'QQ群',
    desc: '加入技术支持群获取帮助',
    link: '#qqgroup' // 替换为实际链接
  }
]

// 将模型限制字符串转换为数组
const modelLimitsArray = computed(() => {
  if (!quotaInfo.value.model_limits) return []
  return quotaInfo.value.model_limits.split(',').map(model => model.trim()).filter(model => model)
})

// 格式化套餐级别
const formatPlanLevel = (planLevel) => {
  const planMap = {
    'free': '免费版',
    'basic': '基础版',
    'pro': '专业版',
    'premium': '高级版',
    'enterprise': '企业版'
  }
  return planMap[planLevel] || planLevel
}

// 映射套餐级别到标签类型
const mapPlanLevelToTag = (planLevel) => {
  const tagMap = {
    'free': 'gray',
    'basic': 'blue',
    'pro': 'cyan',
    'premium': 'purple',
    'enterprise': 'green'
  }
  return tagMap[planLevel] || 'gray'
}

// 格式化过期时间
const formatExpiredTime = (timestamp) => {
  if (!timestamp) return '无限制'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleSupportDropdown = () => {
  isSupportDropdownVisible.value = !isSupportDropdownVisible.value
}

// 切换模型列表展开/收起状态
const toggleModelList = () => {
  isModelListExpanded.value = !isModelListExpanded.value
}

// 新增函数：跳转到OpenWebUI
const goToOpenWebUI = () => {
  const token = userStore.getToken();
  if (token) {
    // 获取当前域名，提取主域名后拼接 chat. 前缀
    const currentHostname = window.location.hostname;
    const parts = currentHostname.split('.');
    // 提取最后两部分作为主域名（如 www.domain.com -> domain.com）
    const mainDomain = parts.slice(-2).join('.');
    const openWebUIUrl = `https://chat.${mainDomain}/sso`;
    const redirectUrl = `${openWebUIUrl}?token=${encodeURIComponent(token)}`;
    window.open(redirectUrl, '_blank');
  } else {
    alert('用户未登录或缺少访问令牌');
  }
}

// 获取用户额度信息
const fetchUserQuota = async () => {
  try {
    loadingQuota.value = true
    const username = userStore.getUserName()
    const email = userStore.getUserEmail()
    
    if (!username || !email) {
      console.warn('无法获取用户额度：缺少用户名或邮箱')
      return
    }
    
    const quotaData = await updateUserQuota({ username, email })
    userStore.updateQuotaInfo(quotaData)
  } catch (error) {
    console.error('获取用户额度失败:', error.message)
    // 可以在这里添加错误提示
  } finally {
    loadingQuota.value = false
  }
}

// 兑换码兑换处理函数
const handleRedeemCode = async () => {
  if (!redemptionCode.value) {
    redemptionMessage.value = '请输入兑换码';
    redemptionMessageType.value = 'error';
    return;
  }

  redemptionLoading.value = true;
  redemptionMessage.value = '';
  
  try {
    const response = await redeemCode({
      code: redemptionCode.value,
      email: userInfo.value.email // 使用当前用户的邮箱
    });

    // 成功兑换后显示消息
    redemptionMessage.value = response.message || '兑换成功！';
    redemptionMessageType.value = 'success';

    // 清空输入框
    redemptionCode.value = '';
    
    // 刷新用户信息
    await fetchUserQuota();
  } catch (error) {
    console.error('兑换失败:', error);
    redemptionMessage.value = error.response?.data?.message || error.message || '兑换失败，请检查兑换码是否正确';
    redemptionMessageType.value = 'error';
  } finally {
    redemptionLoading.value = false;
  }
}

// 页面加载时获取用户额度信息
onMounted(() => {
  if (userStore.state.isLoggedIn) {
    fetchUserQuota()
  }
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 60px;
  position: relative;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  padding: 32px;
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 用户信息卡片样式 */
.profile-info-card {
  grid-column: span 1;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.user-details h3 {
  font-size: 1.5rem;
  margin-bottom: 6px;
}

.user-details p {
  color: var(--text-secondary);
  margin: 0;
}

.account-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.stat-value {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1.1rem;
}

.stat-status-active {
  color: var(--accent-green);
}

/* 套餐信息卡片样式 */
.subscription-card {
  grid-column: span 1;
}

.subscription-badge {
  margin-bottom: 20px;
}

.subscription-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  flex: 1;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.detail-value {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1.1rem;
}

.countdown-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.countdown-title {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.countdown-value {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.8rem;
}

.countdown-warning {
  color: var(--accent-cyan);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.subscription-status {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  text-align: center;
}

.status-message {
  color: #ef4444;
  font-weight: 500;
}

.subscription-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.redemption-section {
  padding: 20px;
  background: var(--bg-card-hover);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  width: 100%;
}

.redemption-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.redemption-description {
  margin-bottom: 16px;
}

.redemption-description p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.redemption-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
}

.form-input:disabled {
  background-color: var(--bg-disabled);
  cursor: not-allowed;
}

.btn-full {
  width: 100%;
}

.redemption-message {
  padding: 12px;
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 500;
  margin-top: 8px;
}

.redemption-message.success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.redemption-message.error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* 额度信息卡片样式 */
.quota-card {
  grid-column: span 1;
}

.quota-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quota-item {
  display: flex;
  flex-direction: column;
}

.quota-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.quota-value {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quota-remain {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--accent-cyan);
}

.quota-unit {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 4px;
}

.quota-plan {
  text-transform: capitalize;
}

.model-limits {
  margin-top: 20px;
}

.model-limits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.model-limits-title {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.model-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--accent-cyan);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.model-toggle-btn:hover {
  background-color: rgba(56, 189, 248, 0.1);
}

.toggle-icon {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 0.7rem;
  transform-origin: center;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.model-list-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.model-list-wrapper.expanded {
  max-height: 500px; /* 设置一个足够大的值，根据需要调整 */
}

.model-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0;
}

.model-item {
  background: var(--bg-card-hover);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.model-count-indicator {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  padding: 8px 0;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: var(--radius-sm);
  margin-top: 8px;
}

/* 兑换码卡片样式 */
.redemption-card {
  grid-column: span 1;
}

.redemption-description {
  margin-bottom: 20px;
}

.redemption-description p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.redemption-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
}

.form-input:disabled {
  background-color: var(--bg-disabled);
  cursor: not-allowed;
}

.btn-full {
  width: 100%;
}

.redemption-message {
  padding: 12px;
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 500;
}

.redemption-message.success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.redemption-message.error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: var(--transition);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--gradient-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4);
}

.btn-primary:disabled {
  background: var(--bg-disabled);
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-outline:hover {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

/* 悬浮客服按钮样式 */
.floating-support {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.support-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: var(--transition);
  color: var(--text-secondary);
}

.support-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(56, 189, 248, 0.6);
}

.support-dropdown {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  width: 220px;
}

.support-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.dropdown-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-glow);
  transform: translateX(-5px);
}

.dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>