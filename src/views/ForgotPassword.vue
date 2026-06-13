<template>
  <main class="auth-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%);top:-100px;left:-150px;pointer-events:none;"></div>
    <div class="orb" style="width:400px;height:400px;background:radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%);bottom:-100px;right:-100px;pointer-events:none;"></div>

    <div class="auth-container">
      <!-- Left Panel -->
      <div class="auth-left">
        <RouterLink to="/" class="auth-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="url(#alg)" stroke-width="1.5" fill="rgba(99,102,241,0.15)"/>
            <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="url(#alg)"/>
            <defs>
              <linearGradient id="alg" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                <stop stop-color="#38bdf8"/><stop offset="1" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
          </svg>
          <span>chat-keeper</span>
        </RouterLink>

        <div class="auth-left-content">
          <h2>重置密码</h2>
          <p>通过验证您的账号信息，重新设置新的密码。</p>

          <div class="trial-note">
            <p class="trial-text">为保障账号安全，重置密码需要验证您的邮箱。</p>
          </div>
        </div>

        <div class="model-pills">
          <div v-for="m in modelPills" :key="m" class="model-pill">{{ m }}</div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="auth-right">
        <div class="auth-form-wrap">
          <!-- Step 1: Verify Account -->
          <template v-if="step === 1">
            <h1 class="auth-title">验证账号</h1>
            <p class="auth-subtitle">想起密码了？<RouterLink to="/login" class="auth-link">返回登录</RouterLink></p>

            <form @submit.prevent="handleResetRequest" class="auth-form">
              <div class="form-group">
                <label>用户名</label>
                <input v-model="form.username" type="text" class="input-field" placeholder="请输入用户名" required />
              </div>
              <div class="form-group">
                <label>邮箱地址</label>
                <input v-model="form.email" type="email" class="input-field" placeholder="your@email.com" required />
              </div>

              <div v-if="error" class="error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ error }}
              </div>

              <div v-if="remainingAttempts" class="warning-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {{ remainingAttemptsError }}
              </div>

              <div v-if="banned" class="banned-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                {{ bannedError }}
              </div>

              <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
                <span v-if="loading" class="loading-dot"></span>
                {{ loading ? '验证中...' : '验证账号' }}
              </button>

              <p class="warning-text">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                验证通过后将引导您设置新密码
              </p>
            </form>
          </template>

          <!-- Step 2: Set New Password -->
          <template v-else-if="step === 2">
            <h1 class="auth-title">设置新密码</h1>
            <p class="auth-subtitle">为账号 <span class="highlight-info">{{ form.username }}</span> 设置新密码</p>

            <div class="verified-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>邮箱 <span class="highlight-email">{{ form.email }}</span> 已验证</span>
            </div>

            <form @submit.prevent="handleSetNewPassword" class="auth-form">
              <div class="form-group">
                <label>新密码</label>
                <div class="password-wrap">
                  <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="input-field pwd-input" placeholder="至少8位,含大小写字母和数字" required />
                  <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                    <svg v-if="!showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
                <!-- Password strength -->
                <div class="pwd-strength" v-if="form.password">
                  <div v-for="i in 4" :key="i" class="strength-bar" :class="{ active: pwdStrength >= i, [`level-${pwdStrength}`]: true }"></div>
                  <span class="strength-label" :class="`text-level-${pwdStrength}`">{{ strengthLabel }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>确认密码</label>
                <div class="password-wrap">
                  <input v-model="form.confirmPassword" :type="showConfirmPwd ? 'text' : 'password'" class="input-field pwd-input" placeholder="请再次输入新密码" required />
                  <button type="button" class="pwd-toggle" @click="showConfirmPwd = !showConfirmPwd">
                    <svg v-if="!showConfirmPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
                <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="pwd-mismatch">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  两次输入的密码不一致
                </div>
                <div v-else-if="form.confirmPassword && form.password === form.confirmPassword" class="pwd-match">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  密码一致
                </div>
              </div>

              <div class="form-group">
                <label>邮箱验证码</label>
                <div class="code-input-wrap">
                  <input v-model="form.verification_code" type="text" class="input-field" placeholder="请输入验证码" maxlength="6" required />
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

              <div v-if="error" class="error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ error }}
              </div>

              <div v-if="codeSentMessage" class="success-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {{ codeSentMessage }}
              </div>

              <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
                <span v-if="loading" class="loading-dot"></span>
                {{ loading ? '设置中...' : '确认重置密码' }}
              </button>
            </form>
          </template>

          <!-- Step 3: Success -->
          <template v-else-if="step === 3">
            <div class="success-container">
              <div class="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2>密码重置成功</h2>
              <p class="success-text">您的新密码已设置成功，现在可以使用新密码登录账号了。</p>
              <button @click="goToLogin" class="btn btn-primary submit-btn">
                立即登录
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { resetPassword } from '@/api/reset-password'
import { sendVerificationCode, register as apiRegister } from '@/api/register'

const router = useRouter()

const step = ref(1) // 1: 验证账号, 2: 设置新密码, 3: 成功
const form = ref({ 
  username: '', 
  email: '', 
  password: '', 
  confirmPassword: '',
  verification_code: '' 
})
const showPwd = ref(false)
const showConfirmPwd = ref(false)
const loading = ref(false)
const error = ref('')
const remainingAttempts = ref(null)
const remainingAttemptsError = ref('')
const banned = ref(false)
const bannedError = ref('')

// 验证码相关状态
const sendingCodeLoading = ref(false)
const countdown = ref(0)
const canSendCode = ref(true)
const codeSentMessage = ref('')

const modelPills = ['xAI', 'Anthropic', 'Gemini', 'OpenAI']

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

function parseRemainingAttempts(message) {
  const match = message.match(/(\d+)次/)
  return match ? parseInt(match[1], 10) : null
}

async function handleResetRequest() {
  loading.value = true
  error.value = ''
  remainingAttempts.value = null
  banned.value = false

  try {
    await resetPassword({
      username: form.value.username,
      email: form.value.email
    })

    // 验证通过，进入设置新密码步骤
    step.value = 2
  } catch (e) {
    const message = e.message || '验证失败'

    if (message.includes('IP已被封禁1天') || message.includes('IP已被限制访问')) {
      banned.value = true
      bannedError.value = message
      remainingAttempts.value = null
      remainingAttemptsError.value = ''
      error.value = ''
    } else if (message.includes('您还有')) {
      remainingAttempts.value = parseRemainingAttempts(message)
      remainingAttemptsError.value = message
      error.value = ''
    } else {
      remainingAttempts.value = null
      remainingAttemptsError.value = ''
      error.value = message
    }
  } finally {
    loading.value = false
  }
}

async function handleSendCode() {
  if (!canSendCode.value) return
  
  sendingCodeLoading.value = true
  codeSentMessage.value = ''
  try {
    await sendVerificationCode(form.value.email)
    
    codeSentMessage.value = `验证码已发送至 ${form.value.email}，请查收`
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
  } finally {
    sendingCodeLoading.value = false
  }
}

async function handleSetNewPassword() {
  loading.value = true
  error.value = ''

  // 验证密码
  if (!form.value.password) {
    error.value = '请输入新密码'
    loading.value = false
    return
  }
  if (pwdStrength.value < 3) {
    error.value = '密码强度不足，请设置更复杂的密码（至少 8 位，包含大小写字母和数字）'
    loading.value = false
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    loading.value = false
    return
  }
  if (!form.value.verification_code) {
    error.value = '请输入邮箱验证码'
    loading.value = false
    return
  }

  try {
    // 调用注册 API 完成重置（实际上是重新注册）
    await apiRegister({
      username: form.value.username.toLowerCase().trim(),
      password: form.value.password,
      email: form.value.email,
      verification_code: form.value.verification_code,
      aff_code: undefined
    })

    // 成功，进入完成步骤
    step.value = 3
  } catch (e) {
    error.value = e.message || '设置密码失败，请重试'
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  position: relative;
  overflow: hidden;
}
.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 960px;
  background: var(--gradient-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}
.auth-left {
  background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(56,189,248,0.05) 100%);
  border-right: 1px solid var(--border);
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;
  overflow: hidden;
}
.auth-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.auth-left-content { flex: 1; }
.auth-left-content h2 { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin-bottom: 12px; }
.auth-left-content p { color: var(--text-secondary); font-size: 15px; line-height: 1.7; margin-bottom: 32px; }
.trial-note {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
}
.trial-text { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 0; }
.model-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.model-pill {
  padding: 5px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 12px;
  color: var(--text-secondary);
}

.auth-right { padding: 48px; display: flex; align-items: center; justify-content: center; }
.auth-form-wrap { width: 100%; max-width: 360px; }
.auth-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin-bottom: 8px; }
.auth-subtitle { font-size: 14px; color: var(--text-secondary); margin-bottom: 28px; }
.auth-link { color: var(--accent-cyan); text-decoration: none; font-weight: 500; }
.auth-link:hover { text-decoration: underline; }
.highlight-info { color: var(--accent-cyan); font-weight: 600; }
.highlight-email { color: var(--text-primary); }

.auth-form { display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
}
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font-body);
  transition: var(--transition);
}
.input-field.pwd-input {
  padding-right: 44px;
}
.input-field:focus {
  outline: none;
  border-color: var(--accent-cyan);
  background: rgba(255,255,255,0.08);
}
.input-field::placeholder { color: var(--text-muted); }

