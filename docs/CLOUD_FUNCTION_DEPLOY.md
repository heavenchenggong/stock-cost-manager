# 云函数部署指南

## 一、准备工作

确保已完成以下步骤：
- [x] 已开通云开发
- [x] 已创建云环境（stock-cost-manager-5dnlifb5283a2）
- [x] app.js 中已配置环境 ID

---

## 二、部署云函数（详细步骤）

### 方法 1：在微信开发者工具中部署（推荐）

#### 步骤 1：打开云开发控制台

1. 在微信开发者工具中，点击顶部菜单 **「云开发」**
2. 进入云开发控制台

#### 步骤 2：部署云函数

**方式 A：右键部署（推荐）**

1. 在左侧项目目录树中，找到 `cloudfunctions` 文件夹
2. 逐个右键点击每个云函数文件夹：
   - `calculate-cost`
   - `get-quote`
   - `get-stock-info`
3. 右键菜单中选择 **「上传并部署：云端安装依赖」**
4. 等待上传完成（每个函数约 10-30 秒）

**方式 B：通过云函数控制台部署**

1. 在云开发控制台中，点击 **「云函数」**
2. 点击右上角 **「新建」** 或 **「上传」**
3. 选择云函数文件夹，点击上传
4. 选择 **「云端安装依赖」**

#### 步骤 3：验证部署

在云开发控制台的「云函数」页面，应该能看到：
- `calculate-cost`
- `get-quote`
- `get-stock-info`

每个函数状态显示为「正常」

---

## 三、常见问题

### Q1: 右键没有「上传并部署」选项？

**解决方法：**

检查 `project.config.json` 中的 `cloudfunctionRoot` 配置：

```json
{
  "cloudfunctionRoot": "./cloudfunctions/",
  ...
}
```

如果配置正确但还是没有，尝试：
1. 关闭项目，重新打开
2. 确保使用的是最新版微信开发者工具

### Q2: 上传时提示「找不到 package.json」？

**解决方法：**

每个云函数文件夹下必须有 `package.json` 和 `index.js` 文件。

检查云函数目录结构：

```
cloudfunctions/
├── calculate-cost/
│   ├── index.js
│   └── package.json
├── get-quote/
│   ├── index.js
│   └── package.json
└── get-stock-info/
    ├── index.js
    └── package.json
```

如果缺少文件，可以手动添加：

**package.json 模板：**
```json
{
  "name": "cloud-function",
  "version": "1.0.0",
  "description": "Cloud Function",
  "main": "index.js",
  "dependencies": {}
}
```

### Q3: 云部署安装依赖失败？

**解决方法：**

尝试使用本地安装依赖：
1. 右键云函数文件夹
2. 选择 **「上传并部署：不安装依赖」**
3. 或者使用命令行在云函数目录下运行：
   ```bash
   npm install
   ```

### Q4: 部署后调用云函数失败？

**可能原因：**
1. 云函数代码有语法错误
2. 云环境 ID 不匹配
3. 云函数调用权限问题

**调试方法：**
1. 在云开发控制台的云函数页面，点击 **「测试」**
2. 查看云函数日志（控制台 → 云函数 → 日志）
3. 在小程序代码中添加 console.log 调试

---

## 四、云函数测试

部署完成后，可以在小程序中测试：

### 测试 1：测试成本计算云函数

打开 `calculate-cost` 云函数，点击「测试」，输入测试数据：

```json
{
  "stockCode": "600519",
  "transactions": [
    {
      "type": "buy",
      "price": 1500,
      "quantity": 100,
      "fee": 500
    }
  ]
}
```

预期返回：
```json
{
  "success": true,
  "avgCost": 1505,
  "totalQuantity": 100
}
```

### 测试 2：测试获取行情云函数

打开 `get-quote` 云函数，点击「测试」：

```json
{
  "stockCode": "600519"
}
```

预期返回股票实时价格信息。

---

## 五、如果以上方法都不行

### 方法 2：使用命令行部署（需要安装微信云开发 CLI）

1. 安装微信云开发 CLI：
   ```bash
   npm install -g @cloudbase/cli
   ```

2. 登录：
   ```bash
   cloudbase login
   ```

3. 部署：
   ```bash
   cd /workspace/projects/projects/stock-cost-manager
   cloudbase functions:deploy calculate-cost
   cloudbase functions:deploy get-quote
   cloudbase functions:deploy get-stock-info
   ```

---

## 六、最简单的替代方案

如果部署云函数遇到困难，可以暂时将云函数逻辑移到小程序前端代码中运行。

这样做的影响：
- ✅ 不需要部署云函数，开发更简单
- ❌ 无法获取实时行情（需要后端 API 调用）
- ❌ 成本计算在前端运行（但功能不受影响）

---

**建议：** 先尝试方法 1（右键部署），这是最简单直接的方式。如果遇到问题，可以截图发给我，我帮你分析。
