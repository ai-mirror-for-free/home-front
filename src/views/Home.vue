<template>
  <main>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-content">
        <span class="hero-eyebrow">{{ currentAnnouncement.content || '全新发布 — xAI、Anthropic、Claude、Gemini、OpenAI 国际顶级模型现已上线' }}</span>
        <h1 class="hero-title">
          一座汇聚全球顶级<br/>
          <span class="hero-title-accent">AI 智能模型</span>的桥梁
        </h1>
        <p class="hero-subtitle">
          专注提供 <strong>Claude 镜像</strong>、<strong>Gemini 镜像</strong>、<strong>OpenAI 镜像</strong> 与 <strong>OpenAI API</strong> 服务。
          一个账号，畅享 GPT、Claude、Gemini、Grok 等数十款顶尖大模型。
          <strong>国内直连</strong>，无需翻墙，按需付费。
        </p>
        <div class="hero-cta">
          <RouterLink to="/login" class="btn btn-primary btn-lg">立即体验</RouterLink>
          <RouterLink to="/models" class="btn btn-outline btn-lg">查看所有模型</RouterLink>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">{{ modelCount }}</span>
            <span class="stat-label">AI 模型</span>
          </div>
          <span class="stat-divider"></span>
          <div class="stat">
            <span class="stat-num">99.9%</span>
            <span class="stat-label">服务可用性</span>
          </div>
          <span class="stat-divider"></span>
          <div class="stat">
            <span class="stat-num">24/7</span>
            <span class="stat-label">在线服务</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Models Showcase -->
    <section class="section" id="models">
      <div class="container">
        <div class="section-header">
          <span class="tag">模型广场</span>
          <h2>接入业界最强 AI 模型镜像</h2>
          <p>从文字创作到代码生成，从图像理解到多模态交互，所有顶级模型一键可达。</p>
        </div>

        <div class="models-grid">
          <div v-for="m in featuredModels" :key="m.id" class="model-card card">
            <div class="model-card-header">
              <div class="model-avatar" :style="{ background: m.solidBg }">
                <span>{{ m.emoji }}</span>
              </div>
              <div class="model-meta">
                <span class="model-provider">{{ m.provider }}</span>
                <h3 class="model-name">{{ m.name }}</h3>
              </div>
              <span class="tag" :class="m.tagClass">{{ m.tag }}</span>
            </div>
            <p class="model-desc">{{ m.desc }}</p>
            <div class="model-caps">
              <span v-for="c in m.caps" :key="c" class="cap-chip">{{ c }}</span>
            </div>
            <div class="model-footer">
              <span class="model-ctx">{{ m.ctx }}</span>
              <RouterLink to="/register" class="model-link">立即使用 →</RouterLink>
            </div>
          </div>
        </div>

        <div class="section-cta">
          <RouterLink to="/models" class="btn btn-outline btn-lg">查看全部 {{ modelCount }} 模型</RouterLink>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="section section-alt social-proof">
      <div class="container">
        <div class="testimonial">
          <p class="testimonial-quote">「一个 chat-keeper 账号，让我们团队把 Claude、Gemini、GPT 全部接入到 OpenWebUI，部署成本几乎为零，国内访问体验却有了质的飞跃。」</p>
          <p class="testimonial-author">— 研发负责人，<span class="testimonial-company">某 AI 创业团队</span></p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header">
          <span class="tag">功能特性</span>
          <h2>为什么选择 chat-keeper</h2>
          <p>为开发者与团队打造，稳定、透明、可控的 AI 模型访问体验。</p>
        </div>

        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card card">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="tag">应用场景</span>
          <h2>为不同角色提供专业支持</h2>
          <p>无论你是独立开发者、创意工作室还是企业团队，都能找到合适的使用方式。</p>
        </div>

        <div class="use-cases">
          <div class="use-case card">
            <div class="use-case-icon">💼</div>
            <div>
              <h3>独立开发者</h3>
              <p>通过统一 API 接入所有主流大模型，按量计费、无需管理多个账号，让产品快速具备 AI 能力。</p>
            </div>
          </div>
          <div class="use-case card">
            <div class="use-case-icon">🎨</div>
            <div>
              <h3>创意工作室</h3>
              <p>用 Claude 与 Gemini 完成脚本、文案与多语种内容生成，让 AI 辅助你完成从灵感到成品的全过程。</p>
            </div>
          </div>
          <div class="use-case card">
            <div class="use-case-icon">🏢</div>
            <div>
              <h3>企业团队</h3>
              <p>在国内直连的环境下为团队提供 OpenWebUI、API 接入与统一计费，让 AI 真正进入工作流。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Foundation -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="tag">技术基础</span>
          <h2>为稳定性而生的架构</h2>
          <p>多路由智能调度 + 国内直连通道，提供可靠、可追溯的 AI 模型服务。</p>
        </div>

        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">🔒</div>
            <h3>隐私安全保障</h3>
            <p>对话内容不用于训练，端到端加密传输，合规存储，保护每一次交流。</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">🌐</div>
            <h3>国内直连访问</h3>
            <p>无需 VPN，国内服务器直连，稳定可靠，随时随地访问顶尖境外模型。</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">⚙️</div>
            <h3>OpenWebUI 对接</h3>
            <p>无缝集成 OpenWebUI，保留熟悉的交互界面，底层换装顶级模型。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Pricing Preview -->
    <section class="section">
      <div class="container">
        <div class="cta-block">
          <h2>按需付费，灵活选择</h2>
          <p>从个人到企业，我们提供匹配每个场景的套餐方案。所有计划均包含免费额度，无隐藏收费。</p>
          <RouterLink to="/pricing" class="btn btn-primary btn-lg">查看定价方案</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const modelCount = ref('50+')

