<template>
  <nav class="nav" :class="{ scrolled: isScrolled }">
    <div class="container nav-inner">
      <!-- Logo -->
      <RouterLink to="/" class="logo">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25 8V20L14 26L3 20V8L14 2 25 8Z" stroke="url(#logoGrad)" stroke-width="1.5" fill="rgba(99,102,241,0.15)"/>
            <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="url(#logoGrad)"/>
            <defs>
              <linearGradient id="logoGrad" x1="3" y1="2" x2="25" y2="26" gradientUnits="userSpaceOnUse">
                <stop stop-color="#38bdf8"/>
                <stop offset="1" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">chat-keeper</span>
      </RouterLink>

      <!-- Desktop Nav -->
      <ul class="nav-links">
        <li><RouterLink to="/models" class="nav-link">模型广场</RouterLink></li>
        <li><RouterLink to="/pricing" class="nav-link">定价方案</RouterLink></li>
        <li><a href="/#features" class="nav-link">功能特性</a></li>
        <li><RouterLink to="/billing-rules" class="nav-link">计费规则</RouterLink></li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
        <!-- 如果用户已登录，显示头像下拉菜单 -->
        <template v-if="userStore.state.isLoggedIn">
          <div class="user-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
            <button class="avatar-btn" @click="toggleDropdown" aria-label="User menu">
              <div class="avatar">
                <span v-if="!userStore.state.userInfo.avatar">{{ userStore.state.userInfo.initials || 'U' }}</span>
                <img v-else :src="userStore.state.userInfo.avatar" :alt="userStore.state.userInfo.name" />
              </div>
            </button>
            
            <div class="dropdown-menu" :class="{ 'show': showDropdown }">
              <div class="dropdown-header">
                <div class="avatar-large">
                  <span v-if="!userStore.state.userInfo.avatar">{{ userStore.state.userInfo.initials || 'U' }}</span>
                  <img v-else :src="userStore.state.userInfo.avatar" :alt="userStore.state.userInfo.name" />
                </div>
                <div class="user-info">
                  <h4>{{ userStore.state.userInfo.name || '用户' }}</h4>
                  <p>{{ userStore.state.userInfo.email }}</p>
                </div>
              </div>
              
              <div class="dropdown-body">
                <RouterLink to="/profile" class="dropdown-item" @click="closeDropdown">
                  <i class="icon-user"></i> 个人中心
                </RouterLink>
                <button class="dropdown-item" @click="handleLogout" @click.stop="closeDropdown">
                  <i class="icon-logout"></i> 退出登录
                </button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-ghost">登录</RouterLink>
          <!-- <RouterLink to="/login" class="btn btn-primary">开始体验</RouterLink> -->
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <span :class="{ open: mobileOpen }"></span>
        <span :class="{ open: mobileOpen }"></span>
        <span :class="{ open: mobileOpen }"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: mobileOpen }">
      <RouterLink to="/models" class="mobile-link" @click="mobileOpen=false">模型广场</RouterLink>
      <RouterLink to="/pricing" class="mobile-link" @click="mobileOpen=false">定价方案</RouterLink>
      <a href="/#features" class="mobile-link" @click="mobileOpen=false">功能特性</a>
      <RouterLink to="/billing-rules" class="mobile-link" @click="mobileOpen=false">计费规则</RouterLink>
      
      <template v-if="userStore.state.isLoggedIn">
        <RouterLink to="/profile" class="mobile-link" @click="mobileOpen=false">个人中心</RouterLink>
        <div class="mobile-actions">
          <button @click="handleLogoutAndCloseMenu" class="btn btn-primary" style="width:100%;justify-content:center">退出登录</button>
        </div>
      </template>
      <template v-else>
        <div class="mobile-actions">
          <RouterLink to="/login" class="btn btn-outline" style="width:100%;justify-content:center" @click="mobileOpen=false">登录</RouterLink>
          <!-- <RouterLink to="/register" class="btn btn-primary" style="width:100%;justify-content:center" @click="mobileOpen=false">开始体验</RouterLink> -->
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const isScrolled = ref(false)
const mobileOpen = ref(false)
const showDropdown = ref(false)
const router = useRouter()
const userStore = useUserStore()

// 检查是否为管理员
const isAdmin = computed(() => {
  return userStore.state.isAdmin || localStorage.getItem('adminToken') !== null
})

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function handleLogout() {
  userStore.logout()
  router.push('/')
  closeDropdown()
}

function handleLogoutAndCloseMenu() {
  handleLogout()
  mobileOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 在实际应用中，这里应该检查用户的认证状态
  // 例如从localStorage、Vuex store或API检查认证状态
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  transition: var(--transition);
  padding: 16px 0;
}
.nav.scrolled {
  background: rgba(2, 4, 9, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 12px 0;
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon { display: flex; align-items: center; }
.logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin-left: auto;
}
.nav-link {
  padding: 8px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}
.nav-link:hover, .nav-link.router-link-active {
  color: var(--text-primary);
  background: rgba(255,255,255,0.06);
}

/* 管理员链接样式 */
.admin-link {
  background: linear-gradient(135deg, #6f42c1, #9333ea);
  color: white;
  padding: 8px 16px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.admin-link:hover {
  background: linear-gradient(135deg, #5a32a3, #7c2d12);
  transform: translateY(-1px);
}

.mobile-link.admin-link {
  color: white;
  background: linear-gradient(135deg, #6f42c1, #9333ea);
  border: none;
  margin-top: 8px;
}

.mobile-link.admin-link:hover {
  opacity: 0.9;
  transform: none;
}

/* 头像按钮样式 */
.user-dropdown {
  position: relative;
  display: inline-block;
}

.avatar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.avatar-btn:hover {
  background-color: rgba(255,255,255,0.1);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 280px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 16px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  display: flex;
  align-items: center;
  padding: 0 20px 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}

.avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 12px;
  overflow: hidden;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.dropdown-body {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: var(--text-primary);
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  font-size: 14px;
  text-align: left;
}

.dropdown-item:hover {
  background-color: rgba(255,255,255,0.06);
  color: var(--text-primary);
}

.icon-user::before {
  content: "👤";
  margin-right: 8px;
}

.icon-logout::before {
  content: "🚪";
  margin-right: 8px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}
.mobile-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}
.mobile-toggle span:nth-child(1).open { transform: rotate(45deg) translate(5px, 5px); }
.mobile-toggle span:nth-child(2).open { opacity: 0; }
.mobile-toggle span:nth-child(3).open { transform: rotate(-45deg) translate(5px, -5px); }

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border);
  background: rgba(2, 4, 9, 0.95);
  backdrop-filter: blur(20px);
}
.mobile-menu.open { display: flex; }
.mobile-link {
  padding: 14px 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid var(--border);
  transition: var(--transition);
}
.mobile-link:hover { color: var(--text-primary); }
.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .mobile-toggle { display: flex; }
}
</style>