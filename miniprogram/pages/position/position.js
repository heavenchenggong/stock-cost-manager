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
      console.log('加载持仓详情，ID:', this.data.positionId);

      const posRes = await db.collection('positions')
        .doc(this.data.positionId)
        .get();

      console.log('持仓数据：', posRes.data);

      // 查询该股票的所有交易记录（移除错误的 openid 查询）
      const transRes = await db.collection('transactions')
        .where({
          stockCode: posRes.data.stockCode
        })
        .orderBy('tradeTime', 'desc')
        .get();

      console.log('交易记录数量：', transRes.data.length);
      console.log('交易记录：', transRes.data);

      // 获取实时行情
      const quoteRes = await wx.cloud.callFunction({
        name: 'get-quote',
        data: {
          stockCode: posRes.data.stockCode,
          region: posRes.data.region
        }
      });

      console.log('行情返回：', quoteRes.result);

      let currentPrice = null;
      if (quoteRes.result && quoteRes.result.code === 0) {
        currentPrice = quoteRes.result.data.ld;
      }

      // 预处理持仓数据
      const avgCost = posRes.data.avgCost;
      const quantity = posRes.data.quantity;
      const currentPrice = currentPriceFromQuote || avgCost;

      const marketValue = quantity * currentPrice;
      const costValue = quantity * avgCost;
      const profit = marketValue - costValue;
      const profitPercent = costValue > 0 ? (profit / costValue) * 100 : 0;

      const formattedPosition = {
        ...posRes.data,
        currentPrice: currentPrice,
        avgCost: avgCost,
        formattedCode: this.formatStockCode(posRes.data.stockCode, posRes.data.region),
        formattedAvgCost: `¥${this.formatMoney(avgCost)}`,
        formattedCurrentPrice: `¥${this.formatMoney(currentPrice)}`,
        formattedQuantity: `${quantity}股`,
        formattedMarketValue: `¥${this.formatMoney(marketValue)}`,
        formattedProfit: `¥${this.formatMoney(profit)}`,
        formattedProfitPercent: `${profitPercent >= 0 ? '+' : ''}${this.formatMoney(profitPercent)}%`,
        profitClass: this.getProfitClass(profit)
      };

      // 预处理交易记录
      const formattedTransactions = transRes.data.map(item => ({
        ...item,
        formattedCode: this.formatStockCode(item.stockCode, item.region),
        formattedPrice: `¥${this.formatMoney(item.price)}`,
        formattedAmount: `¥${this.formatMoney(item.price * item.quantity)}`,
        formattedFee: item.fee > 0 ? `¥${this.formatMoney(item.fee)}` : '',
        formattedTime: this.formatDateTime(item.tradeTime)
      }));

      console.log('预处理后的持仓数据：', formattedPosition);
      console.log('预处理后的交易记录：', formattedTransactions);

      this.setData({
        position: formattedPosition,
        transactions: formattedTransactions,
        loading: false
      });

    } catch (err) {
      console.error('加载详情失败：', err);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  // 工具函数
  formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '--';
    }
    return amount.toFixed(2);
  },

  formatStockCode(code, region) {
    const prefix = region === 'sh' ? 'SH' : 'SZ';
    return `${prefix}${code}`;
  },

  formatDateTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },

  getProfitClass(value) {
    if (value > 0) return 'stock-up';
    if (value < 0) return 'stock-down';
    return 'stock-flat';
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