const announcements = ref([])
const currentAnnouncementIndex = ref(0)
const currentAnnouncement = ref({ content: '' })
let announcementTimer = null

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function fetchAnnouncements() {
  try {
    const response = await fetch('/api/v1/configs/banners')
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        announcements.value = data.sort((a, b) => b.timestamp - a.timestamp).map(item => ({
          id: item.id,
          type: item.type || 'info',
          content: `${formatTimestamp(item.timestamp)} ${item.content}`,
        }))
        if (announcements.value.length > 0) {
          currentAnnouncement.value = announcements.value[0]
        }
      }
    }
  } catch (error) {
    console.log('获取公告失败，使用默认内容')
  }
}

function startAnnouncementScroll() {
  if (announcements.value.length <= 1) return
  announcementTimer = setInterval(() => {
    currentAnnouncementIndex.value = (currentAnnouncementIndex.value + 1) % announcements.value.length
    currentAnnouncement.value = announcements.value[currentAnnouncementIndex.value]
  }, 5000)
}

function stopAnnouncementScroll() {
  if (announcementTimer) {
    clearInterval(announcementTimer)
    announcementTimer = null
  }
}

async function fetchModelCount() {
  try {
    const response = await fetch('/api/available-models')
    if (response.ok) {
      const data = await response.json()
      if (data && data.svip && data.svip.modele_list) {
        modelCount.value = data.svip.modele_list.length + '+'
      }
    }
  } catch (error) {
    console.log('获取模型数量失败，使用默认值')
  }
}

onMounted(() => {
  fetchModelCount()
  fetchAnnouncements().then(() => {
    startAnnouncementScroll()
  })
})

onUnmounted(() => {
  stopAnnouncementScroll()
})

