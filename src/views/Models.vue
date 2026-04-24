<template>
  <main class="models-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%);top:0;right:0;pointer-events:none;"></div>

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <span class="tag tag-purple">四大系列</span>
        <h1 class="page-title">AI 模型广场</h1>
        <p class="page-desc">汇聚全球顶级 AI 模型，支持 Gemini、x-ai、OpenAI、Anthropic 四大系列，满足你的所有使用场景。</p>
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
      <div class="models-grid">
        <div v-for="m in filteredModels" :key="m.id" class="model-card card">
          <div class="mc-header">
            <div class="mc-avatar" :style="{ background: m.gradient }">
              <img :src="getModelIcon(m.series)" :alt="m.provider" class="model-icon" />
            </div>
            <div class="mc-info">
              <span class="mc-provider">{{ m.provider }}</span>
              <h3 class="mc-name">{{ m.name }}</h3>
            </div>
            <span class="tag tag-sm" :class="m.tagClass">{{ m.tag }}</span>
          </div>

          <p class="mc-desc">{{ m.desc }}</p>

          <div class="mc-caps">
            <span v-for="c in m.caps" :key="c" class="cap-chip">{{ c }}</span>
          </div>
        </div>
      </div>

      <!-- Subscribe CTA -->
      <div class="subscribe-cta">
        <div class="cta-content">
          <h2>解锁全部模型</h2>
          <p>前往淘宝购买订阅套餐，获取更多模型访问权限</p>
          <a href="https://e.tb.cn/h.is8ENECRT7auWfa?tk=1stT58rRcnx" target="_blank" class="btn btn-primary">前往淘宝订阅</a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const modelSeries = [
  { id: 'all', label: '全部', icon: '🌐' },
  { id: 'gemini', label: 'Gemini', icon: '/icon/gemini-color.svg' },
  { id: 'x-ai', label: 'x-ai', icon: '/icon/grok.svg' },
  { id: 'openai', label: 'OpenAI', icon: '/icon/openai.svg' },
  { id: 'anthropic', label: 'Anthropic', icon: '/icon/claude-color.svg' },
]

const activeSeries = ref('all')

