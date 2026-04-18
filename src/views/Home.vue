<template>
  <main>
    <!-- Hero Section -->
    <section class="hero">
      <!-- Background orbs -->
      <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%);top:-200px;left:-100px;"></div>
      <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%);bottom:-100px;right:-50px;"></div>

      <!-- Grid lines -->
      <div class="hero-grid"></div>

      <div class="container hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>全新发布 — xAI、Anthropic、Gemini、OpenAI 国际顶级模型现已上线</span>
        </div>

        <h1 class="hero-title">
          汇聚全球顶级<br/>
          <span class="gradient-text">AI 智能模型</span>
        </h1>

        <p class="hero-desc">
          一个账号，畅享 GPT、Claude、Gemini、Grok 等数十款顶尖大模型。
          无需翻墙，按需付费，即刻开始你的 AI 之旅。
        </p>

        <div class="hero-actions">
          <RouterLink to="/login" class="btn btn-primary btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            立即体验
          </RouterLink>
          <RouterLink to="/models" class="btn btn-outline btn-lg">查看所有模型</RouterLink>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">10+</span>
            <span class="stat-label">AI 模型</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">99.9%</span>
            <span class="stat-label">服务可用性</span>
          </div>
        </div>
      </div>

      <!-- Floating model cards -->
      <div class="hero-visual">
        <div class="model-orbit">
          <div class="orbit-ring ring-1"></div>
          <div class="orbit-ring ring-2"></div>

          <div class="center-orb">
            <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="url(#hg)" stroke-width="1.5" fill="rgba(99,102,241,0.2)"/>
              <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="url(#hg)"/>
              <defs>
                <linearGradient id="hg" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#38bdf8"/><stop offset="1" stop-color="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div v-for="(m, i) in orbitModels" :key="i" class="orbit-chip" :style="orbitStyle(i, orbitModels.length)">
            <span class="chip-icon">{{ m.icon }}</span>
            <span>{{ m.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Models Showcase -->
    <section class="section" id="models">
      <div class="container">
        <div class="section-header">
          <span class="tag tag-cyan">模型广场</span>
          <h2 class="section-title">接入业界最强 AI 模型</h2>
          <p class="section-desc">从文字创作到代码生成，从图像理解到多模态交互，所有顶级模型一键可达。</p>
        </div>

        <div class="models-grid">
          <div v-for="m in featuredModels" :key="m.id" class="model-card card">
            <div class="model-card-header">
              <div class="model-avatar" :style="{ background: m.gradient }">
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
              <RouterLink to="/register" class="btn btn-ghost" style="font-size:13px;padding:8px 14px">立即使用 →</RouterLink>
            </div>
          </div>
        </div>

        <div style="text-align:center;margin-top:48px">
          <RouterLink to="/models" class="btn btn-outline btn-lg">查看全部 10+ 模型</RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section features-section" id="features">
      <div class="container">
        <div class="section-header">
          <span class="tag tag-purple">功能特性</span>
          <h2 class="section-title">为什么选择 chat-keeper</h2>
        </div>

        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card card">
            <div class="feature-icon" :style="{ background: f.iconBg }">
              <span v-html="f.icon"></span>
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Documentation -->
    <section class="section docs-section">
      <div class="container">
        <div class="section-header">
          <span class="tag tag-purple">技术文档</span>
          <h2 class="section-title">高级特性与自定义</h2>
          <p class="section-desc">我们建议您使用默认聊天界面即可满足大部分需求。如果您有自定义的需求，可以参考以下信息自行调整。</p>
        </div>

        <div class="docs-grid">
          <a href="https://docs.openwebui.com/features/workspace/prompts" target="_blank" class="doc-card card">
            <div class="doc-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="doc-content">
              <h3>高级系统提示词</h3>
              <p>了解如何自定义系统提示词，打造专属的 AI 助手行为和角色设定。</p>
              <span class="doc-link">查看文档 →</span>
            </div>
          </a>

          <a href="https://docs.openwebui.com/features/workspace/skills/" target="_blank" class="doc-card card">
            <div class="doc-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="doc-content">
              <h3>如何使用 Skills</h3>
              <p>学习使用 Skills 扩展 AI 能力，实现自动化任务和高级功能集成。</p>
              <span class="doc-link">查看文档 →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Pricing Preview -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-box">
          <div class="cta-orb"></div>
          <span class="tag tag-cyan" style="margin-bottom:24px">简单透明的定价</span>
          <h2 class="cta-title">按需付费，灵活选择</h2>
          <p class="cta-desc">从个人到企业，我们提供匹配每个场景的套餐方案。所有计划均包含免费额度，无隐藏收费。</p>
          <div class="cta-actions">
            <RouterLink to="/pricing" class="btn btn-primary btn-lg">查看定价方案</RouterLink>
            <!-- <RouterLink to="/register" class="btn btn-outline btn-lg">免费注册</RouterLink> -->
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const orbitModels = [
  { name: 'GPT', icon: '🤖' },
  { name: 'Claude', icon: '🧠' },
  { name: 'Gemini', icon: '💫' },
  { name: 'xAI', icon: '🔥' },
  { name: 'Llama', icon: '🦙' },
]

function orbitStyle(index, total) {
  const angle = (index / total) * 360
  const rad = (angle * Math.PI) / 180
  const radius = 160
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius
  return {
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    animationDelay: `${index * 0.5}s`
  }
}

const featuredModels = [
  {
    id: 1, provider: 'OpenAI', name: 'GPT-5.4',
    emoji: '🤖', gradient: 'linear-gradient(135deg,#10a37f,#1a7f64)',
    tag: '多模态', tagClass: 'tag-green',
    desc: '最强大的多模态模型，支持文字、图像、语音理解与生成，处理复杂任务游刃有余。',
    caps: ['文本生成', '图像理解', '代码', '推理'],
    ctx: '128K 上下文'
  },
  {
    id: 2, provider: 'Anthropic', name: 'Claude Opus 4.6',
    emoji: '🧠', gradient: 'linear-gradient(135deg,#d97706,#92400e)',
    tag: '推理强', tagClass: 'tag-purple',
    desc: '专注于安全与深度推理，超长上下文处理能力卓越，适合文档分析与复杂逻辑任务。',
    caps: ['深度推理', '文档分析', '创作', '代码'],
    ctx: '200K 上下文'
  },
  {
    id: 3, provider: 'Google', name: 'Gemini 3.1 Pro',
    emoji: '💫', gradient: 'linear-gradient(135deg,#4285f4,#1a56db)',
    tag: '超长', tagClass: 'tag-cyan',
    desc: '谷歌最新旗舰模型，拥有超长上下文窗口，多语言能力出色，擅长数据分析与科学推理。',
    caps: ['超长上下文', '多语言', '数据分析', '代码'],
    ctx: '1M 上下文'
  },
  {
    id: 4, provider: 'xAI', name: 'Grok 4.20',
    emoji: '🔥', gradient: 'linear-gradient(135deg,#f97316,#c2410c)',
    tag: '旗舰', tagClass: 'tag-orange',
    desc: 'xAI 最新旗舰模型，深度推理能力卓越，实时信息获取能力强。',
    caps: ['深度推理', '实时信息', '代码'],
    ctx: '128K 上下文'
  },
  {
    id: 5, provider: 'Meta', name: 'Llama 3.1 405B',
    emoji: '🦙', gradient: 'linear-gradient(135deg,#0284c7,#075985)',
    tag: '开源', tagClass: 'tag-cyan',
    desc: 'Meta 最大规模开源模型，4050亿参数，综合能力强大，支持多语言与代码生成。',
    caps: ['开源免费', '多语言', '代码', '对话'],
    ctx: '128K 上下文'
  },
  {
    id: 6, provider: 'Anthropic', name: 'Claude Sonnet 4.6',
    emoji: '📝', gradient: 'linear-gradient(135deg,#b45309,#78350f)',
    tag: '均衡', tagClass: 'tag-green',
    desc: 'Anthropic 均衡旗舰，深度推理卓越，长文档处理能力出众。',
    caps: ['推理', '文档', '创作', '代码'],
    ctx: '200K 上下文'
  },
]

const features = [
  {
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    iconBg: 'rgba(56,189,248,0.1)',
    title: '流畅响应体验',
    desc: '多路由智能调度，确保模型调用稳定流畅，响应速度满足日常使用需求。'
  },
  {
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    iconBg: 'rgba(167,139,250,0.1)',
    title: '隐私安全保障',
    desc: '对话内容不用于训练，端到端加密传输，合规存储，保护您的每一次交流。'
  },
  {
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    iconBg: 'rgba(52,211,153,0.1)',
    title: '国内直连访问',
    desc: '无需 VPN，国内服务器直连，稳定可靠，随时随地访问顶尖境外模型。'
  },
  {
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    iconBg: 'rgba(56,189,248,0.1)',
    title: '透明按量计费',
    desc: '费用明细清晰透明，用多少付多少，无需预付，按月结算更省心。'
  },
  {
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    iconBg: 'rgba(167,139,250,0.1)',
    title: 'OpenWebUI 对接',
    desc: '无缝集成 OpenWebUI，保留熟悉的交互界面，底层换装顶级模型，体验大幅提升。'
  },
  {
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    iconBg: 'rgba(52,211,153,0.1)',
    title: 'QQ 客服支持',
    desc: '遇到问题可通过 QQ 联系客服，我们会在工作时段尽快回复解答。'
  }
]
</script>

<style scoped>
/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 120px 0 80px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
}
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.2);
  border-radius: 999px;
  font-size: 13px;
  color: var(--accent-cyan);
  margin-bottom: 28px;
  animation: fadeUp 0.6s ease forwards;
}
.badge-dot {
  width: 7px; height: 7px;
  background: var(--accent-cyan);
  border-radius: 50%;
  animation: pulse-glow 2s ease infinite;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(42px, 5.5vw, 72px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  animation: fadeUp 0.7s 0.1s ease both;
}
.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 17px;
  color: var(--text-secondary);
  line-height: 1.75;
  margin-bottom: 36px;
  max-width: 520px;
  animation: fadeUp 0.7s 0.2s ease both;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 52px;
  animation: fadeUp 0.7s 0.3s ease both;
}
.btn-lg { padding: 15px 30px; font-size: 15px; }
.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
  animation: fadeUp 0.7s 0.4s ease both;
}
.stat { display: flex; flex-direction: column; gap: 4px; }
.stat-num {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-label { font-size: 13px; color: var(--text-muted); }
.stat-divider { width: 1px; height: 40px; background: var(--border); }

/* ORBIT VISUAL */
.hero-visual {
  position: absolute;
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.model-orbit {
  position: relative;
  width: 380px;
  height: 380px;
}
.orbit-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(99,102,241,0.15);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: spin-slow linear infinite;
}
.ring-1 { width: 320px; height: 320px; animation-duration: 20s; }
.ring-2 { width: 220px; height: 220px; animation-duration: 14s; animation-direction: reverse; border-color: rgba(56,189,248,0.12); }
.center-orb {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 72px; height: 72px;
  background: rgba(12,18,32,0.9);
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 40px rgba(99,102,241,0.3);
  animation: float 4s ease-in-out infinite;
}
.orbit-chip {
  position: absolute;
  top: 50%; left: 50%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(12,18,32,0.95);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-display);
  white-space: nowrap;
  animation: float 4s ease-in-out infinite;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.chip-icon { font-size: 14px; }

/* SECTION COMMON */
.section-header { text-align: center; margin-bottom: 64px; }
.section-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  margin: 16px 0 12px;
  letter-spacing: -0.02em;
}
.section-desc { color: var(--text-secondary); font-size: 16px; max-width: 520px; margin: 0 auto; }

