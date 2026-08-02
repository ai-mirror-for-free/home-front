<template>
  <main class="models-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:0;right:0;pointer-events:none;"></div>

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <span class="tag tag-purple">模型广场</span>
        <h1 class="page-title">AI 模型广场 - Claude/Gemini/ChatGPT 全系模型</h1>
        <p class="page-desc">汇聚全球顶级 AI 模型，提供 Claude 镜像与 API 套餐服务，专注 Claude 全系大模型，稳定访问、按需付费。</p>
      </div>

      <!-- Series Filters -->
      <div class="filters">
        <button v-for="series in modelSeries" :key="series.id"
          class="filter-btn" :class="{ active: activeSeries === series.id }"
          @click="activeSeries = series.id">
          <img v-if="series.icon.includes('/')" :src="series.icon" :alt="series.label" class="series-icon-img" />
          <span v-else class="series-icon">{{ series.icon }}</span>
          {{ series.label }}
        </button>
      </div>

      <!-- Models Grid -->
      <div v-if="loading" class="models-grid loading-grid">
        <div v-for="i in 6" :key="i" class="model-card card loading-card">
          <div class="loading-placeholder"></div>
        </div>
      </div>
      <div v-else-if="filteredModels.length === 0" class="empty-state">
        <p>暂无可用模型</p>
      </div>
      <div v-else class="models-grid">
        <div v-for="m in filteredModels" :key="m.id" class="model-card card">
          <div class="mc-header">
            <div class="mc-avatar">
              <img :src="getModelIcon(m.series)" :alt="m.provider" class="model-icon" />
            </div>
            <div class="mc-info">
              <span class="mc-provider">{{ m.provider }}</span>
              <h3 class="mc-name">{{ m.name }}</h3>
            </div>
            <span class="tag tag-sm" :class="m.tagClass">{{ m.tag }}</span>
          </div>

          <p class="mc-desc">{{ m.desc }}</p>

          <div v-if="m.caps.length" class="mc-caps">
            <span v-for="c in m.caps.slice(0, 4)" :key="c" class="cap-chip">{{ c }}</span>
          </div>
        </div>
      </div>

      <!-- Subscribe CTA -->
      <div class="subscribe-cta">
        <div class="cta-content">
          <h2>解锁全部模型</h2>
          <p>前往淘宝或闲鱼购买订阅套餐，获取更多模型访问权限</p>
          <div class="cta-buttons">
            <a href="https://e.tb.cn/h.8UyAjmuZLZEnWiZ?tk=gkWigxdsfMo" target="_blank" class="btn btn-primary">前往淘宝订阅</a>
            <a href="https://m.tb.cn/h.8UBxavO?tk=BrifgxWK8rz" target="_blank" class="btn btn-outline">前往闲鱼订阅</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const modelSeries = [
  { id: 'all', label: '全部', icon: '🌐' },
  { id: 'gemini', label: 'Gemini', icon: '/icon/gemini-color.svg' },
  { id: 'openai', label: 'OpenAI', icon: '/icon/openai.svg' },
  { id: 'anthropic', label: 'Anthropic', icon: '/icon/claude-color.svg' },
]

const activeSeries = ref('all')
const allModels = ref([])
const loading = ref(true)

// 从模型名称中提取版本号用于排序
const extractVersion = (name) => {
  const match = name.match(/-(\d+(?:\.\d+)?)/)
  if (match) {
    const parts = match[1].split('.').map(Number)
    return parts[0] * 1000 + (parts[1] || 0)
  }
  return 0
}

// 获取模型所属系列
const getModelSeries = (modelName) => {
  const lowerName = modelName.toLowerCase()
  if (lowerName.includes('gemini')) return 'gemini'
  if (lowerName.includes('grok') || lowerName.startsWith('x-ai')) return 'x-ai'
  if (lowerName.includes('gpt') || lowerName.startsWith('openai')) return 'openai'
  if (lowerName.includes('claude') || lowerName.startsWith('anthropic')) return 'anthropic'
  return 'other'
}

// 获取模型标签
const getModelTag = (modelName, modelData) => {
  if (modelData?.tags) {
    if (modelData.tags.toLowerCase().includes('reasoning') && modelData.model_ratio >= 2) return '旗舰'
    if (modelData.tags.toLowerCase().includes('vision')) return '多模态'
  }
  const lowerName = modelName.toLowerCase()
  if (lowerName.includes('nano') || lowerName.includes('lite')) return '轻量'
  if (lowerName.includes('flash')) return '快速'
  if (lowerName.includes('opus') || lowerName.match(/gpt-?\d+\.?\d*$/)) return '旗舰'
  return '标准'
}

// 获取模型标签样式
const getModelTagClass = (tag) => {
  const classMap = {
    '旗舰': 'tag-cyan',
    '轻量': 'tag-green',
    '快速': 'tag-orange',
    '最新': 'tag-cyan',
    '标准': 'tag-purple',
    '多模态': 'tag-cyan'
  }
  return classMap[tag] || 'tag-purple'
}

