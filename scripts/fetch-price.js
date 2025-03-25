/*
バイナンスAPIから仮想通貨の価格を取得
Command:
node scripts/fetch-price.js 2025-02-28 2025-03-02

-- create table
CREATE TABLE `btc_prices` (
  `open_time` bigint NOT NULL,
  `open` decimal(18,8) DEFAULT NULL,
  `high` decimal(18,8) DEFAULT NULL,
  `low` decimal(18,8) DEFAULT NULL,
  `close` decimal(18,8) DEFAULT NULL,
  `volume` decimal(18,8) DEFAULT NULL,
  `close_time` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`open_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- fetch by JST
SELECT
  *,
  CONVERT_TZ(FROM_UNIXTIME(open_time / 1000, '%Y-%m-%d %H:%i:%s'), '+00:00', '+09:00') AS open_time_jst
FROM btc_prices
HAVING open_time_jst >= '2025-01-01' AND open_time_jst < '2025-01-10'
;
*/

const axios = require('axios');
const mysql = require('mysql2/promise');
const { createConnection } = require('./db');

const fetchHourlyKlines = async (symbol, interval, startTime, endTime, limit = 1000) => {
  const url = 'https://api.binance.com/api/v3/klines';
  const params = { symbol, interval, startTime, endTime, limit };

  const response = await axios.get(url, { params });
  return response.data.map(item => ({
    open_time: item[0],
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
    volume: parseFloat(item[5]),
    close_time: item[6],
  }));
};

const saveToMySQL = async (data) => {
  const connection = await createConnection();

  const insertQuery = `
    INSERT INTO btc_prices 
      (open_time, open, high, low, close, volume, close_time) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      open = VALUES(open), high = VALUES(high), low = VALUES(low),
      close = VALUES(close), volume = VALUES(volume), close_time = VALUES(close_time)
  `;

  for (const row of data) {
    await connection.execute(insertQuery, [
      row.open_time, row.open, row.high, row.low, row.close, row.volume, row.close_time
    ]);
  }

  await connection.end();
};

const args = process.argv.slice(2);
const [startDateStr, endDateStr] = args;

if (!startDateStr || !endDateStr) {
  console.error('使用方法: node fetch-price.js <開始日> <終了日>（例: 2025-03-10 2025-03-13）');
  process.exit(1);
}

const startTime = new Date(`${startDateStr}T00:00:00Z`).getTime();
const endTime = new Date(`${endDateStr}T00:00:00Z`).getTime();

(async () => {
  const data = await fetchHourlyKlines('BTCUSDT', '15m', startTime, endTime);
  console.log(`Fetched ${data.length} rows`);

  await saveToMySQL(data);
  console.log('Saved to MySQL!');
})();
