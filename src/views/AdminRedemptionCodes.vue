<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>管理员后台 - 激活码管理</h1>
      <button @click="logout" class="logout-btn">退出登录</button>
    </header>

    <main class="admin-main">
      <!-- 批量生成激活码 -->
      <section class="generate-section">
        <h2>批量生成激活码</h2>
        <form @submit.prevent="generateCodes" class="generate-form">
          <div class="form-row">
            <div class="form-group">
              <label for="admin-username">管理员账号：</label>
              <input
                id="admin-username"
                v-model="adminAuth.username"
                type="text"
                placeholder="请输入管理员账号"
                required
              />
            </div>
            <div class="form-group">
              <label for="admin-password">管理员密码：</label>
              <input
                id="admin-password"
                v-model="adminAuth.password"
                type="password"
                placeholder="请输入管理员密码"
                required
              />
            </div>
          </div>

          <!-- 任务列表 -->
          <div class="tasks-section">
            <div class="tasks-header">
              <h3>生成任务</h3>
              <button type="button" @click="addTask" class="add-task-btn">+ 添加任务</button>
            </div>
            
            <div class="tasks-list">
              <div v-for="(task, index) in tasks" :key="index" class="task-item">
                <div class="task-inputs">
                  <div class="form-group">
                    <label :for="`plan-${index}`">套餐类型：</label>
                    <select :id="`plan-${index}`" v-model="task.plan" required>
                      <option value="">请选择</option>
                      <option value="default">Default</option>
                      <option value="vip">VIP</option>
                      <option value="svip">SVIP</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label :for="`days-${index}`">天数：</label>
                    <select :id="`days-${index}`" v-model="task.days" required>
                      <option value="">请选择</option>
                      <option value="1">1天</option>
                      <option value="7">7天</option>
                      <option value="30">30天</option>
                      <option value="90">90天</option>
                      <option value="180">180天</option>
                      <option value="365">365天</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label :for="`count-${index}`">数量：</label>
                    <input
                      :id="`count-${index}`"
                      v-model.number="task.count"
                      type="number"
                      min="1"
                      max="1000"
                      placeholder="数量"
                      required
                    />
                  </div>
                </div>
                <button type="button" @click="removeTask(index)" class="remove-task-btn" v-if="tasks.length > 1">删除</button>
              </div>
            </div>
          </div>

          <button type="submit" :disabled="generateLoading" class="generate-btn">
            {{ generateLoading ? '生成中...' : '批量生成激活码' }}
          </button>
        </form>

        <!-- 生成结果展示 -->
        <div v-if="generatedCodes.length > 0" class="generated-result">
          <h3>生成的激活码（共 {{ generatedCodes.length }} 个）</h3>
          <div class="codes-container">
            <div v-for="code in generatedCodes" :key="code.code" class="code-item">
              <span class="code-text">{{ code.code }}</span>
              <button @click="copyCode(code.code)" class="copy-btn">复制</button>
            </div>
          </div>
          <button @click="copyAllCodes" class="copy-all-btn">复制全部</button>
        </div>
      </section>

      <!-- 激活码统计 -->
      <section class="stats-section">
        <h2>激活码统计</h2>
        <div class="stats-actions">
          <button @click="loadStats" :disabled="statsLoading" class="refresh-btn">
            {{ statsLoading ? '加载中...' : '刷新统计' }}
          </button>
        </div>

        <div v-if="statsData.stats && statsData.stats.length > 0" class="stats-content">
          <!-- 汇总数据 -->
          <div class="summary-cards">
            <div class="summary-card total">
              <div class="card-label">总数量</div>
              <div class="card-value">{{ statsData.summary?.total || 0 }}</div>
            </div>
            <div class="summary-card used">
              <div class="card-label">已使用</div>
              <div class="card-value">{{ statsData.summary?.used || 0 }}</div>
            </div>
            <div class="summary-card available">
              <div class="card-label">剩余可用</div>
              <div class="card-value">{{ statsData.summary?.available || 0 }}</div>
            </div>
          </div>

          <!-- 详细统计表格 -->
          <div class="stats-table-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>套餐类型</th>
                  <th>天数</th>
                  <th>总数量</th>
                  <th>已使用</th>
                  <th>剩余可用</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, index) in statsData.stats" :key="index">
                  <td>
                    <span :class="['plan-badge', stat.plan_level]">{{ getPlanName(stat.plan_level) }}</span>
                  </td>
                  <td>{{ stat.days }}天</td>
                  <td>{{ stat.total }}</td>
                  <td>{{ stat.used }}</td>
                  <td>{{ stat.available }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else-if="!statsLoading" class="no-stats">
          暂无统计数据
        </div>
      </section>
    </main>

    <!-- 复制成功提示 -->
    <div v-if="showCopyTip" class="copy-tip">复制成功！</div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  generateActivationCodes, 
  getActivationCodesStats,
  adminLogout
} from '@/api/admin'

