# TabBar 图标准备指南

## 图标需求

需要 8 张图标（4 个页面 × 2 种状态）：

### 图标规格
- **尺寸：** 81px × 81px
- **格式：** PNG（推荐）或 SVG
- **背景：** 透明
- **颜色：** 单色（建议）

### 图标列表

| 页面 | 图标名称 | 状态 | 建议图标 |
|------|----------|------|----------|
| 持仓（首页） | home.png | 默认 | 钱包/图表/首页图标 |
| 持仓（首页） | home-active.png | 选中 | 同上，高亮色 |
| 记录 | record.png | 默认 | 列表/文档/时间线图标 |
| 记录 | record-active.png | 选中 | 同上，高亮色 |
| 添加 | add.png | 默认 | 加号/上传/添加图标 |
| 添加 | add-active.png | 选中 | 同上，高亮色 |
| 设置 | settings.png | 默认 | 齿轮/设置图标 |
| 设置 | settings-active.png | 选中 | 同上，高亮色 |

### 颜色规范

根据 app.json 配置：
- **默认颜色：** #999999（灰色）
- **选中颜色：** #1989fa（蓝色）

## 获取方式

### 方案 1：使用图标库
推荐使用免费图标资源：
- [iconfont](https://www.iconfont.cn/) - 阿里巴巴矢量图标库
- [IconPark](https://iconpark.oceanengine.com/) - 字节跳动图标库
- [Flaticon](https://www.flaticon.com/) - 国际图标库

### 方案 2：使用设计工具
- Figma / Sketch / Adobe Illustrator
- 在线工具：Canva、Photopea

### 方案 3：临时占位符（当前方案）
已准备 SVG 占位符，可直接使用或后续替换

## 放置位置

图标文件应放置在：
```
miniprogram/images/tab/
├── home.png
├── home-active.png
├── record.png
├── record-active.png
├── add.png
├── add-active.png
├── settings.png
└── settings-active.png
```

## 注意事项

1. **保持一致的设计风格** - 同一来源或同一套图标
2. **确保足够清晰** - 81px 建议用矢量图导出
3. **测试显示效果** - 在真机和模拟器中查看
4. **避免过多细节** - TabBar 图标应该简洁明了

---
