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

      this.setData({
        transactions: res.data,
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
  }
});
