<template>
  <main class="billing-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:0;right:0;pointer-events:none;"></div>

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <span class="tag tag-green">计费规则</span>
        <h1 class="page-title">计费规则说明</h1>
        <p class="page-desc">本站提供 Claude 镜像服务与 API 接口服务两种形态，计费方式各有不同，使用前请仔细阅读。</p>
      </div>

      <!-- Rules List -->
      <div class="rules-grid">
        <div v-for="(rule, index) in billingRules" :key="index" :id="rule.id" class="rule-card card">
          <div class="rule-icon">{{ rule.icon }}</div>
          <h3 class="rule-title">{{ rule.title }}</h3>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>

      <!-- Note -->
      <div class="billing-note">
        <p>如有更多疑问，请联系客服咨询。</p>
      </div>
    </div>
  </main>
</template>

<script setup>
const billingRules = [
  {
    id: 'rule-1',
    icon: '🔑',
    title: 'API Key 分类',
    description: 'API 接口分为 Chat 接口与 Image 接口两种，两种接口之间使用不同的 API Key，且 Key 之间不通用，余额也无法互通。请根据实际场景分别申请对应的 Key。'
  },
  {
    id: 'rule-2',
    icon: '💱',
    title: 'API 套餐按官方原价计费',
    description: '所有的 API 套餐可使用模型按官方 API 原价计费，您可以自行前往 Claude / Gemini / OpenAI 等官网查询最新模型价格，本站不额外加价。'
  },
  {
    id: 'rule-3',
    icon: '🪙',
    title: 'Claude 镜像套餐额度制',
    description: 'Claude 镜像套餐目前采用额度制，我们按 Claude 官方预估的对话次数折算为 RMB 现价，本质上和 Claude Pro 套餐价格一致，也没有 5 小时额度限制，您可以按需充值使用。'
  }
]
</script>

<style scoped>
.billing-page {
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
  margin-bottom: 64px;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  margin: 16px 0 16px;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}
.page-desc { color: var(--color-text-muted); font-size: 1.05rem; max-width: 640px; margin: 0 auto; line-height: 1.8; }

.rules-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 820px;
  margin: 0 auto;
}

.rule-card {
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 100px;
}

.rule-icon {
  font-size: 2.2rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-accent);
  border-radius: 14px;
  line-height: 1;
}

.rule-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.rule-desc {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin: 0;
}

.billing-note {
  text-align: center;
  margin-top: 80px;
  padding: 24px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-style: italic;
  font-family: var(--font-display);
}

@media (max-width: 768px) {
  .rules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
