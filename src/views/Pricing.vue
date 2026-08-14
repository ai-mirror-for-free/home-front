<template>
  <main class="pricing-page">
    <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%);pointer-events:none;"></div>

    <div class="container">
      <div class="page-header">
        <span class="tag tag-cyan">灵活定价</span>
        <h1 class="page-title">选择适合你的方案</h1>
        <p class="page-desc">提供 Claude 镜像套餐与 API 套餐两种形式，按 Token 使用量计费，具体价格请前往淘宝店铺查看。</p>
      </div>

      <!-- Package Type Tabs -->
      <div class="package-tabs">
        <button
          v-for="t in packageTypes"
          :key="t.id"
          class="package-tab"
          :class="{ active: activePackageType === t.id }"
          @click="activePackageType = t.id"
        >
          <span class="package-tab-icon">{{ t.icon }}</span>
          <div class="package-tab-text">
            <span class="package-tab-name">{{ t.name }}</span>
            <span class="package-tab-desc">{{ t.desc }}</span>
          </div>
        </button>
      </div>

      <!-- Single VIP Plan -->
      <div class="plan-wrapper">
        <div class="plan-card popular">
          <div class="plan-header">
            <div class="plan-icon" :style="{ background: currentPlan.iconBg }">{{ currentPlan.icon }}</div>
            <div>
              <h3 class="plan-name">{{ currentPlan.name }}</h3>
              <p class="plan-subtitle">{{ currentPlan.subtitle }}</p>
            </div>
          </div>

          <a :href="currentPlan.taobaoUrl" target="_blank" class="plan-btn btn btn-primary">
            前往淘宝查看价格
          </a>
          <a :href="currentPlan.xianyuUrl" target="_blank" class="plan-btn btn btn-outline">
            前往闲鱼查看价格
          </a>

          <div class="plan-divider"></div>

          <ul class="plan-features">
            <li v-for="f in currentPlan.features" :key="f.text" class="plan-feature" :class="{ disabled: !f.included }">
              <svg v-if="f.included" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="check-icon"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="x-icon"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>{{ f.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Note about pricing -->
      <div class="pricing-note">
        <p>所有套餐按 Token 使用量计费，具体价格以淘宝店铺实际发布为准</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const defaultTaobaoUrl = 'https://e.tb.cn/h.8UyAjmuZLZEnWiZ?tk=gkWigxdsfMo'
const defaultXianyuUrl = 'https://m.tb.cn/h.8UBxavO?tk=BrifgxWK8rz'

const packageTypes = [
  { id: 'mirror', name: 'Claude 镜像套餐', icon: '🪞', desc: 'Web 端直接使用,适合个人与团队' },
  { id: 'api', name: 'API 套餐', icon: '🔌', desc: '按量计费,对接自有应用' },
]
const activePackageType = ref('mirror')

const mirrorPlan = ref({
  id: 'mirror-vip',
  name: 'VIP',
  subtitle: 'Claude 镜像 · 全功能',
  icon: '⚡',
  iconBg: 'rgba(56,189,248,0.15)',
  taobaoUrl: defaultTaobaoUrl,
  xianyuUrl: defaultXianyuUrl,
  features: [
    { text: '按 Token 使用量计费', included: true },
    { text: 'Claude 全系模型访问 (Opus / Sonnet / Haiku)', included: true },
    { text: 'Web 端直接对话，无需翻墙', included: true },
    { text: '按官方预估对话次数折算，等同 Claude Pro', included: true },
    { text: '无 5 小时额度限制', included: true },
    { text: '技术支持', included: true },
  ],
  models: [],
})

const apiPlan = ref({
  id: 'api-vip',
  name: 'VIP',
  subtitle: 'API · 全模型接口',
  icon: '⚡',
  iconBg: 'rgba(167,139,250,0.15)',
  taobaoUrl: defaultTaobaoUrl,
  xianyuUrl: defaultXianyuUrl,
  features: [
    { text: '按 Token 使用量计费', included: true },
    { text: 'Claude / Gemini / OpenAI 全系模型', included: true },
    { text: 'Chat 接口 + Image 接口 (Key 独立)', included: true },
    { text: '对接自有应用 / OpenWebUI等', included: true },
    { text: '按各厂商官方原价计费', included: true },
    { text: '高并发 + 技术支持', included: true },
  ],
  models: [],
})

const currentPlan = computed(() => activePackageType.value === 'mirror' ? mirrorPlan.value : apiPlan.value)

function formatModelName(model) {
  if (model.includes('/')) {
    return model.split('/')[1]
  }
  return model
}

async function fetchTaobaoUrl() {
  try {
    const response = await fetch('/api/text/tbUrl')
    if (response.ok) {
      const data = await response.json()
      if (data && data.url) {
        mirrorPlan.value.taobaoUrl = data.url
        apiPlan.value.taobaoUrl = data.url
      }
      if (data && data.xianyu_url) {
        mirrorPlan.value.xianyuUrl = data.xianyu_url
        apiPlan.value.xianyuUrl = data.xianyu_url
      }
    }
  } catch (error) {
    console.log('获取淘宝链接失败，使用默认链接')
  }
}

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

function updatePlanModels(data) {
  if (!data || typeof data !== 'object') return

  const tierKeys = ['default', 'vip', 'svip']
  const collected = []
  tierKeys.forEach((key) => {
    if (data[key] && Array.isArray(data[key].modele_list)) {
      collected.push(...data[key].modele_list)
    }
  })
  if (collected.length) {
    const unique = [...new Set(collected)]
    mirrorPlan.value.models = unique
    apiPlan.value.models = unique
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

.package-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}
.package-tab {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 28px;
  background: #FFFFFF;
  border: 1.5px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition);
  font-family: var(--font-body);
  text-align: left;
  min-width: 280px;
}
.package-tab:hover {
  border-color: var(--color-accent-warm);
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}
.package-tab.active {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, rgba(184,116,75,0.04) 0%, rgba(184,116,75,0.08) 100%);
  box-shadow: var(--shadow-medium);
}
.package-tab-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-accent);
  border-radius: 12px;
  flex-shrink: 0;
}
.package-tab-text { display: flex; flex-direction: column; gap: 2px; }
.package-tab-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
.package-tab-desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.plan-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
}

