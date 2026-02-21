// pages/transaction/transaction.js - 交易记录页

const app = getApp();
const util = require('../../utils/util.js');
const db = wx.cloud.database();

Page({
  data: {
    transactions: [],
    loading: false
  },

  onLoad() {
    this.loadTransactions();
  },

  onShow() {
    this.loadTransactions();
  },

  // 加载交易记录
  async loadTransactions() {
    this.setData({ loading: true });

    try {
      const res = await db.collection('transactions')
        .orderBy('tradeTime', 'desc')
        .get();

      console.log('交易记录原始返回：', res);
      console.log('交易记录数量：', res.data.length);

      // 预处理数据：在 JS 中格式化
      const formattedTransactions = res.data.map(item => ({
        ...item,
        formattedCode: this.formatStockCode(item.stockCode, item.region),
        formattedPrice: `¥${this.formatMoney(item.price)}`,
        formattedAmount: `¥${this.formatMoney(item.price * item.quantity)}`,
        formattedFee: item.fee > 0 ? `¥${this.formatMoney(item.fee)}` : '',
        formattedTime: this.formatDateTime(item.tradeTime)
      }));

      console.log('预处理后数据：', formattedTransactions);

      this.setData({
        transactions: formattedTransactions,
        loading: false
      });

    } catch (err) {
      console.error('加载记录失败：', err);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadTransactions().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 工具函数：格式化金额
  formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '--';
    }
    return amount.toFixed(2);
  },

  // 工具函数：格式化股票代码
  formatStockCode(code, region) {
    const prefix = region === 'sh' ? 'SH' : 'SZ';
    return `${prefix}${code}`;
  },

  // 工具函数：格式化日期时间
  formatDateTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
});
