<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo" style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="url(#fg)" stroke-width="1.5" fill="rgba(99,102,241,0.15)"/>
              <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="url(#fg)"/>
              <defs>
                <linearGradient id="fg" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#38bdf8"/><stop offset="1" stop-color="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
            <span style="font-family:var(--font-display);font-size:20px;font-weight:800;background:var(--gradient-text);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">chat-keeper</span>
          </div>

        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 chat-keeper. 保留所有权利。</p>
        <!-- <p>ICP备XXXXXXXX号</p> -->
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: 72px 0 32px;
  margin-top: auto;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
.footer-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
  max-width: 260px;
  margin-bottom: 24px;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 13px;
}
@media (max-width: 500px) {
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}
</style>
