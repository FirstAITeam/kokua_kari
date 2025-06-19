// server.js
import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// __dirname の代替（ES Modules用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// CORSを有効にする
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// GET /api/address-search?address=...
app.get('/api/address-search', (req, res) => {
  const address = req.query.address || 'default address';
  console.log(`住所検索リクエストを受信: address=${address}`);

  const pythonFilePath = path.resolve(__dirname, 'backend', 'address_search.py');
  // Use python3 instead of poetry to avoid dependency issues
  const command = `python3 ${pythonFilePath} "${address}"`;
  // const command = `poetry run python ${pythonFilePath} "${address}"`;

  console.log(`実行コマンド: ${command}`);

  exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
      console.error('実行エラー:', error.message);
      // エラー時にもデフォルトの応答を返す
      return res.json({
        exists: false,
        error: '住所検索中にエラーが発生しました',
        address: address,
        input_address: address
      });
    }
    if (stderr) {
      console.error('stderr:', stderr);
      // エラー時にもデフォルトの応答を返す
      return res.json({
        exists: false,
        error: '住所検索中にエラーが発生しました',
        address: address,
        input_address: address
      });
    }
    try {
      console.log('Python出力:', stdout);
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error('JSON parse エラー:', parseError);
      // JSON解析エラー時にもデフォルトの応答を返す
      res.json({
        exists: false,
        error: '住所検索結果の解析に失敗しました',
        address: address,
        input_address: address
      });
    }
  });
});

// GET /api/calc-risk?address=...
app.get('/api/calc-risk', (req, res) => {
  const address = req.query.address || 'default address';
  console.log(`リクエストを受信: address=${address}`);

  const pythonFilePath = path.resolve(__dirname, 'backend', 'calcrisk.py');
  const command = `python3 ${pythonFilePath} "${address}"`;

  console.log(`実行コマンド: ${command}`);

  exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
      console.error('実行エラー:', error.message);
      return res.json({
        earthquake: { rank: '不明', risk: 0 },
        flood: { rank: '不明', risk: 0 },
        tsunami: { rank: '不明', risk: 0 },
        dirtsand: { rank: '不明', risk: 0 },
        heavysnow: { rank: '不明', risk: 0 },
        address: address,
        input_address: address
      });
    }
    if (stderr) {
      console.error('stderr:', stderr);
      return res.json({
        earthquake: { rank: '不明', risk: 0 },
        flood: { rank: '不明', risk: 0 },
        tsunami: { rank: '不明', risk: 0 },
        dirtsand: { rank: '不明', risk: 0 },
        heavysnow: { rank: '不明', risk: 0 },
        address: address,
        input_address: address
      });
    }
    try {
      console.log('Python出力:', stdout);
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error('JSON parse エラー:', parseError);
      res.json({
        earthquake: { rank: '不明', risk: 0 },
        flood: { rank: '不明', risk: 0 },
        tsunami: { rank: '不明', risk: 0 },
        dirtsand: { rank: '不明', risk: 0 },
        heavysnow: { rank: '不明', risk: 0 },
        address: address,
        input_address: address
      });
    }
  });
});

app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});