const featuredModels = [
  {
    id: 1, provider: 'OpenAI', name: 'GPT-5.4',
    emoji: '🤖', solidBg: '#10a37f',
    tag: '多模态', tagClass: 'tag-green',
    desc: '最强大的多模态模型，支持文字、图像、语音理解与生成，处理复杂任务游刃有余。',
    caps: ['文本生成', '图像理解', '代码', '推理'],
    ctx: '128K 上下文'
  },
  {
    id: 2, provider: 'Anthropic', name: 'Claude Opus 4.7',
    emoji: '🧠', solidBg: '#B8743E',
    tag: '推理强', tagClass: 'tag-purple',
    desc: '专注于安全与深度推理，超长上下文处理能力卓越，适合文档分析与复杂逻辑任务。',
    caps: ['深度推理', '文档分析', '创作', '代码'],
    ctx: '200K 上下文'
  },
  {
    id: 3, provider: 'Google', name: 'Gemini 3.1 Pro',
    emoji: '💫', solidBg: '#4285f4',
    tag: '超长', tagClass: 'tag-cyan',
    desc: '谷歌最新旗舰模型，拥有超长上下文窗口，多语言能力出色，擅长数据分析与科学推理。',
    caps: ['超长上下文', '多语言', '数据分析', '代码'],
    ctx: '1M 上下文'
  },
  {
    id: 4, provider: 'xAI', name: 'Grok 4.20',
    emoji: '🔥', solidBg: '#1A1A1A',
    tag: '旗舰', tagClass: 'tag-orange',
    desc: 'xAI 最新旗舰模型，深度推理能力卓越，实时信息获取能力强。',
    caps: ['深度推理', '实时信息', '代码'],
    ctx: '128K 上下文'
  },
  {
    id: 6, provider: 'Anthropic', name: 'Claude Sonnet 4.6',
    emoji: '📝', solidBg: '#9B6A3F',
    tag: '均衡', tagClass: 'tag-green',
    desc: 'Anthropic 均衡旗舰，深度推理卓越，长文档处理能力出众。',
    caps: ['推理', '文档', '创作', '代码'],
    ctx: '200K 上下文'
  },
  {
    id: 7, provider: 'Anthropic', name: 'Claude Opus 4.6',
    emoji: '🧠', solidBg: '#8B5A2B',
    tag: '旗舰', tagClass: 'tag-purple',
    desc: 'Anthropic 旗舰模型，深度推理能力卓越，超长上下文处理能力出众。',
    caps: ['深度推理', '文档分析', '创作', '代码'],
    ctx: '200K 上下文'
  },
]

const features = [
  { icon: '⚡', title: '流畅响应体验', desc: '多路由智能调度，确保模型调用稳定流畅，响应速度满足日常使用需求。' },
  { icon: '🔒', title: '隐私安全保障', desc: '对话内容不用于训练，端到端加密传输，合规存储，保护您的每一次交流。' },
  { icon: '🌐', title: '国内直连访问', desc: '无需 VPN，国内服务器直连，稳定可靠，随时随地访问顶尖境外模型。' },
  { icon: '💳', title: '透明按量计费', desc: '费用明细清晰透明，用多少付多少，无需预付，按月结算更省心。' },
  { icon: '🛠', title: 'OpenWebUI 对接', desc: '无缝集成 OpenWebUI，保留熟悉的交互界面，底层换装顶级模型，体验大幅提升。' },
  { icon: '💬', title: 'QQ 客服支持', desc: '遇到问题可通过 QQ 联系客服，我们会在工作时段尽快回复解答。' }
]
</script>

<style scoped>
/* HERO */
.hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  padding: 140px 0 96px;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 50% at 75% 30%, rgba(139,115,85,0.10) 0%, transparent 70%),
    radial-gradient(50% 60% at 15% 70%, rgba(166,144,118,0.08) 0%, transparent 70%),
    linear-gradient(180deg, #FDFCFB 0%, #F6F2EC 100%);
}
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(45,45,45,0.06) 1px, transparent 0);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse at center, black 10%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 10%, transparent 75%);
  opacity: 0.5;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.hero-eyebrow {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255,255,255,0.6);
  margin-bottom: 32px;
  animation: fadeUp 0.7s ease forwards;
  max-width: 100%;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5.5vw, 4.6rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin-bottom: 28px;
  color: var(--color-text-primary);
  animation: fadeUp 0.7s 0.1s ease both;
}
.hero-title-accent {
  font-style: italic;
  color: var(--color-accent);
  font-weight: 500;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--color-text-secondary);
  line-height: 1.85;
  margin-bottom: 40px;
  max-width: 600px;
  animation: fadeUp 0.7s 0.2s ease both;
  font-weight: 300;
}
.hero-subtitle strong {
  color: var(--color-text-primary);
  font-weight: 500;
}

