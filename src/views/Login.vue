<template>
  <main class="auth-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:-100px;left:-150px;pointer-events:none;"></div>
    <div class="orb" style="width:400px;height:400px;background:radial-gradient(circle,rgba(166,144,118,0.08) 0%,transparent 70%);bottom:-100px;right:-100px;pointer-events:none;"></div>

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
          <h2>欢迎回来</h2>
          <p>登录后即可访问国际顶级 AI 模型，开启高效智能创作之旅。</p>

          <div class="trial-note">
            <p class="trial-text">本站目前试运营中，旨在为每个客户提供优质的国外 AI 聊天服务，如有问题可进群反馈。</p>
          </div>
        </div>

        <div class="model-pills">
          <div v-for="m in modelPills" :key="m" class="model-pill">{{ m }}</div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="auth-right">
        <div class="auth-form-wrap">
          <h1 class="auth-title">登录账号</h1>
          <p class="auth-subtitle">还没有账号？<RouterLink to="/register" class="auth-link">免费注册</RouterLink></p>

          <!-- OAuth Buttons -->
          <!-- <div class="oauth-btns">
            <button class="oauth-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              使用 Google 登录
            </button>
            <button class="oauth-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              使用 GitHub 登录
            </button>
          </div> -->

          <div class="divider"><span>使用邮箱登录</span></div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label>邮箱地址</label>
              <input v-model="form.email" type="email" class="input-field" placeholder="your@email.com" required />
            </div>
            <div class="form-group">
              <label>
                密码
                <RouterLink to="/forgot-password" class="forgot-link">忘记密码？</RouterLink>
              </label>
              <div class="password-wrap">
                <input v-model="form.password" :type="showPwd ? 'text' : 'password'" class="input-field" placeholder="••••••••" required />
                <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                  <svg v-if="!showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <div v-if="error" class="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-dot"></span>
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // 导入用户状态管理

const router = useRouter()
const { login } = useUserStore() // 解构出login方法
const form = ref({ email: '', password: '' })
const showPwd = ref(false)
const loading = ref(false)
const error = ref('')

const modelPills = ['xAI', 'Anthropic', 'Gemini', 'OpenAI']

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    // 调用登录API
    const response = await fetch('/api/v1/auths/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // 检查错误信息中的detail字段，显示更友好的错误提示
      if (errorData.detail && typeof errorData.detail === 'string') {
        if (errorData.detail.includes('email or password') || errorData.detail.includes('邮箱') || errorData.detail.includes('密码')) {
          throw new Error('用户名或密码错误')
        }
      }
      throw new Error(errorData.message || `登录失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // 使用用户状态管理登录
    login(
      {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        profile_image_url: data.profile_image_url,
        initials: data.name?.charAt(0).toUpperCase() || data.email?.charAt(0).toUpperCase(),
        avatar: data.profile_image_url
      },
      {
        token: data.token,
        token_type: data.token_type,
        expires_at: data.expires_at
      },
      data.permissions
    )

    // 保存用户名和密码到 localStorage，用于兑换激活码
    localStorage.setItem('userCredentials', JSON.stringify({
      username: data.name,
      email: form.value.email,
      password: form.value.password
    }))

    // 登录成功后跳转到个人中心页
    router.push('/profile')
  } catch (e) {
    console.error('Login error:', e)
    error.value = e.message || '登录失败，请检查邮箱或密码。'
  } finally {
    loading.value = false
  }
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
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
.auth-left-content { flex: 1; }
.auth-left-content h2 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 400; margin-bottom: 12px; }
.auth-left-content p { color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.8; margin-bottom: 32px; }
.trial-note {
  background: #FFFFFF;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 20px;
}
.trial-text { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 0; }
.model-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.model-pill {
  padding: 5px 12px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.auth-right { padding: 48px; display: flex; align-items: center; justify-content: center; }
.auth-form-wrap { width: 100%; max-width: 360px; }
.auth-title { font-family: var(--font-display); font-size: 1.9rem; font-weight: 400; margin-bottom: 8px; color: var(--color-text-primary); }
.auth-subtitle { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 28px; }
.auth-link { color: var(--color-accent); text-decoration: none; font-weight: 500; }
.auth-link:hover { color: var(--color-text-primary); text-decoration: underline; }

.oauth-btns { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.oauth-btn {
  width: 100%;
  padding: 12px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  font-family: var(--font-body);
}
.oauth-btn:hover { background: var(--color-bg-secondary); border-color: var(--color-text-primary); }

.divider { position: relative; text-align: center; margin: 4px 0 20px; }
.divider::before {
  content: '';
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 1px;
  background: var(--color-border-light);
}
.divider span {
  position: relative;
  background: #FFFFFF;
  padding: 0 12px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.auth-form { display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.forgot-link { color: var(--color-accent); text-decoration: none; font-size: 13px; }
.forgot-link:hover { color: var(--color-text-primary); text-decoration: underline; }
.password-wrap { position: relative; }
.pwd-toggle {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 4px;
  transition: var(--transition);
}
.pwd-toggle:hover { color: var(--color-text-primary); }

.error-msg {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: rgba(184,80,80,0.06);
  border: 1px solid rgba(184,80,80,0.25);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: #B85050;
}
.submit-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-top: 4px; }
.loading-dot {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin-slow 0.7s linear infinite;
}

@media (max-width: 768px) {
  .auth-container { grid-template-columns: 1fr; }
  .auth-left { display: none; }
}
</style>