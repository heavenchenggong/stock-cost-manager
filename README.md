# 持股成本管理小程序

## 项目简介

一个用于准确管理股票持仓成本的微信小程序，解决现有证券APP成本计算不准确的问题。

## 功能特性

- ✅ 持仓管理 - 添加、查看、删除持仓
- ✅ 交易记录 - 记录买入、卖出操作
- ✅ 成本计算 - 加权平均法，精确计算
- ✅ 实时行情 - 自动获取股价更新
- ✅ 盈亏分析 - 实时计算盈亏状态

## 技术栈

- **前端**：微信小程序原生开发（WXML + WXSS + JavaScript）
- **后端**：微信云开发（云函数 + 云数据库）
- **API**：iTick 股票行情 API
- **图表**：ECharts for WeChat（待集成）

## 项目结构

```
stock-cost-manager/
├── miniprogram/              # 小程序前端
│   ├── pages/               # 页面
│   │   ├── index/           # 持仓列表
│   │   ├── position/        # 持仓详情
│   │   ├── add-position/    # 添加持仓
│   │   ├── transaction/     # 交易记录
│   │   └── settings/        # 设置
│   ├── utils/               # 工具函数
│   │   └── util.js
│   ├── components/          # 组件（待扩展）
│   ├── app.js               # 小程序入口
│   ├── app.json             # 小程序配置
│   └── app.wxss             # 全局样式
├── cloudfunctions/          # 云函数
│   ├── get-quote/           # 获取实时报价
│   ├── get-stock-info/      # 获取股票信息
│   └── calculate-cost/      # 成本计算（待实现）
├── project.config.json       # 项目配置
├── CONFIG.md                # 配置文档
└── README.md                # 本文件
```

## 快速开始

### 1. 安装微信开发者工具

下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"小程序" -> "导入项目"
3. 填写 AppID（测试号或正式号）
4. 选择项目目录

### 3. 配置云开发

1. 在开发者工具中点击"云开发"
2. 开通云开发（免费版即可）
3. 配置环境 ID

### 4. 创建数据库集合

在云开发控制台创建以下集合：
- `positions` - 持仓表
- `transactions` - 交易记录表

### 5. 上传云函数

在开发者工具中右键云函数目录，选择"上传并部署"

### 6. 运行项目

点击编译按钮，即可在小程序预览

## 核心功能说明

### 成本计算（加权平均法）

```
买入时：
新成本价 = (原成本价 × 原数量 + 新价格 × 新数量) ÷ (原数量 + 新数量)

卖出时：
成本价不变，只减少持仓数量
```

### API 接口

#### 获取实时报价
```
wx.cloud.callFunction({
  name: 'get-quote',
  data: {
    stockCode: '600519',
    region: 'sh'
  }
})
```

#### 获取股票信息
```
wx.cloud.callFunction({
  name: 'get-stock-info',
  data: {
    stockCode: '600519',
    region: 'sh'
  }
})
```

## 数据库设计

### positions（持仓表）

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 主键 |
| _openid | String | 用户标识 |
| stockCode | String | 股票代码 |
| stockName | String | 股票名称 |
| region | String | 市场（sh/sz） |
| quantity | Number | 持有数量 |
| avgCost | Number | 成本价 |
| currentPrice | Number | 当前价（可选） |
| createTime | Number | 创建时间 |
| updateTime | Number | 更新时间 |

### transactions（交易记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 主键 |
| _openid | String | 用户标识 |
| stockCode | String | 股票代码 |
| stockName | String | 股票名称 |
| region | String | 市场 |
| type | String | 类型（buy/sell） |
| price | Number | 交易价格 |
| quantity | Number | 交易数量 |
| fee | Number | 手续费 |
| tradeTime | Number | 交易时间 |
| createTime | Number | 创建时间 |

## 开发计划

- [x] 项目脚手架搭建
- [x] 页面结构创建
- [x] 云函数开发
- [ ] WXML 页面模板
- [ ] 样式完善
- [ ] K线图表集成
- [ ] 盈亏分析页面
- [ ] 数据导出功能
- [ ] 提醒功能

## 注意事项

⚠️ **安全提醒**

1. 不要将 API Token 提交到公开代码仓库
2. 生产环境应使用环境变量存储敏感信息
3. 建议通过云函数中转 API 请求

## 许可证

本项目仅供个人学习使用，请勿用于商业用途。

---

**开发中...** 🚧
