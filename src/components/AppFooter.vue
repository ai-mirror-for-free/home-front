<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">chat-keeper</div>
          <p>专注 Claude 全系大模型，提供 Claude 镜像与 API 套餐两种使用方式。一个账号，畅享 Claude 顶尖模型。</p>
        </div>
        <div class="footer-col">
          <h4>产品</h4>
          <ul>
            <li><RouterLink to="/models">模型广场</RouterLink></li>
            <li><RouterLink to="/plans">套餐介绍</RouterLink></li>
            <li><RouterLink to="/pricing">定价方案</RouterLink></li>
            <li><RouterLink to="/experience">体验中心</RouterLink></li>
            <li><RouterLink to="/billing-rules">计费规则</RouterLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>账户</h4>
          <ul>
            <li><RouterLink to="/login">登录</RouterLink></li>
            <li><RouterLink to="/register">注册</RouterLink></li>
            <li><RouterLink to="/profile">个人中心</RouterLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>联系</h4>
          <ul>
            <li><a href="#">QQ 客服</a></li>
            <li><a href="#">邮箱支持</a></li>
            <li><a href="#">服务状态</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 chat-keeper. 保留所有权利。</p>
        <p class="muted">Designed for AI Practitioners</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2D2D2D;
  color: #fff;
  padding: 80px 0 32px;
  margin-top: auto;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}
.footer-brand .logo {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: #fff;
  letter-spacing: 0.01em;
}
.footer-brand p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.92rem;
  line-height: 1.8;
  max-width: 340px;
  margin-bottom: 0;
}
.footer-col h4 {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 20px;
}
.footer-col ul {
  list-style: none;
  padding: 0;
}
.footer-col li { margin-bottom: 10px; }
.footer-col a {
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.95rem;
  transition: color var(--transition);
}
.footer-col a:hover { color: #fff; }

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}
.footer-bottom .muted {
  font-style: italic;
  font-family: var(--font-display);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
  .footer-brand {
    grid-column: span 2;
    max-width: none;
  }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-brand { grid-column: span 1; }
  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>