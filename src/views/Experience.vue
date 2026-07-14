<template>
  <main class="experience-page">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(139,115,85,0.08) 0%,transparent 70%);top:0;right:0;pointer-events:none;"></div>
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(166,144,118,0.08) 0%,transparent 70%);bottom:0;left:0;pointer-events:none;"></div>

    <div class="container">
      <div class="page-header">
        <span class="tag tag-cyan">体验中心</span>
        <h1 class="page-title">模型体验中心</h1>
        <p class="page-desc">输入 API Key 即可查询余额并体验模型单轮对话，支持图片输出。Key 仅保存在本地，过期自动清除。</p>
      </div>

      <div class="layout">
        <!-- Left: Key & Balance -->
        <section class="card panel">
          <div class="panel-header">
            <h2 class="panel-title"><span class="dot"></span>Key 与余额</h2>
            <span v-if="key" class="key-status">已保存 · 剩余 {{ formatRemainTime() }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">API Key</label>
            <div class="input-wrap">
              <input
                :type="showKey ? 'text' : 'password'"
                v-model="key"
                class="input-field"
                placeholder="请输入你的 API Key（sk-...）"
                @input="onKeyInput"
              />
              <button type="button" class="toggle-btn" @click="showKey = !showKey">
                {{ showKey ? '隐藏' : '显示' }}
              </button>
            </div>
            <div class="hint">
              <label class="expire-label">
                <span>过期时间</span>
                <select v-model.number="expireMinutes" class="expire-select">
                  <option :value="30">30 分钟</option>
                  <option :value="60">1 小时</option>
                  <option :value="60 * 24">1 天</option>
                  <option :value="60 * 24 * 7">7 天</option>
                </select>
              </label>
            </div>
          </div>

          <div class="actions-row">
            <button class="btn btn-primary" :disabled="!key || balanceLoading" @click="fetchBalance">
              <span v-if="balanceLoading" class="spinner"></span>
              <span v-else>查询余额</span>
            </button>
            <button v-if="key" class="btn btn-outline" @click="clearKey">清除 Key</button>
          </div>

          <transition name="fade">
            <div v-if="balance" class="balance-box">
              <div class="balance-main">
                <div class="balance-label">剩余额度</div>
                <div class="balance-value">{{ balance.unlimited ? '∞' : (balance.balance || '¥0.00') }}</div>
                <div v-if="!balance.unlimited && balance.balance_raw != null" class="balance-sub">余额数值：{{ balance.balance_raw }}</div>
              </div>
            </div>
          </transition>

          <div v-if="balanceError" class="error-msg">{{ balanceError }}</div>
        </section>

        <!-- Right: Chat -->
        <section class="card panel">
          <div class="panel-header">
            <h2 class="panel-title"><span class="dot dot-cyan"></span>体验聊天</h2>
            <div v-if="!key" class="warn-tip">请先在左侧输入 Key</div>
          </div>

          <div class="chat-toolbar">
            <div class="model-select-wrap">
              <label class="form-label sm">模型</label>
                <select v-model="selectedModel" class="input-field model-select" :disabled="modelsLoading">
                <option value="">请选择模型</option>
                <option v-for="m in modelList" :key="m.id" :value="m.id">{{ m.name || m.id }}</option>
              </select>
            </div>
            <button class="btn btn-ghost btn-sm" @click="loadModels" :disabled="modelsLoading">刷新</button>
            <button class="btn btn-ghost btn-sm" @click="clearChat">清空</button>
          </div>

          <div class="chat-window" ref="chatWindowRef">
            <div v-if="messages.length === 0" class="chat-empty">
              <div class="empty-icon">💬</div>
              <p>开始你的第一句对话吧</p>
            </div>
            <div v-for="(msg, idx) in messages" :key="idx" class="msg" :class="msg.role">
              <div class="msg-avatar">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
              <div class="msg-body">
                <div class="msg-text" v-html="renderMessage(msg)"></div>
              </div>
            </div>
            <div v-if="chatLoading" class="msg assistant">
              <div class="msg-avatar">AI</div>
              <div class="msg-body">
                <div class="msg-text typing"><span></span><span></span><span></span></div>
              </div>
            </div>
          </div>

          <div v-if="chatError" class="error-msg">{{ chatError }}</div>

          <div class="chat-input-wrap">
            <textarea
              v-model="chatInput"
              class="input-field chat-input"
              rows="2"
              placeholder="输入消息，Enter 发送，Shift+Enter 换行"
              :disabled="chatLoading"
              @keydown.enter.exact.prevent="sendMessage"
            ></textarea>
            <button class="btn btn-primary send-btn" :disabled="chatLoading || !key || !selectedModel || !chatInput.trim()" @click="sendMessage">
              <span v-if="chatLoading" class="spinner"></span>
              <span v-else>发送</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { getStoredKey, setStoredKey, clearStoredKey, checkQuota, sendExperience, fetchExperienceModels } from '@/api/experience'

const KEY_DEFAULT_TTL = 60 * 60 * 1000

const key = ref('')
const showKey = ref(false)
const expireMinutes = ref(60)
const keyExpiresAt = ref(0)
let expireTimer = null

const balance = ref(null)
const balanceLoading = ref(false)
const balanceError = ref('')

const modelList = ref([])
const selectedModel = ref('')
const modelsLoading = ref(false)

const messages = ref([])
const chatInput = ref('')
const chatLoading = ref(false)
const chatError = ref('')
const chatWindowRef = ref(null)

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0'
  if (n < 0) return '∞'
  return Number(n).toLocaleString()
}

