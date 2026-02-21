// cloudfunctions/get-stock-info/index.js
// 获取股票基础信息

const cloud = require('wx-server-sdk');
cloud.init();
const https = require('https');
const http = require('http');

const ITICK_TOKEN = '0ad64d8eedd24335b1fa4f8dd5c542f3629443d38bc644f28f5c816fd3432288';
const ITICK_API_BASE = 'api.itick.org';

// 发送 HTTP 请求
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const req = lib.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

exports.main = async (event, context) => {
  const { stockCode, region } = event;

  if (!stockCode || !region) {
    return {
      code: -1,
      msg: '参数错误：缺少 stockCode 或 region'
    };
  }

  try {
    const url = `https://${ITICK_API_BASE}/stock/info?type=stock&region=${region}&code=${stockCode}`;

    const res = await httpRequest(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'token': ITICK_TOKEN
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
