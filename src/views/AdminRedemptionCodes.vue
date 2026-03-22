<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>管理员后台 - 兑换码管理</h1>
      <button @click="logout" class="logout-btn">退出登录</button>
    </header>

    <main class="admin-main">
      <!-- 生成兑换码表单 -->
      <section class="generate-section">
        <h2>生成兑换码</h2>
        <form @submit.prevent="generateCodes" class="generate-form">
          <div class="form-row">
            <div class="form-group">
              <label for="count">生成数量：</label>
              <input
                id="count"
                v-model.number="generateForm.count"
                type="number"
                min="1"
                max="1000"
                placeholder="输入生成数量(最多1000)"
                required
              />
            </div>
            <div class="form-group">
              <label for="plan">套餐类型：</label>
              <select id="plan" v-model="generateForm.plan" required>
                <option value="">请选择套餐类型</option>
                <option value="vip">VIP</option>
                <option value="svip">SVIP</option>
                <option value="至尊版">至尊版</option>
              </select>
            </div>
          </div>
          <button type="submit" :disabled="generateLoading" class="generate-btn">
            {{ generateLoading ? '生成中...' : '生成兑换码' }}
          </button>
        </form>
      </section>

      <!-- 搜索过滤条件 -->
      <section class="filter-section">
        <h2>搜索过滤</h2>
        <div class="filter-form">
          <div class="form-row">
            <div class="form-group">
              <label for="filter-plan">套餐类型：</label>
              <select id="filter-plan" v-model="filterForm.plan">
                <option value="">全部</option>
                <option value="vip">VIP</option>
                <option value="svip">SVIP</option>
                <option value="至尊版">至尊版</option>
              </select>
            </div>
            <div class="form-group">
              <label for="filter-exchanged">是否已兑换：</label>
              <select id="filter-exchanged" v-model="filterForm.is_exchanged">
                <option value="">全部</option>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
          </div>
          <button @click="loadRedemptionCodes" class="search-btn">搜索</button>
        </div>
      </section>

      <!-- 兑换码列表 -->
      <section class="codes-list">
        <h2>兑换码列表</h2>
        <div class="table-actions">
          <button @click="selectAll" class="action-btn">全选</button>
          <button @click="deleteSelected" :disabled="!selectedIds.length" class="action-btn delete-btn">
            删除选中({{ selectedIds.length }})
          </button>
          <div class="pagination">
            <span>每页显示：</span>
            <select v-model="pagination.limit" @change="loadRedemptionCodes">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <span>{{ pagination.offset + 1 }} - {{ Math.min(pagination.offset + pagination.limit, redemptionCodes.total) }} 条，共 {{ redemptionCodes.total }} 条</span>
            <button @click="prevPage" :disabled="pagination.offset === 0" class="page-btn">上一页</button>
            <button @click="nextPage" :disabled="pagination.offset + pagination.limit >= redemptionCodes.total" class="page-btn">下一页</button>
          </div>
        </div>

        <div class="table-container">
          <table class="codes-table">
            <thead>
              <tr>
                <th width="50"><input type="checkbox" @change="selectAll" :checked="areAllSelected" /></th>
                <th>ID</th>
                <th>兑换码</th>
                <th>套餐类型</th>
                <th>是否已兑换</th>
                <th>关联用户</th>
                <th>创建时间</th>
                <th>兑换时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="code in redemptionCodes.data" :key="code.id">
                <td><input type="checkbox" :value="code.id" v-model="selectedIds" /></td>
                <td>{{ code.id }}</td>
                <td>{{ code.exchange_code }}</td>
                <td>{{ code.plan }}</td>
                <td>
                  <span :class="{ 'status-yes': code.is_exchange, 'status-no': !code.is_exchange }">
                    {{ code.is_exchange ? '是' : '否' }}
                  </span>
                </td>
                <td>{{ code.user_id || '-' }}</td>
                <td>{{ formatDate(code.created_time) }}</td>
                <td>{{ code.exchange_time ? formatDate(code.exchange_time) : '-' }}</td>
              </tr>
              <tr v-if="redemptionCodes.data.length === 0">
                <td colspan="8" class="no-data">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getRedemptionCodes, 
  generateRedemptionCodes, 
  deleteRedemptionCodes,
  adminLogout
} from '@/api/admin'