const formatRemainTime = () => {
  if (!keyExpiresAt.value) return ''
  const diff = keyExpiresAt.value - Date.now()
  if (diff <= 0) return '已过期'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} 分钟`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时`
  return `${Math.floor(hours / 24)} 天`
}

function onKeyInput() {
  if (!key.value) return
  const trimmed = key.value.trim()
  if (trimmed !== key.value) key.value = trimmed
  if (!trimmed) return
  const ttl = expireMinutes.value * 60 * 1000
  setStoredKey(trimmed, ttl)
  keyExpiresAt.value = Date.now() + ttl
  balance.value = null
  scheduleExpire()
}

function scheduleExpire() {
  if (expireTimer) clearTimeout(expireTimer)
  if (!keyExpiresAt.value) return
  const delay = keyExpiresAt.value - Date.now()
  if (delay <= 0) {
    handleExpire()
    return
  }
  expireTimer = setTimeout(handleExpire, delay)
}

function handleExpire() {
  clearStoredKey()
  key.value = ''
  keyExpiresAt.value = 0
  balance.value = null
}

function clearKey() {
  clearStoredKey()
  key.value = ''
  keyExpiresAt.value = 0
  balance.value = null
  balanceError.value = ''
}

async function fetchBalance() {
  if (!key.value) return
  const trimmed = key.value.trim()
  if (trimmed !== key.value) key.value = trimmed
  if (!trimmed) return
  balanceLoading.value = true
  balanceError.value = ''
  try {
    balance.value = await checkQuota(trimmed)
  } catch (e) {
    balanceError.value = e.message || '查询失败'
    balance.value = null
  } finally {
    balanceLoading.value = false
  }
}

async function loadModels() {
  modelsLoading.value = true
  try {
    const list = await fetchExperienceModels()
    modelList.value = list
    if (list.length && !selectedModel.value) {
      const first = list[0]
      selectedModel.value = first.id || ''
    }
  } catch (e) {
    modelList.value = []
  } finally {
    modelsLoading.value = false
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function renderMessage(msg) {
  const text = msg.content || ''
  if (msg.role === 'user') {
    return escapeHtml(text).replace(/\n/g, '<br/>')
  }
  const images = msg.images || []
  let html = escapeHtml(text)
  html = html.replace(/```([\s\S]*?)```/g, (m, p1) => `<pre class="code-block"><code>${escapeHtml(p1)}</code></pre>`)
  html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')
  html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => `<img class="msg-image" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" />`)
  html = html.replace(/(https?:\/\/[^\s)]+\.(?:png|jpg|jpeg|gif|webp|svg))(?!\))/gi, (m, url) => `<img class="msg-image" src="${escapeHtml(url)}" alt="image" />`)
  html = html.replace(/\n/g, '<br/>')
  if (images.length) {
    html += '<div class="msg-images">' + images.map((u) => `<img class="msg-image" src="${escapeHtml(u)}" alt="image" />`).join('') + '</div>'
  }
  return html
}

async function sendMessage() {
  if (!key.value || !selectedModel.value || !chatInput.value.trim() || chatLoading.value) return
  const text = chatInput.value.trim()
  chatInput.value = ''
  chatError.value = ''
  messages.value.push({ role: 'user', content: text })
  chatLoading.value = true
  await nextTick()
  scrollToBottom()
  try {
    const data = await sendExperience({
      key: key.value,
      model: selectedModel.value,
      text
    })
    if (data.type === 'image' && data.image_base64) {
      const fmt = (data.format || 'png').toLowerCase()
      const dataUrl = `data:image/${fmt};base64,${data.image_base64}`
      const meta = data.model ? `已生成图片 (模型: ${data.model}${data.elapsed ? `, 耗时 ${data.elapsed.toFixed(2)}s` : ''})` : '已生成图片'
      messages.value.push({ role: 'assistant', content: meta, images: [dataUrl] })
    } else {
      const content = data.content || ''
      messages.value.push({ role: 'assistant', content })
    }
  } catch (e) {
    chatError.value = e.message || '请求失败'
    messages.value.push({ role: 'assistant', content: '⚠️ ' + (e.message || '请求失败') })
  } finally {
    chatLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function clearChat() {
  messages.value = []
  chatError.value = ''
}

function scrollToBottom() {
  if (chatWindowRef.value) {
    chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight
  }
}

watch(messages, () => nextTick(scrollToBottom), { deep: true })

onMounted(() => {
  const stored = getStoredKey()
  if (stored) {
    key.value = stored
    try {
      const raw = localStorage.getItem('experience_center_key')
      if (raw) {
        const data = JSON.parse(raw)
        keyExpiresAt.value = data.expiresAt || 0
        const remain = (data.expiresAt - Date.now()) / 60000
        if (remain > 0) {
          expireMinutes.value = Math.max(30, Math.round(remain / 60) * 60)
        }
      }
    } catch (e) {}
    scheduleExpire()
  }
  loadModels()
})
</script>

<style scoped>
.experience-page {
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  padding: 60px 32px;
  background: linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 48px;
}
.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  margin: 16px 0 16px;
  letter-spacing: -0.02em;
}
.page-desc { color: var(--color-text-muted); font-size: 1.05rem; max-width: 600px; margin: 0 auto; line-height: 1.8; }

.layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
}