.plan-card {
  background: #FFFFFF;
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-xl);
  padding: 48px;
  position: relative;
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow-medium);
  transition: all var(--transition);
}
.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(139,115,85,0.15);
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

.plan-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.plan-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; background: var(--color-bg-accent); }
.plan-name { font-family: var(--font-display); font-size: 1.8rem; font-weight: 500; color: var(--color-text-primary); margin: 0; }
.plan-subtitle { font-size: 0.95rem; color: var(--color-text-muted); margin-top: 4px; }

.plan-btn {
  width: 100%;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 28px;
  text-decoration: none;
  padding: 16px;
  font-size: 1rem;
}

.plan-divider { height: 1px; background: var(--color-border-light); margin-bottom: 24px; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.plan-feature { display: flex; align-items: center; gap: 12px; font-size: 0.98rem; color: var(--color-text-primary); }
.plan-feature.disabled { color: var(--color-text-muted); }
.check-icon { color: var(--color-accent); flex-shrink: 0; }
.x-icon { color: var(--color-text-muted); flex-shrink: 0; opacity: 0.5; }

/* Models section */
.models-section {
  margin-top: 28px;
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
  padding: 5px 11px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 11px;
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}
.model-chip-muted {
  color: var(--color-text-muted);
  font-style: italic;
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
  .plan-card { max-width: 100%; padding: 36px 28px; }
  .package-tabs { flex-direction: column; align-items: stretch; }
  .package-tab { min-width: 0; }
}
</style>