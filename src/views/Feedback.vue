<template>
  <main class="feedback-page">
    <div class="container">
      <header class="page-head">
        <h1 class="page-title">意见反馈</h1>
        <p class="page-sub">
          遇到问题、有建议，都可以在这里告诉我们，我们会逐条处理并回复。
        </p>
      </header>

      <div v-if="loadingEntry" class="state-box">加载中…</div>

      <div v-else-if="!entry.enabled" class="state-box locked">
        <div class="locked-icon">🔒</div>
        <h3>反馈功能内测中</h3>
        <p>该功能正在小范围灰度测试，暂未对你的账号开放。</p>
        <button class="btn btn-outline" @click="goHome">返回首页</button>
      </div>

      <div v-else class="feedback-grid">
        <!-- 左：提交反馈 -->
        <section class="card compose-card">
          <div class="card-title-row">
            <h2>提交反馈</h2>
          </div>

          <!-- 联系邮箱：必填，默认预填当前账号邮箱，用户可改 -->
          <div class="field">
            <label class="label">联系邮箱 <span class="required">*</span></label>
            <input
              v-model="form.contactEmail"
              class="input"
              type="email"
              autocomplete="email"
              maxlength="254"
              placeholder="方便我们回复你，默认填当前账号邮箱"
            />
            <div class="hint">回复通知会发到这个邮箱，请确保能收到</div>
          </div>

          <div class="field">
            <label class="label">反馈类型</label>
            <div class="chips">
              <button
                v-for="c in categories"
                :key="c.value"
                type="button"
                class="chip"
                :class="{ active: form.category === c.value }"
                @click="form.category = c.value"
              >
                {{ c.label }}
              </button>
            </div>
          </div>

          <div class="field">
            <label class="label">标题</label>
            <input
              v-model="form.subject"
              class="input"
              maxlength="60"
              placeholder="一句话说明问题，例如：点击开始聊天后报 500"
            />
          </div>

          <div class="field">
            <label class="label">详细描述 <span class="required">*</span></label>
            <textarea
              v-model="form.content"
              class="textarea"
              maxlength="5000"
              rows="6"
              placeholder="请描述：做了什么操作、看到什么报错、大概什么时间。越具体定位越快。"
              @paste="handlePaste"
            />
            <div class="counter">{{ form.content.length }}/5000</div>
          </div>

          <!-- 仅「充值与额度」显示：有问题的激活码 -->
          <div v-if="form.category === 'billing'" class="field">
            <label class="label">有问题的激活码</label>
            <textarea
              v-model="form.activationCode"
              class="textarea"
              rows="3"
              maxlength="1000"
              placeholder="如涉及激活/兑换问题，请把有问题的激活码粘贴到这里；多个请换行分隔"
            />
            <div class="hint">只有管理员能看到，用于直接核对卡密状态</div>
          </div>

          <div class="field">
            <div class="attachment-head">
              <label class="label">截图 / 附件</label>
              <span class="hint-strong">建议带上截图，定位快很多</span>
            </div>
            <div
              class="dropzone"
              :class="{ dragging }"
              @click="pickFiles"
              @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false"
              @drop.prevent="handleDrop"
            >
              <input ref="fileInput" type="file" multiple hidden :accept="accept" @change="handlePick" />
              <div class="dropzone-text">
                点击选择、拖拽到此处，或直接 <b>Ctrl+V 粘贴截图</b>
              </div>
              <div class="dropzone-sub">
                支持 png / jpg / gif / webp / pdf / txt / log / json / zip，单个 ≤ 10MB，最多 6 个
              </div>
            </div>

            <div v-if="pending.length" class="thumbs">
              <div v-for="(f, i) in pending" :key="'p' + i" class="thumb">
                <img v-if="f.preview" :src="f.preview" alt="" />
                <div v-else class="thumb-file">{{ tailName(f.file.name) }}</div>
                <button type="button" class="thumb-del" @click.stop="removePending(i)">×</button>
                <span class="thumb-size">{{ prettySize(f.file.size) }}</span>
              </div>
            </div>
          </div>

          <div class="notice">
            图片与附件仅保留 <b>30 天</b>（自工单关闭起算），超期后系统只保留文字内容。
            请把关键信息写在描述里。
          </div>

          <button class="btn btn-primary btn-block" :disabled="submitting" @click="submit">
            {{ submitting ? '提交中…' : '提交反馈' }}
          </button>
          <p v-if="formError" class="error">{{ formError }}</p>
          <p v-if="submitOk" class="success">{{ submitOk }}</p>
        </section>

        <!-- 右：我的工单 -->
        <section class="card list-card">
          <div class="card-title-row">
            <h2>我的工单</h2>
            <button class="btn btn-ghost btn-sm" :disabled="listLoading" @click="loadList()">刷新</button>
          </div>

          <div v-if="listLoading" class="state-box small">加载中…</div>
          <div v-else-if="!tickets.length" class="empty">
            <div class="empty-icon">📭</div>
            <p>还没有提交过反馈</p>
          </div>
          <ul v-else class="ticket-list">
            <li v-for="t in tickets" :key="t.id" class="ticket-item" @click="openTicket(t.id)">
              <div class="ticket-line1">
                <span class="tno">{{ t.ticket_no }}</span>
                <span class="status" :class="statusClass(t.status)">{{ t.status_label }}</span>
                <span v-if="t.user_unread" class="badge">{{ t.user_unread }}</span>
                <!-- 撤销&删除：只对你隐藏，客服仍可看到 -->
                <div class="ticket-ops" @click.stop>
                  <button
                    type="button"
                    class="op-btn danger"
                    title="从我的工单中移除"
                    @click="askHide(t)"
                  >撤销&amp;删除</button>
                </div>
              </div>
              <div class="ticket-subject">{{ t.subject }}</div>
              <div class="ticket-meta">
                <span>{{ t.category_label }}</span>
                <span>·</span>
                <span>{{ shortTime(t.last_message_at) }}</span>
                <span v-if="t.attachment_count">· {{ t.attachment_count }} 个附件</span>
              </div>
            </li>
          </ul>
          <div v-if="total > tickets.length" class="more">
            <button class="btn btn-outline btn-sm" :disabled="listLoading" @click="loadMore">
              加载更多
            </button>
          </div>
          <p v-if="listError" class="error">{{ listError }}</p>
        </section>
      </div>
    </div>

    <!-- 详情抽屉 -->
    <teleport to="body">
      <div v-if="active" class="drawer-mask" @click.self="closeDrawer">
        <div class="drawer">
          <header class="drawer-head">
            <div class="drawer-title-wrap">
              <div class="drawer-title">
                {{ active.ticket.ticket_no }} · {{ active.ticket.subject }}
              </div>
              <div class="drawer-meta">
                <span class="status" :class="statusClass(active.ticket.status)">
                  {{ active.ticket.status_label }}
                </span>
                <span>{{ active.ticket.category_label }}</span>
                <span>{{ shortTime(active.ticket.created_at) }} 提交</span>
              </div>
            </div>
            <div class="drawer-actions">
              <button
                v-if="active.ticket.status !== 'closed'"
                class="btn btn-ghost btn-sm"
                @click="closeActive"
              >
                关闭工单
              </button>
              <button class="btn btn-ghost btn-sm" @click="closeDrawer">收起</button>
            </div>
          </header>

          <div ref="threadEl" class="thread">
            <div v-for="m in active.messages" :key="m.id" class="msg" :class="m.author_role">
              <div class="msg-head">
                <span class="who">{{ m.author_role === 'admin' ? '官方客服' : '我' }}</span>
                <span class="when">{{ shortTime(m.created_at) }}</span>
              </div>
              <div v-if="m.content" class="bubble">{{ m.content }}</div>
              <div v-if="m.attachments.length" class="msg-atts">
                <template v-for="a in m.attachments" :key="a.id">
                  <a
                    v-if="a.url && a.is_image"
                    :href="a.url"
                    target="_blank"
                    rel="noopener"
                    class="att-img"
                  >
                    <img :src="a.url" :alt="a.file_name" />
                  </a>
                  <a
                    v-else-if="a.url"
                    :href="a.url"
                    target="_blank"
                    rel="noopener"
                    class="att-file"
                  >📎 {{ a.file_name }}</a>
                  <span v-else class="att-expired">附件已过期清理（仅保留文字）</span>
                </template>
              </div>
            </div>
          </div>

          <footer class="drawer-foot">
            <div v-if="active.ticket.status === 'closed'" class="closed-tip">
              工单已关闭，补充信息会自动重新开启。
            </div>
            <textarea
              v-model="reply.content"
              class="textarea"
              rows="3"
              placeholder="补充说明 / 继续追问…（可粘贴截图）"
              @paste="handleReplyPaste"
            />
            <div v-if="replyPending.length" class="thumbs">
              <div v-for="(f, i) in replyPending" :key="'rp' + i" class="thumb">
                <img v-if="f.preview" :src="f.preview" alt="" />
                <div v-else class="thumb-file">{{ tailName(f.file.name) }}</div>
                <button type="button" class="thumb-del" @click="removeReplyPending(i)">×</button>
              </div>
            </div>
            <div class="drawer-foot-row">
              <button class="btn btn-outline btn-sm" @click="replyFileInput.click()">添加附件</button>
              <input
                ref="replyFileInput"
                type="file"
                multiple
                hidden
                :accept="accept"
                @change="handleReplyPick"
              />
              <button class="btn btn-primary btn-sm" :disabled="replySending" @click="sendReply">
                {{ replySending ? '发送中…' : '发送' }}
              </button>
            </div>
            <p v-if="replyError" class="error">{{ replyError }}</p>
          </footer>
        </div>
      </div>
    </teleport>

    <!-- 撤销&删除确认（只对用户隐藏，客服仍可见） -->
    <teleport to="body">
      <div v-if="hideTarget" class="confirm-mask" @click.self="hideTarget = null">
        <div class="confirm-box">
          <h3 class="confirm-title">撤销并删除这条工单？</h3>
          <p class="confirm-text">
            <b>{{ hideTarget.ticket_no }}</b> 会从「我的工单」中移除，你不再看到它。
            删除后无法恢复，请确认。
          </p>
          <div class="confirm-actions">
            <button class="btn btn-outline" :disabled="hideBusy" @click="hideTarget = null">取消</button>
            <button class="btn btn-primary" :disabled="hideBusy" @click="doHide">
              {{ hideBusy ? '处理中…' : '确定' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CATEGORY_OPTIONS,
  STATUS_META,
  addTicketMessage,
  closeTicket,
  createTicket,
  deleteTicket,
  getTicket,
  getTicketEntry,
  listTickets
} from '@/api/tickets'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const categories = CATEGORY_OPTIONS
const accept = '.png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.log,.json,.md,.csv,.zip'
const MAX_FILES = 6
const MAX_FILE_MB = 10
const MAX_TOTAL_MB = 30

const entry = reactive({ enabled: false, unread: 0, email: '' })
const loadingEntry = ref(true)

const form = reactive({ category: 'cannot_use', subject: '', content: '', contactEmail: '', activationCode: '' })
const pending = ref([])
const submitting = ref(false)
const formError = ref('')
const submitOk = ref('')
const dragging = ref(false)
const fileInput = ref(null)

const tickets = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 20
const listLoading = ref(false)
const listError = ref('')

// 撤销&删除确认
const hideTarget = ref(null) // 工单对象
const hideBusy = ref(false)

const active = ref(null)
const reply = reactive({ content: '' })
const replyPending = ref([])
const replySending = ref(false)
const replyError = ref('')
const replyFileInput = ref(null)

let unreadTimer = null

// ─── 工具 ────────────────────────────────────────────────────────────

function tailName(name) {
  return (name || '').length > 12 ? '…' + name.slice(-10) : name
}

function prettySize(bytes) {
  if (!bytes) return '0B'
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB'
  return (bytes / 1024 / 1024).toFixed(1) + 'MB'
}

function shortTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function statusClass(status) {
  return STATUS_META[status]?.className || 'status-open'
}

function goHome() {
  router.push('/')
}

const ALLOWED_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'txt', 'log', 'json', 'md', 'csv', 'zip']
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp']

