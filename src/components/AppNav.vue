<template>
  <nav class="nav" :class="{ scrolled: isScrolled }">
    <div class="container nav-inner">
      <!-- Logo -->
      <RouterLink to="/" class="logo">
        <span class="logo-text">chat-keeper<span class="logo-sub">— AI Gateway</span></span>
      </RouterLink>

      <!-- Desktop Nav -->
      <ul class="nav-links">
        <li><RouterLink to="/models" class="nav-link">模型广场</RouterLink></li>
        <li><RouterLink to="/pricing" class="nav-link">定价方案</RouterLink></li>
        <li><RouterLink to="/experience" class="nav-link">体验中心</RouterLink></li>
        <li><a href="/#features" class="nav-link">功能特性</a></li>
        <li><RouterLink to="/billing-rules" class="nav-link">计费规则</RouterLink></li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
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
      <RouterLink to="/experience" class="mobile-link" @click="mobileOpen=false">体验中心</RouterLink>
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
  background: rgba(253, 252, 251, 0.92);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--color-border-light);
  padding: 14px 0;
  transition: padding var(--transition);
}
.nav.scrolled {
  padding: 10px 0;
  background: rgba(253, 252, 251, 0.96);
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
.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.01em;
}
.logo-sub {
  font-weight: 300;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-left: 8px;
  font-style: italic;
  letter-spacing: 0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin-left: auto;
}
.nav-link {
  position: relative;
  padding: 8px 14px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 400;
  border-radius: 0;
  transition: color var(--transition);
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 14px; right: 14px; bottom: 4px;
  height: 1px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--transition);
}
.nav-link:hover {
  color: var(--color-text-primary);
}
.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
}
.nav-link.router-link-active {
  color: var(--color-text-primary);
}

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
  transition: opacity var(--transition);
}
.avatar-btn:hover { opacity: 0.8; }

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 500;
  overflow: hidden;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: 280px;
  background: #FFFFFF;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-medium);
  padding: 12px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.25s ease;
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
  padding: 8px 20px 16px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 8px;
}
.avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 500;
  margin-right: 12px;
  overflow: hidden;
}
.avatar-large img { width: 100%; height: 100%; object-fit: cover; }

.user-info h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--color-text-primary);
}
.user-info p {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
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
  padding: 11px 20px;
  text-decoration: none;
  color: var(--color-text-primary);
  transition: background-color var(--transition);
  border: none;
  background: none;
  width: 100%;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-body);
}
.dropdown-item:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-accent);
}
.icon-user::before { content: "👤"; margin-right: 10px; font-size: 14px; }
.icon-logout::before { content: "↩"; margin-right: 10px; font-size: 14px; }

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
  height: 1.5px;
  background: var(--color-text-primary);
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
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
}
.mobile-menu.open { display: flex; }
.mobile-link {
  padding: 14px 0;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid var(--color-border-light);
  transition: color var(--transition);
}
.mobile-link:hover { color: var(--color-text-primary); }
.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .nav-links, .nav-actions { display: none; }
  .mobile-toggle { display: flex; }
  .logo-sub { display: none; }
}
</style>