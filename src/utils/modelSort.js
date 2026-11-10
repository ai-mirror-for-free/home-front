/**
 * 模型名排序工具
 *
 * 规则（与设计约定一致）：
 *  1. 按「文本段 / 数字段」交替切分后逐段比较（`gemini-2.5-flash` -> ['gemini', 2, 5, 'flash']）
 *  2. 文本段：字母升序（忽略大小写），即 claude < gemini < gpt
 *  3. 数字段：按数值倒序（3.8 > 3.1 > 2.5，不是字符串比较，2.10 不会跑到 2.9 前面）
 *  4. 公共段完全相同、仅长度不同时：短的在前（gpt-5 在 gpt-5.5 之前）
 *  5. 兜底：按原始字符串升序，保证排序结果稳定
 */

function tokenize(str) {
  const tokens = []
  const re = /(\d+)|([A-Za-z]+)/g
  let m
  while ((m = re.exec(str)) !== null) {
    if (m[1] !== undefined) {
      tokens.push({ num: parseInt(m[1], 10), text: null })
    } else {
      tokens.push({ num: null, text: m[2].toLowerCase() })
    }
  }
  return tokens
}

/**
 * 比较两个模型名
 * @returns {number} 负数表示 a 在前
 */
export function compareModelName(a, b) {
  const x = String(a || '')
  const y = String(b || '')
  if (x === y) return 0

  const ta = tokenize(x)
  const tb = tokenize(y)
  const len = Math.min(ta.length, tb.length)

  for (let i = 0; i < len; i += 1) {
    const p = ta[i]
    const q = tb[i]
    const pIsNum = p.num !== null
    const qIsNum = q.num !== null

    if (pIsNum && qIsNum) {
      if (p.num !== q.num) return q.num - p.num // 数字段倒序
      continue
    }
    if (pIsNum || qIsNum) {
      // 数字段优先于文本段（gemini-2.5 排在 gemini-flash 之前）
      return pIsNum ? -1 : 1
    }
    if (p.text !== q.text) return p.text < q.text ? -1 : 1
  }

  if (ta.length !== tb.length) return ta.length - tb.length // 前缀短的在前

  return x < y ? -1 : 1
}

/**
 * 排序模型列表（按 id/name）
 * @param {Array<{id:string,name?:string}>} list
 * @returns {Array} 新数组，不修改入参
 */
export function sortModels(list) {
  return [...(list || [])].sort((a, b) => compareModelName(a?.id || a?.name, b?.id || b?.name))
}