export default {
  name: 'AdminRedemptionCodes',
  setup() {
    const router = useRouter()
    
    // 生成兑换码表单数据
    const generateForm = reactive({
      count: 10,
      plan: ''
    })
    
    // 过滤条件
    const filterForm = reactive({
      plan: '',
      is_exchanged: ''
    })
    
    // 分页信息
    const pagination = reactive({
      limit: 20,
      offset: 0
    })
    
    // 兑换码列表数据
    const redemptionCodes = ref({
      data: [],
      total: 0,
      limit: 0,
      offset: 0
    })
    
    // 加载状态
    const generateLoading = ref(false)
    
    // 选中的兑换码ID
    const selectedIds = ref([])
    
    // 加载兑换码列表
    const loadRedemptionCodes = async () => {
      try {
        const params = {
          limit: pagination.limit,
          offset: pagination.offset,
          ...(filterForm.plan && { plan: filterForm.plan }),
          ...(filterForm.is_exchanged !== '' && { is_exchanged: filterForm.is_exchanged === 'true' })
        }
        
        const response = await getRedemptionCodes(params)
        redemptionCodes.value = response
      } catch (error) {
        console.error('获取兑换码列表失败:', error)
        alert(error.response?.data?.message || error.message || '获取兑换码列表失败')
      }
    }
    
    // 生成兑换码
    const generateCodes = async () => {
      if (!generateForm.count || generateForm.count <= 0 || generateForm.count > 1000) {
        alert('请输入正确的数量(1-1000)')
        return
      }
      
      if (!generateForm.plan) {
        alert('请选择套餐类型')
        return
      }
      
      generateLoading.value = true
      
      try {
        const response = await generateRedemptionCodes(generateForm)
        alert(`成功生成 ${response.count} 个${response.plan}套餐兑换码！`)
        // 重新加载列表
        loadRedemptionCodes()
        // 重置表单
        generateForm.count = 10
        generateForm.plan = ''
      } catch (error) {
        console.error('生成兑换码失败:', error)
        alert(error.response?.data?.message || error.message || '生成兑换码失败')
      } finally {
        generateLoading.value = false
      }
    }
    
    // 删除选中的兑换码
    const deleteSelected = async () => {
      if (!selectedIds.value.length) {
        alert('请先选择要删除的兑换码')
        return
      }
      
      if (!confirm(`确定要删除选中的 ${selectedIds.value.length} 个兑换码吗？此操作不可撤销！`)) {
        return
      }
      
      try {
        await deleteRedemptionCodes(selectedIds.value)
        alert('删除成功！')
        // 重置选中状态
        selectedIds.value = []
        // 重新加载列表
        loadRedemptionCodes()
      } catch (error) {
        console.error('删除兑换码失败:', error)
        alert(error.response?.data?.message || error.message || '删除兑换码失败')
      }
    }
    
    // 全选/取消全选
    const selectAll = () => {
      if (areAllSelected.value) {
        selectedIds.value = []
      } else {
        selectedIds.value = redemptionCodes.value.data.map(code => code.id)
      }
    }
    
    // 是否全选
    const areAllSelected = computed(() => {
      return redemptionCodes.value.data.length > 0 && 
             selectedIds.value.length === redemptionCodes.value.data.length
    })
    
    // 上一页
    const prevPage = () => {
      if (pagination.offset > 0) {
        pagination.offset -= pagination.limit
        loadRedemptionCodes()
      }
    }
    
    // 下一页
    const nextPage = () => {
      if (pagination.offset + pagination.limit < redemptionCodes.value.total) {
        pagination.offset += pagination.limit
        loadRedemptionCodes()
      }
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
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
      
      loadRedemptionCodes()
    })
    
    return {
      generateForm,
      filterForm,
      pagination,
      redemptionCodes,
      generateLoading,
      selectedIds,
      loadRedemptionCodes,
      generateCodes,
      deleteSelected,
      selectAll,
      areAllSelected,
      prevPage,
      nextPage,
      formatDate,
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

.generate-section, .filter-section, .codes-list {
  background: #ffffff;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.generate-section h2, .filter-section h2, .codes-list h2 {
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

.generate-btn, .search-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: transform 0.2s;
}

.generate-btn:hover:not(:disabled), .search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(47, 128, 237, 0.3);
}

.generate-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 6px;
}

.action-btn {
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.delete-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.delete-btn:hover {
  transform: translateY(-2px);
}

.delete-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pagination span {
  color: #4a5568;
  font-weight: 500;
}

.pagination select {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  color: #1a202c;
}

.page-btn {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background: #edf2f7;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  color: #2d3748;
  font-weight: 500;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #cbd5e0;
}

.page-btn:disabled {
  color: #a0aec0;
  background: #f7fafc;
  cursor: not-allowed;
  transform: none;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.codes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  background: #ffffff;
}

.codes-table th,
.codes-table td {
  padding: 0.85rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
}

.codes-table th {
  background: #f7fafc;
  color: #2d3748;
  font-weight: 600;
  position: sticky;
  top: 0;
  border-bottom: 2px solid #e2e8f0;
}

.codes-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.codes-table tbody tr:hover {
  background-color: #ebf8ff;
}

.status-yes {
  color: #27ae60;
  font-weight: bold;
  background-color: #d4edda;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-no {
  color: #e74c3c;
  font-weight: bold;
  background-color: #fcf4f4;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.no-data {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>