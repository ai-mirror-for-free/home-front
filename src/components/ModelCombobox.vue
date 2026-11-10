<template>
  <div ref="rootRef" class="model-combobox" :class="{ 'is-open': open, 'is-disabled': disabled || loading }">
    <div class="mc-control">
      <input
        ref="inputRef"
        v-model="query"
        class="input-field mc-input"
        type="text"
        :placeholder="loading ? '模型加载中…' : placeholder"
        :disabled="disabled || loading"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="open ? 'true' : 'false'"
        @focus="openPanel"
        @click="openPanel"
        @input="onInput"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="onEnter"
        @keydown.esc.prevent="onEscape"
        @keydown.tab="closePanel"
      />
      <button v-if="query" type="button" class="mc-icon-btn mc-clear" title="清除" @mousedown.prevent @click="clearQuery">×</button>
      <button type="button" class="mc-icon-btn mc-arrow" tabindex="-1" :title="open ? '收起' : '展开'" @mousedown.prevent @click="toggle">▾</button>
    </div>

    <transition name="mc-fade">
      <div v-if="open" class="mc-panel" role="listbox">
        <ul ref="listRef" class="mc-list">
          <li
            v-for="(opt, i) in filtered"
            :key="opt.id + '#' + i"
            class="mc-item"
            :class="{ 'is-active': i === highlighted, 'is-selected': opt.id === modelValue }"
            role="option"
            :aria-selected="opt.id === modelValue ? 'true' : 'false'"
            @mouseenter="highlighted = i"
            @mousedown.prevent="select(opt)"
          >
            <span class="mc-item-label">
              <span v-for="(part, pi) in highlightParts(opt.label)" :key="pi" :class="{ hit: part.hit }">{{ part.text }}</span>
            </span>
            <span v-if="opt.id === modelValue" class="mc-check">✓</span>
          </li>
        </ul>
        <div v-if="!filtered.length" class="mc-empty">{{ loading ? '加载中…' : '无匹配模型' }}</div>
        <div class="mc-foot">匹配 {{ filtered.length }} / {{ options.length }} 个模型</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { compareModelName } from '@/utils/modelSort'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '输入关键字搜索模型' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const rootRef = ref(null)
const inputRef = ref(null)
const listRef = ref(null)

const query = ref('')
const open = ref(false)
const highlighted = ref(-1)
// 用户是否手动输入过（手动输入后不再用外部 modelValue 覆盖输入框内容）
const dirty = ref(false)

const normalized = computed(() =>
  (props.options || [])
    .filter((o) => o && o.id)
    .map((o) => ({
      id: o.id,
      label: o.name || o.id,
      search: `${o.id} ${o.name || ''}`.toLowerCase()
    }))
    .sort((a, b) => compareModelName(a.id, b.id))
)

const currentLabel = computed(() => {
  const hit = normalized.value.find((o) => o.id === props.modelValue)
  return hit ? hit.label : props.modelValue || ''
})

// 输入框内容等于当前已选模型时，视为「未搜索」，展示全量列表
const effectiveQuery = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return ''
  if (q === currentLabel.value.toLowerCase()) return ''
  return q
})

const filtered = computed(() => {
  const q = effectiveQuery.value
  if (!q) return normalized.value
  return normalized.value.filter((o) => o.search.includes(q))
})

watch(
  () => props.modelValue,
  (v) => {
    if (dirty.value) return
    const hit = normalized.value.find((o) => o.id === v)
    query.value = hit ? hit.label : v || ''
  },
  { immediate: true }
)

watch(effectiveQuery, () => {
  if (!open.value) return
  highlighted.value = filtered.value.length ? 0 : -1
  nextTick(scrollToHighlighted)
})

function openPanel() {
  if (props.disabled || props.loading || open.value) return
  open.value = true
  const idx = filtered.value.findIndex((o) => o.id === props.modelValue)
  highlighted.value = idx >= 0 ? idx : filtered.value.length ? 0 : -1
  nextTick(scrollToHighlighted)
}

function closePanel() {
  if (!open.value) return
  open.value = false
  highlighted.value = -1
  if (dirty.value) {
    // 未确认的输入回退到已选模型
    dirty.value = false
    query.value = currentLabel.value
  }
}

