// pages/settings/settings.js - 设置页

const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: null
  },

  onLoad() {
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
      },
      fail: (err) => {
        console.log('获取用户信息失败：', err);
      }
    });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              util.showToast('缓存已清除', 'success');
            }
          });
        }
      }
    });
  },

  // 关于
  onAbout() {
    wx.showModal({
      title: '关于',
      content: '持股成本管理助手 v1.0.0\n帮助您准确管理股票持仓成本',
      showCancel: false
    });
  }
});
