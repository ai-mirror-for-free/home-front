<template>
  <div class="invite-page">
    <div class="orb orb-blue" style="top: 8%; left: 6%;"></div>
    <div class="orb orb-purple" style="top: 18%; right: 8%;"></div>

    <div class="container">
      <div class="invite-header">
        <h1 class="page-title">我的邀请</h1>
        <p class="page-subtitle">分享邀请码给好友，好友兑换激活码后您将获得 10% 返利，无封顶</p>
      </div>

      <div class="invite-content" v-if="!loadError">
        <!-- 顶部三张统计卡片 -->
        <div class="stats-grid">
          <div class="card stat-card stat-code">
            <div class="stat-label">我的邀请码</div>
            <div class="stat-value code-value">
              <span class="code-text">{{ affCode || '—' }}</span>
              <button
                v-if="affCode"
                type="button"
                class="copy-btn"
                @click="copyAffCode"
                :title="copied ? '已复制' : '复制邀请链接'"
              >
                <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
            <div class="stat-hint">注册时填写此邀请码即可建立邀请关系</div>
          </div>

          <div class="card stat-card">
            <div class="stat-label">累计返利</div>
            <div class="stat-value">
              <span class="currency">¥</span>
              <span class="amount">{{ Number(totalRewardRmb).toFixed(2) }}</span>
            </div>
            <div class="stat-hint">累计 {{ totalRewardQuota.toLocaleString('zh-CN') }} quota</div>
          </div>

          <div class="card stat-card">
            <div class="stat-label">累计邀请</div>
            <div class="stat-value">
              <span class="amount">{{ inviteCount }}</span>
              <span class="unit">人</span>
            </div>
            <div class="stat-hint">成功通过您的邀请码注册的好友数</div>
          </div>
        </div>

        <!-- 规则说明 -->
        <div class="card rule-card">
          <div class="card-header">
            <h2 class="card-title">返利规则</h2>
          </div>
          <div class="card-body">
            <ul class="rule-list">
              <li>好友注册时填写您的邀请码，建立邀请关系（仅新用户可绑定，不可补填）。</li>
              <li>好友每次兑换 <strong>Claude Code</strong> 激活码，您将获得充值面额 <strong>10%</strong> 的返利，<strong>无封顶</strong>。</li>
              <li>返利自动累加到您的 Claude Code 余额，可在「个人中心」查看。</li>
              <li>同一激活码仅触发一次返利（幂等）。</li>
            </ul>
          </div>
        </div>

        <!-- 返利明细 -->
        <div class="card rewards-card">
          <div class="card-header rewards-header">
            <h2 class="card-title">返利明细</h2>
            <span class="rewards-count" v-if="rewards.length">共 {{ rewards.length }} 条</span>
          </div>
          <div class="card-body">
            <div v-if="rewards.length" class="rewards-list">
              <div class="rewards-row rewards-row-head">
                <div class="col-time">时间</div>
                <div class="col-invitee">被邀请人</div>
                <div class="col-recharge">充值金额</div>
                <div class="col-reward">返利金额</div>
              </div>
              <div v-for="r in rewards" :key="r.activation_code_id + r.invitee_email" class="rewards-row">
                <div class="col-time">{{ r.created_at }}</div>
                <div class="col-invitee" :title="r.invitee_email">{{ r.invitee_email }}</div>
                <div class="col-recharge">¥ {{ Number(r.recharge_rmb || 0).toFixed(2) }}</div>
                <div class="col-reward">¥ {{ Number(r.reward_rmb || 0).toFixed(2) }}</div>
              </div>
            </div>
            <div v-else class="rewards-empty">
              <span class="rewards-empty-icon">🎁</span>
              <p>暂无返利明细</p>
              <p class="rewards-empty-sub">分享您的邀请码，好友兑换激活码后将自动获得返利</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card error-card">
        <div class="card-body">
          <div class="error-text">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ loadError }}
          </div>
          <button class="btn btn-primary" @click="fetchInviteInfo">重新加载</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getInviteInfo } from '@/api/invite'

const userStore = useUserStore()
const userEmail = computed(() => userStore.state.userInfo.email)

const loading = ref(false)
const loadError = ref('')
const affCode = ref('')
const inviteCount = ref(0)
const totalRewardRmb = ref(0)
const totalRewardQuota = ref(0)
const rewards = ref([])

const copied = ref(false)
let copyTimer = null