function toggle() {
  if (open.value) {
    closePanel()
  } else {
    openPanel()
    inputRef.value?.focus()
  }
}

function onInput() {
  dirty.value = true
  if (props.modelValue) emit('update:modelValue', '')
  open.value = true
}

function move(delta) {
  if (!open.value) {
    openPanel()
    return
  }
  const total = filtered.value.length
  if (!total) return
  let i = highlighted.value + delta
  if (i < 0) i = total - 1
  if (i >= total) i = 0
  highlighted.value = i
  nextTick(scrollToHighlighted)
}

function onEnter() {
  if (!open.value) {
    openPanel()
    return
  }
  const opt = filtered.value[highlighted.value]
  if (opt) select(opt)
}

function onEscape() {
  if (open.value) {
    closePanel()
  } else {
    inputRef.value?.blur()
  }
}

function select(opt) {
  dirty.value = false
  query.value = opt.label
  open.value = false
  highlighted.value = -1
  if (opt.id !== props.modelValue) {
    emit('update:modelValue', opt.id)
    emit('change', opt.id)
  }
  inputRef.value?.blur()
}

function clearQuery() {
  dirty.value = true
  query.value = ''
  if (props.modelValue) emit('update:modelValue', '')
  open.value = true
  highlighted.value = filtered.value.length ? 0 : -1
  nextTick(() => {
    scrollToHighlighted()
    inputRef.value?.focus()
  })
}

function scrollToHighlighted() {
  const list = listRef.value
  if (!list || highlighted.value < 0) return
  const el = list.children[highlighted.value]
  if (!el) return
  const top = el.offsetTop
  const bottom = top + el.offsetHeight
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
}

function highlightParts(label) {
  const q = effectiveQuery.value
  const text = String(label || '')
  if (!q) return [{ text, hit: false }]
  const idx = text.toLowerCase().indexOf(q)
  if (idx < 0) return [{ text, hit: false }]
  return [
    { text: text.slice(0, idx), hit: false },
    { text: text.slice(idx, idx + q.length), hit: true },
    { text: text.slice(idx + q.length), hit: false }
  ].filter((p) => p.text)
}

function onDocMouseDown(e) {
  if (!rootRef.value || rootRef.value.contains(e.target)) return
  closePanel()
}

onMounted(() => document.addEventListener('mousedown', onDocMouseDown, true))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMouseDown, true))
</script>

<style scoped>
.model-combobox {
  position: relative;
  width: 100%;
}

.mc-control { position: relative; }

.mc-input {
  width: 100%;
  font-size: 13px;
  padding: 10px 56px 10px 12px;
  background-color: #FFFFFF;
  text-overflow: ellipsis;
}
.mc-input::placeholder { color: var(--color-text-muted); opacity: 0.8; }

.mc-icon-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  line-height: 1;
  padding: 4px 6px;
  font-size: 12px;
  transition: var(--transition-fast);
}
.mc-icon-btn:hover { color: var(--color-text-primary); background: var(--color-bg-secondary); }
.mc-clear { right: 26px; font-size: 15px; }
.mc-arrow { right: 6px; font-size: 11px; }
.is-open .mc-arrow { transform: translateY(-50%) rotate(180deg); }

.mc-panel {
  position: absolute;
  z-index: 40;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 14px 36px rgba(60, 50, 40, 0.14);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mc-list {
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 320px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.mc-list::-webkit-scrollbar { width: 8px; }
.mc-list::-webkit-scrollbar-thumb {
  background: var(--color-border-light);
  border-radius: 999px;
}

.mc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: monospace;
  color: var(--color-text-primary);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}
.mc-item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mc-item-label .hit {
  color: var(--color-accent);
  font-weight: 700;
}
.mc-item.is-active { background: var(--color-bg-secondary); }
.mc-item.is-selected { color: var(--color-accent); }
.mc-check { flex-shrink: 0; font-size: 11px; color: var(--color-accent); }

.mc-empty {
  padding: 16px 12px;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-muted);
}

.mc-foot {
  padding: 6px 12px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
}

.mc-fade-enter-active, .mc-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.mc-fade-enter-from, .mc-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
