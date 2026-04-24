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
    <a href="https://e.tb.cn/h.is8ENECRT7auWfa?tk=1stT58rRcnx" target="_blank" class="floating-icon" title="淘宝店铺">
      <img src="/icon/taobao.svg" alt="淘宝" />
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showQQPopup = ref(false)
const copied = ref(false)

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
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
