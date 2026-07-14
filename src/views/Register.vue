<template>
  <main class="auth-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:-100px;right:-150px;pointer-events:none;"></div>

    <div class="auth-container">
      <!-- Left Panel -->
      <div class="auth-left">
        <RouterLink to="/" class="auth-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="url(#rlg)" stroke-width="1.5" fill="rgba(99,102,241,0.15)"/>
            <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="url(#rlg)"/>
            <defs>
              <linearGradient id="rlg" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                <stop stop-color="#38bdf8"/><stop offset="1" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
          </svg>
          <span>chat-keeper</span>
        </RouterLink>

        <div class="auth-left-content">
          <h2>加入 chat-keeper</h2>
          <p>免费注册，立享体验额度。无需信用卡，30秒快速开始。</p>

          <div class="perks">
            <div v-for="perk in perks" :key="perk.text" class="perk-item">
              <span class="perk-icon">{{ perk.icon }}</span>
              <span>{{ perk.text }}</span>
            </div>
          </div>
        </div>

        <div class="stats-row">
          <div v-for="s in stats" :key="s.label" class="mini-stat">
            <span class="mini-stat-num">{{ s.num }}</span>
            <span class="mini-stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="auth-right">
        <div class="auth-form-wrap">
          <h1 class="auth-title">创建账号</h1>
          <p class="auth-subtitle">已有账号？<RouterLink to="/login" class="auth-link">立即登录</RouterLink></p>

          <!-- <div class="oauth-btns">
            <button class="oauth-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              使用 Google 注册
            </button>
          </div> -->

          <div class="divider"><span>或使用邮箱注册</span></div>

          <form @submit.prevent="handleRegister" class="auth-form">
            <!-- <div class="form-row"> -->
              <div class="form-group">
                <label>姓名</label>
                <input v-model="form.name" type="text" class="input-field" placeholder="你的名字" required />
              </div>
              <!-- <div class="form-group">
                <label>手机号（可选）</label>
                <input v-model="form.phone" type="tel" class="input-field" placeholder="+86 138..." />
              </div> -->
            <!-- </div> -->
            <div class="form-group">
              <label>邮箱地址</label>
              <div class="email-input-wrap">
                <input v-model="emailUsername" type="text" class="input-field" placeholder="yourname" required />
                <span class="email-at">@</span>
                <select v-model="emailDomain" class="email-domain-select" required>
                  <option value="qq.com">qq.com</option>
                  <option value="foxmail.com">foxmail.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="163.com">163.com</option>
                  <option value="126.com">126.com</option>
                  <option value="outlook.com">outlook.com</option>
                  <option value="hotmail.com">hotmail.com</option>
                  <option value="icloud.com">icloud.com</option>
                  <option value="yahoo.com">yahoo.com</option>
                  <option value="edu.cn">edu.cn</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>设置密码</label>
              <!-- 验证码输入框 -->
              <div class="form-group">
                <label>邮箱验证码</label>
                <div class="code-input-wrap">
                  <input v-model="form.verification_code" type="text" class="input-field" placeholder="请输入验证码" maxlength="6" />
                  <button 
                    type="button" 
                    class="send-code-btn" 
                    :disabled="sendingCodeLoading || !canSendCode"
                    @click="handleSendCode"
                  >
                    <span v-if="sendingCodeLoading">发送中...</span>
                    <span v-else-if="!canSendCode">{{ countdown }}s 后重发</span>
                    <span v-else>获取验证码</span>
                  </button>
                </div>
              </div>

              <!-- 密码输入框 -->
              <div class="form-group">
                <label>设置密码</label>
                <div class="password-wrap">
                  <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="input-field" placeholder="至少8位,含大小写字母和数字" required />
                  <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                    <svg v-if="!showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <!-- Password strength -->
              <div class="pwd-strength" v-if="form.password">
                <div v-for="i in 4" :key="i" class="strength-bar" :class="{ active: pwdStrength >= i, [`level-${pwdStrength}`]: true }"></div>
                <span class="strength-label" :class="`text-level-${pwdStrength}`">{{ strengthLabel }}</span>
              </div>
            </div>

            <!-- Invite Code -->
            <div class="form-group">
              <label>邀请码（可选）</label>
              <input v-model="form.invite" type="text" class="input-field" placeholder="输入邀请码享额外奖励" />
            </div>

            <label class="checkbox-wrap">
              <input type="checkbox" v-model="agreed" required />
              <span class="checkmark"></span>
              <span>我已阅读并同意 <a href="#" class="auth-link">服务条款</a> 和 <a href="#" class="auth-link">隐私政策</a></span>
            </label>

            <div v-if="error" class="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary submit-btn" :disabled="loading || !agreed">
              <span v-if="loading" class="loading-dot"></span>
              {{ loading ? '注册中...' : '免费创建账号' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { sendVerificationCode, register as apiRegister } from '@/api/register'

const router = useRouter()
// 表单数据
const form = ref({ 
  name: '', 
  phone: '', 
  password: '', 
  verification_code: '',
  invite: '' 
})
const emailUsername = ref('')
const emailDomain = ref('qq.com')
const showPwd = ref(false)
const agreed = ref(false)
const loading = ref(false)
const error = ref('')

// 验证码相关状态
const sendingCodeLoading = ref(false)
const countdown = ref(0)
const canSendCode = ref(true)
const verificationSent = ref(false) // 是否已发送过验证码


const perks = [
  { icon: '🎁', text: '新用户注册即送 5w 体验额度' },
  { icon: '⚡', text: '立即访问 GPT、Claude、Gemini、xAI(Grok)' },
  { icon: '🔒', text: '数据加密保护，隐私安全保障' },
  { icon: '🌍', text: '国内直连，无需 VPN，随时可用' },
  { icon: '💳', text: '免费计划包含一天体验时间，无需信用卡' },
]

const stats = [
  { num: '10+', label: 'AI 模型' },
  { num: '99.9%', label: '可用率' },
]

// 密码强度计算
const pwdStrength = computed(() => {
  const pwd = form.value.password
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
})

const strengthLabel = computed(() => ['', '弱', '一般', '强', '非常强'][pwdStrength.value])

// 发送验证码
async function handleSendCode() {
  if (!canSendCode.value) return
  
  const email = emailUsername.value.trim() + '@' + emailDomain.value
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    error.value = '请输入有效的邮箱地址'
    return
  }
  
  sendingCodeLoading.value = true
  try {
    await sendVerificationCode(email)
    verificationSent.value = true
    
    // 开始倒计时
    countdown.value = 60
    canSendCode.value = false
    
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        canSendCode.value = true
      }
    }, 1000)
    
    error.value = ''
  } catch (e) {
    error.value = e.message || '发送验证码失败，请重试'
    verificationSent.value = false
  } finally {
    sendingCodeLoading.value = false
  }
}