// 生成描述文本
const getModelDesc = (modelName, modelData) => {
  if (modelData?.description) return modelData.description
  const series = getModelSeries(modelName)
  const seriesNames = { gemini: 'Google', 'x-ai': 'xAI', openai: 'OpenAI', anthropic: 'Anthropic' }
  return `${seriesNames[series] || 'Unknown'} 提供的 AI 模型`
}

// 生成能力标签
const getModelCaps = (modelData) => {
  if (!modelData?.tags) return []
  return modelData.tags.split(',').map(t => t.trim()).filter(Boolean)
}

// 获取模型图标
const getModelIcon = (series) => {
  const icons = {
    'gemini': '/icon/gemini-color.svg',
    'x-ai': '/icon/grok.svg',
    'openai': '/icon/openai.svg',
    'anthropic': '/icon/claude-color.svg'
  }
  return icons[series] || '/icon/grok.svg'
}

// 获取模型渐变
const getModelGradient = (series) => {
  const gradients = {
    gemini: '#4285f4',
    'x-ai': '#1A1A1A',
    openai: '#10a37f',
    anthropic: '#B8743E',
    other: '#6b7280'
  }
  return gradients[series] || gradients.other
}

// 获取模型
async function fetchModels() {
  try {
    loading.value = true
    const response = await fetch('/api/pricing')
    if (response.ok) {
      const data = await response.json()
      if (data?.data) {
        allModels.value = data.data.map(item => {
          const name = item.model_name.includes('/') ? item.model_name.split('/')[1] : item.model_name
          const series = getModelSeries(item.model_name)
          // gemini系列明确设置供应商为Google
          const provider = series === 'gemini' ? 'Google' : (item.model_name.includes('/') ? item.model_name.split('/')[0] : 'Unknown')
          return {
            id: item.model_name,
            provider: provider,
            name: name,
            fullName: item.model_name,
            emoji: '🤖',
            gradient: getModelGradient(series),
            tag: getModelTag(name, item),
            tagClass: getModelTagClass(getModelTag(name, item)),
            desc: getModelDesc(name, item),
            caps: getModelCaps(item),
            series: series
          }
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch models:', error)
  } finally {
    loading.value = false
  }
}

const filteredModels = computed(() => {
  let models = activeSeries.value === 'all' ? allModels.value : allModels.value.filter(m => m.series === activeSeries.value)
  return [...models].sort((a, b) => extractVersion(b.name) - extractVersion(a.name))
})

onMounted(() => {
  fetchModels()
})
</script>

<style scoped>
.models-page {
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
}
.page-header {
  text-align: center;
  padding: 80px 32px 64px;
  background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 56px;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  margin: 16px 0 16px;
  letter-spacing: -0.02em;
}
.page-desc { color: var(--color-text-muted); font-size: 1.05rem; max-width: 600px; margin: 0 auto; line-height: 1.8; }

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
  justify-content: center;
}
.filter-btn {
  padding: 12px 24px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
  display: flex;
  align-items: center;
  gap: 8px;
}
.series-icon { font-size: 18px; }
.series-icon-img { width: 18px; height: 18px; object-fit: contain; }
.filter-btn:hover { color: var(--text-primary); border-color: var(--color-text-primary); background: var(--color-bg-secondary); }
.filter-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }

.models-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.model-card { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.mc-header { display: flex; align-items: center; gap: 12px; }
.mc-avatar {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; flex-shrink: 0;
  overflow: hidden;
}
.model-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.mc-info { flex: 1; min-width: 0; }
.mc-provider { font-size: 11px; color: var(--text-muted); display: block; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
.mc-name { font-family: var(--font-display); font-size: 1.15rem; font-weight: 500; word-break: break-all; margin: 0; color: var(--color-text-primary); }
.tag-sm { font-size: 10px; padding: 4px 10px; flex-shrink: 0; }
.tag-orange { color: #B87A4B; border-color: rgba(184,122,75,0.3); background: rgba(184,122,75,0.06); }
.tag-yellow { color: #B89A4B; border-color: rgba(184,154,75,0.3); background: rgba(184,154,75,0.06); }
.mc-desc { color: var(--color-text-secondary); font-size: 0.93rem; line-height: 1.7; flex: 1; }
.mc-caps { display: flex; flex-wrap: wrap; gap: 6px; }
.cap-chip {
  padding: 4px 10px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

/* Subscribe CTA */
.subscribe-cta {
  margin-top: 80px;
  padding: 56px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  text-align: center;
}
.cta-content h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 12px;
}
.cta-content p {
  color: var(--color-text-muted);
  font-size: 1.05rem;
  margin-bottom: 28px;
}
.cta-buttons {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.loading-grid { grid-template-columns: repeat(3, 1fr); }
.loading-card { min-height: 180px; }
.loading-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #F0EDE7 25%, #F8F6F3 50%, #F0EDE7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
  font-size: 16px;
}

@media (max-width: 1024px) { .models-grid { grid-template-columns: repeat(2, 1fr); } .loading-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .models-grid { grid-template-columns: 1fr; } .loading-grid { grid-template-columns: 1fr; } }
</style>
