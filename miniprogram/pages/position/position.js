// pages/position/position.js - 持仓详情页

const app = getApp();
const util = require('../../utils/util.js');
const db = wx.cloud.database();

Page({
  data: {
    positionId: '',
    position: null,
    transactions: [],
    currentPrice: null,
    loading: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ positionId: options.id });
      this.loadPosition();
    }
  },

  // 加载持仓详情
  async loadPosition() {
    this.setData({ loading: true });

    try {
      const posRes = await db.collection('positions')
        .doc(this.data.positionId)
        .get();

      const transRes = await db.collection('transactions')
        .where({
          stockCode: posRes.data.stockCode,
          _openid: '{openid}' // 云函数中会自动替换
        })
        .orderBy('tradeTime', 'desc')
        .get();

      // 获取实时行情
      const quoteRes = await wx.cloud.callFunction({
        name: 'get-quote',
        data: {
          stockCode: posRes.data.stockCode,
          region: posRes.data.region
        }
      });

      let currentPrice = null;
      if (quoteRes.result.code === 0) {
        currentPrice = quoteRes.result.data.ld;
      }

      this.setData({
        position: {
          ...posRes.data,
          currentPrice
        },
        transactions: transRes.data,
        loading: false
      });

    } catch (err) {
      console.error('加载详情失败：', err);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  // 添加交易记录
  onAddTransaction() {
    wx.navigateTo({
      url: `/pages/add-transaction/add-transaction?stockCode=${this.data.position.stockCode}&region=${this.data.position.region}`
    });
  },

  // 删除持仓
  async onDeletePosition() {
    const confirmed = await util.confirm('确定要删除这个持仓吗？');
    if (!confirmed) return;

    try {
      await db.collection('positions').doc(this.data.positionId).remove();
      util.showToast('删除成功', 'success');
      wx.navigateBack();
    } catch (err) {
      console.error('删除失败：', err);
      util.showToast('删除失败');
    }
  }
});
