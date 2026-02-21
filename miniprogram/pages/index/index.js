  // 加载持仓列表
  async loadPositions() {
    this.setData({ loading: true });

    try {
      const res = await db.collection('positions')
        .orderBy('updateTime', 'desc')
        .get();

      console.log('持仓数据原始返回：', res);
      console.log('持仓数据数量：', res.data.length);

      // 预处理数据：在 JS 中格式化，同时获取实时行情
      const formattedPositions = await Promise.all(res.data.map(async pos => {
        // 默认使用成本价
        let currentPrice = pos.avgCost;

        // 尝试获取实时行情
        try {
          const quoteRes = await wx.cloud.callFunction({
            name: 'get-quote',
            data: {
              stockCode: pos.stockCode,
              region: pos.region
            }
          });
          if (quoteRes.result && quoteRes.result.code === 0) {
            const price = quoteRes.result.data.ld;
            if (price && price > 0) {
              currentPrice = price;
            }
          }
        } catch (err) {
          console.error('获取行情失败：', pos.stockCode, err);
        }

        const cost = pos.quantity * pos.avgCost;
        const value = pos.quantity * currentPrice;
        const profit = value - cost;

        return {
          ...pos,
          currentPrice: currentPrice, // 保存 currentPrice 用于 calculateTotal
          formattedCode: this.formatStockCode(pos.stockCode, pos.region),
          formattedValue: `¥${this.formatMoney(value)}`,
          formattedCost: `¥${this.formatMoney(pos.avgCost)}`,
          formattedCurrentPrice: `¥${this.formatMoney(currentPrice)}`,
          formattedProfit: this.formatMoney(profit),
          profitClass: this.getProfitClass(profit)
        };
      }));

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