.password-wrap { position: relative; }
.pwd-toggle {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;
  transition: var(--transition);
}
.pwd-toggle:hover { color: var(--text-primary); }

.code-input-wrap { display: flex; gap: 8px; }
.send-code-btn {
  white-space: nowrap;
  padding: 0 16px;
  height: 38px;
  background: rgba(56,189,248,0.1);
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  font-family: var(--font-body);
}
.send-code-btn:hover:not(:disabled) { background: rgba(56,189,248,0.2); }
.send-code-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.error-msg {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #f87171;
}

.warning-msg {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: rgba(234,179,8,0.1);
  border: 1px solid rgba(234,179,8,0.2);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #fbbf24;
}

.banned-msg {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #fca5a5;
}

.success-msg {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #4ade80;
}

.verified-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #4ade80;
  margin-bottom: 20px;
}

.submit-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-top: 4px; }
.loading-dot {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin-slow 0.7s linear infinite;
}

.warning-text {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
}

/* Password strength */
.pwd-strength { display: flex; align-items: center; gap: 6px; margin-top: 8px; }

.pwd-mismatch {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #f87171;
  margin-top: 6px;
}

.pwd-match {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4ade80;
  margin-top: 6px;
}
.strength-bar { flex: 1; height: 3px; background: var(--border); border-radius: 2px; transition: var(--transition); }
.strength-bar.active.level-1 { background: #ef4444; }
.strength-bar.active.level-2 { background: #f97316; }
.strength-bar.active.level-3 { background: #eab308; }
.strength-bar.active.level-4 { background: #34d399; }
.strength-label { font-size: 11px; white-space: nowrap; }
.text-level-1 { color: #ef4444; }
.text-level-2 { color: #f97316; }
.text-level-3 { color: #eab308; }
.text-level-4 { color: #34d399; }

/* Success State */
.success-container {
  text-align: center;
  padding: 20px 0;
}
.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(34,197,94,0.1);
  border-radius: 50%;
  margin-bottom: 24px;
  color: #22c55e;
}
.success-container h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
}
.success-text {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .auth-container { grid-template-columns: 1fr; }
  .auth-left { display: none; }
}
</style>
