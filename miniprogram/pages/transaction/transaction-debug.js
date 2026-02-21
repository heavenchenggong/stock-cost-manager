// pages/transaction/transaction.js - 交易记录页（调试版本）

const app = getApp();
const util = require('../../utils/util.js');
const db = wx.cloud.database();

Page({
  data: {
    transactions: [],
    loading: false
  },

  onLoad() {
    console.log('交易记录页面加载');
    this.loadTransactions();
  },

  onShow() {
    console.log('交易记录页面显示');
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

      if (res.data.length > 0) {
        console.log('第一条记录：', JSON.stringify(res.data[0], null, 2));

        // 测试工具函数
        const item = res.data[0];
        console.log('测试工具函数：');
        console.log('  formatStockCode:', this.formatStockCode(item.stockCode, item.region));
        console.log('  formatMoney(price):', this.formatMoney(item.price));
        console.log('  formatMoney(quantity):', this.formatMoney(item.quantity));
        console.log('  formatMoney(fee):', this.formatMoney(item.fee));
        console.log('  formatDateTime(tradeTime):', this.formatDateTime(item.tradeTime));
        console.log('  formatStockCode 函数是否存在:', typeof this.formatStockCode);
      }

      this.setData({
        transactions: res.data,
        loading: false
      });

      console.log('setData 完成，当前 data.transactions:', this.data.transactions);

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
    console.log('formatMoney 调用，参数:', amount);
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '--';
    }
    const result = amount.toFixed(2);
    console.log('formatMoney 返回:', result);
    return result;
  },

  // 工具函数：格式化股票代码
  formatStockCode(code, region) {
    console.log('formatStockCode 调用，参数:', code, region);
    const prefix = region === 'sh' ? 'SH' : 'SZ';
    const result = `${prefix}${code}`;
    console.log('formatStockCode 返回:', result);
    return result;
  },

  // 工具函数：格式化日期时间
  formatDateTime(date) {
    console.log('formatDateTime 调用，参数:', date, '类型:', typeof date);
    const d = new Date(date);
    console.log('Date 对象:', d);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    const result = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    console.log('formatDateTime 返回:', result);
    return result;
  }
});
