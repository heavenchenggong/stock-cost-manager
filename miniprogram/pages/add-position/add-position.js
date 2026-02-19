// pages/add-position/add-position.js - 添加持仓页

const app = getApp();
const util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command;

Page({
  data: {
    stockCode: '',
    stockName: '',
    region: 'sh',
    buyPrice: '',
    quantity: '',
    fee: '',
    loading: false,
    searching: false,
    searchResult: null
  },

  // 搜索股票
  async onSearchStock() {
    const { stockCode, region } = this.data;

    if (!stockCode) {
      util.showToast('请输入股票代码');
      return;
    }

    this.setData({ searching: true });

    try {
      const res = await wx.cloud.callFunction({
        name: 'get-stock-info',
        data: { stockCode, region }
      });

      if (res.result.code === 0) {
        this.setData({
          searchResult: res.result.data,
          stockName: res.result.data.n,
          searching: false
        });
      } else {
        util.showToast('未找到股票信息');
        this.setData({ searching: false });
      }
    } catch (err) {
      console.error('搜索失败：', err);
      util.showToast('搜索失败');
      this.setData({ searching: false });
    }
  },

  // 提交持仓
  async onSubmit() {
    const { stockCode, stockName, region, buyPrice, quantity, fee } = this.data;

    // 表单验证
    if (!stockCode || !stockName) {
      util.showToast('请先搜索股票');
      return;
    }
    if (!buyPrice || !quantity) {
      util.showToast('请填写完整信息');
      return;
    }

    const price = parseFloat(buyPrice);
    const qty = parseInt(quantity);
    const feeAmount = parseFloat(fee) || 0;

    // 计算成本价（含手续费）
    const totalCost = price * qty + feeAmount;
    const avgCost = totalCost / qty;

    this.setData({ loading: true });

    try {
      // 添加交易记录
      await db.collection('transactions').add({
        data: {
          stockCode,
          stockName,
          region,
          type: 'buy',
          price,
          quantity: qty,
          fee: feeAmount,
          tradeTime: Date.now(),
          createTime: Date.now()
        }
      });

      // 检查是否已有持仓
      const existing = await db.collection('positions')
        .where({
          stockCode,
          _openid: '{openid}'
        })
        .get();

      if (existing.data.length > 0) {
        // 已有持仓，更新成本
        const pos = existing.data[0];
        const oldTotal = pos.avgCost * pos.quantity;
        const newTotal = oldTotal + totalCost;
        const newQty = pos.quantity + qty;
        const newAvgCost = newTotal / newQty;

        await db.collection('positions').doc(pos._id).update({
          data: {
            quantity: newQty,
            avgCost: newAvgCost,
            updateTime: Date.now()
          }
        });
      } else {
        // 新增持仓
        await db.collection('positions').add({
          data: {
            stockCode,
            stockName,
            region,
            quantity: qty,
            avgCost,
            createTime: Date.now(),
            updateTime: Date.now()
          }
        });
      }

      util.showToast('添加成功', 'success');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      console.error('添加失败：', err);
      util.showToast('添加失败');
      this.setData({ loading: false });
    }
  },

  // 选择市场
  onSelectRegion(e) {
    this.setData({
      region: e.currentTarget.dataset.region,
      searchResult: null,
      stockName: ''
    });
  },

  // 输入框事件
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  }
});
