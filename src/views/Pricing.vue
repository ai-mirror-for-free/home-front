<template>
  <main class="pricing-page">
    <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%);pointer-events:none;"></div>

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
      { text: '免费5w额度', included: true },
      { text: '基础模型访问权限', included: true },
      { text: '社区技术支持', included: false },
      { text: '优先响应速度', included: false },
    ],
    models: []
  },
  {
    id: 'pro', name: 'VIP', subtitle: '适合个人用户和创作者', icon: '⚡', iconBg: 'rgba(56,189,248,0.15)',
    price: '68',
    taobaoUrl: defaultTaobaoUrl,
    popular: true,
    features: [
      { text: '按量付费对话', included: true },
      { text: '高级模型访问权限', included: true },
      { text: '技术支持', included: true },
      { text: '优先响应速度', included: true },
    ],
    models: []
  },
  {
    id: 'team', name: 'SVIP', subtitle: '适合重度用户', icon: '👑', iconBg: 'rgba(167,139,250,0.15)',
    price: '198',
    taobaoUrl: defaultTaobaoUrl,
    popular: false,
    features: [
      { text: '按量付费对话', included: true },
      { text: '最强模型访问权限', included: true },
      { text: '专属技术支持', included: true },
      { text: '极速响应速度', included: true },
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
.page-header {
  text-align: center;
  padding: 60px 32px;
  background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 80px;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  margin: 16px 0 16px;
  letter-spacing: -0.02em;
}
.page-desc { color: var(--color-text-muted); font-size: 1.05rem; max-width: 540px; margin: 0 auto; line-height: 1.8; }

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 60px;
  align-items: start;
}

.plan-card {
  background: #FFFFFF;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: 36px;
  position: relative;
  transition: all var(--transition);
  box-shadow: var(--shadow-soft);
}
.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
  border-color: var(--color-accent-warm);
}
.plan-card.popular {
  border: 1.5px solid var(--color-primary);
  background: #FFFFFF;
  box-shadow: var(--shadow-medium);
}
.popular-badge {
  position: absolute;
  top: -14px; left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: #fff;
  padding: 6px 22px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-body);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  white-space: nowrap;
}

.plan-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.plan-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; background: var(--color-bg-accent); }
.plan-name { font-family: var(--font-display); font-size: 1.4rem; font-weight: 500; color: var(--color-text-primary); margin: 0; }
.plan-subtitle { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 4px; }

.plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
.price-currency { font-size: 22px; font-weight: 500; color: var(--color-text-secondary); align-self: flex-start; margin-top: 8px; font-family: var(--font-display); }
.price-amount { font-family: var(--font-display); font-size: 3.2rem; font-weight: 500; line-height: 1; color: var(--color-text-primary); }
.price-period { font-size: 14px; color: var(--color-text-muted); }
.price-free { font-family: var(--font-display); font-size: 2.4rem; font-weight: 500; color: var(--accent-green); }

.plan-btn { width: 100%; justify-content: center; margin-top: 24px; margin-bottom: 24px; text-decoration: none; }
.plan-divider { height: 1px; background: var(--color-border-light); margin-bottom: 24px; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.plan-feature { display: flex; align-items: center; gap: 10px; font-size: 0.93rem; color: var(--color-text-primary); }
.plan-feature.disabled { color: var(--color-text-muted); }
.check-icon { color: var(--color-accent); flex-shrink: 0; }
.x-icon { color: var(--color-text-muted); flex-shrink: 0; opacity: 0.5; }

/* Models section */
.models-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}
.models-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
.models-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.model-chip {
  padding: 4px 10px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 11px;
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}

/* Pricing note */
.pricing-note {
  text-align: center;
  padding: 20px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-style: italic;
  font-family: var(--font-display);
}

@media (max-width: 900px) {
  .plans-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto 60px; }
}
</style>
