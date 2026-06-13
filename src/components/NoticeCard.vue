<template>
  <Teleport to="body">
    <Transition name="notice-fade">
      <div v-if="visible" class="notice-overlay" @click.self="handleClose">
        <div class="notice-card" :class="{ 'notice-mobile': isMobile }">
          <div class="notice-header">
            <div class="notice-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="notice-title">公告通知</h2>
            <button class="notice-close-btn" @click="handleClose" aria-label="关闭">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="notice-content" v-html="renderedContent"></div>
          
          <div class="notice-footer">
            <label class="notice-checkbox">
              <input type="checkbox" v-model="dontShowAgain" />
              <span class="checkmark"></span>
              <span class="checkbox-label">不再提示</span>
            </label>
            <div class="notice-buttons">
              <button class="btn btn-outline notice-btn" @click="handleConfirm">
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'
import { getNoticeText } from '@/api/notice'

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

const STORAGE_KEY = 'notice_dismissed'
const NOTICE_TIME_KEY = 'notice_time'

const visible = ref(false)
const content = ref('')
const noticeTime = ref('')
const dontShowAgain = ref(false)
const isMobile = ref(false)

// 渲染后的 HTML 内容
const renderedContent = computed(() => {
  if (!content.value) return ''
  // 先解码转义字符，然后解析 markdown
  const decoded = content.value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
  return marked(decoded)
})

// 检测是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 获取公告数据
const fetchNotice = async () => {
  try {
    const data = await getNoticeText()
    if (!data) return false
    
    content.value = data.content || ''
    noticeTime.value = data.time || ''
    
    if (!content.value) return false
    
    // 检查是否需要显示公告
    const savedTime = localStorage.getItem(NOTICE_TIME_KEY)
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    
    // 如果用户勾选了不再提示，且时间相同，则不显示
    if (isDismissed && savedTime === noticeTime.value) {
      return false
    }
    
    return true
  } catch (error) {
    console.warn('获取公告失败:', error)
    return false
  }
}

// 关闭处理
const handleClose = () => {
  visible.value = false
}

// 确认处理
const handleConfirm = () => {
  // 如果勾选了不再提示，保存状态
  if (dontShowAgain.value) {
    localStorage.setItem(STORAGE_KEY, 'true')
    localStorage.setItem(NOTICE_TIME_KEY, noticeTime.value)
  }
  visible.value = false
}

// 初始化
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  const shouldShow = await fetchNotice()
  if (shouldShow) {
    // 延迟一点显示，让页面先渲染
    setTimeout(() => {
      visible.value = true
    }, 500)
  }
})
</script>

<style scoped>
.notice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.notice-card {
  background: var(--gradient-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 40px rgba(56, 189, 248, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.notice-card.notice-mobile {
  max-width: 100%;
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  background: rgba(56, 189, 248, 0.05);
}

.notice-icon {
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
  margin: 0;
}

.notice-close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: var(--transition);
}

.notice-close-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.notice-content {
  padding: 24px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-primary);
  flex: 1;
  overflow-y: auto;
}

/* Markdown 渲染样式 */
.notice-content :deep(h1),
.notice-content :deep(h2),
.notice-content :deep(h3),
.notice-content :deep(h4),
.notice-content :deep(h5),
.notice-content :deep(h6) {
  margin: 0 0 12px 0;
  font-family: var(--font-display);
  color: var(--text-primary);
}

.notice-content :deep(h1) { font-size: 1.5em; }
.notice-content :deep(h2) { font-size: 1.3em; }
.notice-content :deep(h3) { font-size: 1.15em; }

.notice-content :deep(p) {
  margin: 0 0 12px 0;
}

.notice-content :deep(p:last-child) {
  margin-bottom: 0;
}

.notice-content :deep(a) {
  color: var(--accent-cyan);
  text-decoration: none;
}

.notice-content :deep(a:hover) {
  text-decoration: underline;
}

.notice-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.notice-content :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.notice-content :deep(pre code) {
  background: none;
  padding: 0;
}

.notice-content :deep(ul),
.notice-content :deep(ol) {
  margin: 0 0 12px 0;
  padding-left: 24px;
}

.notice-content :deep(li) {
  margin: 4px 0;
}

.notice-content :deep(blockquote) {
  margin: 12px 0;
  padding: 8px 16px;
  border-left: 3px solid var(--accent-cyan);
  background: rgba(56, 189, 248, 0.05);
  color: var(--text-secondary);
}

.notice-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}

.notice-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.notice-content :deep(th),
.notice-content :deep(td) {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}

.notice-content :deep(th) {
  background: rgba(255, 255, 255, 0.05);
}

.notice-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.2);
}

.notice-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.notice-checkbox input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--text-muted);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  position: relative;
}

.notice-checkbox input:checked + .checkmark {
  background: var(--accent-cyan);
  border-color: var(--accent-cyan);
}

.notice-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.notice-buttons {
  display: flex;
  gap: 12px;
}

.notice-btn {
  padding: 10px 24px;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .notice-overlay {
    padding: 16px;
    align-items: flex-end;
  }
  
  .notice-card {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 80vh;
  }
  
  .notice-header {
    padding: 16px 20px;
  }
  
  .notice-content {
    padding: 20px;
    max-height: 250px;
  }
  
  .notice-footer {
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
  }
  
  .notice-checkbox {
    align-self: flex-start;
  }
  
  .notice-buttons {
    width: 100%;
  }
  
  .notice-btn {
    flex: 1;
  }
}

/* 过渡动画 */
.notice-fade-enter-active,
.notice-fade-leave-active {
  transition: opacity 0.3s ease;
}

.notice-fade-enter-active .notice-card,
.notice-fade-leave-active .notice-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.notice-fade-enter-from,
.notice-fade-leave-to {
  opacity: 0;
}

.notice-fade-enter-from .notice-card,
.notice-fade-leave-to .notice-card {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}
</style>