.panel { padding: 24px; display: flex; flex-direction: column; gap: 18px; height: fit-content; min-height: 0; }
.panel-header { display: flex; justify-content: space-between; align-items: center; }
.panel-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--color-accent);
}
.dot-cyan {
  background: var(--color-accent-warm);
}
.key-status {
  font-size: 11px;
  color: var(--accent-green);
  background: rgba(111,143,111,0.08);
  border: 1px solid rgba(111,143,111,0.25);
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.warn-tip {
  font-size: 11px;
  color: #B89A4B;
  background: rgba(184,154,75,0.08);
  border: 1px solid rgba(184,154,75,0.25);
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.form-label.sm { font-size: 11px; }
.input-wrap { position: relative; }
.input-wrap .input-field { padding-right: 64px; font-family: monospace; font-size: 13px; }
.toggle-btn {
  position: absolute;
  right: 8px; top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: var(--transition);
}
.toggle-btn:hover { color: var(--color-text-primary); background: var(--color-bg-secondary); }

.hint { display: flex; justify-content: flex-end; }
.expire-label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-text-muted); }
.expire-select {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  font-family: var(--font-body);
}
.expire-select option {
  background-color: #FFFFFF;
  color: var(--color-text-primary);
}

.actions-row { display: flex; gap: 10px; }
.actions-row .btn { flex: 1; justify-content: center; }
.actions-row .btn-outline { flex: 0 0 auto; }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.balance-box {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.balance-main { display: flex; flex-direction: column; gap: 4px; }
.balance-label { font-size: 12px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.balance-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
.balance-value .unit { font-size: 12px; color: var(--color-text-muted); }
.balance-sub { font-size: 12px; color: var(--color-text-muted); margin-top: 4px; }

.error-msg {
  font-size: 13px;
  color: #B85050;
  background: rgba(184,80,80,0.06);
  border: 1px solid rgba(184,80,80,0.25);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
}

/* Chat */
.panel:last-child { height: calc(100vh - 240px); min-height: 560px; }
.chat-toolbar {
  display: flex;
  align-items: end;
  gap: 10px;
}
.model-select-wrap { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.model-select { font-size: 13px; padding: 10px 12px; background-color: #FFFFFF; }
.model-select option {
  background-color: #FFFFFF;
  color: var(--color-text-primary);
}
.btn-sm { padding: 8px 14px; font-size: 12px; }

.chat-window {
  flex: 1 1 auto;
  overflow-y: auto;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}
.chat-empty {
  margin: auto;
  text-align: center;
  color: var(--text-muted);
}
.empty-icon { font-size: 36px; margin-bottom: 8px; }
.msg { display: flex; gap: 10px; align-items: flex-start; }
.msg.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  flex-shrink: 0;
}
.msg.user .msg-avatar { background: var(--color-primary); color: #fff; font-family: var(--font-display); }
.msg.assistant .msg-avatar { background: var(--color-accent); color: #fff; font-family: var(--font-display); }
.msg-body { max-width: 75%; }
.msg-text {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  line-height: 1.7;
  word-break: break-word;
  white-space: pre-wrap;
  color: var(--color-text-primary);
}
.msg.user .msg-text {
  background: #FFFFFF;
  border: 1px solid var(--color-border);
}
.msg.assistant .msg-text {
  background: #FFFFFF;
  border: 1px solid var(--color-border-light);
}
.inline-code {
  background: var(--color-bg-secondary);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  color: var(--color-accent);
}
.code-block {
  background: #2D2D2D;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
  white-space: pre;
}
.code-block code { font-family: monospace; font-size: 13px; color: #F8F6F3; }
.msg-image, .msg-images img {
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin-top: 8px;
  display: block;
}
.msg-images { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.msg-images img { max-width: 240px; }

.typing { display: inline-flex; gap: 4px; padding: 14px 18px; }
.typing span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: typing 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

.chat-input-wrap { display: flex; gap: 10px; align-items: flex-end; }
.chat-input { resize: none; flex: 1; max-height: 140px; min-height: 60px; font-family: var(--font-body); }
.send-btn { padding: 10px 22px; flex-shrink: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 1024px) {
  .layout { grid-template-columns: 1fr; }
  .panel:last-child { height: auto; min-height: 540px; }
}
</style>