.hero-cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 56px;
  animation: fadeUp 0.7s 0.3s ease both;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
  animation: fadeUp 0.7s 0.4s ease both;
  padding-top: 32px;
  border-top: 1px solid var(--color-border-light);
  max-width: 560px;
}
.stat { display: flex; flex-direction: column; gap: 4px; }
.stat-num {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}
.stat-label { font-size: 13px; color: var(--color-text-muted); }
.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border);
}

/* SECTION COMMON */
.section-header { text-align: center; margin-bottom: 64px; }
.section-header h2 {
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  font-weight: 400;
  margin: 16px 0 14px;
  letter-spacing: -0.015em;
}
.section-header p {
  color: var(--color-text-muted);
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 auto;
}
.section-cta {
  text-align: center;
  margin-top: 56px;
}

/* MODELS GRID */
.models-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.model-card { padding: 32px; display: flex; flex-direction: column; gap: 16px; }
.model-card-header { display: flex; align-items: center; gap: 14px; }
.model-avatar {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  color: #fff;
}
.model-meta { flex: 1; min-width: 0; }
.model-provider {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 2px;
}
.model-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}
.model-desc {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  flex: 1;
}
.model-caps { display: flex; flex-wrap: wrap; gap: 6px; }
.cap-chip {
  padding: 4px 10px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 400;
}
.model-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}
.model-ctx {
  font-size: 12px;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}
.model-link {
  font-size: 13px;
  color: var(--color-accent);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition);
}
.model-link:hover { color: var(--color-text-primary); }

/* SOCIAL PROOF */
.social-proof { text-align: center; }
.testimonial { max-width: 820px; margin: 0 auto; }
.testimonial-quote {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  font-style: italic;
  font-weight: 400;
  color: var(--color-text-primary);
  margin-bottom: 24px;
  line-height: 1.55;
  letter-spacing: -0.005em;
}
.testimonial-author {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0;
}
.testimonial-company {
  font-weight: 500;
  color: var(--color-accent);
}

/* FEATURES */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feature-card { padding: 32px; }
.feature-icon {
  width: 56px;
  height: 56px;
  background: var(--color-bg-accent);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 1.5rem;
}
.feature-card h3 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 12px;
}
.feature-card p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.75;
  margin-bottom: 0;
}

/* USE CASES */
.use-cases {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 880px;
  margin: 0 auto;
}
.use-case {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 32px 36px;
}
.use-case-icon {
  font-size: 1.8rem;
  width: 56px; height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-accent);
  border-radius: 14px;
  flex-shrink: 0;
}
.use-case h3 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 8px;
}
.use-case p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.75;
  margin: 0;
}

/* CTA */
.cta-block {
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 24px;
}
.cta-block h2 {
  font-size: clamp(2rem, 3.6vw, 2.8rem);
  font-weight: 400;
  margin-bottom: 18px;
  letter-spacing: -0.015em;
}
.cta-block p {
  color: var(--color-text-muted);
  font-size: 1.05rem;
  margin-bottom: 36px;
  line-height: 1.8;
}

/* Responsive */
@media (max-width: 1024px) {
  .models-grid, .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .hero { padding-top: 120px; min-height: auto; }
  .hero-stats { gap: 18px; flex-wrap: wrap; }
  .stat-divider { display: none; }
  .models-grid, .features-grid { grid-template-columns: 1fr; }
  .use-case { flex-direction: column; padding: 28px; }
  .model-card { padding: 24px; }
}
</style>