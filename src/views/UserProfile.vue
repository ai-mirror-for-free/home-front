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
              <span class="tag tag-cyan">Claude Code · 预付费按量</span>
            </div>

            <div class="subscription-details">
              <div class="detail-item">
                <span class="detail-label">计费方式</span>
                <span class="detail-value">按 Token 使用量计费 (CNY)</span>
              </div>
            </div>
            
            <div class="subscription-actions">
              <button @click="goToClaudeMirror" class="btn btn-primary">
                开始聊天
              </button>
              <a href="https://e.tb.cn/h.8UyAjmuZLZEnWiZ?tk=gkWigxdsfMo" class="btn btn-outline">
                淘宝购买
              </a>
              <a href="https://m.tb.cn/h.8UBxavO?tk=BrifgxWK8rz" class="btn btn-outline">
                闲鱼购买
              </a>
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
                    placeholder="在此输入兑换码"
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
            <div class="plans-list" v-if="quotaInfo.plans && quotaInfo.plans.length">
              <div v-for="plan in quotaInfo.plans" :key="plan.type" class="plan-quota-card">
                <div class="plan-quota-head">
                  <div class="plan-quota-title">
                    <span class="plan-quota-name">{{ formatPlanType(plan.type) }}</span>
                    <span v-if="plan.has_key" class="tag tag-cyan">已开通</span>
                    <span v-else class="tag tag-gray">未开通</span>
                  </div>
                  <span class="plan-quota-currency">{{ quotaInfo.currency || 'CNY' }}</span>
                </div>

                <div class="plan-quota-balance">
                  <div class="balance-label">账户余额</div>
                  <div class="balance-value">
                    <template v-if="plan.unlimited">
                      <span class="balance-unlimited">无限</span>
                    </template>
                    <template v-else-if="plan.has_key">
                      <span class="currency-symbol">¥</span>
                      <span class="amount">{{ Number(plan.balance || 0).toFixed(2) }}</span>
                    </template>
                    <template v-else>
                      <span class="currency-symbol">¥</span>
                      <span class="amount">0.00</span>
                    </template>
                  </div>
                </div>

                <div class="plan-quota-meta">
                  <div class="meta-item">
                    <span class="meta-label">累计充值</span>
                    <span class="meta-value">
                      <template v-if="plan.unlimited">—</template>
                      <template v-else>¥ {{ Number(plan.total_recharged || 0).toFixed(2) }}</template>
                    </span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">状态</span>
                    <span class="meta-value">
                      <template v-if="plan.unlimited">不限量</template>
                      <template v-else-if="plan.has_key">可用</template>
                      <template v-else>未开通</template>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="plans-empty">
              <span class="plans-empty-icon">💳</span>
              <p>暂无套餐额度数据</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUserQuota, normalizeQuotaInfo } from '@/api/register'
import { redeemCode } from '@/api/admin' // 假设redeemCode函数在admin.js中

const userStore = useUserStore()
const isSupportDropdownVisible = ref(false)
const loadingQuota = ref(false)

// 新增兑换码相关变量
const redemptionCode = ref('')
const redemptionLoading = ref(false)
const redemptionMessage = ref('')
const redemptionMessageType = ref('') // 'success' or 'error'

// 使用计算属性来响应式地获取用户信息
const userInfo = computed(() => userStore.state.userInfo)
const subscriptionInfo = computed(() => userStore.state.subscriptionInfo)
const quotaInfo = computed(() => userStore.state.quotaInfo)

// 判断是否为管理员角色
const isAdmin = computed(() => {
  return userInfo.value.role === 'admin'
})

// 客服支持选项
const supportOptions = [
  {
    title: '在线客服',
    desc: '工作日 9:00-18:00 提供服务',
    link: '#contact'
  },
  {
    title: 'QQ群',
    desc: '加入技术支持群获取帮助',
    link: '#qqgroup'
  }
]

// 格式化套餐类型 (来自后端 plans[].type)
const formatPlanType = (type) => {
  const map = {
    'claude code': 'Claude Code',
  }
  return map[type] || type
}

const toggleSupportDropdown = () => {
  isSupportDropdownVisible.value = !isSupportDropdownVisible.value
}

const goToClaudeMirror = () => {
  const token = userStore.getToken();
  if (token) {
    const currentHostname = window.location.hostname;
    const parts = currentHostname.split('.');
    const mainDomain = parts.slice(-2).join('.');
    const targetUrl = `https://claude.${mainDomain}/?token=${encodeURIComponent(token)}`;
    window.open(targetUrl, '_blank');
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
    userStore.updateQuotaInfo(normalizeQuotaInfo(quotaData))
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
    // 从 localStorage 获取保存的用户凭据
    const savedCredentials = localStorage.getItem('userCredentials')
    let credentials = { username: '', email: '', password: '' }
    
    if (savedCredentials) {
      try {
        credentials = JSON.parse(savedCredentials)
      } catch (e) {
        console.error('解析保存的凭据失败:', e)
      }
    }
    
    const response = await redeemCode({
      code: redemptionCode.value,
      username: credentials.username || userInfo.value.name,
      email: credentials.email || userInfo.value.email,
      password: credentials.password
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

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-quota-card {
  padding: 22px 24px;
  background: var(--bg-card-hover);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-quota-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.plan-quota-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.plan-quota-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--text-primary);
}

.tag-gray {
  color: var(--text-muted);
  border-color: var(--border);
  background: rgba(255,255,255,0.04);
}

.plan-quota-currency {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  letter-spacing: 0.05em;
}

.plan-quota-balance {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 0;
  border-top: 1px dashed var(--border);
  border-bottom: 1px dashed var(--border);
}

.balance-label {
  font-size: 0.82rem;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

.balance-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--text-primary);
}

.balance-value .currency-symbol {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.balance-value .amount {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  color: var(--accent-cyan);
  letter-spacing: -0.01em;
}

.balance-unlimited {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  background: var(--gradient-accent, linear-gradient(135deg, #38bdf8, #a78bfa));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.02em;
}

.plan-quota-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.meta-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 500;
}

.plans-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  text-align: center;
}

.plans-empty-icon {
  font-size: 2.2rem;
  opacity: 0.6;
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