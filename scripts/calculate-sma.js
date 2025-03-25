/*
金額の推移から色々計算する関数
*/

const mysql = require('mysql2/promise');
const { createConnection } = require('./db');

const getPriceData = async (limit = 1000) => {
  const connection = await createConnection();

  // NOTE: LimitをBindしていない
  const [rows] = await connection.execute(
    `SELECT open_time, close FROM btc_prices ORDER BY open_time ASC LIMIT 1000`
  );

  await connection.end();

  return rows.map(row => ({
    timestamp: row.open_time,
    close: parseFloat(row.close)
  }));
};

// 移動平均線を算出
const calculateSMA = (prices, period) => {
  const sma = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null); // 計算できない期間
      continue;
    }

    const window = prices.slice(i - period + 1, i + 1);
    const avg = window.reduce((sum, val) => sum + val.close, 0) / period;

    sma.push(avg);
  }

  return sma;
};

(async () => {
  const prices = await getPriceData(1000);
  const sma25 = calculateSMA(prices, 25);

  // 例：最後10件を表示
  for (let i = prices.length - 10; i < prices.length; i++) {
    console.log({
      time: new Date(prices[i].timestamp).toISOString(),
      close: prices[i].close,
      sma25: sma25[i]
    });
  }
})();