export default {
  name: 'AdminRedemptionCodes',
  setup() {
    const router = useRouter()
    
    // 管理员认证信息
    const adminAuth = reactive({
      username: '',
      password: ''
    })
    
    // 生成任务列表
    const tasks = ref([
      { plan: '', days: '', count: 10 }
    ])
    
    // 加载状态
    const generateLoading = ref(false)
    const statsLoading = ref(false)
    
    // 生成结果
    const generatedCodes = ref([])
    
    // 统计数据
    const statsData = ref({
      stats: [],
      summary: {}
    })
    
    // 复制提示
    const showCopyTip = ref(false)
    
    // 添加任务
    const addTask = () => {
      tasks.value.push({ plan: '', days: '', count: 10 })
    }
    
    // 删除任务
    const removeTask = (index) => {
      if (tasks.value.length > 1) {
        tasks.value.splice(index, 1)
      }
    }
    
    // 生成激活码
    const generateCodes = async () => {
      if (!adminAuth.username || !adminAuth.password) {
        alert('请输入管理员账号和密码')
        return
      }
      
      // 验证任务列表
      const validTasks = tasks.value.filter(task => task.plan && task.days && task.count > 0)
      if (validTasks.length === 0) {
        alert('请至少添加一个有效的任务')
        return
      }
      
      generateLoading.value = true
      generatedCodes.value = []
      
      try {
        // 构建请求数据
        const requestData = {
          username: adminAuth.username,
          password: adminAuth.password,
          tasks: validTasks.map(task => [task.plan, parseInt(task.days), task.count])
        }
        
        const response = await generateActivationCodes(requestData)
        
        // 保存生成的激活码
        if (response.codes && response.codes.length > 0) {
          generatedCodes.value = response.codes
          alert(`成功生成 ${response.total_generated} 个激活码！`)
        } else {
          alert('生成完成，但没有返回激活码列表')
        }
        
        // 清空任务列表
        tasks.value = [{ plan: '', days: '', count: 10 }]
      } catch (error) {
        console.error('生成激活码失败:', error)
        alert(error.response?.data?.message || error.message || '生成激活码失败')
      } finally {
        generateLoading.value = false
      }
    }
    
    // 复制单个激活码
    const copyCode = async (code) => {
      try {
        await navigator.clipboard.writeText(code)
        showCopyTip.value = true
        setTimeout(() => {
          showCopyTip.value = false
        }, 2000)
      } catch (error) {
        console.error('复制失败:', error)
      }
    }
    
    // 复制所有激活码
    const copyAllCodes = async () => {
      const allCodes = generatedCodes.value.map(c => c.code).join('\n')
      try {
        await navigator.clipboard.writeText(allCodes)
        showCopyTip.value = true
        setTimeout(() => {
          showCopyTip.value = false
        }, 2000)
      } catch (error) {
        console.error('复制失败:', error)
      }
    }
    
    // 加载统计数据
    const loadStats = async () => {
      if (!adminAuth.username || !adminAuth.password) {
        alert('请先在生成激活码表单中输入管理员账号和密码')
        return
      }
      
      statsLoading.value = true
      
      try {
        const response = await getActivationCodesStats({
          username: adminAuth.username,
          password: adminAuth.password
        })
        
        statsData.value = response
      } catch (error) {
        console.error('获取统计数据失败:', error)
        alert(error.response?.data?.message || error.message || '获取统计数据失败')
      } finally {
        statsLoading.value = false
      }
    }
    
    // 获取套餐名称
    const getPlanName = (plan) => {
      const planNames = {
        'default': 'Default',
        'vip': 'VIP',
        'svip': 'SVIP'
      }
      return planNames[plan] || plan
    }
    
    // 退出登录
    const logout = () => {
      adminLogout()
      router.push('/admin/login')
    }
    
    onMounted(() => {
      // 检查是否有管理员token
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        router.push('/admin/login')
        return
      }
      
      // 从 localStorage 读取之前保存的管理员认证信息
      const savedAuth = localStorage.getItem('adminAuth')
      if (savedAuth) {
        try {
          const auth = JSON.parse(savedAuth)
          adminAuth.username = auth.username || ''
          adminAuth.password = auth.password || ''
        } catch (e) {
          console.error('解析保存的认证信息失败:', e)
        }
      }
    })
    
    return {
      adminAuth,
      tasks,
      generateLoading,
      statsLoading,
      generatedCodes,
      statsData,
      showCopyTip,
      addTask,
      removeTask,
      generateCodes,
      copyCode,
      copyAllCodes,
      loadStats,
      getPlanName,
      logout
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px 0;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.logout-btn:hover {
  transform: scale(1.05);
}

.admin-main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.generate-section, .stats-section {
  background: #ffffff;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.generate-section h2, .stats-section h2 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  color: #2d3748;
  border-bottom: 2px solid #edf2f7;
  padding-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f8fafc;
  color: #1a202c;
  transition: border-color 0.3s;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #667eea;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.generate-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: transform 0.2s;
  margin-top: 1rem;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(47, 128, 237, 0.3);
}

.generate-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

/* 任务列表样式 */
.tasks-section {
  margin-bottom: 1.5rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tasks-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #4a5568;
}

.add-task-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.add-task-btn:hover {
  transform: translateY(-2px);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.task-inputs {
  display: flex;
  gap: 1rem;
  flex: 1;
  flex-wrap: wrap;
}

.task-inputs .form-group {
  min-width: 150px;
  flex: 1;
}

.remove-task-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.remove-task-btn:hover {
  transform: translateY(-2px);
}

/* 生成结果样式 */
.generated-result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f0fff4;
  border-radius: 8px;
  border: 2px solid #68d391;
}

.generated-result h3 {
  margin-top: 0;
  color: #276749;
  font-size: 1rem;
}

.codes-container {
  max-height: 300px;
  overflow-y: auto;
  margin: 1rem 0;
}

.code-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
}

.code-text {
  font-family: monospace;
  color: #2d3748;
}

.copy-btn {
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: transform 0.2s;
}

.copy-btn:hover {
  transform: scale(1.05);
}

.copy-all-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.copy-all-btn:hover {
  transform: translateY(-2px);
}

/* 统计部分样式 */
.stats-actions {
  margin-bottom: 1.5rem;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.summary-cards {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  min-width: 150px;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-card.used {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.summary-card.available {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.card-label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.card-value {
  font-size: 2rem;
  font-weight: bold;
}

.stats-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

.stats-table th,
.stats-table td {
  padding: 0.85rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
}

.stats-table th {
  background: #f7fafc;
  color: #2d3748;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.stats-table tbody tr:hover {
  background-color: #f7fafc;
}

.plan-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.plan-badge.default {
  background-color: #e2e8f0;
  color: #4a5568;
}

.plan-badge.vip {
  background-color: #fed7d7;
  color: #c53030;
}

.plan-badge.svip {
  background-color: #feebc8;
  color: #c05621;
}

.no-stats {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 2rem;
  font-size: 1.1rem;
}

/* 复制提示 */
.copy-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>