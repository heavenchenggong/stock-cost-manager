# 数据库索引优化配置

## 索引创建指南

微信云开发数据库建议为常用查询创建索引，以提高查询性能。

---

## 需要创建的索引

### 1. positions 集合索引

**查询语句：**
```javascript
db.collection('positions')
  .orderBy('updateTime', 'desc')
  .get()
```

**索引配置：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `updateTime` | 降序 | 按更新时间降序排列 |

**创建方式：**

#### 方法 1：通过链接快速创建（推荐）

点击以下链接，会自动打开云开发控制台的索引创建页面：

```
cloud://createindex?env=stock-cost-manager-5dnlifb5283a2&collection=positions&from=console&s=%5B%7B%22field%22%3A%22updateTime%22%2C%22type%22%3A-1%7D%5D
```

#### 方法 2：通过云开发控制台手动创建

1. 打开云开发控制台
2. 点击左侧「数据库」
3. 选择 `positions` 集合
4. 点击「索引管理」
5. 点击「添加索引」
6. 输入索引名称：`updateTime_desc`
7. 添加索引字段：
   - 字段名：`updateTime`
   - 排序方式：降序
8. 点击「确定」

---

### 2. transactions 集合索引（推荐创建）

**查询语句：**
```javascript
db.collection('transactions')
  .where({ stockCode: '600089' })
  .orderBy('tradeTime', 'desc')
  .get()
```

**索引配置：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `stockCode` | 升序 | 股票代码查询 |
| `tradeTime` | 降序 | 按交易时间降序排列 |

**创建方式：**

#### 方法 1：手动创建

1. 打开云开发控制台
2. 数据库 → `transactions` 集合
3. 点击「索引管理」
4. 添加索引名称：`stockCode_tradeTime`
5. 添加索引字段（复合索引）：
   - 第 1 字段：`stockCode`（升序）
   - 第 2 字段：`tradeTime`（降序）
6. 点击「确定」

---

## 索引说明

### 什么是索引？

索引类似于书的目录，可以快速定位数据，避免全表扫描。

### 为什么需要索引？

- **提升查询速度**：从几秒降到毫秒级
- **降低资源消耗**：减少数据库读取量
- **避免全表扫描**：避免读取所有数据

### 什么时候需要索引？

当你的查询包含以下情况时：
- `where()` 条件查询
- `orderBy()` 排序
- 数据量较大（超过 100 条）

---

## 当前索引状态

### positions 集合
| 索引名称 | 字段 | 状态 |
|----------|------|------|
| `updateTime_desc` | updateTime (降序) | ⚠️ 待创建 |

### transactions 集合
| 索引名称 | 字段 | 状态 |
|----------|------|------|
| `stockCode_tradeTime` | stockCode (升序), tradeTime (降序) | ⚠️ 待创建 |

---

## 注意事项

1. **创建索引需要时间**：数据量越大，创建时间越长
2. **占用存储空间**：索引会占用额外的数据库存储
3. **影响写入性能**：索引过多会略微降低写入速度
4. **定期维护**：对于个人应用，当前索引数量足够

---

## 快速操作

### 立即创建索引（推荐）

点击下面的链接，快速创建 `updateTime` 索引：

**[点击创建 positions.updateTime 索引](cloud://createindex?env=stock-cost-manager-5dnlifb5283a2&collection=positions&from=console&s=%5B%7B%22field%22%3A%22updateTime%22%2C%22type%22%3A-1%7D%5D)**

创建后，性能会明显提升，查询从几秒降到毫秒级！
