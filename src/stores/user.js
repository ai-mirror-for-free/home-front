// 简单的用户状态管理
import { reactive, readonly } from 'vue';

// 从localStorage恢复状态
const restoreState = () => {
  const storedState = localStorage.getItem('userStore');
  if (storedState) {
    try {
      return JSON.parse(storedState);
    } catch (e) {
      console.error('Error parsing stored user state:', e);
    }
  }

  // 默认状态
  return {
    userInfo: {
      id: null,
      name: '', // 移除默认值
      email: '', // 移除默认值
      role: '',
      profile_image_url: null,
      initials: '',
      avatar: null // 可选的头像URL
    },
    authInfo: {
      token: '',
      token_type: '',
      expires_at: null
    },
    permissions: {},
    subscriptionInfo: {
      planName: '专业版',
      planType: 'cyan', // 对应样式类
      expiryDate: '2024年12月31日',
      daysLeft: 245,
      isActive: true
    },
    quotaInfo: {
      remain_quota: 0,
      model_limits: '',
      used_quota: 0,
      expired_time: 0,
      plan_level: ''
    },
    isLoggedIn: false
  };
};

// 初始化状态
const state = reactive(restoreState());

// 监听状态变化并保存到localStorage
const saveState = () => {
  localStorage.setItem('userStore', JSON.stringify(state));
};

// 为state添加监听器，当状态改变时自动保存
Object.defineProperty(state, '_watcher', {
  writable: false,
  enumerable: false,
  value: () => {
    // 使用 nextTick 确保在 DOM 更新后再保存状态
    Promise.resolve().then(() => {
      saveState();
    });
  }
});

// 重写属性设置器，使其触发保存
const originalUserInfo = { ...state.userInfo };
const originalAuthInfo = { ...state.authInfo };
const originalPermissions = { ...state.permissions };
const originalSubscriptionInfo = { ...state.subscriptionInfo };
const originalQuotaInfo = { ...state.quotaInfo };
const originalIsLoggedIn = state.isLoggedIn;

// 保存状态变更的代理
const createProxy = (target, key) => {
  return new Proxy(target, {
    set(obj, prop, value) {
      obj[prop] = value;
      state._watcher(); // 触发状态保存
      return true;
    }
  });
};

// 为各个对象创建代理
state.userInfo = createProxy(state.userInfo, 'userInfo');
state.authInfo = createProxy(state.authInfo, 'authInfo');
state.permissions = createProxy(state.permissions, 'permissions');
state.subscriptionInfo = createProxy(state.subscriptionInfo, 'subscriptionInfo');
state.quotaInfo = createProxy(state.quotaInfo, 'quotaInfo');

export function useUserStore() {
  const login = (userData, authData = null, permissionsData = null) => {
    state.isLoggedIn = true;
    
    // 更新用户信息
    if (userData) {
      // 计算姓名首字母缩写
      const nameInitials = userData.name ? userData.name.charAt(0).toUpperCase() : '';
      
      Object.assign(state.userInfo, {
        id: userData.id || state.userInfo.id,
        name: userData.name || state.userInfo.name,
        email: userData.email || state.userInfo.email,
        role: userData.role || state.userInfo.role,
        profile_image_url: userData.profile_image_url || state.userInfo.profile_image_url,
        initials: userData.initials || nameInitials || state.userInfo.initials,
        avatar: userData.avatar || userData.profile_image_url || state.userInfo.avatar
      });
    }
    
    // 更新认证信息
    if (authData) {
      Object.assign(state.authInfo, {
        token: authData.token || state.authInfo.token,
        token_type: authData.token_type || state.authInfo.token_type,
        expires_at: authData.expires_at || state.authInfo.expires_at
      });
    }
    
    // 更新权限信息
    if (permissionsData) {
      Object.assign(state.permissions, permissionsData);
    }
  };

  const logout = () => {
    state.isLoggedIn = false;
    // 重置为默认用户数据
    Object.assign(state.userInfo, {
      id: null,
      name: '',
      email: '',
      role: '',
      profile_image_url: null,
      initials: '',
      avatar: null
    });
    Object.assign(state.authInfo, {
      token: '',
      token_type: '',
      expires_at: null
    });
    Object.assign(state.permissions, {});
    Object.assign(state.quotaInfo, {
      remain_quota: 0,
      model_limits: '',
      used_quota: 0,
      expired_time: 0,
      plan_level: ''
    });

    // 清除本地存储
    localStorage.removeItem('userStore');
  };

  const updateSubscription = (subscriptionData) => {
    Object.assign(state.subscriptionInfo, subscriptionData);
  };

  const updateQuotaInfo = (quotaData) => {
    Object.assign(state.quotaInfo, quotaData);
  };

  // 添加一个方法用于获取token
  const getToken = () => {
    return state.authInfo.token;
  };

  // 添加方法用于获取用户邮箱
  const getUserEmail = () => {
    return state.userInfo.email;
  };

  // 添加方法用于获取用户名
  const getUserName = () => {
    return state.userInfo.name;
  };

  return {
    state: readonly(state),
    login,
    logout,
    updateSubscription,
    updateQuotaInfo,
    getToken,
    getUserEmail,
    getUserName
  };
}