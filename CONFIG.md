# 项目配置文件 - 持股成本管理小程序

## API 配置

### iTick 股票行情 API

**Base URL:** `https://api.itick.org`

**API Token:** `0ad64d8eedd24335b1fa4f8dd5c542f3629443d38bc644f28f5c816fd3432288`

**申请地址:** https://itick.io

**文档地址:** https://docs.itick.io

---

### 接口列表

#### 1. 实时报价

```
GET /stock/tick?region={sh|sz}&code={股票代码}
```

**请求头:**
```json
{
  "accept": "application/json",
  "token": "YOUR_TOKEN"
}
```

**返回示例:**
```json
{
  "code": 0,
  "msg": null,
  "data": {
    "s": "600519",
    "ld": 1485.5,
    "t": 1770965819000,
    "v": 10,
    "d": 2
  }
}
```

**字段说明:**
- `s`: 股票代码
- `ld`: 最新价格
- `t`: 时间戳
- `v`: 成交量
- `d`: 状态码

---

#### 2. K线数据

```
GET /stock/kline?region={sh|sz}&code={股票代码}&kType={类型}&cnt={数量}
```

**kType 参数:**
- `1` = 1分钟K线
- `5` = 5分钟K线
- `15` = 15分钟K线
- `30` = 30分钟K线
- `60` = 60分钟K线
- `240` = 日K线
- `1200` = 周K线

**返回示例:**
```json
{
  "code": 0,
  "msg": null,
  "data": [
    {
      "tu": 240174.41,
      "c": 1501.12,
      "t": 1770786300000,
      "v": 160,
      "h": 1501.19,
      "l": 1500.92,
      "o": 1501.13
    }
  ]
}
```

**字段说明:**
- `tu`: 成交额
- `c`: 收盘价
- `t`: 时间戳
- `v`: 成交量
- `h`: 最高价
- `l`: 最低价
- `o`: 开盘价

---

#### 3. 股票基础信息

```
GET /stock/info?type=stock&region={sh|sz}&code={股票代码}
```

**返回示例:**
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "c": "600519",
    "n": "贵州茅台",
    "t": "stock",
    "e": "SSE",
    "s": "Food & Beverage",
    "i": "Spirits"
  }
}
```

---

## 小程序配置

### 项目名称
**持股成本管理助手**

### 核心功能
1. 持仓管理
2. 交易记录
3. 成本计算（加权平均法）
4. 实时行情
5. 盈亏分析

### 技术栈
- 前端：微信小程序原生开发（WXML + WXSS + JavaScript）
- 后端：微信云开发（云函数 + 云数据库）
- 图表：ECharts for WeChat
- 行情API：iTick

### 数据库设计

#### 持仓表（positions）
```javascript
{
  _id: "xxx",
  _openid: "user_openid",
  stockCode: "600519",
  stockName: "贵州茅台",
  region: "sh",
  quantity: 100,
  avgCost: 1800.50,
  createTime: 1705593600000,
  updateTime: 1705593600000
}
```

#### 交易记录表（transactions）
```javascript
{
  _id: "xxx",
  _openid: "user_openid",
  stockCode: "600519",
  stockName: "贵州茅台",
  region: "sh",
  type: "buy", // buy | sell
  price: 1795.00,
  quantity: 100,
  fee: 8.00,
  tradeTime: 1705593600000,
  createTime: 1705593600000
}
```

---

## 成本计算规则（加权平均法）

### 买入时
```
新成本价 = (原成本价 × 原数量 + 新价格 × 新数量) ÷ (原数量 + 新数量)
新数量 = 原数量 + 新数量
```

### 卖出时
```
成本价 = 原成本价（不变）
数量 = 原数量 - 卖出数量
```

### 示例
```
第一次买入：100股 @ 10元
  成本价 = 10元，持仓 = 100股

第二次买入：100股 @ 12元
  成本价 = (100×10 + 100×12) ÷ 200 = 11元
  持仓 = 200股

卖出50股：
  成本价 = 11元（不变）
  持仓 = 150股
```

---

## 安全注意事项

⚠️ **API Token 安全**

1. 不要将 Token 提交到公开代码仓库
2. 生产环境应使用环境变量存储
3. 建议通过云函数中转，避免前端直接调用
4. 定期更换 Token

---

## 开发计划

### Phase 1: 基础框架（本周）
- [x] API 测试
- [ ] 创建小程序项目
- [ ] 配置云开发环境
- [ ] 搭建页面结构

### Phase 2: 核心功能（下周）
- [ ] 持仓管理（增删改查）
- [ ] 交易记录（增删改查）
- [ ] 成本计算逻辑
- [ ] 实时行情接入

### Phase 3: 高级功能（后续）
- [ ] 盈亏分析
- [ ] K线图表
- [ ] 数据导出
- [ ] 提醒功能

---
