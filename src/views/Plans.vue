<template>
  <main class="plans-page">
    <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%);pointer-events:none;"></div>

    <div class="container">
      <div class="page-header">
        <span class="tag tag-cyan">套餐介绍</span>
        <h1 class="page-title">两大服务，一次了解</h1>
        <p class="page-desc">chat-keeper 主营两大服务：可直接访问的 Claude 镜像网站，以及面向开发者的各大模型 API 接口服务。</p>
      </div>

      <!-- Service 1: Claude 镜像 -->
      <section id="mirror" class="service-block">
        <div class="service-head">
          <div class="service-icon" style="background: rgba(184,116,75,0.15);">🪞</div>
          <div>
            <span class="tag tag-cyan">面向用户</span>
            <h2 class="service-title">Claude 镜像服务</h2>
            <p class="service-subtitle">本站直接提供 Claude 官方镜像站点，国内直连，注册即用。</p>
          </div>
        </div>

        <div class="service-grid">
          <div class="info-card card">
            <h3>服务说明</h3>
            <p>本站提供一个与 Claude 官网体验一致的镜像站点，用户无需翻墙、无需 API Key，注册账号后即可在国内直连使用全部 Claude 全系模型。</p>
          </div>
          <div class="info-card card">
            <h3>支持模型</h3>
            <ul>
              <li>Claude Opus 4.8 / 4.7 / 4.6 (旗舰推理)</li>
              <li>Claude Sonnet 5 / 4.6 (均衡首选)</li>
              <li>Claude Haiku 5 / 4.5 (快速响应)</li>
            </ul>
          </div>
          <div class="info-card card">
            <h3>计费方式</h3>
            <p>采用<strong>额度制</strong>：我们按 Claude 官方预估的对话次数折算为现价，本质上与 Claude Pro 套餐价格一致，<strong>无 5 小时额度限制</strong>，按需充值使用。</p>
          </div>
          <div class="info-card card">
            <h3>适用人群</h3>
            <ul>
              <li>想在国内直接用 Claude 的个人用户</li>
              <li>不愿折腾 API Key 与科学上网的创作者</li>
              <li>对话量较大、需要稳定不限时的重度用户</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Service 2: API 接口 -->
      <section id="api" class="service-block">
        <div class="service-head">
          <div class="service-icon" style="background: rgba(56,189,248,0.15);">🔌</div>
          <div>
            <span class="tag tag-purple">面向开发者</span>
            <h2 class="service-title">API 接口服务</h2>
            <p class="service-subtitle">提供 Claude / Gemini / OpenAI 等大模型的标准 API 接口，对接自有应用。</p>
          </div>
        </div>

        <div class="api-subtypes">
          <div class="api-subtype card">
            <div class="api-subtype-head">
              <span class="api-subtype-icon">💬</span>
              <h3>Chat 接口</h3>
            </div>
            <p>对话、文本生成、工具调用 (Function Calling)、长上下文处理等，覆盖主流大模型的对话能力。</p>
            <ul>
              <li>适用模型：Claude 全系 / Gemini 全系 / GPT 全系</li>
              <li>典型场景：聊天机器人、写作助手、代码助手、数据分析</li>
            </ul>
          </div>
          <div class="api-subtype card">
            <div class="api-subtype-head">
              <span class="api-subtype-icon">🎨</span>
              <h3>Image 接口</h3>
            </div>
            <p>图像生成与编辑能力，独立的计费通道，适用于需要 AI 画图的应用场景。</p>
            <ul>
              <li>适用模型：GPT Image / Google 生图模型等</li>
              <li>典型场景：营销图生成、商品图、设计素材</li>
            </ul>
          </div>
        </div>

        <div class="api-warning card">
          <div class="api-warning-icon">⚠️</div>
          <div>
            <h4>两类接口独立计费</h4>
            <p>Chat 接口与 Image 接口使用<strong>不同的 API Key</strong>，余额不可互通。请根据实际场景分别申请对应的 Key。</p>
          </div>
        </div>

        <div class="service-grid">
          <div class="info-card card">
            <h3>计费方式</h3>
            <p>API 套餐按<strong>各厂商官方原价</strong>计费，可前往 Anthropic / Google / OpenAI 等官网查询模型单价，我们不额外加价。</p>
          </div>
          <div class="info-card card">
            <h3>支持的厂商</h3>
            <ul>
              <li><strong>Claude</strong> (Anthropic) - 对话 / 推理 / 长文档</li>
              <li><strong>Gemini</strong> (Google) - 多模态 / 长上下文</li>
              <li><strong>OpenAI</strong> - 对话 / 生图 / 工具调用</li>
            </ul>
          </div>
          <div class="info-card card">
            <h3>接入方式</h3>
            <ul>
              <li>兼容 OpenAI 协议，统一 BaseURL 即可切换模型</li>
              <li>支持 Function Calling、流式输出、多轮对话</li>
              <li>提供请求日志、用量统计、错误码说明</li>
            </ul>
          </div>
          <div class="info-card card">
            <h3>适用人群</h3>
            <ul>
              <li>独立开发者 / 创业团队</li>
              <li>需要把 AI 接入自有产品的工程师</li>
              <li>多模型对比、A/B 测试的研究者</li>
            </ul>
          </div>
        </div>

        <div class="service-cta">
          <RouterLink to="/pricing" class="btn btn-primary btn-lg">查看 API 套餐</RouterLink>
          <a :href="taobaoUrl" target="_blank" class="btn btn-outline btn-lg">前往淘宝购买</a>
          <a :href="xianyuUrl" target="_blank" class="btn btn-outline btn-lg">前往闲鱼购买</a>
        </div>
      </section>

      <!-- 对比表 -->
      <section class="compare-block">
        <div class="section-header">
          <span class="tag tag-orange">对比一览</span>
          <h2>两种服务怎么选？</h2>
        </div>
        <div class="compare-table card">
          <div class="compare-row compare-head">
            <div></div>
            <div>Claude 镜像服务</div>
            <div>API 接口服务</div>
          </div>
          <div class="compare-row">
            <div class="compare-label">适用人群</div>
            <div>个人用户 / 创作者</div>
            <div>开发者 / 团队</div>
          </div>
          <div class="compare-row">
            <div class="compare-label">使用方式</div>
            <div>登录本站直接对话</div>
            <div>用 API Key 接入应用</div>
          </div>
          <div class="compare-row">
            <div class="compare-label">支持模型</div>
            <div>仅 Claude 全系</div>
            <div>Claude / Gemini / OpenAI</div>
          </div>
          <div class="compare-row">
            <div class="compare-label">计费</div>
            <div>额度制 (等同 Claude Pro)</div>
            <div>按官方原价 (Token / 次)</div>
          </div>
          <div class="compare-row">
            <div class="compare-label">5 小时限制</div>
            <div>无</div>
            <div>无</div>
          </div>
          <div class="compare-row">
            <div class="compare-label">需要 API Key</div>
            <div>否</div>
            <div>是 (Chat / Image 分开)</div>
          </div>
        </div>
      </section>

      <div class="plans-note">
        <p>所有套餐按需购买、按需使用，详细价格请前往淘宝店铺查看。</p>
      </div>
    </div>
  </main>
