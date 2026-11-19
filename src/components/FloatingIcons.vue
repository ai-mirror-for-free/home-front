<template>
  <div class="floating-icons">
    <div class="icon-wrapper">
      <div class="floating-icon" :class="{ active: showQQPopup }" title="加入QQ群" @click="toggleQQPopup">
        <img src="/icon/QQ.svg" alt="QQ" />
      </div>
      <Transition name="popup">
        <div v-if="showQQPopup" class="qq-popup">
          <div class="popup-arrow"></div>
          <div class="popup-content">
            <div class="popup-header">
              <span class="qq-icon">🐧</span>
              <span class="popup-title">加入QQ群</span>
            </div>
            <div class="popup-body">
              <div class="group-number">
                <span class="label">群号</span>
                <span class="value">940836490</span>
                <button class="copy-btn" @click="copyGroupNumber">
                  <span v-if="!copied">复制</span>
                  <span v-else class="copied-text">已复制 ✓</span>
                </button>
              </div>
              <p class="hint">点击上方按钮复制群号</p>
              <p class="hint">在QQ中搜索即可加入</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <a :href="taobaoUrl" target="_blank" rel="noopener noreferrer" class="floating-icon" title="淘宝店铺">
      <img src="/icon/taobao.svg" alt="淘宝" />
    </a>
    <a :href="fakaUrl" target="_blank" rel="noopener noreferrer" class="floating-icon floating-icon-text" title="点击购买">
      <span class="floating-icon-emoji">🛒</span>
    </a>
    <!-- 反馈入口：仅登录 + 灰度白名单显示（后端 /api/tickets/entry 判定）；放最下方 -->
    <button
      v-if="showFeedback"
      class="floating-icon feedback-icon"
      title="意见反馈"
      @click="goFeedback"
    >
      <span class="floating-icon-emoji">💬</span>
      <span v-if="ticketUnread" class="feedback-badge">
        {{ ticketUnread > 9 ? '9+' : ticketUnread }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getTicketEntry } from '@/api/tickets'
import {
  getPurchaseLinks,
  DEFAULT_TAOBAO_URL
} from '@/api/siteLinks'

const showQQPopup = ref(false)
const copied = ref(false)

const router = useRouter()
const userStore = useUserStore()

// 灰度反馈入口：未登录 / 非白名单都静默隐藏
const showFeedback = ref(false)
const ticketUnread = ref(0)

async function loadFeedbackEntry() {
  if (!userStore.state.isLoggedIn) {
    showFeedback.value = false
    return
  }
  try {
    const data = await getTicketEntry()
    showFeedback.value = !!data?.enabled
    ticketUnread.value = data?.unread || 0
  } catch (e) {
    showFeedback.value = false
  }
}

function goFeedback() {
  router.push('/feedback')
}

// 购买链接优先取后台「配置管理」，未配置时用常量兜底
const taobaoUrl = ref(DEFAULT_TAOBAO_URL)
const fakaUrl = ref(DEFAULT_TAOBAO_URL)

function toggleQQPopup() {
  showQQPopup.value = !showQQPopup.value
}

function copyGroupNumber() {
  navigator.clipboard.writeText('940836490')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function handleClickOutside(event) {
  const wrapper = document.querySelector('.icon-wrapper')
  if (wrapper && !wrapper.contains(event.target)) {
    showQQPopup.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  loadFeedbackEntry()
  try {
    const links = await getPurchaseLinks()
    taobaoUrl.value = links.taobaoUrl
    fakaUrl.value = links.fakaUrl
  } catch (e) {
    console.warn('获取购买链接失败，使用默认链接:', e.message)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.floating-icons {
  position: fixed;
  bottom: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
}

.icon-wrapper {
  position: relative;
}
.floating-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.floating-icon:hover,
.floating-icon.active {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
}

.floating-icon.active {
  background: linear-gradient(135deg, #12b7f5 0%, #3498db 100%);
}

.floating-icon.active img {
  filter: brightness(0) invert(1);
}

.floating-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.floating-icon-text .floating-icon-emoji {
  font-size: 22px;
  line-height: 1;
}

/* 反馈入口（button 元素，继承 .floating-icon 外观） */
.feedback-icon {
  border: none;
  padding: 0;
  position: relative;
}

.feedback-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #C0392B;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}

.qq-popup {
  position: absolute;
  right: 56px;
  bottom: 0;
  width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.popup-arrow {
  position: absolute;
  right: -6px;
  bottom: 14px;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
}

.popup-content {
  position: relative;
  z-index: 1;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #12b7f5 0%, #3498db 100%);
  color: #fff;
}

.qq-icon {
  font-size: 18px;
}

.popup-title {
  font-size: 14px;
  font-weight: 600;
}

.popup-body {
  padding: 16px;
}

.group-number {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.group-number .label {
  font-size: 12px;
  color: #6c757d;
}

.group-number .value {
  font-size: 15px;
  font-weight: 600;
  color: #212529;
  flex: 1;
}

.copy-btn {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #12b7f5;
  background: #fff;
  border: 1px solid #12b7f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #12b7f5;
  color: #fff;
}

.copied-text {
  color: #28a745;
}

.hint {
  font-size: 12px;
  color: #6c757d;
  margin: 0 0 6px 0;
  text-align: center;
}

.hint:last-child {
  margin-bottom: 0;
}

/* 弹出动画 */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.popup-enter-from .qq-popup,
.popup-leave-to .qq-popup {
  transform: translateX(10px) scale(0.95);
}
</style>
