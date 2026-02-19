# 部署准备清单

## 准备工作

### 1. 微信开发者工具安装
- [ ] 下载并安装最新版微信开发者工具
  - 官网：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2. 微信小程序账号
- [ ] 注册微信小程序账号
  - 登录：https://mp.weixin.qq.com/
- [ ] 获取 AppID（在「开发」→「开发设置」中）

### 3. 云开发环境
- [ ] 在小程序管理后台开通云开发
- [ ] 获取环境 ID（在云开发控制台首页）

---

## 项目导入

### 1. 打开项目
1. 打开微信开发者工具
2. 选择「导入项目」
3. 填写项目信息：
   - 项目目录：`/workspace/projects/projects/stock-cost-manager/`
   - AppID：填入你的小程序 AppID
   - 项目名称：持股成本管理

### 2. 项目配置
- [ ] 修改 `project.config.json` 中的 `appid` 为你的小程序 AppID
- [ ] 确认 `cloudfunctionRoot` 为 `cloudfunctions`
- [ ] 确认云开发环境 ID 配置正确

---

## 云函数部署

### 1. 上传云函数
在微信开发者工具中：
- 右键点击 `cloudfunctions/get-quote` → 「上传并部署：云端安装依赖」
- 右键点击 `cloudfunctions/get-stock-info` → 「上传并部署：云端安装依赖」
- 右键点击 `cloudfunctions/calculate-cost` → 「上传并部署：云端安装依赖」⭐

### 2. 测试云函数
- 在云开发控制台 → 云函数
- 点击每个云函数的「测试」按钮
- 输入测试参数，验证返回结果

#### calculate-cost 测试参数（首次买入）
```json
{
  "stockCode": "600000",
  "stockName": "浦发银行",
  "region": "cn",
  "type": 1,
  "price": 10.00,
  "quantity": 100,
  "fee": 5.00
}
```
预期返回：
```json
{
  "code": 0,
  "message": "买入成功",
  "data": {
    "action": "create",
    "quantity": 100,
    "avgCost": 10.05
  }
}
```

---

## 数据库创建

### 1. 创建集合
在云开发控制台 → 数据库中创建以下集合：

| 集合名称 | 说明 | 权限设置 |
|---------|------|---------|
| positions | 持仓表 | 所有用户可读，仅创建者可写 |
| transactions | 交易记录表 | 所有用户可读，仅创建者可写 |

### 2. 设置权限规则
对于 `positions` 集合：
```json
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```

对于 `transactions` 集合：
```json
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```

---

## API 配置

### iTick API 配置
- [ ] 确认 API Key 已正确配置
- [ ] 测试行情接口是否正常工作
- [ ] 检查 API 调用量限制（免费套餐）

---

## 测试清单

### 功能测试
- [ ] 持仓列表页面正常显示
- [ ] 添加持仓功能正常
- [ ] 持仓详情页面正常
- [ ] 交易记录功能正常
- [ ] 实时行情数据获取正常
- [ ] 成本计算准确 ⭐
  - [ ] 首次买入成本计算正确
  - [ ] 加仓成本计算正确
  - [ ] 减仓成本价不变
  - [ ] 清仓后重新买入成本计算正确

### 兼容性测试
- [ ] iOS 真机测试
- [ ] Android 真机测试
- [ ] 不同分辨率适配

---

## 常见问题

### 云函数部署失败
- 检查网络连接
- 确认云开发环境已开通
- 查看云函数日志定位错误

### 数据库权限错误
- 确认权限规则配置正确
- 检查用户登录状态
- 确认 `wx.cloud.init()` 已调用

### 行情数据获取失败
- 检查 API Key 是否有效
- 确认网络请求域名已配置白名单
- 查看云函数日志

---

## 后续优化

### P1 优先级
- [ ] 集成 ECharts K 线图表
- [ ] 实现下拉刷新
- [ ] 实现上拉加载更多

### P2 优先级
- [ ] 数据导出（Excel）
- [ ] 价格提醒功能
- [ ] 微信订阅消息推送

---

## 相关文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [项目进度文档](/workspace/projects/projects/stock-cost-manager/PROGRESS.md)
- [项目配置文档](/workspace/projects/projects/stock-cost-manager/CONFIG.md)

---
