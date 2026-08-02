<template>
  <main>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-content">
        <span class="hero-eyebrow">全新发布 — Claude 全系大模型镜像与 API 套餐现已上线</span>
        <h1 class="hero-title">
          Claude 的稳定访问<br/>
          与 <span class="hero-title-accent">各厂商模型的API 接入</span>
        </h1>
        <p class="hero-subtitle">
          专注提供 <strong>Claude 镜像</strong> 与 <strong>API 套餐</strong> 服务。
          一个账号，即可畅享 Claude 全系顶尖大模型。
          <strong>国内直连</strong>，无需翻墙，按需付费。
        </p>
        <div class="hero-cta">
          <RouterLink to="/login" class="btn btn-primary btn-lg">立即体验</RouterLink>
          <RouterLink to="/plans" class="btn btn-outline btn-lg">套餐介绍</RouterLink>
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

    

    <!-- Plans Preview Section -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header">
          <span class="tag">套餐介绍</span>
          <h2>两大服务，按需选择</h2>
          <p>既可以直接使用 Claude 镜像站点，也可以用 API Key 接入 Claude / Gemini / OpenAI 等大模型接口。</p>
        </div>

        <div class="plans-preview-grid">
          <div class="plan-preview card">
            <div class="plan-preview-head">
              <div class="plan-preview-icon" style="background: rgba(184,116,75,0.15);">🪞</div>
              <span class="tag tag-cyan">面向用户</span>
            </div>
            <h3>Claude 镜像服务</h3>
            <p>本站直接提供 Claude 官方镜像站点，国内直连访问，无需翻墙、无需 API Key，注册即用。</p>
            <ul class="plan-preview-points">
              <li>Web 端直接对话，使用体验与 Claude 官网一致</li>
              <li>覆盖 Claude 全系模型 (Opus / Sonnet / Haiku)</li>
              <li>采用额度制，无 5 小时额度限制</li>
              <li>登录账号即可使用，无需信用卡</li>
            </ul>
            <RouterLink to="/plans#mirror" class="plan-preview-link">了解镜像服务 →</RouterLink>
          </div>

          <div class="plan-preview card">
            <div class="plan-preview-head">
              <div class="plan-preview-icon" style="background: rgba(56,189,248,0.15);">🔌</div>
              <span class="tag tag-purple">面向开发者</span>
            </div>
            <h3>API 接口服务</h3>
            <p>提供 Claude / Gemini / OpenAI 等大模型的标准 API 接口，对接自有应用与工作流。</p>
            <ul class="plan-preview-points">
              <li><strong>Chat 接口</strong>：对话 / 文本生成 / 工具调用</li>
              <li><strong>Image 接口</strong>：图像生成与编辑 (独立计费)</li>
              <li>两类接口对应不同的 API Key，不可混用</li>
              <li>按官方原价计费，可前往各厂商官网查询</li>
            </ul>
            <RouterLink to="/plans#api" class="plan-preview-link">了解 API 服务 →</RouterLink>
          </div>
        </div>

        <div class="section-cta">
          <RouterLink to="/plans" class="btn btn-primary btn-lg">查看完整套餐介绍</RouterLink>
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
              <p>用 Claude 完成脚本、文案与多语种内容生成，让 AI 辅助你完成从灵感到成品的全过程。</p>
            </div>
          </div>
          <div class="use-case card">
            <div class="use-case-icon">🏢</div>
            <div>
              <h3>企业团队</h3>
              <p>在国内直连的环境下为团队提供 Claude 镜像、API 接入与统一计费，让 AI 真正进入工作流。</p>
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
            <h3>Claude 镜像直连</h3>
            <p>本站直接接入 Claude 镜像，无需 OpenWebUI，开箱即用、稳定可靠。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Pricing Preview -->
    <section class="section">
      <div class="container">
        <div class="cta-block">
          <h2>两种套餐，按需选择</h2>
          <p>提供 <strong>Claude 镜像套餐</strong>（Web 端直接使用）与 <strong>API 套餐</strong>（按量计费对接自有应用），所有计划均包含免费额度，无隐藏收费。</p>
          <RouterLink to="/pricing" class="btn btn-primary btn-lg">查看定价方案</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const modelCount = ref('50+')

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
})

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

/* PLANS PREVIEW */
.plans-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 980px;
  margin: 0 auto;
}
.plan-preview {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: all var(--transition);
}
.plan-preview:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
  border-color: var(--color-accent-warm);
}
.plan-preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.plan-preview-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.plan-preview h3 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0;
  color: var(--color-text-primary);
}
.plan-preview > p {
  color: var(--color-text-secondary);
  font-size: 0.98rem;
  line-height: 1.8;
  margin: 0;
}
.plan-preview-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.plan-preview-points li {
  position: relative;
  padding-left: 22px;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  line-height: 1.7;
}
.plan-preview-points li::before {
  content: '✓';
  position: absolute;
  left: 0; top: 0;
  color: var(--color-accent);
  font-weight: 600;
}
.plan-preview-points strong {
  color: var(--color-text-primary);
  font-weight: 600;
}
.plan-preview-link {
  margin-top: auto;
  font-size: 0.95rem;
  color: var(--color-accent);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition);
}
.plan-preview-link:hover { color: var(--color-text-primary); }

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
  .plans-preview-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hero { padding-top: 120px; min-height: auto; }
  .hero-stats { gap: 18px; flex-wrap: wrap; }
  .stat-divider { display: none; }
  .models-grid, .features-grid { grid-template-columns: 1fr; }
  .use-case { flex-direction: column; padding: 28px; }
  .model-card { padding: 24px; }
  .plan-preview { padding: 28px; }
  .section-cta .btn { display: block; margin: 8px auto; }
}
</style>