/* MODELS GRID */
.models-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.model-card { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.model-card-header { display: flex; align-items: center; gap: 12px; }
.model-avatar {
  width: 44px; height: 44px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.model-meta { flex: 1; }
.model-provider { font-size: 11px; color: var(--text-muted); font-weight: 500; display: block; }
.model-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; }
.model-desc { color: var(--text-secondary); font-size: 13.5px; line-height: 1.6; flex: 1; }
.model-caps { display: flex; flex-wrap: wrap; gap: 6px; }
.cap-chip {
  padding: 4px 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}
.model-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border); }
.model-ctx { font-size: 12px; color: var(--text-muted); font-family: monospace; }

/* FEATURES */
.features-section { background: linear-gradient(180deg, transparent, rgba(8,13,20,0.8) 30%, rgba(8,13,20,0.8) 70%, transparent); }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature-card { padding: 28px; display: flex; flex-direction: column; gap: 14px; }
.feature-icon {
  width: 48px; height: 48px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-cyan);
}
.feature-card h3 { font-family: var(--font-display); font-size: 17px; font-weight: 700; }
.feature-card p { color: var(--text-secondary); font-size: 14px; line-height: 1.7; }

/* DOCUMENTATION */
.docs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 800px; margin: 0 auto; }
.doc-card {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 24px; text-decoration: none;
  transition: all 0.2s ease;
}
.doc-card:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.4); }
.doc-icon {
  width: 48px; height: 48px; flex-shrink: 0;
  background: rgba(99,102,241,0.1);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-purple);
}
.doc-content { display: flex; flex-direction: column; gap: 6px; }
.doc-content h3 { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); }
.doc-content p { color: var(--text-secondary); font-size: 13px; line-height: 1.6; }
.doc-link { font-size: 13px; color: var(--accent-cyan); font-weight: 500; margin-top: 4px; }

/* CTA */
.cta-section { }
.cta-box {
  position: relative;
  text-align: center;
  padding: 80px 48px;
  background: var(--gradient-card);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex; flex-direction: column; align-items: center;
}
.cta-orb {
  position: absolute;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: pulse-glow 4s ease infinite;
}
.cta-title {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  margin-bottom: 16px;
}
.cta-desc {
  position: relative;
  color: var(--text-secondary);
  font-size: 16px;
  max-width: 500px;
  margin-bottom: 36px;
  line-height: 1.7;
}
.cta-actions {
  position: relative;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-visual { display: none; }
  .models-grid, .features-grid, .docs-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .models-grid, .features-grid, .docs-grid { grid-template-columns: 1fr; }
  .hero-stats { gap: 20px; }
  .cta-box { padding: 48px 24px; }
}
</style>