function extOf(name) {
  const i = (name || '').lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

// 把 File[] 归一成 [{file, preview}]，并做前端预校验（后端还会再校验一遍）
function normalizeFiles(fileList, target) {
  const list = Array.from(fileList || [])
  const errors = []
  for (const file of list) {
    if (target.value.length >= MAX_FILES) {
      errors.push(`最多 ${MAX_FILES} 个附件`)
      break
    }
    const ext = extOf(file.name)
    if (!ALLOWED_EXT.includes(ext)) {
      errors.push(`不支持的格式：${file.name}`)
      continue
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      errors.push(`${file.name} 超过 ${MAX_FILE_MB}MB`)
      continue
    }
    const totalBytes =
      target.value.reduce((s, x) => s + x.file.size, 0) + file.size
    if (totalBytes > MAX_TOTAL_MB * 1024 * 1024) {
      errors.push(`附件总大小不能超过 ${MAX_TOTAL_MB}MB`)
      break
    }
    if (target.value.some((x) => x.file.name === file.name && x.file.size === file.size)) {
      continue // 粘贴会重复触发，同文件去重
    }
    target.value.push({
      file,
      preview: IMAGE_EXT.includes(ext) ? URL.createObjectURL(file) : ''
    })
  }
  return errors
}

function revokeAll(list) {
  list.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
}

function removePending(i) {
  const item = pending.value[i]
  if (item?.preview) URL.revokeObjectURL(item.preview)
  pending.value.splice(i, 1)
}

function removeReplyPending(i) {
  const item = replyPending.value[i]
  if (item?.preview) URL.revokeObjectURL(item.preview)
  replyPending.value.splice(i, 1)
}

// ─── 附件入口：点击 / 拖拽 / 粘贴 ───────────────────────────────────

function pickFiles() {
  fileInput.value?.click()
}

function handlePick(e) {
  const errors = normalizeFiles(e.target.files, pending)
  if (errors.length) formError.value = errors[0]
  e.target.value = ''
}

function handleDrop(e) {
  dragging.value = false
  const errors = normalizeFiles(e.dataTransfer?.files, pending)
  if (errors.length) formError.value = errors[0]
}

function handlePaste(e) {
  const files = e.clipboardData?.files
  if (files && files.length) {
    e.preventDefault() // 防止图片以 base64 塞进 textarea
    const errors = normalizeFiles(files, pending)
    if (errors.length) formError.value = errors[0]
  }
}

function handleReplyPick(e) {
  const errors = normalizeFiles(e.target.files, replyPending)
  if (errors.length) replyError.value = errors[0]
  e.target.value = ''
}

function handleReplyPaste(e) {
  const files = e.clipboardData?.files
  if (files && files.length) {
    e.preventDefault()
    const errors = normalizeFiles(files, replyPending)
    if (errors.length) replyError.value = errors[0]
  }
}

// ─── 列表 / 详情 ────────────────────────────────────────────────────

async function loadEntry() {
  try {
    const data = await getTicketEntry()
    entry.enabled = !!data?.enabled
    entry.unread = data?.unread || 0
    entry.email = data?.email || ''
    // 联系邮箱默认预填当前账号邮箱（用户可改），不覆盖用户已填的内容
    if (entry.email && !form.contactEmail) form.contactEmail = entry.email
  } catch (e) {
    // 未登录 / 登录过期：路由守卫已拦，这里只做兜底
    entry.enabled = false
    formError.value = e.message
  } finally {
    loadingEntry.value = false
  }
}

async function loadList(reset = true) {
  listLoading.value = true
  try {
    const data = await listTickets({ page: page.value, size: pageSize })
    if (reset) tickets.value = data.items || []
    else tickets.value = tickets.value.concat(data.items || [])
    total.value = data.total || 0
  } catch (e) {
    formError.value = e.message
  } finally {
    listLoading.value = false
  }
}

function loadMore() {
  page.value += 1
  loadList(false)
}

async function openTicket(id) {
  try {
    const data = await getTicket(id)
    active.value = data
    reply.content = ''
    replyError.value = ''
    revokeAll(replyPending.value)
    replyPending.value = []
    // 已读后刷新列表未读状态
    loadList(true)
    loadEntry()
    document.body.style.overflow = 'hidden'
    scrollThreadBottom()
  } catch (e) {
    formError.value = e.message
  }
}

function closeDrawer() {
  active.value = null
  document.body.style.overflow = ''
}
async function submit() {
  formError.value = ''
  submitOk.value = ''
  const contactEmail = form.contactEmail.trim()
  if (!contactEmail) {
    formError.value = '请填写联系邮箱'
    return
  }
  if (!/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(contactEmail)) {
    formError.value = '联系邮箱格式不正确'
    return
  }
  if (!form.subject.trim()) {
    formError.value = '请填写标题'
    return
  }
  if (!form.content.trim()) {
    formError.value = '请填写问题描述'
    return
  }
  submitting.value = true
  try {
    const res = await createTicket({
      category: form.category,
      subject: form.subject.trim(),
      content: form.content.trim(),
      contactEmail,
      activationCode: form.category === 'billing' ? form.activationCode.trim() : '',
      files: pending.value.map((p) => p.file)
    })
    revokeAll(pending.value)
    pending.value = []
    form.subject = ''
    form.content = ''
    form.category = 'cannot_use'
    form.activationCode = ''
    form.contactEmail = entry.email || ''
    submitOk.value = `已提交，单号 ${res.ticket_no}`
    page.value = 1
    await loadList(true)
    await loadEntry()
  } catch (e) {
    formError.value = e.message
  } finally {
    submitting.value = false
  }
}

function askHide(ticket) {
  listError.value = ''
  hideTarget.value = ticket
}

async function doHide() {
  const ticket = hideTarget.value
  if (!ticket) return
  hideBusy.value = true
  listError.value = ''
  try {
    await deleteTicket(ticket.id)
    hideTarget.value = null
    if (active.value?.ticket?.id === ticket.id) closeDrawer()
    page.value = 1
    await loadList(true)
    await loadEntry()
  } catch (e) {
    listError.value = e.message
    hideTarget.value = null
  } finally {
    hideBusy.value = false
  }
}

async function sendReply() {
  if (!active.value) return
  replyError.value = ''
  const content = reply.content.trim()
  if (!content && !replyPending.value.length) {
    replyError.value = '请输入内容或添加附件'
    return
  }
  replySending.value = true
  try {
    await addTicketMessage(active.value.ticket.id, {
      content,
      files: replyPending.value.map((p) => p.file)
    })
    revokeAll(replyPending.value)
    replyPending.value = []
    reply.content = ''
    await openTicket(active.value.ticket.id) // 重新拉详情（含新消息）
    await loadList(true)
  } catch (e) {
    replyError.value = e.message
  } finally {
    replySending.value = false
  }
}

async function closeActive() {
  if (!active.value) return
  try {
    await closeTicket(active.value.ticket.id)
    await openTicket(active.value.ticket.id)
    await loadList(true)
  } catch (e) {
    replyError.value = e.message
  }
}

onMounted(async () => {
  await loadEntry()
  if (entry.enabled) {
    await loadList(true)
    startPolling()
  }
})

onUnmounted(() => {
  stopPolling()
  revokeAll(pending.value)
  revokeAll(replyPending.value)
  document.body.style.overflow = ''
})

// ─── 实时刷新（轮询）─────────────────────────────────────────────────
// 静态站没有长连接：客服回复 / 工单状态变化靠轮询自己出现，不必刷新页面。
// 约束：页面可见才轮询；提交/加载中跳过；只替换数据，不碰富输入框草稿与待发送附件。
let detailTimer = null
const threadEl = ref(null)

function startPolling() {
  stopPolling()
  unreadTimer = setInterval(pollOverview, 20000)
  detailTimer = setInterval(pollDetail, 10000)
  document.addEventListener('visibilitychange', onPageVisible)
}

function stopPolling() {
  if (unreadTimer) clearInterval(unreadTimer)
  if (detailTimer) clearInterval(detailTimer)
  unreadTimer = null
  detailTimer = null
  document.removeEventListener('visibilitychange', onPageVisible)
}

function onPageVisible() {
  if (document.hidden) return
  pollOverview()
  pollDetail()
}

function listSig(list) {
  return (list || [])
    .map((x) => [x.id, x.status, x.user_unread, x.admin_unread, x.message_count, x.last_message_at].join('|'))
    .join(';')
}

// 未读数 + 列表（保持用户已「加载更多」的页数，不缩回第一页）
async function pollOverview() {
  if (document.hidden || listLoading.value || submitting.value || replySending.value) return
  loadEntry()
  try {
    const size = pageSize * Math.max(1, page.value)
    const data = await listTickets({ page: 1, size })
    const next = data.items || []
    if (listSig(next) !== listSig(tickets.value)) tickets.value = next
    total.value = data.total || 0
  } catch (e) {
    // 轮询失败静默
  }
}

function detailSig(d) {
  const ms = d?.messages || []
  const last = ms[ms.length - 1]
  return [d?.ticket?.status, ms.length, last?.id, last?.created_at].join('|')
}

function scrollThreadBottom() {
  nextTick(() => {
    const el = threadEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

async function pollDetail() {
  if (!active.value || document.hidden || replySending.value) return
  const id = active.value.ticket?.id
  if (!id) return
  try {
    const data = await getTicket(id)
    if (!data || active.value?.ticket?.id !== id) return
    if (detailSig(data) === detailSig(active.value)) return
    active.value = data // 回复草稿 / 待发附件在独立 ref，不会被清掉
    scrollThreadBottom()
    loadEntry()
  } catch (e) {
    // 静默
  }
}
</script>

<style scoped>
.feedback-page {
  padding-top: 100px;
  padding-bottom: 80px;
  min-height: 100vh;
}

.page-head {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.page-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.state-box {
  max-width: 720px;
  margin: 0 auto;
  padding: 60px 32px;
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
}

.state-box.small {
  padding: 24px;
  border: none;
  background: transparent;
}

.state-box.locked h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin: 12px 0 8px;
  color: var(--text-primary);
}

.state-box.locked p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.locked-icon {
  font-size: 2rem;
}

.feedback-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .feedback-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-soft);
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.card-title-row h2 {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 500;
  color: var(--text-primary);
}

.field {
  margin-bottom: 18px;
}

.label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.required {
  color: #B23B3B;
}

.input,
.textarea {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

.textarea {
  resize: vertical;
  min-height: 90px;
  line-height: 1.6;
}

.input:focus,
.textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
}

.counter {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.hint {
  margin-top: 6px;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 7px 14px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-body);
}

.chip:hover {
  border-color: var(--color-accent);
}

.chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.attachment-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.hint-strong {
  font-size: 0.78rem;
  color: #A0723F;
}

.dropzone {
  margin-top: 8px;
  padding: 22px 16px;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.dropzone:hover,
.dropzone.dragging {
  border-color: var(--color-accent);
  background: #fff;
}

.dropzone-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.dropzone-text b {
  color: var(--color-accent);
}

.dropzone-sub {
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.thumb {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-file {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 6px;
  font-size: 0.68rem;
  color: var(--text-muted);
  text-align: center;
  word-break: break-all;
}

.thumb-del {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
}

.thumb-size {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2px 4px;
  font-size: 0.62rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  text-align: center;
}

.notice {
  margin: 18px 0;
  padding: 12px 14px;
  font-size: 0.8rem;
  line-height: 1.7;
  color: #7A5B34;
  background: rgba(184, 122, 75, 0.08);
  border: 1px solid rgba(184, 122, 75, 0.25);
  border-radius: var(--radius-md);
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.error {
  margin-top: 10px;
  font-size: 0.82rem;
  color: #B23B3B;
}

.success {
  margin-top: 10px;
  font-size: 0.82rem;
  color: #3F7A4F;
}

.btn-sm {
  padding: 0.45rem 0.9rem;
  font-size: 0.8rem;
}

/* 工单列表 */
.ticket-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* 工单多了在卡片内部滚动，不把页面拉长 */
  max-height: calc(100vh - 300px);
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.ticket-list::-webkit-scrollbar {
  width: 6px;
}

.ticket-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.ticket-list::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 900px) {
  .ticket-list {
    max-height: none;
  }
}

/* 每行的撤销 / 删除：未 hover 时隐藏，桌面端 hover 出现，触屏设备一直显示 */
.ticket-ops {
  margin-left: auto;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity var(--transition);
}

.ticket-item:hover .ticket-ops,
.ticket-item:focus-within .ticket-ops {
  opacity: 1;
}

@media (hover: none) {
  .ticket-ops {
    opacity: 1;
  }
}

.op-btn {
  padding: 2px 8px;
  font-size: 0.72rem;
  font-family: var(--font-body);
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition: var(--transition);
}

.op-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.op-btn.danger:hover {
  border-color: #C0392B;
  color: #C0392B;
}

/* 确认弹窗 */
.confirm-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 26, 26, 0.35);
  backdrop-filter: blur(2px);
  padding: 20px;
}

.confirm-box {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.confirm-title {
  margin: 0 0 10px;
  font-size: 1.05rem;
  color: var(--text-primary);
}

.confirm-text {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.ticket-item {
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  background: #fff;
}

.ticket-item:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-soft);
}

.ticket-line1 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tno {
  font-size: 0.78rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.status {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.7rem;
  border-radius: 999px;
  border: 1px solid transparent;
}

.status-open {
  color: #A0723F;
  background: rgba(184, 122, 75, 0.1);
  border-color: rgba(184, 122, 75, 0.3);
}

.status-replied {
  color: #3F6F8F;
  background: rgba(63, 111, 143, 0.1);
  border-color: rgba(63, 111, 143, 0.3);
}

.status-closed {
  color: var(--text-muted);
  background: rgba(0, 0, 0, 0.04);
  border-color: var(--border);
}

.badge {
  margin-left: auto;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #C0392B;
  color: #fff;
  font-size: 0.66rem;
  line-height: 18px;
  text-align: center;
}

.ticket-subject {
  font-size: 0.92rem;
  color: var(--text-primary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ticket-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 0.74rem;
  color: var(--text-muted);
}

.empty {
  padding: 32px 0;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 1.6rem;
  margin-bottom: 6px;
}

.more {
  margin-top: 14px;
  text-align: center;
}

/* 详情抽屉 */
.drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(26, 26, 26, 0.45);
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: min(720px, 100%);
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.18);
  animation: slideIn 0.22s ease;
}

@keyframes slideIn {
  from { transform: translateX(30px); opacity: 0.6; }
  to { transform: translateX(0); opacity: 1; }
}

.drawer-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
  background: #fff;
}

.drawer-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  word-break: break-all;
}

.drawer-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.drawer-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-shrink: 0;
}

.thread {
  flex: 1;
  overflow-y: auto;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.msg-head {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 6px;
}

.msg.admin .msg-head {
  justify-content: flex-start;
}

.msg.user .msg-head {
  justify-content: flex-end;
}

.who {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.when {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.bubble {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg.user .bubble {
  background: var(--color-primary);
  color: #fff;
  border-top-right-radius: 4px;
  margin-left: auto;
  max-width: 92%;
}

.msg.admin .bubble {
  background: #fff;
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-top-left-radius: 4px;
  max-width: 92%;
}

.msg-atts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.msg.user .msg-atts {
  justify-content: flex-end;
}

.att-img img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
  display: block;
}

.att-file {
  display: inline-block;
  padding: 6px 10px;
  font-size: 0.78rem;
  color: var(--color-accent);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  text-decoration: none;
}

.att-expired {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 6px 10px;
  border: 1px dashed var(--border);
  border-radius: 8px;
}

.drawer-foot {
  padding: 16px 22px 20px;
  border-top: 1px solid var(--border);
  background: #fff;
}

.closed-tip {
  margin-bottom: 10px;
  padding: 8px 12px;
  font-size: 0.78rem;
  color: #7A5B34;
  background: rgba(184, 122, 75, 0.08);
  border-radius: 8px;
}

.drawer-foot-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
