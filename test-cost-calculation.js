/**
 * 成本计算逻辑测试
 * 测试加权平均法的正确性
 */

// 成本计算函数（简化版，不依赖云开发 SDK）
function calculateCost(currentQuantity, currentCost, tradeType, price, quantity, fee) {
  const cost = currentCost || 0;

  if (tradeType === 1) {
    // 买入
    if (currentQuantity > 0) {
      // 加仓：计算新的成本价
      const newQuantity = currentQuantity + quantity;
      const newCost = (cost * currentQuantity + price * quantity + fee) / newQuantity;
      return {
        action: 'add',
        quantity: newQuantity,
        avgCost: parseFloat(newCost.toFixed(4))
      };
    } else {
      // 首次买入
      const newCost = (price * quantity + fee) / quantity;
      return {
        action: 'create',
        quantity: quantity,
        avgCost: parseFloat(newCost.toFixed(4))
      };
    }
  } else if (tradeType === 2) {
    // 卖出
    if (currentQuantity < quantity) {
      return {
        error: '卖出数量超过持仓数量'
      };
    }

    const newQuantity = currentQuantity - quantity;

    if (newQuantity > 0) {
      // 减仓：成本价不变
      return {
        action: 'reduce',
        quantity: newQuantity,
        avgCost: cost
      };
    } else {
      // 清仓
      return {
        action: 'clear',
        quantity: 0
      };
    }
  }

  return { error: '无效的交易类型' };
}

// 测试用例
const testCases = [
  {
    name: '测试 1: 首次买入',
    input: {
      currentQuantity: 0,
      currentCost: 0,
      tradeType: 1, // 买入
      price: 10.00,
      quantity: 100,
      fee: 5.00
    },
    expected: {
      quantity: 100,
      avgCost: 10.05 // (10.00 * 100 + 5.00) / 100
    }
  },
  {
    name: '测试 2: 加仓',
    input: {
      currentQuantity: 100,
      currentCost: 10.05,
      tradeType: 1,
      price: 11.00,
      quantity: 100,
      fee: 5.00
    },
    expected: {
      quantity: 200,
      avgCost: 10.55 // (10.05 * 100 + 11.00 * 100 + 5.00) / 200
    }
  },
  {
    name: '测试 3: 减仓',
    input: {
      currentQuantity: 200,
      currentCost: 10.55,
      tradeType: 2, // 卖出
      price: 12.00,
      quantity: 100,
      fee: 5.00
    },
    expected: {
      quantity: 100,
      avgCost: 10.55 // 成本价不变
    }
  },
  {
    name: '测试 4: 清仓',
    input: {
      currentQuantity: 100,
      currentCost: 10.55,
      tradeType: 2,
      price: 12.00,
      quantity: 100,
      fee: 5.00
    },
    expected: {
      quantity: 0,
      action: 'clear'
    }
  },
  {
    name: '测试 5: 清仓后重新买入',
    input: {
      currentQuantity: 0,
      currentCost: 10.55, // 旧的成本价应该被忽略
      tradeType: 1,
      price: 9.00,
      quantity: 100,
      fee: 5.00
    },
    expected: {
      quantity: 100,
      avgCost: 9.05 // (9.00 * 100 + 5.00) / 100
    }
  },
  {
    name: '测试 6: 卖出数量超过持仓',
    input: {
      currentQuantity: 100,
      currentCost: 10.00,
      tradeType: 2,
      price: 12.00,
      quantity: 150,
      fee: 5.00
    },
    expected: {
      error: '卖出数量超过持仓数量'
    }
  }
];

// 运行测试
console.log('='.repeat(60));
console.log('成本计算逻辑测试');
console.log('='.repeat(60));
console.log('');

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log('-'.repeat(40));

  const result = calculateCost(
    test.input.currentQuantity,
    test.input.currentCost,
    test.input.tradeType,
    test.input.price,
    test.input.quantity,
    test.input.fee
  );

  console.log('输入:', test.input);
  console.log('预期结果:', test.expected);
  console.log('实际结果:', result);

  // 验证结果
  let isPassed = true;
  if (test.expected.error) {
    isPassed = result.error === test.expected.error;
  } else {
    if (test.expected.quantity !== result.quantity) isPassed = false;
    if (test.expected.avgCost !== undefined && test.expected.avgCost !== result.avgCost) isPassed = false;
    if (test.expected.action !== undefined && test.expected.action !== result.action) isPassed = false;
  }

  if (isPassed) {
    console.log('✅ 测试通过');
    passed++;
  } else {
    console.log('❌ 测试失败');
    failed++;
  }
});

// 总结
console.log('\n' + '='.repeat(60));
console.log('测试总结');
console.log('='.repeat(60));
console.log(`总测试数: ${testCases.length}`);
console.log(`通过: ${passed} ✅`);
console.log(`失败: ${failed} ❌`);
console.log(`通过率: ${((passed / testCases.length) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

// 盈亏计算测试
console.log('\n' + '='.repeat(60));
console.log('盈亏计算测试');
console.log('='.repeat(60));

function calculateProfitLoss(avgCost, currentPrice, quantity) {
  const profitLoss = (currentPrice - avgCost) * quantity;
  const profitLossPercent = ((currentPrice - avgCost) / avgCost) * 100;
  return {
    profitLoss: parseFloat(profitLoss.toFixed(2)),
    profitLossPercent: parseFloat(profitLossPercent.toFixed(2))
  };
}

const plTests = [
  {
    name: '测试 1: 盈利',
    avgCost: 10.00,
    currentPrice: 12.00,
    quantity: 100,
    expected: { profitLoss: 200.00, profitLossPercent: 20.00 }
  },
  {
    name: '测试 2: 亏损',
    avgCost: 10.00,
    currentPrice: 8.00,
    quantity: 100,
    expected: { profitLoss: -200.00, profitLossPercent: -20.00 }
  },
  {
    name: '测试 3: 持平',
    avgCost: 10.00,
    currentPrice: 10.00,
    quantity: 100,
    expected: { profitLoss: 0.00, profitLossPercent: 0.00 }
  }
];

plTests.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log('-'.repeat(40));

  const result = calculateProfitLoss(test.avgCost, test.currentPrice, test.quantity);
  console.log('平均成本:', test.avgCost);
  console.log('当前价格:', test.currentPrice);
  console.log('数量:', test.quantity);
  console.log('预期盈亏:', test.expected);
  console.log('实际盈亏:', result);

  const isPassed =
    result.profitLoss === test.expected.profitLoss &&
    result.profitLossPercent === test.expected.profitLossPercent;

  if (isPassed) {
    console.log('✅ 测试通过');
    passed++;
  } else {
    console.log('❌ 测试失败');
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('盈亏计算测试通过率: ' + ((passed / (testCases.length + plTests.length)) * 100).toFixed(1) + '%');
console.log('='.repeat(60));