</template>

<script setup>
const taobaoUrl = 'https://e.tb.cn/h.8UyAjmuZLZEnWiZ?tk=gkWigxdsfMo'
const xianyuUrl = 'https://m.tb.cn/h.8UBxavO?tk=BrifgxWK8rz'
</script>

<style scoped>
.plans-page {
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
.page-desc {
  color: var(--color-text-muted);
  font-size: 1.05rem;
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.8;
}

/* SERVICE BLOCK */
.service-block {
  margin-bottom: 100px;
  scroll-margin-top: 100px;
}
.service-head {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 40px;
}
.service-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
}
.service-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 500;
  margin: 8px 0 6px;
  letter-spacing: -0.01em;
}
.service-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  margin: 0;
  line-height: 1.7;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}
.info-card {
  padding: 28px;
}
.info-card h3 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 12px;
  color: var(--color-text-primary);
}
.info-card p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0;
}
.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.info-card ul li {
  position: relative;
  padding-left: 20px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
}
.info-card ul li::before {
  content: '·';
  position: absolute;
  left: 4px; top: -2px;
  color: var(--color-accent);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}
.info-card strong {
  color: var(--color-text-primary);
  font-weight: 600;
}

.service-cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.service-cta .btn {
  text-decoration: none;
}

/* API SUBTYPES */
.api-subtypes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.api-subtype {
  padding: 28px;
}
.api-subtype-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.api-subtype-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-accent);
  border-radius: 12px;
}
.api-subtype h3 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0;
  color: var(--color-text-primary);
}
.api-subtype > p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0 0 14px;
}
.api-subtype ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.api-subtype ul li {
  position: relative;
  padding-left: 20px;
  color: var(--color-text-secondary);
  font-size: 0.93rem;
  line-height: 1.7;
}
.api-subtype ul li::before {
  content: '·';
  position: absolute;
  left: 4px; top: -2px;
  color: var(--color-accent);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}

.api-warning {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 28px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, rgba(184,154,75,0.06) 0%, rgba(184,154,75,0.1) 100%);
  border-color: rgba(184,154,75,0.25);
}
.api-warning-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  line-height: 1;
}
.api-warning h4 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 6px;
  color: #8B6F2E;
}
.api-warning p {
  color: var(--color-text-secondary);
  font-size: 0.93rem;
  line-height: 1.7;
  margin: 0;
}
.api-warning strong {
  color: #8B6F2E;
  font-weight: 600;
}

/* COMPARE TABLE */
.compare-block {
  margin-bottom: 60px;
}
.section-header {
  text-align: center;
  margin-bottom: 40px;
}
.section-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  font-weight: 400;
  margin: 12px 0 0;
  letter-spacing: -0.01em;
}
.compare-table {
  padding: 0;
  overflow: hidden;
  max-width: 880px;
  margin: 0 auto;
}
.compare-row {
  display: grid;
  grid-template-columns: 160px 1fr 1fr;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}
.compare-row:last-child { border-bottom: none; }
.compare-row:nth-child(even) {
  background: var(--color-bg-secondary);
}
.compare-head {
  background: var(--color-bg-primary) !important;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1rem;
}
.compare-head > div:nth-child(2),
.compare-head > div:nth-child(3) {
  color: var(--color-accent);
}
.compare-label {
  font-weight: 600;
  color: var(--color-text-primary);
}

.plans-note {
  text-align: center;
  padding: 20px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-style: italic;
  font-family: var(--font-display);
}

/* Responsive */
@media (max-width: 1024px) {
  .service-grid, .api-subtypes { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .service-head { flex-direction: column; align-items: flex-start; }
  .compare-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px 20px;
  }
  .compare-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); }
  .compare-row > div:not(.compare-label) { padding-left: 12px; }
  .compare-head > div:not(.compare-label) { padding-left: 0; }
  .service-cta .btn { width: 100%; justify-content: center; }
}
</style>