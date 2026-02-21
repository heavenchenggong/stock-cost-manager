// pages/index/index.js - 持仓列表页

const app = getApp();
const util = require('../../utils/util.js');
const db = wx.cloud.database();

Page({
  data: {
    positions: [],
    totalValue: 0,
    totalCost: 0,
    totalProfit: 0,
    loading: false
  },

  onLoad() {
    this.loadPositions();
  },

  onShow() {
    this.loadPositions();
  },

  // 加载持仓列表
  async loadPositions() {
    this.setData({ loading: true });

    try {
      const res = await db.collection('positions')
        .orderBy('updateTime', 'desc')
        .get();

      console.log('持仓数据原始返回：', res);
      console.log('持仓数据数量：', res.data.length);
      console.log('持仓数据详情：', JSON.stringify(res.data, null, 2));

      this.setData({
        positions: res.data,
        loading: false
      });

      this.calculateTotal();

    } catch (err) {
      console.error('加载持仓失败：', err);
      util.showToast('加载失败，请重试');
      this.setData({ loading: false });
    }
  },

  // 计算总资产
  calculateTotal() {
    const { positions } = this.data;
    let totalValue = 0;
    let totalCost = 0;

    positions.forEach(pos => {
      const value = pos.quantity * (pos.currentPrice || pos.avgCost);
      const cost = pos.quantity * pos.avgCost;

      totalValue += value;
      totalCost += cost;
    });

    const totalProfit = totalValue - totalCost;

    this.setData({
      totalValue,
      totalCost,
      totalProfit
    });
  },

  // 跳转到添加持仓页面
  onAddPosition() {
    wx.navigateTo({
      url: '/pages/add-position/add-position'
    });
  },

  // 查看持仓详情
  onViewPosition(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/position/position?id=${id}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadPositions().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
