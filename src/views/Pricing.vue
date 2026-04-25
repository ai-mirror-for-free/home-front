<template>
  <main class="pricing-page">
    <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%);pointer-events:none;"></div>

    <div class="container">
      <div class="page-header">
        <span class="tag tag-cyan">灵活定价</span>
        <h1 class="page-title">选择适合你的方案</h1>
        <p class="page-desc">简单直接的订阅方案，前往淘宝购买即可解锁更多模型访问权限。</p>
      </div>

      <!-- Plans Grid -->
      <div class="plans-grid">
        <div v-for="plan in plans" :key="plan.id"
          class="plan-card"
          :class="{ popular: plan.popular }">

          <div v-if="plan.popular" class="popular-badge">
            <span>⭐ 最受欢迎</span>
          </div>

          <div class="plan-header">
            <div class="plan-icon" :style="{ background: plan.iconBg }">{{ plan.icon }}</div>
            <div>
              <h3 class="plan-name">{{ plan.name }}</h3>
              <p class="plan-subtitle">{{ plan.subtitle }}</p>
            </div>
          </div>

          <div class="plan-price">
            <span class="price-currency">¥</span>
            <span class="price-amount">{{ plan.price }}</span>
            <span class="price-period">/天</span>
          </div>

          <a :href="plan.taobaoUrl" target="_blank" class="plan-btn btn" :class="plan.popular ? 'btn-primary' : 'btn-outline'">
            前往淘宝购买
          </a>

          <div class="plan-divider"></div>

          <ul class="plan-features">
            <li v-for="f in plan.features" :key="f.text" class="plan-feature" :class="{ disabled: !f.included }">
              <svg v-if="f.included" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="check-icon"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="x-icon"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>{{ f.text }}</span>
            </li>
          </ul>

          <!-- Available Models -->
          <div class="models-section">
            <h4 class="models-title">可用模型</h4>
            <div class="models-list">
              <span v-for="model in plan.models" :key="model" class="model-chip">{{ formatModelName(model) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Note about pricing -->
      <div class="pricing-note">
        <p>具体套餐价格和权益请以淘宝店铺实际发布为准</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const defaultTaobaoUrl = 'https://e.tb.cn/h.is8ENECRT7auWfa?tk=1stT58rRcnx'

const plans = ref([
  {
    id: 'free', name: '基础版', subtitle: '适合轻度使用', icon: '🌱', iconBg: 'rgba(52,211,153,0.15)',
    price: '30',
    taobaoUrl: defaultTaobaoUrl,
    popular: false,
    features: [
      { text: '每日 20 次免费对话', included: true },
      { text: '基础模型访问权限', included: true },
      { text: '社区技术支持', included: true },
      { text: '高级模型访问权限', included: false },
      { text: '优先响应速度', included: false },
    ],
    models: []
  },
  {
    id: 'pro', name: '专业版', subtitle: '适合个人用户和创作者', icon: '⚡', iconBg: 'rgba(56,189,248,0.15)',
    price: '68',
    taobaoUrl: defaultTaobaoUrl,
    popular: true,
    features: [
      { text: '无限次对话', included: true },
      { text: '更多模型访问权限', included: true },
      { text: '优先响应速度', included: true },
      { text: '技术支持', included: true },
    ],
    models: []
  },
  {
    id: 'team', name: '至尊版', subtitle: '适合重度用户', icon: '👥', iconBg: 'rgba(167,139,250,0.15)',
    price: '198',
    taobaoUrl: defaultTaobaoUrl,
    popular: false,
    features: [
      { text: '全部模型访问权限', included: true },
      { text: '最大额度支持', included: true },
      { text: '极速响应速度', included: true },
      { text: '专属技术支持', included: true },
    ],
    models: []
  },
])

// 格式化模型名称
function formatModelName(model) {
  // 将 anthropic/claude-haiku-4.5 转换为 claude-haiku-4.5
  // 将 x-ai/grok-4-fast 转换为 grok-4-fast
  if (model.includes('/')) {
    return model.split('/')[1]
  }
  return model
}

// 获取淘宝链接
async function fetchTaobaoUrl() {
  try {
    const response = await fetch('/api/text/tbUrl')
    if (response.ok) {
      const data = await response.json()
      if (data && data.url) {
        plans.value.forEach(plan => {
          plan.taobaoUrl = data.url
        })
      }
    }
  } catch (error) {
    console.log('获取淘宝链接失败，使用默认链接')
  }
}

// 获取可用模型列表
async function fetchAvailableModels() {
  try {
    const response = await fetch('/api/available-models')
    if (response.ok) {
      const data = await response.json()
      updatePlanModels(data)
    }
  } catch (error) {
    console.log('获取可用模型列表失败，使用默认配置')
  }
}

// 更新套餐模型
function updatePlanModels(data) {
  if (!data || typeof data !== 'object') return

  // 新格式: { default: { modele_list: [...], price: 1 }, vip: {...}, svip: {...} }
  // default -> 基础版, vip -> 专业版, svip -> 至尊版
  if (data.default && plans.value[0]) {
    plans.value[0].models = data.default.modele_list || []
    plans.value[0].price = data.default.price || plans.value[0].price
  }
  if (data.vip && plans.value[1]) {
    plans.value[1].models = data.vip.modele_list || []
    plans.value[1].price = data.vip.price || plans.value[1].price
  }
  if (data.svip && plans.value[2]) {
    plans.value[2].models = data.svip.modele_list || []
    plans.value[2].price = data.svip.price || plans.value[2].price
  }
}

onMounted(() => {
  fetchTaobaoUrl()
  fetchAvailableModels()
})
</script>

<style scoped>
.pricing-page {
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
}
.page-header { text-align: center; padding: 60px 0 56px; }
.page-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  margin: 16px 0 12px;
  letter-spacing: -0.02em;
}
.page-desc { color: var(--text-secondary); font-size: 16px; max-width: 480px; margin: 0 auto; }

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 60px;
  align-items: start;
}

.plan-card {
  background: var(--gradient-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 32px;
  position: relative;
  transition: var(--transition);
}
.plan-card:hover { border-color: var(--border-glow); box-shadow: 0 8px 40px rgba(56,189,248,0.06); }
.plan-card.popular {
  border-color: rgba(99,102,241,0.4);
  background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(12,18,32,0.95) 100%);
  box-shadow: 0 0 40px rgba(99,102,241,0.15);
}
.popular-badge {
  position: absolute;
  top: -14px; left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-accent);
  color: #fff;
  padding: 6px 20px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-display);
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(99,102,241,0.4);
}

.plan-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.plan-icon { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 22px; }
.plan-name { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
.plan-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
.price-currency { font-size: 22px; font-weight: 700; color: var(--text-secondary); align-self: flex-start; margin-top: 8px; }
.price-amount { font-family: var(--font-display); font-size: 52px; font-weight: 800; line-height: 1; }
.price-period { font-size: 14px; color: var(--text-muted); }

.plan-btn { width: 100%; justify-content: center; margin-top: 24px; margin-bottom: 24px; text-decoration: none; }
.plan-divider { height: 1px; background: var(--border); margin-bottom: 24px; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.plan-feature { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.plan-feature.disabled { color: var(--text-muted); }
.check-icon { color: var(--accent-green); flex-shrink: 0; }
.x-icon { color: var(--text-muted); flex-shrink: 0; }

/* Models section */
.models-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}
.models-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.models-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.model-chip {
  padding: 4px 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: monospace;
}

/* Pricing note */
.pricing-note {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 13px;
}

@media (max-width: 900px) {
  .plans-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto 60px; }
}
</style>
