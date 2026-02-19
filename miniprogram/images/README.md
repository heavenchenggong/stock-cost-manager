# 图标文件说明

## 需要准备的图标

微信小程序的 tabBar 需要以下图标文件（共8张）：

### tabBar 图标（4个功能 × 2种状态）

| 图标 | 文件名 | 尺寸 | 说明 |
|------|--------|------|------|
| 持仓（未选中） | `images/tab/home.png` | 81×81px | 持仓列表图标 |
| 持仓（已选中） | `images/tab/home-active.png` | 81×81px | 持仓列表图标（高亮） |
| 记录（未选中） | `images/tab/record.png` | 81×81px | 交易记录图标 |
| 记录（已选中） | `images/tab/record-active.png` | 81×81px | 交易记录图标（高亮） |
| 添加（未选中） | `images/tab/add.png` | 81×81px | 添加按钮图标 |
| 添加（已选中） | `images/tab/add-active.png` | 81×81px | 添加按钮图标（高亮） |
| 设置（未选中） | `images/tab/settings.png` | 81×81px | 设置图标 |
| 设置（已选中） | `images/tab/settings-active.png` | 81×81px | 设置图标（高亮） |

## 图标要求

- **格式**：PNG
- **尺寸**：81×81px（推荐），最大不超过 120×120px
- **颜色**：
  - 未选中状态：灰色（#999999）
  - 已选中状态：主色调（#1989fa）
- **背景**：透明

## 图标设计建议

### 持仓图标（home）
- 建议：钱包图标、股票图标、或饼图图标
- 含义：代表我的持仓

### 记录图标（record）
- 建议：列表图标、历史图标、或文档图标
- 含义：代表交易记录

### 添加图标（add）
- 建议：加号（+）图标、或下载图标
- 含义：代表添加新持仓

### 设置图标（settings）
- 建议：齿轮图标、或用户图标
- 含义：代表设置页面

## 获取图标的方式

### 1. 使用图标库
推荐使用以下免费图标库：
- [Iconfont](https://www.iconfont.cn/) - 阿里巴巴矢量图标库
- [IconPark](https://iconpark.oceanengine.com/) - 字节跳动图标库
- [Icons8](https://icons8.com/) - 国际图标库

搜索关键词：`wallet`, `history`, `plus`, `settings`

### 2. 在线生成
使用以下工具生成图标：
- [IconKitchen](https://www.material.io/resources/icons/) - Material Design 图标
- [Flaticon](https://www.flaticon.com/) - 扁平化图标

### 3. 自行设计
使用以下工具设计：
- [Figma](https://www.figma.com/)
- [Sketch](https://www.sketch.com/)
- [Adobe XD](https://www.adobe.com/products/xd.html)

## 临时方案（测试用）

如果暂时不想准备图标，可以：

1. **使用纯色块代替**（仅用于测试）：
   ```javascript
   // app.json 中的 tabBar 配置
   "tabBar": {
     "custom": true  // 启用自定义 tabBar
   }
   ```

2. **下载免费图标**：
   访问 Iconfont，搜索并下载 PNG 格式图标

3. **使用在线图标生成器**：
   使用简单图标生成网站快速生成

## 注意事项

⚠️ **重要提醒：**
- 图标必须是 PNG 格式
- 尺寸必须是正方形（81×81px 或 120×120px）
- 未选中图标建议使用灰色
- 已选中图标建议使用品牌色（#1989fa）
- 背景必须是透明的

## 快速开始

### 最快的方式：
1. 访问 Iconfont: https://www.iconfont.cn/
2. 搜索"钱包"、"历史"、"添加"、"设置"
3. 选择喜欢的图标，下载 PNG 格式（81×81px）
4. 重命名并放到对应的目录中

---

**准备好图标后，重新编译小程序即可看到完整效果！**
