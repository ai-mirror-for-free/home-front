<template>
  <div id="app">
    <!-- 非管理员页面显示顶部导航栏 -->
    <template v-if="!isAdminRoute">
      <AppNav />
    </template>
    <RouterView />
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()

// 判断是否为管理员相关路由
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>
#app {
  min-height: 100vh;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
}
</style>