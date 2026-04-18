<template>
  <main class="billing-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(52,211,153,0.12) 0%,transparent 70%);top:0;right:0;pointer-events:none;"></div>

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <span class="tag tag-green">计费规则</span>
        <h1 class="page-title">计费规则说明</h1>
        <p class="page-desc">了解我们的计费规则，合理规划您的使用额度。</p>
      </div>

      <!-- Rules List -->
      <div class="rules-grid">
        <div v-for="(rule, index) in billingRules" :key="index" class="rule-card card">
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
    icon: '⏰',
    title: '额度过期规则',
    description: '请在额度时间内将额度用完，过期后将不可使用。'
  },
  {
    icon: '💾',
    title: '未使用完的额度',
    description: '未使用完的额度本身不会消失，但是重新使用需要购买新套餐，过期时间以新购买套餐为准。'
  },
  {
    icon: '🔄',
    title: '额度继承',
    description: '额度会自动继承到新购买的套餐上。'
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

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.rule-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-icon {
  font-size: 48px;
  line-height: 1;
}

.rule-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.rule-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.billing-note {
  text-align: center;
  margin-top: 60px;
  padding: 24px;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .rules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
