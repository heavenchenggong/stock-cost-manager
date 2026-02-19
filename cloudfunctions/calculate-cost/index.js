const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 计算持仓成本
 *
 * @param {Object} event
 * @param {string} event.openid - 用户 openid（可选，系统自动获取）
 * @param {string} event.stockCode - 股票代码
 * @param {string} event.stockName - 股票名称
 * @param {string} event.region - 市场区域（cn、hk、us）
 * @param {number} event.type - 交易类型：1=买入，2=卖出
 * @param {number} event.price - 交易价格
 * @param {number} event.quantity - 交易数量（股数）
 * @param {number} event.fee - 手续费
 *
 * @returns {Object} { code: 0/-1, message: string, data: Object }
 */
exports.main = async (event) => {
  const { stockCode, stockName, region, type, price, quantity, fee } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 参数验证
  if (!stockCode || !type || !price || !quantity) {
    return {
      code: -1,
      message: '缺少必要参数'
    }
  }

  if (type !== 1 && type !== 2) {
    return {
      code: -1,
      message: '交易类型无效'
    }
  }

  if (price <= 0 || quantity <= 0) {
    return {
      code: -1,
      message: '价格和数量必须大于0'
    }
  }

  try {
    // 查询现有持仓
    const positionRes = await db.collection('positions')
      .where({
        _openid: openid,
        stockCode: stockCode
      })
      .get()

    const existingPosition = positionRes.data[0]

    // 创建交易记录
    const transactionData = {
      _openid: openid,
      stockCode,
      stockName,
      region,
      type, // 1=买入，2=卖出
      price,
      quantity,
      fee,
      tradeTime: Date.now(),
      createTime: Date.now()
    }

    await db.collection('transactions').add({
      data: transactionData
    })

    // 处理持仓
    if (type === 1) {
      // 买入
      if (existingPosition) {
        // 加仓：计算新的成本价
        const oldCost = existingPosition.avgCost
        const oldQuantity = existingPosition.quantity
        const newQuantity = oldQuantity + quantity

        // 新成本价 = (原成本 × 原数量 + 买入价 × 买入数量 + 手续费) / 新数量
        const newCost = (oldCost * oldQuantity + price * quantity + fee) / newQuantity

        await db.collection('positions')
          .doc(existingPosition._id)
          .update({
            data: {
              quantity: newQuantity,
              avgCost: parseFloat(newCost.toFixed(4)), // 保留4位小数
              updateTime: Date.now()
            }
          })

        return {
          code: 0,
          message: '买入成功',
          data: {
            action: 'add',
            quantity: newQuantity,
            avgCost: parseFloat(newCost.toFixed(4))
          }
        }
      } else {
        // 首次买入
        const cost = (price * quantity + fee) / quantity

        await db.collection('positions').add({
          data: {
            _openid: openid,
            stockCode,
            stockName,
            region,
            quantity,
            avgCost: parseFloat(cost.toFixed(4)),
            createTime: Date.now(),
            updateTime: Date.now()
          }
        })

        return {
          code: 0,
          message: '买入成功',
          data: {
            action: 'create',
            quantity,
            avgCost: parseFloat(cost.toFixed(4))
          }
        }
      }
    } else {
      // 卖出
      if (!existingPosition) {
        return {
          code: -1,
          message: '持仓不存在'
        }
      }

      if (existingPosition.quantity < quantity) {
        return {
          code: -1,
          message: '卖出数量超过持仓数量'
        }
      }

      const newQuantity = existingPosition.quantity - quantity

      if (newQuantity > 0) {
        // 减仓：成本价不变
        await db.collection('positions')
          .doc(existingPosition._id)
          .update({
            data: {
              quantity: newQuantity,
              updateTime: Date.now()
            }
          })

        return {
          code: 0,
          message: '卖出成功',
          data: {
            action: 'reduce',
            quantity: newQuantity,
            avgCost: existingPosition.avgCost
          }
        }
      } else {
        // 清仓：删除持仓记录
        await db.collection('positions')
          .doc(existingPosition._id)
          .remove()

        return {
          code: 0,
          message: '卖出成功（清仓）',
          data: {
            action: 'clear',
            quantity: 0
          }
        }
      }
    }
  } catch (err) {
    console.error('成本计算失败：', err)
    return {
      code: -1,
      message: '操作失败：' + err.message
    }
  }
}
