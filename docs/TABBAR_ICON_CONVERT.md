# TabBar 图标转换说明

## 问题描述

微信小程序的 tabBar 图标仅支持 `.png`、`.jpg`、`.jpeg` 格式，当前图标为 `.svg` 格式。

## 需要转换的文件

```
images/tab/
├── home.svg → home.png (81x81)
├── home-active.svg → home-active.png (81x81)
├── record.svg → record.png (81x81)
├── record-active.svg → record-active.png (81x81)
├── add.svg → add.png (81x81)
├── add-active.svg → add-active.png (81x81)
├── settings.svg → settings.png (81x81)
└── settings-active.svg → settings-active.png (81x81)
```

## 推荐转换方法

### 方法 1：在线转换（最简单）

1. 访问：https://cloudconvert.com/svg-to-png
2. 点击「选择文件」，上传 8 个 SVG 文件
3. 设置输出尺寸为 81×81 像素
4. 点击「转换」
5. 下载所有 PNG 文件

### 方法 2：Adobe Express

访问：https://www.adobe.com/express/feature/image/convert/svg-to-png

### 方法 3：使用设计软件

- **Figma/Sketch**：导入 SVG，导出为 PNG (81×81)
- **Illustrator**：打开 SVG，导出为 PNG

## 转换后的操作

1. 将所有 PNG 文件放到 `miniprogram/images/tab/` 目录
2. 删除或重命名原有的 .svg 文件
3. 重新导入项目（或刷新编译）

---

**临时方案：**
如果暂时没有图标，可以先删除 `app.json` 中的 `tabBar` 配置，小程序可以正常运行，只是没有底部导航栏。
