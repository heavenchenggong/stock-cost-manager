// cloudfunctions/get-stock-info/index.js
// 获取股票基础信息

const cloud = require('wx-server-sdk');
cloud.init();

const ITICK_TOKEN = '0ad64d8eedd24335b1fa4f8dd5c542f3629443d38bc644f28f5c816fd3432288';
const ITICK_API_BASE = 'https://api.itick.org';

exports.main = async (event, context) => {
  const { stockCode, region } = event;

  if (!stockCode || !region) {
    return {
      code: -1,
      msg: '参数错误：缺少 stockCode 或 region'
    };
  }

  try {
    const res = await cloud.request({
      url: `${ITICK_API_BASE}/stock/info`,
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'token': ITICK_TOKEN
      },
      data: {
        type: 'stock',
        region,
        code: stockCode
      }
    });

    if (res.statusCode === 200 && res.data.code === 0) {
      return {
        code: 0,
        msg: 'success',
        data: res.data.data
      };
    } else {
      return {
        code: -1,
        msg: '获取股票信息失败',
        detail: res.data
      };
    }
  } catch (err) {
    return {
      code: -1,
      msg: '请求异常',
      error: err.message
    };
  }
};