// 处理注册提交
async function handleRegister() {
  loading.value = true
  error.value = ''
  
  const email = emailUsername.value.trim() + '@' + emailDomain.value
  
  // 验证必填字段
  if (!form.value.name.trim()) {
    error.value = '请输入姓名'
    loading.value = false
    return
  }
  if (!emailUsername.value.trim()) {
    error.value = '请输入邮箱地址'
    loading.value = false
    return
  }
  if (!form.value.password) {
    error.value = '请输入密码'
    loading.value = false
    return
  }
  if (pwdStrength.value < 3) {
    error.value = '密码强度不足，请设置更复杂的密码（至少 8 位，包含大小写字母和数字）'
    loading.value = false
    return
  }
  if (!form.value.verification_code) {
    error.value = '请输入邮箱验证码'
    loading.value = false
    return
  }
  
  try {
    // 调用注册 API
    const result = await apiRegister({
      username: form.value.name.trim().toLowerCase().replace(/\s+/g, '_'),
      password: form.value.password,
      email: email,
      verification_code: form.value.verification_code,
      aff_code: form.value.invite?.trim() || undefined
    })
    
    // 注册成功，跳转到登录页并提示获取 API Token
    error.value = ''
    setTimeout(() => {
      router.push({ 
        path: '/login', 
        query: { token: result.token, userId: result.user_id } 
      })
    }, 1000)
    
  } catch (e) {
    error.value = e.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 重置表单
function resetForm() {
  form.value = { name: '', phone: '', password: '', verification_code: '', invite: '' }
  emailUsername.value = ''
  emailDomain.value = 'qq.com'
  showPwd.value = false
  agreed.value = false
  error.value = ''
  verificationSent.value = false
  countdown.value = 0
  canSendCode.value = true
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 80px 24px;
  position: relative; overflow: hidden;
}
.auth-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  width: 100%; max-width: 1000px;
  background: #FFFFFF;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}
.auth-left {
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border-light);
  padding: 48px;
  display: flex; flex-direction: column; gap: 40px;
}
.auth-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none;
  font-family: var(--font-display); font-size: 1.5rem; font-weight: 500;
  color: var(--color-text-primary);
}
.auth-left-content { flex: 1; }
.auth-left-content h2 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 400; margin-bottom: 12px; }
.auth-left-content p { color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.8; margin-bottom: 28px; }
.perks { display: flex; flex-direction: column; gap: 14px; }
.perk-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--color-text-secondary); }
.perk-icon { font-size: 20px; width: 24px; flex-shrink: 0; }
.stats-row { display: flex; gap: 0; background: #FFFFFF; border: 1px solid var(--color-border-light); border-radius: var(--radius-md); overflow: hidden; }
.mini-stat { flex: 1; padding: 16px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
.mini-stat:not(:last-child) { border-right: 1px solid var(--color-border-light); }
.mini-stat-num { font-family: var(--font-display); font-size: 1.2rem; font-weight: 500; color: var(--color-text-primary); }
.mini-stat-label { font-size: 11px; color: var(--color-text-muted); }

.auth-right { padding: 48px; display: flex; align-items: center; justify-content: center; background: #FFFFFF; }
.auth-form-wrap { width: 100%; max-width: 400px; }
.auth-title { font-family: var(--font-display); font-size: 1.9rem; font-weight: 400; margin-bottom: 8px; color: var(--color-text-primary); }
.auth-subtitle { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 24px; }
.auth-link { color: var(--color-accent); text-decoration: none; font-weight: 500; }

.oauth-btns { margin-bottom: 20px; }
.oauth-btn {
  width: 100%; padding: 12px;
  background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-md);
  color: var(--color-text-primary); font-size: 14px; font-weight: 500; cursor: pointer;
  transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 10px;
  font-family: var(--font-body);
}
.oauth-btn:hover { background: var(--color-bg-secondary); border-color: var(--color-text-primary); }

.divider { position: relative; text-align: center; margin: 4px 0 18px; }
.divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--color-border-light); }
.divider span { position: relative; background: #FFFFFF; padding: 0 12px; font-size: 12px; color: var(--color-text-muted); }

.auth-form { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-group label { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.08em; }
.password-wrap { position: relative; }
.pwd-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 4px; transition: var(--transition); }
.pwd-toggle:hover { color: var(--color-text-primary); }

.pwd-strength { display: flex; align-items: center; gap: 6px; margin-top: 8px; }
.strength-bar { flex: 1; height: 3px; background: var(--color-border-light); border-radius: 2px; transition: var(--transition); }
.strength-bar.active.level-1 { background: #B85050; }
.strength-bar.active.level-2 { background: #B87A4B; }
.strength-bar.active.level-3 { background: #B89A4B; }
.strength-bar.active.level-4 { background: #6F8F6F; }
.strength-label { font-size: 11px; white-space: nowrap; }
.text-level-1 { color: #B85050; }
.text-level-2 { color: #B87A4B; }
.text-level-3 { color: #B89A4B; }
.text-level-4 { color: #6F8F6F; }

.checkbox-wrap {
  display: flex; align-items: flex-start; gap: 10px; cursor: pointer;
  font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5;
}
.checkbox-wrap input { display: none; }
.checkmark {
  width: 18px; height: 18px; min-width: 18px;
  background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 4px;
  display: flex; align-items: center; justify-content: center; transition: var(--transition);
}
.checkbox-wrap input:checked + .checkmark { background: var(--color-primary); border-color: var(--color-primary); }
.checkbox-wrap input:checked + .checkmark::after { content: '✓'; font-size: 11px; color: #fff; font-weight: 700; }

.error-msg {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; background: rgba(184,80,80,0.06); border: 1px solid rgba(184,80,80,0.25);
  border-radius: var(--radius-sm); font-size: 13px; color: #B85050;
}
.email-input-wrap {
  display: flex;
  align-items: center;
  gap: 0;
}
.email-at {
  padding: 0 8px;
  color: var(--color-text-muted);
  font-size: 16px;
}
.email-domain-select {
  height: 42px;
  padding: 0 12px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}
.email-domain-select option {
  background: #FFFFFF;
  color: var(--color-text-primary);
}
.email-domain-select:focus {
  outline: none;
  border-color: var(--color-accent);
}
.code-input-wrap {
  display: flex; gap: 8px;
}
.send-code-btn {
  white-space: nowrap;
  padding: 0 16px;
  height: 38px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}
.send-code-btn:hover:not(:disabled) {
  background: #FFFFFF;
  border-color: var(--color-text-primary);
}
.send-code-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.loading-dot {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin-slow 0.7s linear infinite;
}

@media (max-width: 768px) {
  .auth-container { grid-template-columns: 1fr; }
  .auth-left { display: none; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
