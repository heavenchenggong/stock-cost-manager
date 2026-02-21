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

      // 预处理数据：在 JS 中格式化
      const formattedPositions = res.data.map(pos => {
        const currentPrice = pos.currentPrice || pos.avgCost;
        const cost = pos.quantity * pos.avgCost;
        const value = pos.quantity * currentPrice;
        const profit = value - cost;

        return {
          ...pos,
          formattedCode: this.formatStockCode(pos.stockCode, pos.region),
          formattedValue: `¥${this.formatMoney(value)}`,
          formattedCost: `¥${this.formatMoney(pos.avgCost)}`,
          formattedCurrentPrice: `¥${this.formatMoney(currentPrice)}`,
          formattedProfit: this.formatMoney(profit),
          profitClass: this.getProfitClass(profit)
        };
      });

      console.log('预处理后数据：', formattedPositions);

      this.setData({
        positions: formattedPositions,
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
  },

  // 工具函数：格式化金额
  formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '--';
    }
    return amount.toFixed(2);
  },

  // 工具函数：格式化百分比
  formatPercent(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return '--';
    }
    const percent = value * 100;
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  },

  // 工具函数：格式化股票代码
  formatStockCode(code, region) {
    const prefix = region === 'sh' ? 'SH' : 'SZ';
    return `${prefix}${code}`;
  },

  // 工具函数：获取盈亏样式
  getProfitClass(value) {
    if (value > 0) return 'stock-up';
    if (value < 0) return 'stock-down';
    return 'stock-flat';
  }
});
