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

      console.log('云函数完整返回：', res);
      console.log('云函数结果：', res.result);

      // 检查返回结构
      if (!res.result) {
        console.error('云函数返回为空');
        util.showToast('云函数返回异常');
        this.setData({ searching: false });
        return;
      }

      console.log('res.result.code:', res.result.code);
      console.log('res.result.data:', res.result.data);
      console.log('res.result.data 是否为 null:', res.result.data === null);

      if (res.result.code === 0) {
        if (res.result.data && res.result.data.n) {
          this.setData({
            searchResult: res.result.data,
            stockName: res.result.data.n,
            searching: false
          });
          console.log('股票信息：', res.result.data);
        } else {
          console.error('data 或 data.n 为空，完整返回：', res.result);
          util.showToast('未找到股票信息（data 为空）');
          this.setData({ searching: false });
        }
      } else {
        console.error('云函数返回错误：', res.result);
        util.showToast(`未找到股票信息: ${res.result.msg || '未知错误'}`);
        this.setData({ searching: false });
      }
    } catch (err) {
      console.error('搜索失败：', err);
      console.error('错误详情：', JSON.stringify(err));
      util.showToast('搜索失败');
      this.setData({ searching: false });
    }
  },

  // 提交持仓
  async onSubmit() {
    const { stockCode, stockName, region, buyPrice, quantity, fee } = this.data;

    console.log('提交数据：', { stockCode, stockName, region, buyPrice, quantity, fee });

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

    console.log('解析后数据：', { price, qty, feeAmount });

    // 计算成本价（含手续费）
    const totalCost = price * qty + feeAmount;
    const avgCost = totalCost / qty;

    console.log('计算结果：', { totalCost, avgCost });

    this.setData({ loading: true });

    try {
      // 添加交易记录
      console.log('开始添加交易记录...');
      const transactionRes = await db.collection('transactions').add({
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
      console.log('交易记录添加成功：', transactionRes);

      // 检查是否已有持仓
      console.log('检查是否已有持仓...');
      const existing = await db.collection('positions')
        .where({
          stockCode
        })
        .get();

      console.log('已有持仓查询结果：', existing.data);

      if (existing.data.length > 0) {
        // 已有持仓，更新成本
        console.log('更新已有持仓...');
        const pos = existing.data[0];
        const oldTotal = pos.avgCost * pos.quantity;
        const newTotal = oldTotal + totalCost;
        const newQty = pos.quantity + qty;
        const newAvgCost = newTotal / newQty;

        console.log('更新数据：', { oldTotal, newTotal, newQty, newAvgCost });

        await db.collection('positions').doc(pos._id).update({
          data: {
            quantity: newQty,
            avgCost: newAvgCost,
            updateTime: Date.now()
          }
        });
        console.log('持仓更新成功');
      } else {
        // 新增持仓
        console.log('新增持仓...');
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
        console.log('持仓添加成功');
      }

      this.setData({ loading: false });
      util.showToast('添加成功', 'success');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      console.error('添加失败：', err);
      console.error('错误详情：', JSON.stringify(err));
      util.showToast('添加失败：' + (err.message || '未知错误'));
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