const allModels = [
  // Gemini 系列
  { 
    id: 'gemini-3.1-pro', 
    provider: 'Google', 
    name: 'gemini-3.1-pro', 
    emoji: '💫', 
    gradient: 'linear-gradient(135deg,#4285f4,#1a56db)', 
    tag: '旗舰', 
    tagClass: 'tag-cyan', 
    desc: '谷歌最新旗舰模型，100万token超长上下文，多模态能力出众。', 
    caps: ['超长上下文', '多模态', '多语言'], 
    series: 'gemini' 
  },
  { 
    id: 'gemini-3.1-flash-lite', 
    provider: 'Google', 
    name: 'gemini-3.1-flash-lite', 
    emoji: '⚡', 
    gradient: 'linear-gradient(135deg,#1967d2,#0d47a1)', 
    tag: '轻量', 
    tagClass: 'tag-green', 
    desc: 'Gemini 系列轻量版本，速度极快，成本极低，适合高频调用。', 
    caps: ['快速', '轻量', '高性价比'], 
    series: 'gemini' 
  },
  { 
    id: 'gemini-3-flash', 
    provider: 'Google', 
    name: 'gemini-3-flash', 
    emoji: '🚀', 
    gradient: 'linear-gradient(135deg,#2563eb,#1e40af)', 
    tag: '最新', 
    tagClass: 'tag-cyan', 
    desc: '谷歌最新一代模型，速度更快，能力更强，性价比极佳。', 
    caps: ['快速', '多模态', '代码'], 
    series: 'gemini', 
    isNew: true 
  },

  // x-ai 系列
  { 
    id: 'grok-4.20', 
    provider: 'x-ai', 
    name: 'grok-4.20', 
    emoji: '🔥', 
    gradient: 'linear-gradient(135deg,#f97316,#dc2626)', 
    tag: '旗舰', 
    tagClass: 'tag-orange', 
    desc: 'x-ai 最新旗舰模型，深度推理能力卓越，实时信息获取能力强。', 
    caps: ['深度推理', '实时信息', '代码'], 
    series: 'x-ai',
    isHot: true 
  },
  { 
    id: 'grok-4.1-fast', 
    provider: 'x-ai', 
    name: 'grok-4.1-fast', 
    emoji: '⚡', 
    gradient: 'linear-gradient(135deg,#ea580c,#9a3412)', 
    tag: '快速', 
    tagClass: 'tag-orange', 
    desc: 'x-ai 快速响应模型，延迟低，适合实时对话和交互场景。', 
    caps: ['快速响应', '低延迟', '对话'], 
    series: 'x-ai' 
  },
  { 
    id: 'grok-4-fast', 
    provider: 'x-ai', 
    name: 'grok-4-fast', 
    emoji: '💨', 
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', 
    tag: '极速', 
    tagClass: 'tag-yellow', 
    desc: 'x-ai 极速版本，极高吞吐量，适合批量处理和大规模调用。', 
    caps: ['极速', '高吞吐', '批处理'], 
    series: 'x-ai' 
  },

  // OpenAI 系列
  { 
    id: 'gpt-5.4', 
    provider: 'OpenAI', 
    name: 'gpt-5.4', 
    emoji: '🤖', 
    gradient: 'linear-gradient(135deg,#10a37f,#1a7f64)', 
    tag: '旗舰', 
    tagClass: 'tag-green', 
    desc: 'OpenAI 最强旗舰，综合能力第一梯队，支持文字图像音频。', 
    caps: ['文本', '图像', '语音', '代码'], 
    series: 'openai',
    isHot: true 
  },
  { 
    id: 'gpt-5.4-mini', 
    provider: 'OpenAI', 
    name: 'gpt-5.4-mini', 
    emoji: '⚡', 
    gradient: 'linear-gradient(135deg,#059669,#047857)', 
    tag: '轻量', 
    tagClass: 'tag-green', 
    desc: 'GPT-5.4 的精简版，速度快，价格低，适合高频调用场景。', 
    caps: ['快速', '轻量', '高性价比'], 
    series: 'openai' 
  },
  { 
    id: 'gpt-5.4-nano', 
    provider: 'OpenAI', 
    name: 'gpt-5.4-nano', 
    emoji: '📱', 
    gradient: 'linear-gradient(135deg,#34d399,#10b981)', 
    tag: '超轻', 
    tagClass: 'tag-green', 
    desc: 'OpenAI 超轻量模型，极低成本，极高速度，适合简单任务。', 
    caps: ['超轻', '极速', '低成本'], 
    series: 'openai',
    isNew: true 
  },

  // Anthropic 系列
  { 
    id: 'claude-opus-4.6', 
    provider: 'Anthropic', 
    name: 'claude-opus-4.6', 
    emoji: '🧮', 
    gradient: 'linear-gradient(135deg,#2563eb,#1e40af)', 
    tag: '旗舰', 
    tagClass: 'tag-cyan', 
    desc: 'Anthropic 最强旗舰，深度推理能力超强，复杂任务处理首选。', 
    caps: ['深度推理', '数学', '科学', '代码'], 
    series: 'anthropic' 
  },
  { 
    id: 'claude-opus-4.7', 
    provider: 'Anthropic', 
    name: 'claude-opus-4.7', 
    emoji: '🧮', 
    gradient: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)', 
    tag: '旗舰', 
    tagClass: 'tag-cyan', 
    desc: 'Anthropic 最新旗舰模型，推理能力再升级，复杂问题解决更加精准。', 
    caps: ['深度推理', '数学', '科学', '代码', '最新'], 
    series: 'anthropic',
    isNew: true 
  },
  { 
    id: 'claude-sonnet-4.6', 
    provider: 'Anthropic', 
    name: 'claude-sonnet-4.6', 
    emoji: '🧠', 
    gradient: 'linear-gradient(135deg,#d97706,#92400e)', 
    tag: '均衡', 
    tagClass: 'tag-purple', 
    desc: 'Anthropic 均衡旗舰，深度推理卓越，长文档处理能力出众。', 
    caps: ['推理', '文档', '创作', '代码'], 
    series: 'anthropic' 
  },
  { 
    id: 'claude-haiku-4.5', 
    provider: 'Anthropic', 
    name: 'claude-haiku-4.5', 
    emoji: '📝', 
    gradient: 'linear-gradient(135deg,#b45309,#78350f)', 
    tag: '快速', 
    tagClass: 'tag-green', 
    desc: 'Anthropic 系列最快最轻量模型，低成本高效率，适合批量处理。', 
    caps: ['快速', '轻量', '文本'], 
    series: 'anthropic' 
  },
]

const filteredModels = computed(() => {
  if (activeSeries.value === 'all') return allModels
  return allModels.filter(m => m.series === activeSeries.value)
})

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
  padding: 60px 0 48px;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  margin: 16px 0 12px;
  letter-spacing: -0.02em;
}
.page-desc { color: var(--text-secondary); font-size: 16px; max-width: 500px; margin: 0 auto; }

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
.filter-btn:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); }
.filter-btn.active { background: var(--gradient-accent); color: #fff; border-color: transparent; box-shadow: 0 0 20px rgba(99,102,241,0.3); }

.models-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.model-card { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.mc-header { display: flex; align-items: center; gap: 12px; }
.mc-avatar {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; flex-shrink: 0;
  overflow: hidden;
}
.model-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.mc-info { flex: 1; }
.mc-provider { font-size: 11px; color: var(--text-muted); display: block; }
.mc-name { font-family: var(--font-display); font-size: 14px; font-weight: 700; word-break: break-all; }
.tag-sm { font-size: 10px; padding: 3px 8px; flex-shrink: 0; }
.tag-orange {
  background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(220,38,38,0.2));
  color: #f97316;
  border: 1px solid rgba(249,115,22,0.3);
}
.tag-yellow {
  background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2));
  color: #f59e0b;
  border: 1px solid rgba(245,158,11,0.3);
}
.mc-desc { color: var(--text-secondary); font-size: 13px; line-height: 1.65; flex: 1; }
.mc-caps { display: flex; flex-wrap: wrap; gap: 6px; }
.cap-chip {
  padding: 4px 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

/* Subscribe CTA */
.subscribe-cta {
  margin-top: 60px;
  padding: 48px;
  background: var(--gradient-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  text-align: center;
}
.cta-content h2 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}
.cta-content p {
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) { .models-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .models-grid { grid-template-columns: 1fr; } }
</style>
