// utils/util.js - 工具函数

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数，默认2
 * @returns {string} 格式化后的金额
 */
function formatMoney(amount, decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '--';
  }
  return amount.toFixed(decimals);
}

/**
 * 格式化百分比
 * @param {number} value - 数值（如0.0523表示5.23%）
 * @param {number} decimals - 小数位数，默认2
 * @returns {string} 格式化后的百分比
 */
function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }
  const percent = value * 100;
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(decimals)}%`;
}

/**
 * 格式化股票代码
 * @param {string} code - 股票代码
 * @param {string} region - 市场：sh/sz
 * @returns {string} 格式化后的代码（如 SH600519）
 */
function formatStockCode(code, region) {
  const prefix = region === 'sh' ? 'SH' : 'SZ';
  return `${prefix}${code}`;
}

/**
 * 判断涨跌
 * @param {number} value - 数值
 * @returns {string} up/down/flat
 */
function getTrend(value) {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'flat';
}

/**
 * 格式化日期
 * @param {number|Date} date - 日期或时间戳
 * @returns {string} 格式化后的日期（如 2024-01-01）
 */
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间
 * @param {number|Date} date - 日期或时间戳
 * @returns {string} 格式化后的日期时间（如 2024-01-01 10:30:00）
 */
function formatDateTime(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 深拷贝
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  const clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

/**
 * 显示 Toast 提示
 * @param {string} title - 提示内容
 * @param {string} icon - 图标：success/error/loading/none
 * @param {number} duration - 显示时长（毫秒）
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration
  });
}

/**
 * 显示 Loading
 * @param {string} title - 提示内容
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏 Loading
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 确认对话框
 * @param {string} content - 内容
 * @param {string} title - 标题
 * @returns {Promise<boolean>}
 */
function confirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

module.exports = {
  formatMoney,
  formatPercent,
  formatStockCode,
  getTrend,
  formatDate,
  formatDateTime,
  debounce,
  throttle,
  deepClone,
  showToast,
  showLoading,
  hideLoading,
  confirm
};
