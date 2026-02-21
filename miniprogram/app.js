// app.js
App({
  onLaunch() {
    console.log('持股成本管理助手启动');

    // 初始化云开发
    wx.cloud.init({
      env: 'stock-cost-manager-5dnlifb5283a2',
      traceUser: true
    });
  },

  globalData: {
    userInfo: null,
    itickToken: '0ad64d8eedd24335b1fa4f8dd5c542f3629443d38bc644f28f5c816fd3432288'
  }
})
