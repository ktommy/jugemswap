require("dotenv").config();
const axios = require('axios');
const web3 = require('@solana/web3.js');
const bs58 = require('bs58').default;

const swapJupiter = async () => {
  const inputMint = 'So11111111111111111111111111111111111111112'; // SOL
  const outputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
  const amount = web3.LAMPORTS_PER_SOL * 0.01; // この inputMint の金額で、outputMint を買う
  const slippageBps = 100;

  try {
    console.log("見積もりを取得します。");
    const quoteRes = await axios.get('https://quote-api.jup.ag/v6/quote', {
      params: {
        inputMint,
        outputMint,
        amount,
        slippageBps,
        onlyDirectRoutes: false,
      },
    });

    const quoteResponse = quoteRes.data;

    console.log("トランザクションを生成します。");
    const swapRes = await axios.post(
      'https://quote-api.jup.ag/v6/swap',
      {
        quoteResponse,
        userPublicKey: process.env.SOL_WALLET_ADDRESS,
        wrapUnwrapSOL: true,
        asLegacyTransaction: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("トランザクションを実行します。対象ウォレットアドレス: ", process.env.SOL_WALLET_ADDRESS);
    const swapTx = swapRes.data.swapTransaction;
    const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');
    const secretKey = bs58.decode(process.env.SOL_SECRET_KEY);
    const keypair = web3.Keypair.fromSecretKey(secretKey);
    const txBuffer = Buffer.from(swapTx, 'base64');
    const tx = web3.Transaction.from(txBuffer);
  
    tx.partialSign(keypair);
  
    const txid = await connection.sendRawTransaction(tx.serialize());
    console.log('トランザクション送信完了！TxID: ', txid);

  } catch (error) {
    console.error('Error:', error.message);
  }
};

swapJupiter();