async function fetchInviteInfo() {
  if (!userEmail.value) {
    loadError.value = '请先登录后再查看邀请信息'
    return
  }
  loading.value = true
  loadError.value = ''
  try {
    const resp = await getInviteInfo(userEmail.value)
    const data = resp && resp.data ? resp.data : {}
    affCode.value = data.aff_code || ''
    inviteCount.value = Number(data.invite_count || 0)
    totalRewardRmb.value = Number(data.total_reward_rmb || 0)
    totalRewardQuota.value = Number(data.total_reward_quota || 0)
    rewards.value = Array.isArray(data.rewards) ? data.rewards : []
  } catch (e) {
    loadError.value = e.message || '查询失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function buildInviteLink() {
  if (!affCode.value) return ''
  const origin = window.location.origin
  return `${origin}/register?aff=${encodeURIComponent(affCode.value)}`
}

function copyAffCode() {
  const link = buildInviteLink()
  if (!link) return
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      copied.value = true
      clearTimeout(copyTimer)
      copyTimer = setTimeout(() => { copied.value = false }, 1500)
    }).catch(() => fallbackCopy(link))
  } else {
    fallbackCopy(link)
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 1500)
  } finally {
    document.body.removeChild(ta)
  }
}

onMounted(() => {
  if (userStore.state.isLoggedIn) {
    fetchInviteInfo()
  } else {
    loadError.value = '请先登录后再查看邀请信息'
  }
})
</script>

<style scoped>
.invite-page {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 60px;
  position: relative;
}

.invite-header {
  text-align: center;
  margin-bottom: 36px;
}

.page-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: var(--gradient-text, linear-gradient(135deg, #38bdf8, #a78bfa));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--text-secondary, #6b7280);
  font-size: 1.05rem;
}

.invite-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 800px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  padding: 28px;
  background: var(--bg-card, #FFFFFF);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);
  letter-spacing: 0.04em;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: var(--text-primary, #111827);
}

.stat-value .currency {
  font-size: 1.2rem;
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

.stat-value .amount {
  font-family: var(--font-display, serif);
  font-size: 2rem;
  font-weight: 600;
  color: var(--accent-cyan, #38bdf8);
  letter-spacing: -0.01em;
}

.stat-value .unit {
  font-size: 1rem;
  color: var(--text-secondary, #6b7280);
  margin-left: 4px;
}

.stat-hint {
  font-size: 0.78rem;
  color: var(--text-muted, #9ca3af);
}

.stat-code {
  background:
    linear-gradient(var(--bg-card, #FFFFFF), var(--bg-card, #FFFFFF)) padding-box,
    linear-gradient(135deg, #38bdf8, #a855f7) border-box;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.stat-code::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.12), transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.12), transparent 55%);
  pointer-events: none;
}

.stat-code > * {
  position: relative;
  z-index: 1;
}

.code-value {
  font-family: 'Courier New', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary, #111827);
  background: var(--gradient-accent, linear-gradient(135deg, #38bdf8, #a78bfa));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.code-text {
  font-family: inherit;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border, #e5e7eb);
  background: var(--bg-card, #FFFFFF);
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: var(--transition, all 0.2s);
  margin-left: 6px;
}

.copy-btn:hover {
  border-color: var(--accent-cyan, #38bdf8);
  color: var(--accent-cyan, #38bdf8);
}

.card-header {
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.rewards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0;
}

.rewards-count {
  font-size: 0.85rem;
  color: var(--text-secondary, #6b7280);
}

.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-list li {
  position: relative;
  padding-left: 22px;
  color: var(--text-primary, #111827);
  font-size: 0.95rem;
  line-height: 1.6;
}

.rule-list li::before {
  content: '✦';
  position: absolute;
  left: 0;
  top: 0;
  color: #a855f7;
  font-size: 1rem;
  line-height: 1.6;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rewards-row {
  display: grid;
  grid-template-columns: 1.4fr 1.6fr 1fr 1fr;
  gap: 12px;
  padding: 14px 8px;
  border-bottom: 1px solid var(--border, #e5e7eb);
  align-items: center;
  font-size: 0.95rem;
  color: var(--text-primary, #111827);
}

.rewards-row:last-child {
  border-bottom: none;
}

.rewards-row-head {
  font-size: 0.78rem;
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: transparent;
  padding: 6px 8px 10px;
}

.col-invitee {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-recharge,
.col-reward {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.col-reward {
  color: #22c55e;
  font-weight: 600;
}

.rewards-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  gap: 8px;
  color: var(--text-secondary, #6b7280);
  font-size: 0.95rem;
  text-align: center;
}

.rewards-empty-icon {
  font-size: 2.2rem;
  opacity: 0.6;
}

.rewards-empty-sub {
  font-size: 0.85rem;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}

.error-card .card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-md, 10px);
  font-size: 0.95rem;
  color: #ef4444;
}

.btn {
  padding: 10px 22px;
  border-radius: var(--radius-md, 10px);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: var(--transition, all 0.2s);
}

.btn-primary {
  background: var(--gradient-accent, linear-gradient(135deg, #38bdf8, #a78bfa));
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(56, 189, 248, 0.35);
}
</style>