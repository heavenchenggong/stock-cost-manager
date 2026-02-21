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
    let fullUrl = url;

    // 如果有查询参数，添加到 URL
    if (options.params) {
      const queryParams = new URLSearchParams(options.params).toString();
      fullUrl = `${url}?${queryParams}`;
    }

    const urlObj = new URL(fullUrl);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    console.log('请求 URL:', fullUrl);
    console.log('请求头:', options.headers);

    const req = lib.request(fullUrl, {
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('响应状态码:', res.statusCode);
        console.log('响应数据:', data);
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          console.log('JSON 解析失败:', e.message);
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      console.log('请求错误:', err);
      reject(err);
    });
    req.end();
  });
}

exports.main = async (event, context) => {
  const { stockCode, region } = event;

  console.log('调用参数:', { stockCode, region });

  if (!stockCode || !region) {
    return {
      code: -1,
      msg: '参数错误：缺少 stockCode 或 region'
    };
  }

  try {
    // 修改 API 调用方式，使用不同的参数格式
    const url = `https://${ITICK_API_BASE}/stock/info`;
    console.log('请求 URL:', url);

    const res = await httpRequest(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'token': ITICK_TOKEN
      },
      // 使用查询参数
      params: {
        type: 'stock',
        region: region.toUpperCase(),
        code: stockCode
      }
    });

    console.log('API 返回状态:', res.statusCode);
    console.log('API 返回数据:', JSON.stringify(res.data));

    if (res.statusCode === 200) {
      // 检查返回结构
      console.log('res.data.code:', res.data.code);
      console.log('res.data.data:', res.data.data);

      // iTick API 返回 {code: 0, msg: "ok", data: {...}} 或 {code: 0, msg: "ok", data: null}
      if (res.data.code === 0) {
        if (res.data.data) {
          console.log('返回股票信息:', res.data.data);
          return {
            code: 0,
            msg: 'success',
            data: res.data.data
          };
        } else {
          console.log('API 返回成功但 data 为空');
          return {
            code: -1,
            msg: '未找到该股票',
            hint: `股票代码 ${stockCode} (${region.toUpperCase()}) 可能不存在或未上市`,
            apiResponse: res.data
          };
        }
      } else {
        console.log('API 返回错误');
        return {
          code: -1,
          msg: `获取股票信息失败: ${res.data.msg || '未知错误'}`,
          detail: res.data
        };
      }
    } else {
      console.log('HTTP 状态码异常');
      return {
        code: -1,
        msg: `请求失败: ${res.statusCode}`,
        detail: res.data
      };
    }
  } catch (err) {
    console.log('异常错误:', err);
    return {
      code: -1,
      msg: '请求异常',
      error: err.message
    };
  }
};
