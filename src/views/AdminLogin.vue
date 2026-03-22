<template>
  <div class="login-container">
    <div class="login-form">
      <h2>管理员登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '@/api/admin'

export default {
  name: 'AdminLogin',
  setup() {
    const username = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')
    const router = useRouter()

    const handleLogin = async () => {
      if (!username.value || !password.value) {
        error.value = '请填写用户名和密码'
        return
      }

      loading.value = true
      error.value = ''
      
      try {
        const response = await adminLogin({
          username: username.value,
          password: password.value
        })
        
        // 存储token到localStorage
        localStorage.setItem('adminToken', response.access_token)
        
        // 跳转到管理员后台首页
        router.push('/admin')
      } catch (err) {
        error.value = err.response?.data?.message || err.message || '登录失败，请检查用户名和密码'
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background-color: #f8fafc;
  color: #1a202c;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background-color: #ffffff;
}

.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #e53e3e;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
  background-color: #fed7d7;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #feb2b2;
}
</style>